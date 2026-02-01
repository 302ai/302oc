#!/usr/bin/env node
/**
 * 302oc CLI 入口 - 交互式菜单模式
 */
import chalk from 'chalk';
import { showMainMenu } from './commands/menu.js';
/**
 * 主函数
 */
async function main() {
    try {
        // 显示欢迎信息
        console.clear();
        console.log('');
        console.log(chalk.cyan.bold('╔═══════════════════════════════════════╗'));
        console.log(chalk.cyan.bold('║         302oc - 302.AI 配置工具        ║'));
        console.log(chalk.cyan.bold('║                                       ║'));
        console.log(chalk.cyan.bold('║    OpenClaw x 302.AI                 ║'));
        console.log(chalk.cyan.bold('║    简化配置，一键切换                 ║'));
        console.log(chalk.cyan.bold('╚═══════════════════════════════════════╝'));
        // 显示主菜单
        await showMainMenu();
    }
    catch (error) {
        console.error(chalk.red('\n❌ 发生错误:'));
        console.error(error);
        process.exit(1);
    }
}
// 运行主程序
main();
//# sourceMappingURL=cli.js.map