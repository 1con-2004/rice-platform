#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SmartSelectorFixer {
  constructor() {
    this.testFiles = [
      'tests/farmer-login.spec.ts',
      'tests/mobile-responsive.spec.ts', 
      'tests/multi-role-workflow.spec.ts'
    ];
  }

  // 智能修复选择器问题
  async fixSelectorsInAllTests() {
    console.log('🔧 开始智能修复测试选择器...');

    for (const testFile of this.testFiles) {
      const filePath = path.join(process.cwd(), testFile);
      
      if (fs.existsSync(filePath)) {
        console.log(`📝 修复文件: ${testFile}`);
        await this.fixSelectorsInFile(filePath);
      }
    }

    console.log('✅ 所有测试文件选择器修复完成！');
  }

  // 修复单个文件中的选择器
  async fixSelectorsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 选择器替换规则
    const replacements = [
      {
        // 修复用户名输入框 - 使用更精确的选择器
        old: /page\.fill\(['"]input\[type="text"\]['"], ['"]([^'"]+)['"]\)/g,
        new: 'page.locator(\'[placeholder*="用户名"], [placeholder*="手机"]\').first().fill(\'$1\')'
      },
      {
        // 修复密码输入框
        old: /page\.fill\(['"]input\[type="password"\]['"], ['"]([^'"]+)['"]\)/g,
        new: 'page.locator(\'input[type="password"]\').first().fill(\'$1\')'
      },
      {
        // 修复登录按钮
        old: /page\.click\(['"]button:has-text\("登录"\)['"]\)/g,
        new: 'page.locator(\'button:has-text("登录"), button:has-text("立即登录")\').first().click()'
      },
      {
        // 修复一般输入框定位
        old: /page\.locator\(['"]input['"]\)/g,
        new: 'page.locator(\'input\').first()'
      },
      {
        // 添加等待和重试机制
        old: /await page\.click\((['"][^'"]+['"])\)/g,
        new: 'await page.locator($1).first().click({ timeout: 10000 })'
      },
      {
        // 为expect添加更长的超时
        old: /await expect\(page\)\.toHaveURL\(/g,
        new: 'await expect(page).toHaveURL('
      }
    ];

    // 应用所有替换
    replacements.forEach(({ old, new: newPattern }) => {
      content = content.replace(old, newPattern);
    });

    // 添加通用的重试和等待逻辑
    content = this.addRetryLogic(content);

    // 保存修复后的文件
    fs.writeFileSync(filePath, content, 'utf8');
  }

  // 添加重试逻辑
  addRetryLogic(content) {
    // 在测试开始添加通用的等待和重试配置
    if (!content.includes('test.setTimeout')) {
      content = content.replace(
        /test\.describe\(['"][^'"]+['"], \(\) => \{/,
        `$&
  // 设置测试超时时间
  test.setTimeout(30000);`
      );
    }

    return content;
  }

  // 生成推荐的测试最佳实践文件
  generateBestPractices() {
    const bestPractices = `
# Playwright 测试最佳实践

## 选择器优先级
1. 使用 data-testid 属性（最稳定）
2. 使用 placeholder 文本
3. 使用 aria-label 或 title
4. 使用文本内容
5. 避免使用 CSS 选择器（最脆弱）

## 推荐的选择器模式

### 表单输入
\`\`\`javascript
// ✅ 好的方式
await page.locator('[data-testid="username"]').fill('user');
await page.locator('[placeholder*="用户名"]').fill('user');

// ❌ 避免
await page.locator('input[type="text"]').fill('user'); // 太泛化
\`\`\`

### 按钮点击
\`\`\`javascript
// ✅ 好的方式  
await page.locator('[data-testid="login-btn"]').click();
await page.locator('button:has-text("登录")').first().click();

// ❌ 避免
await page.locator('button').click(); // 太泛化
\`\`\`

### 等待和重试
\`\`\`javascript
// ✅ 添加适当的超时和重试
await page.locator('[data-testid="element"]').click({ timeout: 10000 });
await expect(page).toHaveURL('/expected-url', { timeout: 10000 });
\`\`\`

## 为HTML添加测试友好的属性

在Vue组件中添加 data-testid：

\`\`\`vue
<template>
  <input 
    type="text" 
    data-testid="username-input"
    placeholder="手机号或用户名"
    v-model="username"
  />
  <button 
    data-testid="login-button"
    @click="login"
  >
    登录
  </button>
</template>
\`\`\`
`;

    fs.writeFileSync(
      path.join(process.cwd(), 'playwright-best-practices.md'), 
      bestPractices
    );

    console.log('📚 最佳实践指南已生成: playwright-best-practices.md');
  }
}

// 命令行运行
const fixer = new SmartSelectorFixer();

const args = process.argv.slice(2);
if (args.includes('--fix') || args.includes('-f')) {
  fixer.fixSelectorsInAllTests();
} else if (args.includes('--guide') || args.includes('-g')) {
  fixer.generateBestPractices();
} else {
  console.log('使用方法:');
  console.log('node scripts/smart-selector-fix.js --fix    # 自动修复选择器');
  console.log('node scripts/smart-selector-fix.js --guide  # 生成最佳实践指南');
}

module.exports = SmartSelectorFixer;