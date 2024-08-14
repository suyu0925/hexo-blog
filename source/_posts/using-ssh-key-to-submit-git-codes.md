---
title: 使用ssh key来提交git代码
date: 2024-08-14 13:30:02
tags: git
description: 当使用公用电脑提交git代码时，不想暴露账号的登录信息。此时最简单的做法是使用ssh key，可以很方便的销毁。
---
以github和gitee为例。

## 创建ssh keys

首先是创建一个ssh key。参见[Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)或[生成/添加SSH公钥](https://gitee.com/help/articles/4181)。

```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```

## 添加ssh公钥到git服务

github参见[Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)。

gitee参见[生成/添加SSH公钥](https://gitee.com/help/articles/4181)。

## 验证

添加完ssh公钥可使用`ssh -T`来验证。

```sh
> ssh -T git@github.com
The authenticity of host '[ssh.github.com]:443 ([198.18.0.155]:443)' can't be established.
ED25519 key fingerprint is SHA256:WJxA1e/dM8m1V9Q+8tJjOt3K1T4M6g3V+LfZ6PQErUg.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[ssh.github.com]:443' (ED25519) to the list of known hosts.
Hi $your_name! You've successfully authenticated, but GitHub does not provide shell access.
```

## 配置多个ssh keys

如果存在多个ssh keys，需要添加配置文件`~/.ssh/config`来指定具体使用哪个key。参见[Git配置多个SSH-Key](https://gitee.com/help/articles/4229)。

```ini
# gitee
Host gitee.com
    HostName gitee.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/gitee_id_rsa

# github
Host github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/github_id_rsa
```

## ssh key密码

如果在创建ssh key时指定了密码，为了避免反复输入密码，可以使用[ssh-agent](https://man.openbsd.org/ssh-agent.1)。参见[Working with SSH key passphrases](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/working-with-ssh-key-passphrases)。

## 切换仓库地址

使用ssh key认证后，拉取仓库就需要使用ssh地址而不是https地址。

```sh
> git remote -v
origin  https://github.com/username/repository.git (fetch)
origin  https://github.com/username/repository.git (push)

> git remote set-url origin git@github.com:username/repository.git

> git remote -v
origin  git@github.com:username/repository.git (fetch)
origin  git@github.com:username/repository.git (push)
```

## 附录：github连接出错

如果碰到了这个问题：

```sh
> ssh -T git@github.com
kex_exchange_identification: Connection closed by remote host
Connection closed by 20.27.177.113 port 22

> ssh-keyscan github.com
github.com: Connection closed by remote host
github.com: Connection closed by remote host
github.com: Connection closed by remote host
github.com: Connection closed by remote host
github.com: Connection closed by remote host
```

问题原因是翻墙软件只代理了常见的80和443而没有代理22端口，需要在config里修改两个地方：

1. 指定使用443端口
2. 同时将HostName指定为`ssh.github.com`

```ini
# github
Host github.com
    HostName ssh.github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/github_id_rsa
    IdentitiesOnly yes
    Port 443
```
