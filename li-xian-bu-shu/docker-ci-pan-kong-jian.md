# docker磁盘空间

> Docker 默认把镜像和容器数据存放在 /var/lib/docker 目录下，在安装前，应该保证根目录有足够多的空间（100G以上），如果根目录没有足够多的硬盘空间，可以在docker安装好后，使用以下方把数据迁移到其他硬盘上去。

## 假设此时有一块 500G 的硬盘，并且把硬盘挂载至 /mnt/docker 目录 （有现成挂载好的硬盘空间同理）

### 停止 docker 服务

systemctl stop docker

### 做个备份

tar -czf &gt; /home/var\_lib\_docker-backup-$\(date + %s\).tar.gz /var/lib/docker

### 迁移 /var/lib/docker目录到 mnt 目录下

mv /var/lib/docker /mnt/docker

### 建个 symlink

ln -s /home/docker /var/lib/docker

### 确认文件夹类型为 symlink 类型

ls /var/lib/docker

### 启动 docker

systemctl restart docker

