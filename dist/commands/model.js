/**
 * model 命令 - 配置模型
 */
import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadConfig, saveConfig } from '../utils/config.js';
import { applyProfile } from '../utils/openclaw.js';
import { DEFAULT_MODELS } from '../types/index.js';
export async function configModel() {
    console.log(chalk.cyan.bold('\n════════════════════════════════════════'));
    console.log(chalk.cyan.bold('           模型配置'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════\n'));
    const config = loadConfig();
    if (!config || !config.currentProfile) {
        console.log(chalk.yellow('⚠️  没有可用的配置\n'));
        return;
    }
    const currentProfile = config.profiles[config.currentProfile];
    const { modelType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'modelType',
            message: '选择要配置的模型类型:',
            choices: [
                { name: '🎯 主模型 (ANTHROPIC_MODEL)', value: 'primary' },
                { name: '🚀 Haiku 模型', value: 'haiku' },
                { name: '⚖️  Sonnet 模型', value: 'sonnet' },
                { name: '💪 Opus 模型', value: 'opus' }
            ]
        }
    ]);
    const modelChoices = [
        { name: '🚀 Claude 3.5 Haiku (快速)', value: DEFAULT_MODELS.haiku },
        { name: '⚖️  Claude Sonnet 4 (平衡)', value: DEFAULT_MODELS.sonnet },
        { name: '💪 Claude Opus 4 (强大)', value: DEFAULT_MODELS.opus }
    ];
    const { model } = await inquirer.prompt([
        {
            type: 'list',
            name: 'model',
            message: `选择 ${modelType} 模型:`,
            choices: modelChoices,
            default: DEFAULT_MODELS.sonnet
        }
    ]);
    // 更新模型配置
    if (!currentProfile.models) {
        currentProfile.models = {};
    }
    currentProfile.models[modelType] = model;
    // 应用配置
    console.log(chalk.gray('\n正在应用模型配置...'));
    applyProfile(currentProfile);
    // 保存配置
    saveConfig(config);
    // 显示成功信息
    const modelName = modelChoices.find(c => c.value === model)?.name || model;
    console.log(chalk.green.bold(`\n✅ 模型已更新: ${modelName}\n`));
    console.log(chalk.cyan('📋 配置信息:'));
    console.log(chalk.gray(`   配置: ${currentProfile.name}`));
    console.log(chalk.gray(`   类型: ${modelType}`));
    console.log(chalk.gray(`   模型: ${model}`));
    console.log('');
}
//# sourceMappingURL=model.js.map