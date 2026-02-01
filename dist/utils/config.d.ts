/**
 * 配置文件读写工具
 */
import { Config } from '../types/index.js';
/**
 * 加载配置文件
 */
export declare function loadConfig(): Config | null;
/**
 * 保存配置文件
 */
export declare function saveConfig(config: Config): void;
/**
 * 获取配置目录路径
 */
export declare function getConfigDir(): string;
/**
 * 获取配置文件路径
 */
export declare function getConfigPath(): string;
/**
 * 检查配置是否存在
 */
export declare function configExists(): boolean;
/**
 * 删除配置文件
 */
export declare function deleteConfig(): void;
//# sourceMappingURL=config.d.ts.map