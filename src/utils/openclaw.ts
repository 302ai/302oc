/**
 * OpenClaw 配置管理工具
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { Profile, OpenClawSettings, OpenClawProvider, OpenClawModel } from '../types/index.js';

const OPENCLAW_DIR = join(homedir(), '.openclaw');
const SETTINGS_FILE = join(OPENCLAW_DIR, 'openclaw.json');
const BACKUP_DIR = join(OPENCLAW_DIR, 'backup');

/**
 * 加载 OpenClaw 配置
 */
export function loadOpenClawSettings(): OpenClawSettings {
  if (!existsSync(SETTINGS_FILE)) {
    return {};
  }

  try {
    const content = readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(content) as OpenClawSettings;
  } catch (error) {
    console.error('OpenClaw 配置读取失败:', error);
    return {};
  }
}

/**
 * 保存 OpenClaw 配置
 */
export function saveOpenClawSettings(settings: OpenClawSettings): void {
  try {
    // 确保目录存在
    if (!existsSync(OPENCLAW_DIR)) {
      mkdirSync(OPENCLAW_DIR, { recursive: true });
    }

    // 格式化 JSON
    const content = JSON.stringify(settings, null, 2);
    writeFileSync(SETTINGS_FILE, content, 'utf-8');
  } catch (error) {
    console.error('OpenClaw 配置保存失败:', error);
    throw error;
  }
}

/**
 * 备份 OpenClaw 配置
 */
export function backupOpenClawSettings(): string | null {
  if (!existsSync(SETTINGS_FILE)) {
    return null;
  }

  try {
    // 创建备份目录
    if (!existsSync(BACKUP_DIR)) {
      mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // 生成时间戳
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFile = join(BACKUP_DIR, `openclaw.json.backup_${timestamp}`);

    // 复制文件
    copyFileSync(SETTINGS_FILE, backupFile);

    return backupFile;
  } catch (error) {
    console.error('配置备份失败:', error);
    return null;
  }
}

/**
 * 应用配置到 OpenClaw
 */
export function applyProfile(profile: Profile): void {
  const settings = loadOpenClawSettings();

  // 更新 meta 信息
  if (!settings.meta) {
    settings.meta = {};
  }
  settings.meta.lastTouchedAt = new Date().toISOString();
  settings.meta.lastTouchedVersion = '302oc-1.0.0';

  // 初始化 models 结构
  if (!settings.models) {
    settings.models = {
      mode: 'merge',
      providers: {}
    };
  }
  if (!settings.models.providers) {
    settings.models.providers = {};
  }

  // 创建模型配置
  const modelConfig: OpenClawModel = {
    id: profile.models.primary || 'claude-sonnet-4-20250514',
    name: getModelDisplayName(profile.models.primary || 'claude-sonnet-4-20250514'),
    api: 'anthropic-messages',
    reasoning: true,
    input: ['text'],
    contextWindow: 200000,
    maxTokens: 8192
  };

  // 配置 302.AI 提供商
  const provider: OpenClawProvider = {
    baseUrl: profile.baseUrl,
    apiKey: profile.apiKey,
    auth: 'api-key',
    api: 'anthropic-messages',
    authHeader: false,
    models: [modelConfig]
  };

  settings.models.providers['302.AI'] = provider;

  // 初始化 agents 结构
  if (!settings.agents) {
    settings.agents = {
      defaults: {}
    };
  }
  if (!settings.agents.defaults) {
    settings.agents.defaults = {};
  }

  // 设置默认模型
  const modelId = profile.models.primary || 'claude-sonnet-4-20250514';
  settings.agents.defaults.model = {
    primary: `302.AI/${modelId}`,
    fallbacks: [`302.AI/${modelId}`]
  };

  settings.agents.defaults.models = {
    [`302.AI/${modelId}`]: {
      alias: '302.AI'
    }
  };

  // 保存配置
  saveOpenClawSettings(settings);
}

/**
 * 获取模型显示名称
 */
function getModelDisplayName(modelId: string): string {
  const modelNames: Record<string, string> = {
    'claude-sonnet-4-5-20250929': 'Claude Sonnet 4.5',
    'claude-opus-4-5-20251101': 'Claude Opus 4.5',
    'cc-sonnet-4-5-20250929': 'CC Sonnet 4.5',
    'cc-opus-4-5-20251101': 'CC Opus 4.5',
    'glm-for-coding': 'GLM for Coding',
    'kimi-for-coding': 'Kimi for Coding',
    'minimax-for-coding': 'MiniMax for Coding',
    'gpt-5.2': 'GPT 5.2',
    'claude-sonnet-4-20250514': 'Claude Sonnet 4'
  };
  return modelNames[modelId] || modelId;
}

/**
 * 检查 OpenClaw 是否已安装
 */
export function isOpenClawInstalled(): boolean {
  return existsSync(OPENCLAW_DIR);
}

/**
 * 获取 OpenClaw 配置路径
 */
export function getOpenClawSettingsPath(): string {
  return SETTINGS_FILE;
}
