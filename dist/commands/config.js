/**
 * config 命令 - 配置管理
 */
import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadConfig, saveConfig } from '../utils/config.js';
import { maskApiKey, validateApiKey, validateBaseUrl, validateProfileName } from '../utils/validator.js';
export async function configManager(action) {
    const config = loadConfig();
    switch (action) {
        case 'list':
            listConfigs(config);
            await pause();
            break;
        case 'add':
            await addConfig(config);
            break;
        case 'remove':
            await removeConfig(config);
            break;
    }
}
/**
 * 列出所有配置
 */
function listConfigs(config) {
    if (!config || Object.keys(config.profiles).length === 0) {
        console.log(chalk.yellow('\n⚠️  没有可用的配置\n'));
        return;
    }
    console.log(chalk.cyan.bold('\n═══════════════════════════════════════'));
    console.log(chalk.cyan.bold('           已保存的配置'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));
    Object.entries(config.profiles).forEach(([id, profile]) => {
        const isCurrent = id === config.currentProfile;
        const currentTag = isCurrent ? chalk.green(' ◀── 当前') : '';
        console.log(chalk.bold(`${profile.name}${currentTag}`));
        console.log(chalk.gray(`   ID: ${id}`));
        console.log(chalk.gray(`   API Key: ${maskApiKey(profile.apiKey)}`));
        console.log(chalk.gray(`   Base URL: ${profile.baseUrl}`));
        if (profile.models.primary) {
            console.log(chalk.gray(`   主模型: ${profile.models.primary}`));
        }
        console.log('');
    });
}
/**
 * 添加新配置
 */
async function addConfig(config) {
    console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
    console.log(chalk.cyan.bold('           添加新配置'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));
    if (!config) {
        console.log(chalk.red('❌ 配置文件不存在，请先初始化'));
        await pause();
        return;
    }
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: '配置名称:',
            validate: validateProfileName
        },
        {
            type: 'password',
            name: 'apiKey',
            message: 'API Key:',
            mask: '*',
            validate: validateApiKey
        },
        {
            type: 'input',
            name: 'baseUrl',
            message: 'Base URL:',
            default: 'https://api.302.ai',
            validate: validateBaseUrl
        }
    ]);
    // 生成配置 ID
    const id = answers.name.toLowerCase().replace(/\s+/g, '-');
    // 检查 ID 是否已存在
    if (config.profiles[id]) {
        const { overwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `配置 "${id}" 已存在，是否覆盖？`,
                default: false
            }
        ]);
        if (!overwrite) {
            return;
        }
    }
    // 创建新配置
    config.profiles[id] = {
        name: answers.name,
        apiKey: answers.apiKey.trim(),
        baseUrl: answers.baseUrl.trim(),
        models: {
            primary: 'claude-sonnet-4-20250514',
            haiku: 'claude-3-5-haiku-20241022',
            sonnet: 'claude-sonnet-4-20250514',
            opus: 'claude-opus-4-20250514'
        }
    };
    // 保存配置
    saveConfig(config);
    console.log(chalk.green(`\n✅ 配置已添加: ${answers.name}`));
    console.log(chalk.gray(`ID: ${id}`));
    console.log(chalk.gray('\n使用 "切换配置" 功能切换到此配置'));
    await pause();
}
/**
 * 删除配置
 */
async function removeConfig(config) {
    console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
    console.log(chalk.cyan.bold('           删除配置'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));
    if (!config || Object.keys(config.profiles).length === 0) {
        console.log(chalk.yellow('⚠️  没有可用的配置\n'));
        await pause();
        return;
    }
    // 如果只有一个配置，不允许删除
    if (Object.keys(config.profiles).length === 1) {
        console.log(chalk.yellow('⚠️  至少需要保留一个配置\n'));
        await pause();
        return;
    }
    const choices = Object.entries(config.profiles).map(([id, profile]) => {
        const isCurrent = id === config.currentProfile;
        const disabled = isCurrent ? ' (不能删除当前配置)' : '';
        return {
            name: `${profile.name}${disabled}`,
            value: id,
            disabled: isCurrent
        };
    });
    const { profileId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'profileId',
            message: '选择要删除的配置:',
            choices
        }
    ]);
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `确认删除配置 "${config.profiles[profileId].name}"？`,
            default: false
        }
    ]);
    if (confirm) {
        const name = config.profiles[profileId].name;
        delete config.profiles[profileId];
        saveConfig(config);
        console.log(chalk.green(`\n✅ 配置已删除: ${name}\n`));
    }
    else {
        console.log(chalk.gray('取消操作\n'));
    }
    await pause();
}
/**
 * 暂停等待用户按键
 */
async function pause() {
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '\n按 Enter 返回...' }]);
}
//# sourceMappingURL=config.js.map