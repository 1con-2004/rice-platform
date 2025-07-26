#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class PlaywrightTestDebugger {
  constructor() {
    this.testResults = [];
    this.screenshots = [];
    this.logFile = path.join(__dirname, '../test-debug-log.txt');
  }

  // 运行测试并自动捕获问题
  async runTestsWithAutoCapture() {
    console.log('🤖 开始自动化测试调试...');
    
    try {
      // 清理之前的日志
      if (fs.existsSync(this.logFile)) {
        fs.unlinkSync(this.logFile);
      }

      // 运行测试并捕获输出
      const testProcess = spawn('pnpm', ['run', 'test:e2e', '--reporter=line'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });

      let stdout = '';
      let stderr = '';

      testProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(data.toString());
      });

      testProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(data.toString());
      });

      testProcess.on('close', (code) => {
        this.analyzeTestResults(stdout, stderr, code);
      });

    } catch (error) {
      console.error('❌ 运行测试时出错:', error.message);
      this.logError('Test execution failed', error);
    }
  }

  // 分析测试结果并生成报告
  analyzeTestResults(stdout, stderr, exitCode) {
    console.log(`\n📊 测试分析完成 (退出码: ${exitCode})`);
    
    const analysis = {
      timestamp: new Date().toISOString(),
      exitCode,
      stdout,
      stderr,
      issues: this.extractIssues(stdout, stderr),
      suggestions: []
    };

    // 根据常见错误模式生成建议
    analysis.suggestions = this.generateSuggestions(analysis.issues);

    // 保存分析结果
    this.saveAnalysis(analysis);
    
    // 显示问题摘要
    this.displaySummary(analysis);

    // 如果有错误，自动尝试修复
    if (analysis.issues.length > 0) {
      this.autoFixCommonIssues(analysis.issues);
    }
  }

  // 提取测试中的问题
  extractIssues(stdout, stderr) {
    const issues = [];
    const allOutput = stdout + stderr;

    // 匹配不同类型的错误
    const errorPatterns = [
      {
        type: 'element_not_found',
        pattern: /locator\('([^']+)'\).*resolved to (\d+) elements/g,
        description: '元素定位问题'
      },
      {
        type: 'timeout',
        pattern: /Timed out (\d+)ms waiting for expect\(([^)]+)\)\.([^(]+)/g,
        description: '超时错误'
      },
      {
        type: 'navigation_failed',
        pattern: /expect\(page\)\.toHaveURL.*Expected pattern: ([^\\n]+).*Received string: "([^"]+)"/g,
        description: '页面导航失败'
      },
      {
        type: 'element_not_visible',
        pattern: /expect.*toBeVisible.*Error: strict mode violation/g,
        description: '元素不可见或定位模糊'
      }
    ];

    errorPatterns.forEach(({ type, pattern, description }) => {
      let match;
      while ((match = pattern.exec(allOutput)) !== null) {
        issues.push({
          type,
          description,
          details: match[0],
          groups: match.slice(1)
        });
      }
    });

    return issues;
  }

  // 生成修复建议
  generateSuggestions(issues) {
    const suggestions = [];

    issues.forEach(issue => {
      switch (issue.type) {
        case 'element_not_found':
          suggestions.push({
            issue: issue.description,
            fix: `检查元素选择器 '${issue.groups[0]}' 是否正确，实际找到 ${issue.groups[1]} 个元素`,
            action: 'update_selector'
          });
          break;
        
        case 'timeout':
          suggestions.push({
            issue: issue.description,
            fix: `等待 ${issue.groups[2]} 操作超时，检查页面加载或元素状态`,
            action: 'increase_timeout_or_fix_selector'
          });
          break;
        
        case 'navigation_failed':
          suggestions.push({
            issue: issue.description,
            fix: `页面导航失败，期望: ${issue.groups[0]}，实际: ${issue.groups[1]}`,
            action: 'check_routing'
          });
          break;
        
        case 'element_not_visible':
          suggestions.push({
            issue: issue.description,
            fix: '元素选择器匹配到多个元素，需要更精确的选择器',
            action: 'refine_selector'
          });
          break;
      }
    });

    return suggestions;
  }

  // 自动修复常见问题
  async autoFixCommonIssues(issues) {
    console.log('\n🔧 尝试自动修复常见问题...');

    for (const issue of issues) {
      if (issue.type === 'element_not_visible' && issue.details.includes('input[type="text"]')) {
        console.log('🔍 检测到输入框定位问题，生成更精确的选择器...');
        await this.generateBetterSelectors();
      }
    }
  }

  // 生成更好的选择器
  async generateBetterSelectors() {
    console.log('📝 生成更精确的选择器建议...');
    
    const suggestions = `
// 建议的更精确选择器：
// 代替 input[type="text"] 使用：
await page.locator('[placeholder="手机号或用户名"]').fill('newuser');
// 或者
await page.locator('input.form-input').first().fill('newuser');
// 或者
await page.locator('[data-testid="username"]').fill('newuser');

// 代替 input[type="password"] 使用：
await page.locator('[placeholder*="密码"]').fill('123456');
// 或者
await page.locator('input[type="password"].form-input').fill('123456');
`;

    fs.writeFileSync(path.join(__dirname, '../selector-suggestions.txt'), suggestions);
    console.log('💡 选择器建议已保存到 selector-suggestions.txt');
  }

  // 保存分析结果
  saveAnalysis(analysis) {
    const report = `
🤖 自动化测试调试报告
========================
时间: ${analysis.timestamp}
退出码: ${analysis.exitCode}

📋 发现的问题 (${analysis.issues.length}个):
${analysis.issues.map(issue => `- ${issue.description}: ${issue.details.substring(0, 100)}...`).join('\n')}

💡 修复建议:
${analysis.suggestions.map(s => `- ${s.issue}: ${s.fix}`).join('\n')}

📄 完整输出:
${analysis.stdout}

❌ 错误输出:
${analysis.stderr}
========================
`;

    fs.writeFileSync(this.logFile, report);
    console.log(`📝 完整分析报告已保存到: ${this.logFile}`);
  }

  // 显示问题摘要
  displaySummary(analysis) {
    console.log('\n📋 问题摘要:');
    console.log('='.repeat(50));
    
    if (analysis.issues.length === 0) {
      console.log('✅ 没有发现问题！');
      return;
    }

    analysis.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.description}`);
      console.log(`   详情: ${issue.details.substring(0, 200)}...`);
    });

    console.log('\n💡 建议的修复方案:');
    analysis.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.fix}`);
    });
  }

  // 记录错误
  logError(message, error) {
    const errorLog = `[${new Date().toISOString()}] ${message}: ${error.message}\n`;
    fs.appendFileSync(this.logFile, errorLog);
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
const testDebugger = new PlaywrightTestDebugger();

if (args.includes('--auto') || args.includes('-a')) {
  testDebugger.runTestsWithAutoCapture();
} else {
  console.log('使用方法:');
  console.log('node scripts/auto-test-debug.js --auto  # 自动运行测试并分析问题');
  console.log('node scripts/auto-test-debug.js -a      # 简写版本');
}

module.exports = PlaywrightTestDebugger;