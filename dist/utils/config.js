/**
 * 配置文件读写工具
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
const CONFIG_DIR = join(homedir(), '.302oc');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
/**
 * 加载配置文件
 */
export function loadConfig() {
    if (!existsSync(CONFIG_FILE)) {
        return null;
    }
    try {
        const content = readFileSync(CONFIG_FILE, 'utf-8');
        const config = JSON.parse(content);
        // 验证配置格式
        if (!config.version || !config.profiles) {
            console.error('配置文件格式错误');
            return null;
        }
        return config;
    }
    catch (error) {
        console.error('配置文件读取失败:', error);
        return null;
    }
}
/**
 * 保存配置文件
 */
export function saveConfig(config) {
    try {
        // 确保配置目录存在
        if (!existsSync(CONFIG_DIR)) {
            mkdirSync(CONFIG_DIR, { recursive: true });
        }
        // 格式化 JSON（缩进 2 空格）
        const content = JSON.stringify(config, null, 2);
        writeFileSync(CONFIG_FILE, content, 'utf-8');
    }
    catch (error) {
        console.error('配置文件保存失败:', error);
        throw error;
    }
}
/**
 * 获取配置目录路径
 */
export function getConfigDir() {
    return CONFIG_DIR;
}
/**
 * 获取配置文件路径
 */
export function getConfigPath() {
    return CONFIG_FILE;
}
/**
 * 检查配置是否存在
 */
export function configExists() {
    return existsSync(CONFIG_FILE);
}
/**
 * 删除配置文件
 */
export function deleteConfig() {
    if (existsSync(CONFIG_FILE)) {
        unlinkSync(CONFIG_FILE);
    }
}
//# sourceMappingURL=config.js.map