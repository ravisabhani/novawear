const { test, expect } = require('@playwright/test');
const axe = require('axe-core');

// Runs accessibility checks (axe) against key pages
test.describe('Accessibility smoke checks', () => {
  test.beforeEach(async ({ request }) => {
    // Ensure at least one product exists (create via admin user)
    const adminEmail = `axadmin-${Date.now()}@example.com`;
    const adminPass = 'adminpass';

    const API = 'http://localhost:5000';

    // wait for backend API to be ready
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
    const r1 = await request.post(`${API}/api/auth/register`, { data: { name: 'Axe Admin', email: adminEmail, password: adminPass, adminSecret: 'e2e_secret' } });
    if (!r1.ok()) {
      const t = await r1.text();
      console.error('Register failed response:', r1.status(), t);
    }
    expect(r1.ok()).toBeTruthy();
    const login = await request.post(`${API}/api/auth/login`, { data: { email: adminEmail, password: adminPass } });
    expect(login.ok()).toBeTruthy();
    const { token } = (await login.json()).data;

    const productRes = await request.post(`${API}/api/products`, { headers: { authorization: `Bearer ${token}` }, data: { name: 'Axe Product', description: 'Accessibility test product', price: 1.0, category: 'accessibility', stockQuantity: 1 } });
    expect(productRes.ok()).toBeTruthy();

    // store id for route tests
    test.info().annotations.push({ type: 'product-id', description: (await productRes.json()).data._id });
  });

  async function runAxe(page) {
    const axeSource = axe.source;
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () => await axe.run());
    return result;
  }

  test('home, signup, login, product and cart should have no serious accessibility violations', async ({ page }) => {
    const pid = test.info().annotations.find((a) => a.type === 'product-id')?.description;

    const routes = ['/', '/signup', '/login', `/products/${pid}`, '/cart'];

    for (const r of routes) {
      await page.goto(r);
      await page.waitForLoadState('networkidle');
      const res = await runAxe(page);
      const serious = (res.violations || []).filter((v) => ['critical', 'serious'].includes(v.impact));
      expect(serious.length, `Accessibility violations on ${r}: ${JSON.stringify(serious, null, 2)}`).toBe(0);
    }
  });
});
