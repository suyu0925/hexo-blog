---
title: 部署docker私有源
date: 2022-12-30 10:07:24
tags: 
- docker
description: 在部署服务时，经常需要将docker image拷贝至服务器，使用私有源来管理image会更方便。
---
关于docker私有源也可以参见[官方文档](https://docs.docker.com/registry/deploying/)，这篇文章是我整理的笔记。

## 速览
docker私有源的搭建使用docker官方镜像[registry](https://hub.docker.com/_/registry)来实现，比如一个最简单的本地私有源：
```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

服务跑起来后，就可以使用了：
```bash
docker pull ubuntu:16.04
docker tag ubuntu:16.04 localhost:5000/my-ubuntu
docker push localhost:5000/my-ubuntu
docker image remove ubuntu:16.04
docker image remove localhost:5000/my-ubuntu
```

上面的命令把`ubuntu:16.04`镜像推送到了`localhost:5000/my-ubuntu`。
注意最后的`docker image remove localhost:5000/my-ubuntu`并不会删除服务器上的镜像，有点类似`git branch -d xxx`，只是删除了本地的镜像。
还是可以从服务器上拉取镜像：
```bash
docker pull localhost:5000/my-ubuntu
```

## 映射数据区

默认情况下，数据会被存储在[docker卷](https://docs.docker.com/storage/volumes/)中。我们可以将registry的`/var/lib/registry/`映射到本地目录。
```powershell
mkdir data
docker run -d `
  -p 5000:5000 `
  --restart=always `
  --name registry `
  -v "$(pwd)/data:/var/lib/registry" `
  registry:2
```
这样我们只要保有`data`目录，就能重新建起一个源。

## 鉴权登录

私有源肯定得有鉴权登录，否则就成了公有源。虽然也可以通过云服务器的[IP白名单](https://help.aliyun.com/document_detail/25471.html#h2-url-4)来实现这一点，但账号密码的泛用性更强一些。

首先创建一个密码本
```bash
mkdir auth
docker run --rm --entrypoint htpasswd httpd:2 -Bbn testuser testpassword > auth/htpasswd
```
如果是在windows上，需要指定输出文件的编码格式为Ascii（如指定UTF8，PowerShell中除UTF7之外的所有Unicode编码都是with BOM)。如果不指定，[PowerShell默认](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding#character-encoding-in-windows-powershell)的编码格式是[UTF-16 LE](https://en.wikipedia.org/wiki/UTF-16)，无法被registry使用。
```bash
docker run --rm --entrypoint htpasswd httpd:2 -Bbn testuser testpassword | Set-Content -Encoding ASCII auth/htpasswd
```
如果不想使用`bcrypt`，可以省略`-B`参数。

在启动registry时使用密码本
```powershell
docker run -d `
  -p 5000:5000 `
  --restart=always `
  --name registry `
  -v "$(pwd)/auth:/auth" `
  -v "$(pwd)/data:/var/lib/registry" `
  -e "REGISTRY_AUTH=htpasswd" `
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" `
  -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" `
  registry:2
```

此时再进行push，会提示未鉴权：
```bash
> docker push localhost:5000/my-ubuntu
Using default tag: latest
The push refers to repository [localhost:5000/my-ubuntu]
1251204ef8fc: Preparing
47ef83afae74: Preparing
df54c846128d: Preparing
be96a3f634de: Preparing
no basic auth credentials
```

需要先[登录](https://docs.docker.com/engine/reference/commandline/login/)才能使用源：
```bash
> docker login -u testuser -p testpassword localhost:5000
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
Login Succeeded
```

再进行push操作就正常了：
```bash
> docker push localhost:5000/my-ubuntu
Using default tag: latest
The push refers to repository [localhost:5000/my-ubuntu]
1251204ef8fc: Pushed
47ef83afae74: Pushed
df54c846128d: Pushed
be96a3f634de: Pushed
latest: digest: sha256:a3785f78ab8547ae2710c89e627783cfa7ee7824d3468cae6835c9f4eae23ff7 size: 1150
```

## 外部访问

目前为止我们都是将服务监听在localhost，如果我们要放开给外部使用，最好使用TSL。

使用SSL域名证书有两种方式，一种是[将证书直接绑到registry](https://docs.docker.com/registry/deploying/#get-a-certificate)服务使用，另一种是[使用apache](https://docs.docker.com/registry/recipes/apache/)或[nginx反向代理](https://docs.docker.com/registry/recipes/nginx/)。

nginx是最通用的方案，我们选择这个。

### nginx反向代理

除了最常规的反向代理设置外，registry还需要以下几个设置：

**header**
我们需要反向代理这几个http头
```conf
proxy_set_header  Host              $http_host;   # required for docker client's sake
proxy_set_header  X-Real-IP         $remote_addr; # pass on real client's IP
proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header  X-Forwarded-Proto $scheme;
```

**auth**
```conf
  location /v2/ {
      # To add basic authentication to v2 use auth_basic setting.
      auth_basic "Registry realm";
      auth_basic_user_file /etc/nginx/conf.d/nginx.htpasswd;
  }
```

**body size**
```conf
  server {
    # disable any limits to avoid HTTP 413 for large image uploads
    client_max_body_size 0;
  }
```

**完整示例**
还有一些其它设置，下面是一个完整的示例：
```conf
events {
    worker_connections  1024;
}

http {

  upstream docker-registry {
    server registry:5000;
  }

  ## Set a variable to help us decide if we need to add the
  ## 'Docker-Distribution-Api-Version' header.
  ## The registry always sets this header.
  ## In the case of nginx performing auth, the header is unset
  ## since nginx is auth-ing before proxying.
  map $upstream_http_docker_distribution_api_version $docker_distribution_api_version {
    '' 'registry/2.0';
  }

  server {
    listen 443 ssl;
    server_name myregistrydomain.com;

    # SSL
    ssl_certificate /etc/nginx/conf.d/domain.crt;
    ssl_certificate_key /etc/nginx/conf.d/domain.key;

    # Recommendations from https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html
    ssl_protocols TLSv1.1 TLSv1.2;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # disable any limits to avoid HTTP 413 for large image uploads
    client_max_body_size 0;

    # required to avoid HTTP 411: see Issue #1486 (https://github.com/moby/moby/issues/1486)
    chunked_transfer_encoding on;

    location /v2/ {
      # Do not allow connections from docker 1.5 and earlier
      # docker pre-1.6.0 did not properly set the user agent on ping, catch "Go *" user agents
      if ($http_user_agent ~ "^(docker\/1\.(3|4|5(?!\.[0-9]-dev))|Go ).*$" ) {
        return 404;
      }

      # To add basic authentication to v2 use auth_basic setting.
      auth_basic "Registry realm";
      auth_basic_user_file /etc/nginx/conf.d/nginx.htpasswd;

      ## If $docker_distribution_api_version is empty, the header is not added.
      ## See the map directive above where this variable is defined.
      add_header 'Docker-Distribution-Api-Version' $docker_distribution_api_version always;

      proxy_pass                          http://docker-registry;
      proxy_set_header  Host              $http_host;   # required for docker client's sake
      proxy_set_header  X-Real-IP         $remote_addr; # pass on real client's IP
      proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header  X-Forwarded-Proto $scheme;
      proxy_read_timeout                  900;
    }
  }
}
```

将上面的conf文件保存至`auth/nginx.conf`。

将SSL证书保存至`auth/`。
```bash
cp domain.crt auth
cp domain.key auth
```

将下面的内容保存至`docker-compose.yml`。
```yml
nginx:
  # Note : Only nginx:alpine supports bcrypt.
  # If you don't need to use bcrypt, you can use a different tag.
  # Ref. https://github.com/nginxinc/docker-nginx/issues/29
  image: "nginx:alpine"
  ports:
    - 5043:443
  links:
    - registry:registry
  volumes:
    - ./auth:/etc/nginx/conf.d
    - ./auth/nginx.conf:/etc/nginx/nginx.conf:ro

registry:
  image: registry:2
  volumes:
    - ./data:/var/lib/registry
```

**完成**
跑起来看看结果
```bash
docker-compose up -d
```

看看是不是可以正常使用了
```bash
docker login -u=testuser -p=testpassword -e=root@example.ch myregistrydomain.com:5043
docker tag ubuntu myregistrydomain.com:5043/test
docker push myregistrydomain.com:5043/test
docker pull myregistrydomain.com:5043/test
```

如果不想使用docker-compose再运行一个nginx，要注意`htpasswd`的存放路径，需要放在nginx的用户`www-data`能读取到的地方，比如`/var/www`下。
