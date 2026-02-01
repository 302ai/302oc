/**
 * 简化的主菜单
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadConfig, saveConfig, deleteConfig } from '../utils/config.js';
import { applyProfile, isOpenClawInstalled } from '../utils/openclaw.js';

interface SimpleConfig {
  apiKey: string;
  apiEndpoint: 'international' | 'domestic';
  language: 'zh' | 'en';
  model: string;
}

function isFirstRun(): boolean {
  const config = loadConfig();
  return !config || !config.currentProfile;
}

function loadSimpleConfig(): SimpleConfig {
  const config = loadConfig();

  if (config && config.currentProfile) {
    const profile = Object.values(config.profiles)[0] as any;
    return {
      apiKey: profile.apiKey || '',
      apiEndpoint: profile.baseUrl?.includes('302ai.cn') ? 'domestic' : 'international',
      language: profile.language || 'zh',
      model: profile.models?.primary || 'claude-sonnet-4-20250514'
    };
  }

  return {
    apiKey: '',
    apiEndpoint: 'international',
    language: 'zh',
    model: 'claude-sonnet-4-20250514'
  };
}

function saveSimpleConfig(config: SimpleConfig): void {
  const baseUrl = config.apiEndpoint === 'domestic'
    ? 'https://api.302ai.cn'
    : 'https://api.302.ai';

  const fullConfig = {
    version: '1.0.0',
    currentProfile: 'default',
    profiles: {
      default: {
        name: '302.AI',
        apiKey: config.apiKey,
        baseUrl: baseUrl,
        language: config.language,
        models: {
          primary: config.model,
          haiku: config.model,
          sonnet: config.model,
          opus: config.model
        }
      }
    }
  };

  saveConfig(fullConfig);
}

function showLogo(language: 'zh' | 'en' = 'en'): void {
  console.log('');
  console.log(chalk.white.bold('  ┌────────────────────────────────────────────────┐'));
  console.log(chalk.white.bold('  │                                                │'));
  console.log(chalk.hex('#FFFFFF').bold('        ██████╗  ██████╗  ██████╗  █████╗ ██╗'));
  console.log(chalk.hex('#F0E0FF').bold('       ╚═════██╗██╔═══██╗╚════██╗ ██╔══██╗██║'));
  console.log(chalk.hex('#E8D0FF').bold('         █████╔╝██║   ██║ █████╔╝ ███████║██║'));
  console.log(chalk.hex('#E0C0FF').bold('         ╚═══██╗██║   ██║██╔═══╝  ██╔══██║██║'));
  console.log(chalk.hex('#D8B0FF').bold('        ██████╔╝╚██████╔╝███████╗ ██║  ██║██║'));
  console.log(chalk.hex('#D0A0FF').bold('        ╚═════╝  ╚═════╝ ╚══════╝ ╚═╝  ╚═╝╚═╝'));
  console.log(chalk.white.bold('  │                                                │'));
  const subtitle = language === 'zh' ? '            OpenClaw 配置工具' : '         OpenClaw Configuration Tool';
  console.log(chalk.yellow.bold(subtitle));
  console.log(chalk.white.bold('  │                                                │'));
  console.log(chalk.white.bold('  └────────────────────────────────────────────────┘'));
  console.log('');
}

async function runInitialSetup(): Promise<void> {
  console.clear();
  showLogo();

  console.log(chalk.cyan.bold('  Welcome / 欢迎'));
  console.log(chalk.gray('  First time setup / 首次配置\n'));

  // Step 1: Select Language
  console.log(chalk.gray('  (Use arrow keys / 使用方向键选择)'));
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Select Language / 选择语言:',
      choices: [
        { name: '中文', value: 'zh' },
        { name: 'English', value: 'en' }
      ]
    }
  ]);

  const config: SimpleConfig = {
    apiKey: '',
    apiEndpoint: 'international',
    language: language,
    model: 'claude-sonnet-4-20250514'
  };

  console.clear();
  showLogo(config.language);

  // Step 2: Enter API Key
  const apiKeyMsg = config.language === 'zh' ? '请输入 302.AI API Key:' : 'Enter 302.AI API Key:';
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: apiKeyMsg,
      mask: '*',
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return config.language === 'zh' ? 'API Key 不能为空' : 'API Key cannot be empty';
        }
        if (trimmed.length < 20) {
          return config.language === 'zh' ? 'API Key 长度不足' : 'API Key is too short';
        }
        return true;
      }
    }
  ]);
  config.apiKey = apiKey.trim();

  console.clear();
  showLogo(config.language);

  // Step 3: Select Model
  const modelChoices = [
    { name: 'Claude Sonnet 4.5', value: 'claude-sonnet-4-5-20250929' },
    { name: 'Claude Opus 4.5', value: 'claude-opus-4-5-20251101' },
    { name: 'CC Sonnet 4.5', value: 'cc-sonnet-4-5-20250929' },
    { name: 'CC Opus 4.5', value: 'cc-opus-4-5-20251101' },
    { name: 'GLM for Coding', value: 'glm-for-coding' },
    { name: 'Kimi for Coding', value: 'kimi-for-coding' },
    { name: 'MiniMax for Coding', value: 'minimax-for-coding' },
    { name: 'GPT 5.2', value: 'gpt-5.2' },
    { name: config.language === 'zh' ? '自定义模型名...' : 'Custom model...', value: 'custom' }
  ];

  const modelMsg = config.language === 'zh' ? '选择模型:' : 'Select model:';
  const arrowHint = config.language === 'zh' ? '  (使用方向键选择)' : '  (Use arrow keys)';
  console.log(chalk.gray(arrowHint));
  const { model } = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: modelMsg,
      choices: modelChoices
    }
  ]);

  if (model === 'custom') {
    const customMsg = config.language === 'zh' ? '请输入自定义模型名称:' : 'Enter custom model name:';
    const { customModel } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customModel',
        message: customMsg,
        validate: (input: string) => {
          if (!input.trim()) {
            return config.language === 'zh' ? '模型名称不能为空' : 'Model name cannot be empty';
          }
          return true;
        }
      }
    ]);
    config.model = customModel.trim();
  } else {
    config.model = model;
  }

  console.clear();
  showLogo(config.language);

  // Step 4: Select Endpoint
  const endpointChoices = config.language === 'zh' ? [
    { name: '国际节点 (api.302.ai)', value: 'international' },
    { name: '国内节点 (api.302ai.cn)', value: 'domestic' }
  ] : [
    { name: 'International (api.302.ai)', value: 'international' },
    { name: 'Domestic (api.302ai.cn)', value: 'domestic' }
  ];

  const endpointMsg = config.language === 'zh' ? '选择 API 节点:' : 'Select API endpoint:';
  const arrowHint2 = config.language === 'zh' ? '  (使用方向键选择)' : '  (Use arrow keys)';
  console.log(chalk.gray(arrowHint2));
  const { endpoint } = await inquirer.prompt([
    {
      type: 'list',
      name: 'endpoint',
      message: endpointMsg,
      choices: endpointChoices
    }
  ]);
  config.apiEndpoint = endpoint;

  console.clear();
  showLogo(config.language);

  // Step 5: Confirm and Apply
  const baseUrl = config.apiEndpoint === 'domestic' ? 'https://api.302ai.cn' : 'https://api.302.ai';
  const maskedKey = config.apiKey.substring(0, 10) + '...' + config.apiKey.substring(config.apiKey.length - 4);

  console.log(chalk.cyan(config.language === 'zh' ? '配置预览:' : 'Configuration Preview:'));
  console.log(chalk.gray('   API Key: ' + maskedKey));
  console.log(chalk.gray('   API Endpoint: ' + baseUrl));
  console.log(chalk.gray('   Model: ' + config.model));
  console.log(chalk.gray('   Language: ' + (config.language === 'zh' ? '中文' : 'English')));
  console.log('');

  const confirmMsg = config.language === 'zh' ? '是否应用配置到 OpenClaw?' : 'Apply configuration to OpenClaw?';
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: confirmMsg,
      default: true
    }
  ]);

  if (confirm) {
    saveSimpleConfig(config);

    if (!isOpenClawInstalled()) {
      const noCodeMsg = config.language === 'zh' ? '\n❌ 未检测到 OpenClaw' : '\n❌ OpenClaw not detected';
      console.log(chalk.red(noCodeMsg));
      const installMsg = config.language === 'zh' ? '请先安装 OpenClaw: https://github.com/nicholasoxford/openclaw' : 'Please install OpenClaw first: https://github.com/nicholasoxford/openclaw';
      console.log(chalk.yellow(installMsg));
      console.log('');
      const savedMsg = config.language === 'zh' ? '配置已保存，安装 OpenClaw 后再次运行 302oc 即可应用。' : 'Configuration saved. Run 302oc again after installing OpenClaw.';
      console.log(chalk.gray(savedMsg));
    } else {
      const profile = {
        name: '302.AI',
        apiKey: config.apiKey,
        baseUrl: baseUrl,
        models: {
          primary: config.model,
          haiku: config.model,
          sonnet: config.model,
          opus: config.model
        }
      };

      applyProfile(profile);
      const successMsg = config.language === 'zh' ? '\n✓ 配置已应用！现在可以在 OpenClaw 中使用 302.AI 了！' : '\n✓ Configuration applied! You can now use 302.AI in OpenClaw!';
      console.log(chalk.green.bold(successMsg));
    }
  } else {
    saveSimpleConfig(config);
    const savedMsg = config.language === 'zh' ? '\n配置已保存，但未应用到 OpenClaw。' : '\nConfiguration saved but not applied to OpenClaw.';
    console.log(chalk.yellow(savedMsg));
  }

  console.log('');
}

export async function showMainMenu(): Promise<void> {
  // Check if first run
  if (isFirstRun()) {
    await runInitialSetup();
    return;
  }

  while (true) {
    console.clear();
    const config = loadSimpleConfig();
    showLogo(config.language);

    const configTitle = config.language === 'zh' ? '当前配置:' : 'Current Configuration:';
    console.log(chalk.cyan(configTitle));
    const apiKeyStatus = config.apiKey
      ? (config.language === 'zh' ? '已配置' : 'Configured')
      : (config.language === 'zh' ? '未配置' : 'Not configured');
    console.log(chalk.gray('   API Key: ' + apiKeyStatus));

    const endpointName = config.apiEndpoint === 'domestic'
      ? (config.language === 'zh' ? '国内节点 (api.302ai.cn)' : 'Domestic (api.302ai.cn)')
      : (config.language === 'zh' ? '国际节点 (api.302.ai)' : 'International (api.302.ai)');
    const endpointLabel = config.language === 'zh' ? '   API 节点: ' : '   API Endpoint: ';
    console.log(chalk.gray(endpointLabel + endpointName));

    const languageName = config.language === 'zh' ? '中文' : 'English';
    const languageLabel = config.language === 'zh' ? '   界面语言: ' : '   Language: ';
    console.log(chalk.gray(languageLabel + languageName));

    const modelLabel = config.language === 'zh' ? '   主模型: ' : '   Model: ';
    console.log(chalk.gray(modelLabel + config.model));
    console.log('');

    const menu = config.language === 'zh' ? [
      { name: '1. 配置 API Key', value: 'apikey' },
      { name: '2. 配置 API 节点', value: 'endpoint' },
      { name: '3. 配置模型', value: 'model' },
      { name: '4. 配置界面语言', value: 'language' },
      { name: '5. 清空当前配置', value: 'clear' },
      { name: '6. 应用配置并退出', value: 'apply' },
      { name: '7. 直接退出', value: 'exit' }
    ] : [
      { name: '1. Configure API Key', value: 'apikey' },
      { name: '2. Configure API Endpoint', value: 'endpoint' },
      { name: '3. Configure Model', value: 'model' },
      { name: '4. Configure Language', value: 'language' },
      { name: '5. Clear Configuration', value: 'clear' },
      { name: '6. Apply and Exit', value: 'apply' },
      { name: '7. Exit', value: 'exit' }
    ];

    const menuArrowHint = config.language === 'zh' ? '(使用方向键选择)' : '(Use arrow keys)';
    console.log(chalk.gray(menuArrowHint));
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: config.language === 'zh' ? '请选择操作:' : 'Select an action:',
        choices: menu
      }
    ]);

    switch (action) {
      case 'apikey':
        await configureApiKey(config);
        break;

      case 'endpoint':
        await configureEndpoint(config);
        break;

      case 'model':
        await configureModel(config);
        break;

      case 'language':
        await configureLanguage(config);
        break;

      case 'clear':
        const result = await clearConfig(config);
        if (result === 'restart') {
          await runInitialSetup();
          return;
        }
        break;

      case 'apply':
        await applyAndExit(config);
        return;

      case 'exit':
        const byeMsg = config.language === 'zh' ? '\n再见!\n' : '\nGoodbye!\n';
        console.log(chalk.cyan(byeMsg));
        return;
    }
  }
}

async function configureApiKey(config: SimpleConfig): Promise<void> {
  console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
  const title = config.language === 'zh' ? '         配置 API Key' : '         Configure API Key';
  console.log(chalk.cyan.bold(title));
  console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));

  if (config.apiKey) {
    const maskedKey = config.apiKey.substring(0, 10) + '...' + config.apiKey.substring(config.apiKey.length - 4);
    const prefix = config.language === 'zh' ? '当前 API Key: ' : 'Current API Key: ';
    console.log(chalk.gray(prefix + maskedKey));
    console.log('');
  }

  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: config.language === 'zh' ? '请输入 302.AI API Key:' : 'Enter 302.AI API Key:',
      mask: '*',
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return config.language === 'zh' ? 'API Key 不能为空' : 'API Key cannot be empty';
        }
        if (trimmed.length < 20) {
          return config.language === 'zh' ? 'API Key 长度不足' : 'API Key is too short';
        }
        return true;
      }
    }
  ]);

  config.apiKey = apiKey.trim();
  saveSimpleConfig(config);

  const successMsg = config.language === 'zh' ? '\nAPI Key 已保存！\n' : '\nAPI Key saved!\n';
  console.log(chalk.green(successMsg));
}

async function configureEndpoint(config: SimpleConfig): Promise<void> {
  console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
  const title = config.language === 'zh' ? '         配置 API 节点' : '         Configure API Endpoint';
  console.log(chalk.cyan.bold(title));
  console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));

  const choices = config.language === 'zh' ? [
    { name: '国际节点 (api.302.ai) - International', value: 'international' },
    { name: '国内节点 (api.302ai.cn) - Domestic', value: 'domestic' }
  ] : [
    { name: 'International (api.302.ai)', value: 'international' },
    { name: 'Domestic (api.302ai.cn)', value: 'domestic' }
  ];

  const selectMsg = config.language === 'zh' ? '选择 API 节点:' : 'Select API endpoint:';
  const endpointHint = config.language === 'zh' ? '(使用方向键选择)' : '(Use arrow keys)';
  console.log(chalk.gray(endpointHint));
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: selectMsg,
      choices: choices
    }
  ]);

  config.apiEndpoint = action as 'international' | 'domestic';
  saveSimpleConfig(config);

  const endpointName = config.apiEndpoint === 'domestic' ? '国内节点' : '国际节点';
  const successMsg = config.language === 'zh' ? '\n已切换到 ' + endpointName + '\n' : '\nSwitched to ' + (action === 'domestic' ? 'Domestic' : 'International') + '\n';
  console.log(chalk.green(successMsg));
}

async function configureModel(config: SimpleConfig): Promise<void> {
  console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
  const title = config.language === 'zh' ? '         配置模型' : '         Configure Model';
  console.log(chalk.cyan.bold(title));
  console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));

  const modelChoices = [
    { name: 'Claude Sonnet 4.5', value: 'claude-sonnet-4-5-20250929' },
    { name: 'Claude Opus 4.5', value: 'claude-opus-4-5-20251101' },
    { name: 'CC Sonnet 4.5', value: 'cc-sonnet-4-5-20250929' },
    { name: 'CC Opus 4.5', value: 'cc-opus-4-5-20251101' },
    { name: 'GLM for Coding', value: 'glm-for-coding' },
    { name: 'Kimi for Coding', value: 'kimi-for-coding' },
    { name: 'MiniMax for Coding', value: 'minimax-for-coding' },
    { name: 'GPT 5.2', value: 'gpt-5.2' },
    { name: config.language === 'zh' ? '自定义模型名...' : 'Custom model...', value: 'custom' }
  ];

  const selectMsg = config.language === 'zh' ? '选择主模型:' : 'Select primary model:';
  const modelHint = config.language === 'zh' ? '(使用方向键选择)' : '(Use arrow keys)';
  console.log(chalk.gray(modelHint));
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: selectMsg,
      choices: modelChoices
    }
  ]);

  let selectedModel = action;

  if (action === 'custom') {
    const { customModel } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customModel',
        message: config.language === 'zh' ? '请输入自定义模型名称:' : 'Enter custom model name:',
        validate: (input: string) => {
          if (!input.trim()) {
            return config.language === 'zh' ? '模型名称不能为空' : 'Model name cannot be empty';
          }
          return true;
        }
      }
    ]);
    selectedModel = customModel.trim();
  }

  config.model = selectedModel;
  saveSimpleConfig(config);

  const successMsg = config.language === 'zh' ? '\n模型已设置为: ' + selectedModel + '\n' : '\nModel set to: ' + selectedModel + '\n';
  console.log(chalk.green(successMsg));
}

async function configureLanguage(config: SimpleConfig): Promise<void> {
  console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
  console.log(chalk.cyan.bold('         Configure Language / 配置语言'));
  console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));

  const choices = [
    { name: '中文', value: 'zh' },
    { name: 'English', value: 'en' }
  ];

  console.log(chalk.gray('(Use arrow keys / 使用方向键选择)'));
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select Language / 选择语言:',
      choices: choices
    }
  ]);

  config.language = action;
  saveSimpleConfig(config);

  const successMsg = action === 'zh' ? '\n语言已切换为中文\n' : '\nLanguage switched to English\n';
  console.log(chalk.green(successMsg));
}

async function applyAndExit(config: SimpleConfig): Promise<void> {
  if (!config.apiKey) {
    const errorMsg = config.language === 'zh' ? '\n❌ 请先配置 API Key\n' : '\n❌ Please configure API Key first\n';
    console.log(chalk.red(errorMsg));
    const continueMsg = config.language === 'zh' ? '按 Enter 返回...' : 'Press Enter to continue...';
    await inquirer.prompt([{ type: 'input', name: 'continue', message: continueMsg }]);
    return;
  }

  console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
  const title = config.language === 'zh' ? '         应用配置到 OpenClaw' : '         Apply Configuration to OpenClaw';
  console.log(chalk.cyan.bold(title));
  console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));

  if (!isOpenClawInstalled()) {
    const noCodeMsg = config.language === 'zh' ? '❌ 未检测到 OpenClaw' : '❌ OpenClaw not detected';
    console.log(chalk.red(noCodeMsg));
    const installMsg = config.language === 'zh' ? '请先安装 OpenClaw: https://github.com/nicholasoxford/openclaw' : 'Please install OpenClaw first: https://github.com/nicholasoxford/openclaw';
    console.log(chalk.yellow(installMsg));
    console.log('');
    const continueMsg = config.language === 'zh' ? '按 Enter 返回...' : 'Press Enter to continue...';
    await inquirer.prompt([{ type: 'input', name: 'continue', message: continueMsg }]);
    return;
  }

  const baseUrl = config.apiEndpoint === 'domestic'
    ? 'https://api.302ai.cn'
    : 'https://api.302.ai';

  const profile = {
    name: '302.AI',
    apiKey: config.apiKey,
    baseUrl: baseUrl,
    models: {
      primary: config.model,
      haiku: config.model,
      sonnet: config.model,
      opus: config.model
    }
  };

  const applyingMsg = config.language === 'zh' ? '正在应用配置...' : 'Applying configuration...';
  console.log(chalk.gray(applyingMsg));
  applyProfile(profile);

  const successMsg = config.language === 'zh' ? '配置已应用！' : 'Configuration applied!';
  console.log(chalk.green.bold('\n' + successMsg + '\n'));

  console.log(chalk.cyan('配置信息 / Configuration:'));
  console.log(chalk.gray('   API Key: ' + config.apiKey.substring(0, 10) + '...' + config.apiKey.substring(config.apiKey.length - 4)));
  console.log(chalk.gray('   API Endpoint: ' + baseUrl));
  console.log(chalk.gray('   Model: ' + config.model));
  console.log('');

  const successMsg2 = config.language === 'zh' ? '现在可以在 OpenClaw 中使用 302.AI 了！' : 'You can now use 302.AI in OpenClaw!';
  console.log(chalk.green(successMsg2));
  console.log('');

  const exitMsg = config.language === 'zh' ? '按 Enter 退出...' : 'Press Enter to exit...';
  await inquirer.prompt([{ type: 'input', name: 'continue', message: exitMsg }]);

  const byeMsg = config.language === 'zh' ? '再见!\n' : 'Goodbye!\n';
  console.log(chalk.cyan(byeMsg));
}

async function clearConfig(config: SimpleConfig): Promise<'restart' | void> {
  console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
  const title = config.language === 'zh' ? '         清空当前配置' : '         Clear Configuration';
  console.log(chalk.cyan.bold(title));
  console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));

  const confirmMsg = config.language === 'zh' ? '确定要清空所有配置吗？' : 'Are you sure you want to clear all configuration?';
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: confirmMsg,
      default: false
    }
  ]);

  if (confirm) {
    deleteConfig();

    const successMsg = config.language === 'zh' ? '\n配置已清空！即将重新开始配置...\n' : '\nConfiguration cleared! Restarting setup...\n';
    console.log(chalk.green(successMsg));

    // 返回标记，让主菜单知道需要重新进入引导流程
    return 'restart';
  } else {
    const cancelMsg = config.language === 'zh' ? '\n已取消\n' : '\nCancelled\n';
    console.log(chalk.gray(cancelMsg));
  }
}
