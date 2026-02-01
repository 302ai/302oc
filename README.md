<p align="center"><a href="https://302.ai/" target="blank"><img src="https://raw.githubusercontent.com/302ai/302oc/refs/heads/main/banner.png" /></a></p >

<h1 align="center">
<span>
    OpenClaw 配置工具 | OpenClaw Configuration Tool
</span>
</h1>

<p align="center">
  一键配置 OpenClaw 使用 302.AI API<br/>
  One-click configuration for OpenClaw with 302.AI API
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/302oc"><img src="https://img.shields.io/npm/v/302oc.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/302oc"><img src="https://img.shields.io/npm/dm/302oc.svg" alt="npm downloads"></a>
  <a href="https://github.com/302ai/302oc/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/302oc.svg" alt="license"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/302oc.svg" alt="node version"></a>
</p>

---

## ✨ 功能特性 | Features

- 🚀 **一键配置** - 快速配置 OpenClaw 使用 302.AI API
- 🌐 **双语支持** - 支持中文和英文界面
- 🔄 **多节点切换** - 支持国际节点和国内节点
- 🤖 **多模型支持** - 支持多种 AI 模型选择
- 💾 **配置管理** - 保存、修改、清空配置

---

## 📦 安装使用 | Installation

### 方式一：直接运行（推荐）

```bash
npx 302oc
```

### 方式二：全局安装

```bash
npm install -g 302oc
302oc
```

---

## 🎯 快速开始 | Quick Start

### 首次使用

运行 `npx 302oc` 后，按照引导完成配置：

1. **选择语言** - 中文 / English
2. **输入 API Key** - 输入您的 302.AI API Key
3. **选择模型** - 选择要使用的 AI 模型
4. **选择节点** - 国际节点 / 国内节点
5. **确认应用** - 将配置应用到 OpenClaw

### 主菜单功能

```
1. 配置 API Key      - 设置或更新 API Key
2. 配置 API 节点     - 切换国际/国内节点
3. 配置模型          - 选择 AI 模型
4. 配置界面语言      - 切换中文/英文
5. 清空当前配置      - 重置所有配置
6. 应用配置并退出    - 保存配置到 OpenClaw
7. 直接退出          - 退出程序
```

---

## 🌐 API 节点 | API Endpoints

| 节点 | 地址 | 适用场景 |
|------|------|----------|
| 国际节点 | `api.302.ai` | 海外用户 |
| 国内节点 | `api.302ai.cn` | 中国大陆用户 |

---

## 🤖 支持的模型 | Supported Models

- Claude Sonnet 4.5
- Claude Opus 4.5
- CC Sonnet 4.5
- CC Opus 4.5
- GLM for Coding
- Kimi for Coding
- MiniMax for Coding
- GPT 5.2
- 自定义模型...

---

## 📁 配置文件位置 | Configuration Files

| 系统 | 302oc 配置 | OpenClaw 配置 |
|------|------------|---------------|
| Windows | `%USERPROFILE%\.302oc\config.json` | `%USERPROFILE%\.openclaw\openclaw.json` |
| macOS/Linux | `~/.302oc/config.json` | `~/.openclaw/openclaw.json` |

---

## 🔧 系统要求 | Requirements

- Node.js >= 18.0.0
- OpenClaw 已安装

---

## 📄 许可证 | License

[MIT](LICENSE)

---

## 🔗 相关链接 | Links

- [302.AI 官网](https://302.ai)
- [OpenClaw](https://github.com/nicholasoxford/openclaw)
- [问题反馈](https://github.com/302ai/302oc/issues)

---

<p align="center">
  Made with ❤️ by <a href="https://302.ai">302.AI</a>
</p>
