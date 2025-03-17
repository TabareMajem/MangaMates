import { expect, test } from '@playwright/test';

test.describe('Message Sending Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should send message successfully', async ({ page }) => {
    await page.goto('/messages/new');

    // Fill message form
    await page.selectOption('select[name="platform"]', 'kakao');
    await page.fill('input[name="recipientId"]', 'test-recipient');
    await page.fill('textarea[name="content"]', 'Test message');

    // Send message
    await page.click('button[type="submit"]');

    // Verify success notification
    await expect(page.locator('.toast-success')).toContainText('Message queued');

    // Check message status
    await page.goto('/messages');
    await expect(page.locator('table')).toContainText('Test message');
    await expect(page.locator('table')).toContainText('Sent');
  });

  test('should handle validation errors', async ({ page }) => {
    await page.goto('/messages/new');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Verify error messages
    await expect(page.locator('.error-message')).toContainText('Platform is required');
    await expect(page.locator('.error-message')).toContainText('Recipient is required');
    await expect(page.locator('.error-message')).toContainText('Content is required');
  });
});
