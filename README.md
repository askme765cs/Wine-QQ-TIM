本版本wine-QQ安装说明
-------------------

1.解压文件，直接双击qq.sh可运行QQ

2.将解压后的文件夹放在主目录文件夹下(或其他目录)

3.修改QQ.desktop文件

>[Desktop Entry]  
>Encoding=UTF-8  
>Name=QQ  
>Comment=腾讯QQ  
>Type=Application  
>Exec="..path/qq.sh"%u #..path为sh文件路径  
>Icon=../path/QQ.jpg #QQ图标文件  
>Name[fr_FR]=QQ  
4.将QQ.desktop复制到～/local/usr/applications目录下  

5.现在可通过菜单来启动QQ

手动安装最新版wine QQ方法
-------------------

1.安装wine、winetricks最新版

2.打开winetricks,"安装字体"，选择安装"fakechinese"(会将微软字体替换为文泉驿字体)

3.打开winetricks,"安装windows DLL 或组件"，选择安装"msls31"

4.打开终端执行：winecfg

点击上方的“函数库”那一栏，并点击把光标移动到“新增库函数顶替”下方的方框里，分别输入\*ntoskrnl.exe回车，\*riched20回车，\*txplatform.exe回车。然后在点击下方新出现的\*ntoskrnl.exe和\*txplatform.exe，点击编辑，选择“停用”。

说明：这里，如果不替换riched20的话则安装好QQ后无法输入用户名，不停用txplatform.exe则WineQQ无法完整退出，导致关掉重开后提示QQ文件被占用，禁用ntoskrnl.exe是为了规避可能出现QQ无法启动的bug

5.使用腾讯QQ官网下载的安装包安装QQ

6.QQ启动方法

(1)终端命令：wine ~/.wine/drive_c/Program\ Files\ (x86)/Tencent/QQ/Bin/QQ.exe

(2)建立desktop文件和加入系统菜单的方法:

  a.建立"qq.sh",并添加执行权限，内容为

> #!/bin/bash        
>wine ~/.wine/drive_c/Program\ Files\ (x86)/Tencent/QQ/Bin/QQ.exe

  b.建立QQ.desktop文件，并添加执行权限,内容为

>[Desktop Entry]    
>Encoding=UTF-8  
>Name=QQ  
>Comment=腾讯QQ  
>Type=Application  
>Exec="..path/qq.sh"%u  
>#..path为sh文件路径  
>Icon=../path/QQ.jpg  
>#QQ图标文件  
>Name[fr_FR]=QQ  
*此安装方法参考了[Wine安装最新版QQ(8.9.2)的简单教程](http://www.ubuntukylin.com/ukylin/forum.php?mod=viewthread&tid=30511)， 对文中的方法进行了完善。*
