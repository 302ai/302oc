/**
 * Claude Code 配置管理工具
 */
import { Profile, ClaudeSettings } from '../types/index.js';
/**
 * 加载 Claude Code 配置
 */
export declare function loadClaudeSettings(): ClaudeSettings;
/**
 * 保存 Claude Code 配置
 */
export declare function saveClaudeSettings(settings: ClaudeSettings): void;
/**
 * 备份 Claude Code 配置
 */
export declare function backupClaudeSettings(): string | null;
/**
 * 应用配置到 Claude Code
 */
export declare function applyProfile(profile: Profile): void;
/**
 * 检查 Claude Code 是否已安装
 */
export declare function isClaudeCodeInstalled(): boolean;
/**
 * 获取 Claude Code 配置路径
 */
export declare function getClaudeSettingsPath(): string;
//# sourceMappingURL=claude.d.ts.map