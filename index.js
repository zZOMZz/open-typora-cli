#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 获取Typora应用程序路径
function getTyporaPath() {
  if(process.env.TYPORA_PATH){
    return process.env.TYPORA_PATH;
  }

  const platform = process.platform;
  
  switch (platform) {
    case 'darwin': // macOS
      return '/Applications/Typora.app/Contents/MacOS/Typora';
    case 'win32': // Windows
      return 'C:\\Program Files\\Typora\\Typora.exe';
    case 'linux': // Linux
      return 'typora'; // 假设已安装并添加到PATH
    default:
      throw new Error(`不支持的操作系统: ${platform}`);
  }
}

// 检查文件或目录是否存在
function checkPathExists(targetPath) {
  try {
    return fs.existsSync(targetPath);
  } catch (error) {
    return false;
  }
}

// 打开Typora
function openWithTypora(targetPath) {
  const typoraPath = getTyporaPath();
  const resolvedPath = path.resolve(targetPath);
  
  // 检查目标路径是否存在
  if (!checkPathExists(resolvedPath)) {
    console.error(`错误: 路径不存在 "${resolvedPath}"`);
    process.exit(1);
  }
  
  // 构建命令
  const command = `"${typoraPath}" "${resolvedPath}"`;
  
  // 执行命令
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error.message}`);
      process.exit(1);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
  });
}

// 设置命令行参数
program
  .name('typora')
  .description('在Typora中打开文件或文件夹')
  .version('1.0.0')
  .argument('[path]', '要打开的文件或文件夹路径 (默认为当前目录)', '.')
  .option('-t, --typora-path <path>', 'Typora应用程序路径')
  .action((pathArg, options) => {
    if(options.typoraPath){
      process.env.TYPORA_PATH = options.typoraPath;
    }

    openWithTypora(pathArg);
  });

// 解析命令行参数
program.parse(); 