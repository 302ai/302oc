/**
 * Claude Code 配置管理工具
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { MODEL_ENV_KEYS } from '../types/index.js';
const CLAUDE_DIR = join(homedir(), '.claude');
const SETTINGS_FILE = join(CLAUDE_DIR, 'settings.json');
const BACKUP_DIR = join(CLAUDE_DIR, 'backup');
/**
 * 加载 Claude Code 配置
 */
export function loadClaudeSettings() {
    if (!existsSync(SETTINGS_FILE)) {
        return {};
    }
    try {
        const content = readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error('Claude Code 配置读取失败:', error);
        return {};
    }
}
/**
 * 保存 Claude Code 配置
 */
export function saveClaudeSettings(settings) {
    try {
        // 确保目录存在
        if (!existsSync(CLAUDE_DIR)) {
            mkdirSync(CLAUDE_DIR, { recursive: true });
        }
        // 格式化 JSON
        const content = JSON.stringify(settings, null, 2);
        writeFileSync(SETTINGS_FILE, content, 'utf-8');
    }
    catch (error) {
        console.error('Claude Code 配置保存失败:', error);
        throw error;
    }
}
/**
 * 备份 Claude Code 配置
 */
export function backupClaudeSettings() {
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
        const backupFile = join(BACKUP_DIR, `settings.json.backup_${timestamp}`);
        // 复制文件
        copyFileSync(SETTINGS_FILE, backupFile);
        return backupFile;
    }
    catch (error) {
        console.error('配置备份失败:', error);
        return null;
    }
}
/**
 * 应用配置到 Claude Code
 */
export function applyProfile(profile) {
    const settings = loadClaudeSettings();
    // 初始化 env 对象
    if (!settings.env) {
        settings.env = {};
    }
    // 清理现有的模型环境变量
    MODEL_ENV_KEYS.forEach(key => {
        delete settings.env[key];
    });
    // 应用 API Key
    settings.env.ANTHROPIC_API_KEY = profile.apiKey;
    // 应用 Base URL
    if (profile.baseUrl) {
        settings.env.ANTHROPIC_BASE_URL = profile.baseUrl;
    }
    else {
        delete settings.env.ANTHROPIC_BASE_URL;
    }
    // 应用模型配置
    if (profile.models.primary) {
        settings.env.ANTHROPIC_MODEL = profile.models.primary;
    }
    if (profile.models.haiku) {
        settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = profile.models.haiku;
    }
    if (profile.models.sonnet) {
        settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL = profile.models.sonnet;
    }
    if (profile.models.opus) {
        settings.env.ANTHROPIC_DEFAULT_OPUS_MODEL = profile.models.opus;
    }
    // 保存配置
    saveClaudeSettings(settings);
}
/**
 * 检查 Claude Code 是否已安装
 */
export function isClaudeCodeInstalled() {
    return existsSync(CLAUDE_DIR);
}
/**
 * 获取 Claude Code 配置路径
 */
export function getClaudeSettingsPath() {
    return SETTINGS_FILE;
}
//# sourceMappingURL=claude.js.map