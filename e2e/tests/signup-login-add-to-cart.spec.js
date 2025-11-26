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
    await page.click('button:has-text("Create account")');

    // Visit the product page and add to cart
    await page.goto(`/products/${prod._id}`);
    await page.click('button:has-text("Add to cart")');

    // Go to cart and checkout
    await page.goto('/cart');
    await page.waitForSelector('text=Your cart');

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

    // Confirm order success UI appears
    await expect(page.locator('text=Order placed')).toBeVisible();
    await expect(page.locator(/total: \$/i)).toBeVisible();
  });
});
