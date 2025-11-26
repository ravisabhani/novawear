const { test, expect } = require('@playwright/test');

test.describe('E2E flow: signup -> login -> add to cart -> checkout', () => {
  test('signup, add product to cart and checkout', async ({ page, request }) => {
    // Create an admin + product through the backend API so the product exists
    const adminEmail = `admin-${Date.now()}@example.com`;
    const adminPass = 'adminpass';

    // Use backend API directly (server runs on port 5000), request fixture baseURL points at frontend
    const API = 'http://localhost:5000';

    // wait for backend API to be ready (Playwright only waits for front-end port by default)
    const waitForApi = async () => {
      const start = Date.now();
      while (Date.now() - start < 30_000) {
        try {
          const r = await request.get(`${API}/api/health`);
          if (r && r.ok()) return;
        } catch (err) {
          // ignore and wait
        }
        await new Promise((res) => setTimeout(res, 500));
      }
      throw new Error('Backend API did not become ready');
    };
    await waitForApi();
    const reg = await request.post(`${API}/api/auth/register`, { data: { name: 'E2E Admin', email: adminEmail, password: adminPass, adminSecret: 'e2e_secret' } });
    expect(reg.ok()).toBeTruthy();

    const login = await request.post(`${API}/api/auth/login`, { data: { email: adminEmail, password: adminPass } });
    expect(login.ok()).toBeTruthy();
    const { token } = (await login.json()).data;

    const productRes = await request.post(`${API}/api/products`, { data: { name: 'E2E Product', description: 'E2E product', price: 9.99, category: 'e2e', stockQuantity: 5 }, headers: { authorization: `Bearer ${token}` } });
    expect(productRes.ok()).toBeTruthy();
    const prod = (await productRes.json()).data;

    // Signup a new user in the app (this will auto-login and redirect)
    const userEmail = `user-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.fill('#name', 'E2E User');
    await page.fill('#email', userEmail);
    await page.fill('#password', 'password123');
    // collect page console messages and network responses so we can debug failures
    page.on('console', (msg) => console.log('[PAGE CONSOLE]', msg.type(), msg.text()));
    const apiResponses = [];
    page.on('response', async (res) => {
      try {
        const url = res.url();
        if (url.includes('/api/')) {
          const body = await res.text().catch(() => '<unserializable>');
          console.log('[API RESP]', res.status(), res.request().method(), url, body.slice(0, 300));
          apiResponses.push({ url, status: res.status(), method: res.request().method(), body: body.slice(0, 1000) });
        }
      } catch (e) {
        console.log('Error capturing response body', e);
      }
    });

    await page.click('button:has-text("Create account")');
    // wait for nav to show authenticated state (Logout button or user name)
    await page.waitForSelector('text=Logout', { timeout: 10000 });

    // Visit the product page and add to cart
    await page.goto(`/products/${prod._id}`);
    // click Add to cart and await a successful /cart/item response or toast
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/cart/item') && r.status() === 200, { timeout: 10000 }),
      page.click('button:has-text("Add to cart")'),
    ]).catch(async (err) => {
      console.log('Add to cart network error or timeout — recorded API responses:', apiResponses.slice(-6));
      throw err;
    });

    // Go to cart and checkout
    await page.goto('/cart');
    await page.waitForSelector('text=Your cart');
    // Ensure at least one cart item is present before trying to click Checkout
    await page.waitForSelector('text=Remove', { timeout: 10000 });

    // Debug: capture cart HTML and ensure the Checkout button is visible/clickable
    console.log('--- CART PAGE HTML START ---');
    try {
      const html = await page.content();
      // Print a short snippet to avoid huge logs
      console.log(html.slice(0, 600));
    } catch (e) {
      console.log('Could not capture page HTML', e);
    }
    console.log('--- CART PAGE HTML END ---');

    const checkoutLocator = page.locator('button:has-text("Checkout")');
    // Wait up to 15s for the button to become visible
    await checkoutLocator.waitFor({ state: 'visible', timeout: 15000 });
    console.log('Checkout buttons found:', await checkoutLocator.count());
    // Extra safety: ensure button is enabled before clicking
    await checkoutLocator.waitFor({ state: 'attached', timeout: 15000 });
    await checkoutLocator.click({ timeout: 15000 });

    // Confirm order success UI appears (target heading to avoid strict mode error)
    await expect(page.getByRole('heading', { name: 'Order placed' })).toBeVisible();
    // The toast uses role=status too, so target the confirmation banner by locating the heading
    const orderBanner = page.getByRole('heading', { name: 'Order placed' }).locator('..');
    await expect(orderBanner.getByText(/total: \$/i)).toBeVisible();
  });
});
