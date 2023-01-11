---
title: 在Visual Studio中使用docker调试与发布
date: 2023-01-11 15:39:24
tags:
- docker
description: 在Visual Studio 2022中内置了对docker的支持，可以很方便的调试与发布至docker源。
---
## 启用docker
在创建Visual Studio工程时，可以选择`启用docker`。

{% asset_img "enable-docker.png" "启用docker" %}

在这里可以选择使用linux或windows容器，后续也可以修改，配置在fsproj中的`<DockerDefaultTargetOS>Windows</DockerDefaultTargetOS>`。
可以使用命令`DockerCli.exe -SwitchDaemon`来切换linux和windows容器。

在打开工程时，会在`容器工具`中预热容器，这里展示的是切换至windows容器后首次的显示内容：
```
========== 容器必备项检查 ==========
正在验证是否安装了 Docker Desktop...
安装了 Docker Desktop。
========== 正在验证 Docker Desktop 是否正在运行... ==========
正在验证 Docker Desktop 是否正在运行...
Docker Desktop 正在运行。
========== 正在验证 Docker OS ==========
正在验证 Docker Desktop 的操作系统模式是否匹配项目的目标操作系统...
正在将 Docker 切换为使用 Windows 容器...
C:\Program Files\Docker\Docker\DockerCli.exe -SwitchDaemon
Docker 正在使用 Windows 容器。
Docker Desktop 的操作系统模式与项目的目标操作系统匹配。
========== 拉取所需的映像 ==========
正在检查缺少的 Docker 映像...
正在拉取 Docker 映像。要取消此下载，请关闭命令提示符窗口。
docker pull mcr.microsoft.com/dotnet/aspnet:6.0
Docker 映像准备就绪。
========== 正在为 aspnetcore-starter 预热容器 ==========
正在启动容器...
docker build -f "C:\aspnetcore-starter\Dockerfile" --force-rm -t aspnetcorestarter:dev --target base  --label "com.microsoft.created-by=visual-studio" --label "com.microsoft.visual-studio.project-name=aspnetcore-starter" "C:\aspnetcore-starter" 
Sending build context to Docker daemon   12.8kB

Step 1/6 : FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
 ---> bf68776fa5fd
Step 2/6 : WORKDIR /app
 ---> Running in e94384d22857
Removing intermediate container e94384d22857
 ---> ea0fbf24c0b6
Step 3/6 : EXPOSE 80
 ---> Running in ce3b710cbd03
Removing intermediate container ce3b710cbd03
 ---> 789a79d66692
Step 4/6 : EXPOSE 443
 ---> Running in e5d1564b5068
Removing intermediate container e5d1564b5068
 ---> e1fe0f5f6e4e
Step 5/6 : LABEL com.microsoft.created-by=visual-studio
 ---> Running in 72be90c608ab
Removing intermediate container 72be90c608ab
 ---> 01a9446b8b12
Step 6/6 : LABEL com.microsoft.visual-studio.project-name=aspnetcore-starter
 ---> Running in ed3661aaa105
Removing intermediate container ed3661aaa105
 ---> dd3e1d24aff2
Successfully built dd3e1d24aff2
Successfully tagged aspnetcorestarter:dev
docker run -dt -v "C:\Users\username\onecoremsvsmon\17.4.11004.1991:C:\remote_debugger:ro" -v "C:\Users\username\AppData\Roaming\Microsoft\UserSecrets:C:\Users\ContainerUser\AppData\Roaming\Microsoft\UserSecrets:ro" -v "C:\Users\username\AppData\Roaming\ASP.NET\Https:C:\Users\ContainerUser\AppData\Roaming\ASP.NET\Https:ro" -v "C:\aspnetcore-starter\aspnetcore-starter:C:\app" -v "C:\aspnetcore-starter:c:\src" -v "C:\Users\username\.nuget\packages\:c:\.nuget\fallbackpackages2" -v "C:\Program Files (x86)\Microsoft Visual Studio\Shared\NuGetPackages:c:\.nuget\fallbackpackages" -e "ASPNETCORE_LOGGING__CONSOLE__DISABLECOLORS=true" -e "ASPNETCORE_ENVIRONMENT=Development" -e "ASPNETCORE_URLS=https://+:443;http://+:80" -e "DOTNET_USE_POLLING_FILE_WATCHER=1" -e "NUGET_PACKAGES=c:\.nuget\fallbackpackages2" -e "NUGET_FALLBACK_PACKAGES=c:\.nuget\fallbackpackages;c:\.nuget\fallbackpackages2" -P --name aspnetcore-starter --entrypoint C:\remote_debugger\x64\msvsmon.exe aspnetcorestarter:dev /noauth /anyuser /silent /nostatus /noclrwarn /nosecuritywarn /nofirewallwarn /nowowwarn /fallbackloadremotemanagedpdbs /timeout:2147483646 /LogDebuggeeOutputToStdOut 
671324104a5211ce0bce851af1e5373ce9af9cfb3198b8e1b3606da04af2225b
已成功启动容器。
========== 已完成 ==========
```

## 在启动调试时卡住
使用linux容器启动调试时，显示以下输出：
```
1>C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NonInteractive -NoProfile -WindowStyle Hidden -ExecutionPolicy RemoteSigned -File "C:\Users\username\AppData\Local\Temp\GetVsDbg.ps1" -Version vs2017u5 -RuntimeID linux-x64 -InstallPath "C:\Users\username\vsdbg\vs2017u5"
1>Info: Using vsdbg version '17.4.11209.2'
1>Info: Using Runtime ID 'linux-x64'
1>Info: Latest version of VsDbg is present. Skipping downloads
1>C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NonInteractive -NoProfile -WindowStyle Hidden -ExecutionPolicy RemoteSigned -File "C:\Users\username\AppData\Local\Temp\GetVsDbg.ps1" -Version vs2017u5 -RuntimeID linux-musl-x64 -InstallPath "C:\Users\username\vsdbg\vs2017u5\linux-musl-x64"
1>Info: Using vsdbg version '17.4.11209.2'
1>Info: Using Runtime ID 'linux-musl-x64'
```
然后卡在这里。

查看`C:\Users\username\AppData\Local\Temp\GetVsDbg.ps1`，很容易发现它是卡在了下载上：
```powershell
    $target = ("vsdbg-" + $VersionNumber).Replace('.','-') + "/vsdbg-" + $RuntimeID + ".zip"
    $url = "https://vsdebugger.azureedge.net/" + $target

    DownloadAndExtract $url $InstallPath

    WriteSuccessInfo $InstallPath $RuntimeID $VersionNumber
    Write-Host "Info: Successfully installed vsdbg at '$InstallPath'"
```
我们把`$url`拼凑出来，得到`https://vsdebugger.azureedge.net/vsdbg-17-4-11209-2/vsdbg-linux-musl-x64.zip`。

直接使用Edge下载，发现这个压缩包的大小为60兆左右，下载速度在50K，大约需要20分钟。
看来直接放着不管，等半小时就能解决卡住的问题了。

但谁叫咱们是急性子呢，使用{% post_link neat-download-manager Neat Download Manager %}下载，2分钟搞定。
下载完后把它解压缩到`$InstallPath`，即`C:\Users\username\vsdbg\vs2017u5\linux-musl-x64`。强行关闭visual studio，再次启动调试就正常了。

## 发布

如果要发布到docker registry，可以在发布时，选择发布到`Docker容器注册表`。

VS内置了两个Docker源：Azure和Docker Hub。
{% asset_img "select-docker-registry.png" "选择容器注册表" %}

我们选择{% post_link deploy-docker-registry 自建docker源 %}：
{% asset_img "publish-to-docker-registry.png" "自建docker源" %}

注意，这里填的url不要含`http`头，VS会添加`https`头来强制使用ssl确保安全性。因为[使用账号密码的鉴权方式不支持http](https://docs.docker.com/registry/insecure/)。
发布源的配置保存在工程目录的`Properties\PublishProfiles\`子目录下。

只需轻轻点击发布即可推送到docker私有源。
```
已启动生成...
1>------ 已启动生成: 项目: aspnetcore-starter, 配置: Release Any CPU ------
1>aspnetcore-starter -> C:\aspnetcore-starter\bin\Release\net6.0\aspnetcore-starter.dll
2>------ 已启动发布: 项目: aspnetcore-starter, 配置: Release Any CPU ------
aspnetcore-starter -> C:\aspnetcore-starter\bin\Release\net6.0\aspnetcore-starter.dll
aspnetcore-starter -> C:\aspnetcore-starter\obj\Docker\publish\
Docker version 20.10.21, build baeda1f
docker build -f "C:\aspnetcore-starter\Dockerfile" --force-rm -t aspnetcorestarter  --label "com.microsoft.created-by=visual-studio" --label "com.microsoft.visual-studio.project-name=aspnetcore-starter" "C:" 
#1 [internal] load build definition from Dockerfile
#1 sha256:8baf9fe9cc57b6cf0dd45cec9ac8f026f414e73ab07bc3ccd5d42b5e310f458f
#1 transferring dockerfile: 1.06kB done
#1 DONE 0.0s

#2 [internal] load .dockerignore
#2 sha256:f5805a506c9a1d0feb2b7cfc779db1395c7c998c1b106fd6a488baef30c69bb0
#2 transferring context: 382B done
#2 DONE 0.0s

#3 [internal] load metadata for mcr.microsoft.com/dotnet/sdk:6.0
#3 sha256:9eb4f6c3944cfcbfe18b9f1a753c769fc35341309a8d4a21f8937f47e94c712b
#3 ...

#4 [internal] load metadata for mcr.microsoft.com/dotnet/aspnet:6.0
#4 sha256:ac4494cbca04ddb415c76edcbcc7688784c2a6ea65dd656286c013738aa3b75f
#4 DONE 0.0s

#3 [internal] load metadata for mcr.microsoft.com/dotnet/sdk:6.0
#3 sha256:9eb4f6c3944cfcbfe18b9f1a753c769fc35341309a8d4a21f8937f47e94c712b
#3 DONE 0.3s

#8 [build 1/7] FROM mcr.microsoft.com/dotnet/sdk:6.0@sha256:23abf93a047e6f1bf1659bd0ff787facd6c80dcbf3421dd655f10bac209d1fde
#8 sha256:c96c19e06e8ccfaae43656f0e9f3762d271a5c005dd95681e629f08302587e53
#8 DONE 0.0s

#5 [base 1/2] FROM mcr.microsoft.com/dotnet/aspnet:6.0
#5 sha256:50f1ddc10932c4a74c7af5704e931a9489c710faea4f2381fe2380827a900e00
#5 DONE 0.0s

#10 [internal] load build context
#10 sha256:b6a38a1e45714a79432c6ecbdb652fff543e4059d3b34c5c5f999be364f37248
#10 transferring context: 5.54kB 0.0s done
#10 DONE 0.1s

#9 [build 2/7] WORKDIR /src
#9 sha256:9c9fa3968f5b4f2cff4aa864a4ce235a22a6c7305e5220f516bc00d86d30e575
#9 CACHED

#11 [build 3/7] COPY [aspnetcore-starter/aspnetcore-starter.fsproj, aspnetcore-starter/]
#11 sha256:6d9a5e2943840ea676fb7090c9d6650d8649bdc9e91b8706b67bed5fcb44eeb1
#11 DONE 0.0s

#12 [build 4/7] RUN dotnet restore "aspnetcore-starter/aspnetcore-starter.fsproj"
#12 sha256:f7fe82b3aa75010301a204a04d87b86cd4f5d4b0cfbd462708e9cb6662812373
#12 1.017   Determining projects to restore...
#12 3.569   Restored /src/aspnetcore-starter/aspnetcore-starter.fsproj (in 2.24 sec).
#12 DONE 3.7s

#13 [build 5/7] COPY . .
#13 sha256:acc19d075613d47507d57b0daabf4ff169fac8c1dff88b4e77e6a0e99f8590cb
#13 DONE 0.1s

#14 [build 6/7] WORKDIR /src/aspnetcore-starter
#14 sha256:7dd55bf8c94ee5fd1995b4194fc59971f4e3417b237b62f6b73f3276752134f5
#14 DONE 0.1s

#15 [build 7/7] RUN dotnet build "aspnetcore-starter.fsproj" -c Release -o /app/build
#15 sha256:27ea67d1d5032e19f58a61b48b66488f25899abd04ab77761897c04b8c72c0ad
#15 0.506 MSBuild version 17.3.2+561848881 for .NET
#15 1.183   Determining projects to restore...
#15 1.645   All projects are up-to-date for restore.
#15 5.471   aspnetcore-starter -> /app/build/aspnetcore-starter.dll
#15 5.486 
#15 5.486 Build succeeded.
#15 5.486     0 Warning(s)
#15 5.486     0 Error(s)
#15 5.486 
#15 5.486 Time Elapsed 00:00:04.89
#15 DONE 5.5s

#16 [publish 1/1] RUN dotnet publish "aspnetcore-starter.fsproj" -c Release -o /app/publish /p:UseAppHost=false
#16 sha256:32f4298e51c853156a2f81bb365b8f4b12eda0127896fc52e6a8e94186a256f7
#16 0.511 MSBuild version 17.3.2+561848881 for .NET
#16 1.113   Determining projects to restore...
#16 1.499   All projects are up-to-date for restore.
#16 2.305   aspnetcore-starter -> /src/aspnetcore-starter/bin/Release/net6.0/aspnetcore-starter.dll
#16 2.365   aspnetcore-starter -> /app/publish/
#16 DONE 2.4s

#6 [base 2/2] WORKDIR /app
#6 sha256:bc3cf6c390e5fe0e66017b4845c8fcf3e56c7adac9f514a00c2c986024f377a4
#6 CACHED

#7 [final 1/2] WORKDIR /app
#7 sha256:3baba3edbb555769ad9a49e827de88d7dcc4f72ad6e2b42e576964e4a30eac96
#7 CACHED

#17 [final 2/2] COPY --from=publish /app/publish .
#17 sha256:888b07e32e65ef8e188f006eaa973588bbffde456c17a1a5be7ff18d2cf0f3d3
#17 DONE 0.1s

#18 exporting to image
#18 sha256:e8c613e07b0b7ff33893b694f7759a10d42e180f2b4dc349fb57dc6b71dcab00
#18 exporting layers 0.1s done
#18 writing image sha256:d666433c2e744951f78bf298a82a05d62da163cac2fb335ba215cc707f60fcce done
#18 naming to docker.io/library/aspnetcorestarter done
#18 DONE 0.1s
========== 版本: 1 成功，0 失败，0 更新，0 跳过 ==========
========== 占用时间 00:17.813 ==========
========== 发布: 1 个成功，0 个失败，0 个已跳过 ==========
========== 占用时间 00:17.813 ==========
The push refers to repository [your_docker_registry.com:443/aspnetcorestarter]
bb0e8b5691c1: Preparing
5f70bf18a086: Preparing
756d414086ee: Preparing
7e963e684504: Preparing
579f2f220e9d: Preparing
3484e444e9cf: Preparing
95a1c56e8ba5: Preparing
67a4178b7d47: Preparing
3484e444e9cf: Waiting
95a1c56e8ba5: Waiting
67a4178b7d47: Waiting
756d414086ee: Layer already exists
5f70bf18a086: Layer already exists
579f2f220e9d: Layer already exists
7e963e684504: Layer already exists
95a1c56e8ba5: Layer already exists
3484e444e9cf: Layer already exists
67a4178b7d47: Layer already exists
bb0e8b5691c1: Pushed
latest: digest: sha256:32dd47b9da184b1462566f6a37f80875fefbe29a3b46f030cf4519573dccc170 size: 1995
已成功推送带标记“latest”的 Docker 映像
```
