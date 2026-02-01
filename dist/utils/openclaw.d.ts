/**
 * OpenClaw 配置管理工具
 */
import { Profile, OpenClawSettings } from '../types/index.js';
/**
 * 加载 OpenClaw 配置
 */
export declare function loadOpenClawSettings(): OpenClawSettings;
/**
 * 保存 OpenClaw 配置
 */
export declare function saveOpenClawSettings(settings: OpenClawSettings): void;
/**
 * 备份 OpenClaw 配置
 */
export declare function backupOpenClawSettings(): string | null;
/**
 * 应用配置到 OpenClaw
 */
export declare function applyProfile(profile: Profile): void;
/**
 * 检查 OpenClaw 是否已安装
 */
export declare function isOpenClawInstalled(): boolean;
/**
 * 获取 OpenClaw 配置路径
 */
export declare function getOpenClawSettingsPath(): string;
//# sourceMappingURL=openclaw.d.ts.map