import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/nl/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const accept = page.locator('text=Alles accepteren').first();
if (await accept.isVisible().catch(() => false)) {
  await accept.click();
  await page.waitForTimeout(300);
}
await page.screenshot({ path: '.claude-qa-backbutton-nl.png', clip: { x: 700, y: 0, width: 400, height: 80 } });
await browser.close();
console.log('done');
