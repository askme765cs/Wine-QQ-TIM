#!/bin/sh
echo '正在添加32位架构支持'
sudo dpkg --add-architecture i386
wget https://dl.winehq.org/wine-builds/Release.key
sudo apt-key add Release.key
echo '正在添加Wine的源'
sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/
echo '正在更新源'
sudo apt-get update
echo ‘正在安装Wine的稳定版’
sudo apt-get install --install-recommends winehq-stable
echo '正在安装winetricks'
wget https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
chmod +x winetricks
sudo cp winetricks /usr/local/bin
echo '安装完成，重启后进入下载的Wine QQ文件夹，终端执行sh qq.sh即可'
