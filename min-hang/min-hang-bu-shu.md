# 民行部署

```javascript
一. 新服务器部署方案
二. 已部署服务器更新项目方案
```

## 一、新服务器部署方案

### 介质准备

1. docker镜像文件，下载地址：[http://172.16.121.82:9090/docker-ce/docker\_offline\_x86.zip](http://172.16.121.82:9090/docker-ce/docker_offline_x86.zip)
2. nginx镜像文件，下载地址：[http://xxxxxx](http://xxxxxx)
3. redis镜像文件，下载地址：[http://xxxxxx](http://xxxxxx)
4. 达梦数据库文件，下载地址：[http://xxxxxx](http://xxxxxx)
5. zip.rpm文件，下载地址：[http://xxxxxx](http://xxxxxx)

```javascript
// 新建文件夹并进入此文件夹内
mkdir -p /u02/soft/ && cd /u02/soft/
// 安装zip
rpm -ivh zip.rpm
```

> 将docker、nginx、redis、zip.rpm文件通过sftp上传至 /u02/soft/ 目录下

### docker部署

> Docker 默认把镜像和容器数据存放在 /var/lib/docker 目录下，在安装前，应该保证根目录有足够多的空间（100G以上），如果根目录没有足够多的硬盘空间，可以在docker安装好后，使用以下方把数据迁移到其他硬盘上去。

```javascript
// 上传安装包至服务器 root目录，解压至当前目录

// 进入安装目录
cd /u02/soft/docker/

// 设置可执行权限
chmod +x install-docker.sh

// 执行安装
./install-docker.sh

// 如果没有错误信息，则表示docker已经成功安装。
// 查看容器列表
docker ps
```

## 注意:

> 假设此时有一块 500G 的硬盘，并且把硬盘挂载至 /home/docker 目录 （有现成挂载好的硬盘空间同理）

```javascript
// 停止 docker 服务
systemctl stop docker

// 做个备份
tar -czvf /home/var_lib_docker-backup.tar.gz /var/lib/docker

// 迁移 /var/lib/docker目录到 home 目录下
mv /var/lib/docker /home/docker

// 建个 symlink
ln -s /home/docker /var/lib/docker

// 确认文件夹类型为 symlink 类型 
ls /var/lib/docker

// 启动 docker
systemctl restart docker

// 确认docker是否启动
docker ps
```

### nginx部署

```javascript
// 进入nginx文件夹，解压inline.zip
cd /u02/soft/nginx/ && unzip inline.zip
// 加载nginx镜像
docker load -i nginx.tar
//修改application.yml文件（数据库地址、redis地址），定位到db和redis的地方并修改ip即可
vim application.yml
// 加载镜像中的nginx  (最后命令有个点)
docker build -f dockerfile -t spp-nginx:1.0 . 
//查看服务器磁盘空间，将run-nginx.sh 路径更改
df -h
//创建文件夹
mkdir -p /root/project/ && touch /root/project/error.log
mkdir -p /root/project/caseFiles/
// 执行nginx脚本
./run-nginx.sh
//验证是否启动成功
docker ps
```

### redis部署

> 原则上将redis上传至/u02/soft/redis/ 目录下，先赋权、docker load，然后执行.sh文件即可

```javascript
//进入redis目录并赋权
cd /u02/soft/redis/ && chmod 775 redis-server.tar redis-server.sh
// 加载镜像
docker load -i redis-server.tar
//查看redis端口是否被占用（没有数据则表示没有占用，可用）,如果端口占用则需要更改redis-server.sh文件，将端口更改
netstat -nltp | grep 6379
//执行脚本启动redis
./redis-server.sh

//查看redis是否启动成功
docker ps
```

### 民行项目部署

```javascript
// 查看docker容器id
docker ps
// 进入容器启动后台项目
docker exec -it spp-nginx /bin/bash
// 进入后台文件位置
cd /user/project/spp-net-consult-intranet/
// 执行启动
nohup java -jar spp-net-consult-intranet-1.0.0.jar > temp-inline.log &
//查看启动日志
tail -200f temp-inline.log
//退出容器
exit
```

### 达梦数据库部署

## 二、已部署服务器更新项目方案

> 原则上讲jar文件和inline.zip文件上传至/u02/soft/nginx/目录下

#### 后端项目部署

```javascript
//查看容器id
docker ps
// 将宿主机上的jar文件拷贝至容器
docker cp spp-net-consult-intranet-1.0.0.jar id(此id是容器id):/user/project/spp-net-consult-intranet/spp-net-consult-intranet-1.0.0.jar
// 进入容器并启动程序
docker exec -it spp-nginx /bin/bash
cd /user/project/spp-net-consult-intranet/     
nohup java -jar spp-net-consult-intranet-1.0.0.jar > temp-inline.log &
tail -200f temp-inline.log
exit
```

#### 前端项目部署

```javascript
//解压inline.zip文件
unzip inline.zip
//将宿主机上inline文件夹拷贝至容器
docker cp inline id:/user/project/spp-net-consult-intranet/inline
```

