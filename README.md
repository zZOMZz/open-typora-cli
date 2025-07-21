# open-typora-cli

## 简介

**open-typora-cli** 是一个命令行工具，帮助你在终端中快速用 Typora 打开指定的文件或文件夹。  
支持 macOS、Windows、Linux，适合 Typora 重度用户和 Markdown 爱好者。

## 主要功能

- 通过命令行一键用 Typora 打开当前目录、指定文件或文件夹
- 支持自定义 Typora 可执行文件路径（适配不同操作系统和安装方式）
- 兼容 macOS、Windows、Linux
- 终端立即返回，不会阻塞后续命令

## 安装

```bash
npm install -g open-typora-cli
```

## 使用方法

### 打开当前目录

```bash
typora .
```

### 打开指定文件

```bash
typora README.md
```

### 打开指定文件夹

```bash
typora ./docs
```

### 配置 Typora 路径（如默认路径无效时）

```bash
typora config -t "/Applications/Typora.app/Contents/MacOS/Typora"   # macOS
typora config -t "C:\\Program Files\\Typora\\Typora.exe"            # Windows
```

## 适用场景

- 习惯用命令行管理文档的用户
- 需要批量或快速打开 Markdown 文件的开发者
- 需要在不同平台下灵活配置 Typora 路径的用户
