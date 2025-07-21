#!/usr/bin/env node

const os = require('os');
const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { exec, spawn, spawnSync} = require('child_process');
const configPath = path.join(os.homedir(), '.typora-cli.json');
// 获取Typora应用程序路径
function getTyporaPath() {
  // 如果配置文件存在，则读取配置文件
  if(fs.existsSync(configPath)){
    return JSON.parse(fs.readFileSync(configPath, 'utf-8')).typoraPath;
  }

  // 如果配置文件不存在，则根据操作系统获取默认路径
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

// 检查路径是否是有效的Typora应用程序路径
function isValidTyporaPath(typoraPath) {
  if (!checkPathExists(typoraPath)) return false;
  // 检查是不是文件
  const stat = fs.statSync(typoraPath);
  if (!stat.isFile()) return false;

  // 判断是不是可执行文件
  const isExecutable = fs.statSync(typoraPath).mode & 0o111;
  if (!isExecutable) return false;

  return true;
} 

// 打开Typora
function openWithTypora(targetPath) {
  const typoraPath = getTyporaPath();
  const resolvedPath = path.resolve(targetPath);

  if (!checkPathExists(resolvedPath)) {
    console.error(`[Error]: 读取文件或文件夹路径不存在 "${resolvedPath}"`);
    process.exit(1);
  }

  try {
    if (process.platform === 'darwin') {
      // macOS: 用 open -a Typora
      exec(`open -a "${typoraPath}" "${resolvedPath}"`);
      process.exit(0);
    } else {
      // 其他平台（如 Linux），直接用 Typora 路径
      const child = spawn(typoraPath, [resolvedPath], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      process.exit(0);
    }
  } catch (error) {
    console.error(`[Error]: 打开Typora失败: ${error.message}`);
    process.exit(1);
  }  
}

// 设置path
program
  .name('config-typora')
  .command('config')
  .description('配置Typora应用程序路径')
  .option('-t, --typora-path <path>', 'Typora应用程序路径')
  .action((options) => {
    if(options.typoraPath){
      if (!isValidTyporaPath(options.typoraPath)) {
        console.error(`[Error]: 该路径不是有效的Typora应用程序路径: ${options.typoraPath}`);
        process.exit(1);
      }

      fs.writeFileSync(configPath, JSON.stringify({
        typoraPath: options.typoraPath
      }));
      console.log(`[Info]: 配置写入成功，Typora应用程序路径为: ${options.typoraPath}`);
    }

    process.exit(0);
  });

// 设置命令行参数 
program
  .name('open-typora')
  .description('在Typora中打开文件或文件夹')
  .version('1.0.0')
  .argument('[path]', '要打开的文件或文件夹路径 (默认为当前目录)', '.')
  .action((pathArg) => {
    openWithTypora(pathArg);

  });

// 解析命令行参数
program.parse(); 