/**
 * init 命令 - 初始化配置
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { validateApiKey, validateBaseUrl, validateProfileName } from '../utils/validator.js';
import { applyProfile, isOpenClawInstalled, backupOpenClawSettings } from '../utils/openclaw.js';
import { saveConfig, loadConfig } from '../utils/config.js';
import { Config, Profile, DEFAULT_MODELS } from '../types/index.js';

export async function init(): Promise<boolean> {
  console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
  console.log(chalk.cyan.bold('       初始化 302.AI 配置'));
  console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));

  // 检查 OpenClaw 是否已安装
  if (!isOpenClawInstalled()) {
    console.error(chalk.red('❌ 错误: 未检测到 OpenClaw 安装'));
    console.log(chalk.yellow('请先安装 OpenClaw: https://github.com/nicholasoxford/openclaw'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '按 Enter 返回...' }]);
    return false;
  }

  // 检查是否已有配置
  const existingConfig = loadConfig();
  if (existingConfig) {
    console.log(chalk.yellow('⚠️  检测到已有配置'));
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: '是否要重新配置？',
        default: false
      }
    ]);

    if (!overwrite) {
      return false;
    }
  }

  // 收集配置信息
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'profileName',
      message: '配置名称:',
      default: '默认配置',
      validate: validateProfileName
    },
    {
      type: 'password',
      name: 'apiKey',
      message: '请输入 302.AI API Key:',
      mask: '*',
      validate: validateApiKey
    },
    {
      type: 'input',
      name: 'baseUrl',
      message: 'Base URL:',
      default: 'https://api.302.ai',
      validate: validateBaseUrl
    },
    {
      type: 'confirm',
      name: 'configureModels',
      message: '是否配置自定义模型？',
      default: false
    }
  ]);

  let models = {
    primary: DEFAULT_MODELS.sonnet,
    haiku: DEFAULT_MODELS.haiku,
    sonnet: DEFAULT_MODELS.sonnet,
    opus: DEFAULT_MODELS.opus
  };

  // 如果用户想配置自定义模型
  if (answers.configureModels) {
    const modelAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'primary',
        message: '选择主模型:',
        choices: [
          { name: '🚀 Claude 3.5 Haiku (快速)', value: DEFAULT_MODELS.haiku },
          { name: '⚖️  Claude Sonnet 4 (平衡)', value: DEFAULT_MODELS.sonnet },
          { name: '💪 Claude Opus 4 (强大)', value: DEFAULT_MODELS.opus }
        ],
        default: DEFAULT_MODELS.sonnet
      }
    ]);

    models.primary = modelAnswers.primary;
  }

  // 创建配置对象
  const profileId = 'default';
  const profile: Profile = {
    name: answers.profileName,
    apiKey: answers.apiKey.trim(),
    baseUrl: answers.baseUrl.trim(),
    models
  };

  // 创建或更新配置
  let config: Config;
  if (existingConfig) {
    config = existingConfig;
    config.profiles[profileId] = profile;
    config.currentProfile = profileId;
  } else {
    config = {
      version: '1.0.0',
      currentProfile: profileId,
      profiles: {
        [profileId]: profile
      }
    };
  }

  // 备份现有配置
  console.log(chalk.gray('\n正在备份现有配置...'));
  const backupPath = backupOpenClawSettings();
  if (backupPath) {
    console.log(chalk.gray(`✓ 备份已保存`));
  }

  // 应用配置到 OpenClaw
  console.log(chalk.gray('正在应用配置到 OpenClaw...'));
  applyProfile(profile);

  // 保存配置
  saveConfig(config);

  // 显示成功信息
  console.log(chalk.green.bold('\n✅ 配置完成！\n'));
  console.log(chalk.cyan('📋 配置信息:'));
  console.log(chalk.gray(`   名称: ${profile.name}`));
  console.log(chalk.gray(`   API Key: ${answers.apiKey.substring(0, 10)}...${answers.apiKey.substring(answers.apiKey.length - 4)}`));
  console.log(chalk.gray(`   Base URL: ${profile.baseUrl}`));
  console.log(chalk.gray(`   主模型: ${profile.models.primary}`));

  console.log(chalk.green('\n🎉 现在可以在 OpenClaw 中使用 302.AI 了！'));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: '\n按 Enter 返回主菜单...' }]);
  return true;
}
