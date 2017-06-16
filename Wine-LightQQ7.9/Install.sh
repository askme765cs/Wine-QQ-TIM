#!/bin/bash 
mkdir /opt/QQLight7.9
cp -R qq /opt/QQLight7.9/qq
cp  qq.sh /opt/QQLight7.9/qq.sh
cp  Wine-QQ-Tool.sh /opt/QQLight7.9/Wine-QQ-Tool.sh
cp  icon/QQ.png /opt/QQLight7.9/qq.png
cp  icon/Wine-QQ-Tool.png  /opt/QQLight7.9/Wine-QQ-Tool.png
cp QQ.desktop /usr/share/applications/QQLight.desktop
cp Wine-QQ-Tool.desktop /usr/share/applications/Wine-QQLight-Tool.desktop
chmod 744 /usr/share/applications/QQLight.desktop /usr/share/applications/Wine-QQLight-Tool.desktop
sudo chown -R "$SUDO_USER":users  /opt/QQLight7.9
chmod -R 755 /opt/QQLight7.9
echo "安装完成" 
