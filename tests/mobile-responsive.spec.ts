import { test, expect } from '@playwright/test';

test.describe('移动端响应式测试', () => {
  // 设置测试超时时间
  test.setTimeout(30000);
  test('移动端主页布局正常', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // 检查移动端页面加载正常
    await expect(page.locator('body')).toBeVisible();
    
    // 检查角色按钮在移动端的显示
    const roleButtons = page.locator('text=我是农户');
    await expect(roleButtons.first()).toBeVisible();
    
    // 验证移动端样式
    const button = page.locator('button:has-text("我是农户")').first();
    const buttonBox = await button.boundingBox();
    expect(buttonBox?.width).toBeGreaterThan(100); // 按钮宽度适合触摸
  });

  test('农户设置页面移动端适配', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 模拟登录流程
    await page.goto('/');
    await page.locator('text=我是农户').first().click({ timeout: 10000 });
    await page.locator('[placeholder="手机号或用户名"]').fill('newuser');
    await page.locator('[placeholder="请输入密码"]').fill('123456');
    await page.locator('button:has-text("立即登录")').click();
    
    // 进入设置页面
    await page.locator('text=设置').first().click({ timeout: 10000 });
    
    // 检查表单在移动端的布局
    await expect(page.locator('input').first()).toBeVisible();
    
    // 验证头像上传区域
    const avatarUpload = page.locator('[type="file"]');
    if (await avatarUpload.count() > 0) {
      await expect(avatarUpload).toBeVisible();
    }
  });
});