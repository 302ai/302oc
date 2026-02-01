/**
 * switch 命令 - 切换配置
 */
import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadConfig, saveConfig } from '../utils/config.js';
import { applyProfile } from '../utils/openclaw.js';
import { maskApiKey } from '../utils/validator.js';
export async function switchProfile() {
    console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
    console.log(chalk.cyan.bold('           切换配置'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));
    const config = loadConfig();
    if (!config || Object.keys(config.profiles).length === 0) {
        console.log(chalk.yellow('⚠️  没有可用的配置\n'));
        return;
    }
    // 构建选项列表
    const choices = Object.entries(config.profiles).map(([id, profile]) => {
        const isCurrent = id === config.currentProfile;
        const currentTag = isCurrent ? chalk.green(' ◀── 当前') : '';
        return {
            name: `${profile.name}${currentTag}`,
            value: id
        };
    });
    const { profileId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'profileId',
            message: '选择要切换的配置:',
            choices
        }
    ]);
    const profile = config.profiles[profileId];
    // 应用配置
    console.log(chalk.gray('\n正在应用配置...'));
    applyProfile(profile);
    // 更新当前配置
    config.currentProfile = profileId;
    saveConfig(config);
    // 显示成功信息
    console.log(chalk.green.bold('\n✅ 已切换到: ' + profile.name));
    console.log(chalk.cyan('\n📋 当前配置:'));
    console.log(chalk.gray(`   API Key: ${maskApiKey(profile.apiKey)}`));
    console.log(chalk.gray(`   Base URL: ${profile.baseUrl}`));
    console.log(chalk.gray(`   主模型: ${profile.models.primary || '未设置'}`));
    console.log('');
}
//# sourceMappingURL=switch.js.map