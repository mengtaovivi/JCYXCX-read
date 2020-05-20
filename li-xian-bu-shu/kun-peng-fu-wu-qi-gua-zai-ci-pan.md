# 鲲鹏服务器挂载磁盘

> 退回根目录

```javascript
cd /
```

> 在根目录创建dmdata文件夹（高检要求）

```javascript
mkdir dmdata
```

> 查看磁盘信息

```javascript
fdisk -l | grep 'Disk/dev/'
```

> 查看磁盘挂载情况

```javascript
df -h | grep ‘/dev’
```

> 磁盘分区

```javascript
//对应未挂载磁盘路径
fdisk /dev/vdb
```

> 格式化分区为ext4

```javascript
mkfs -t ext4 /dev/vdb
//按照提示输入：w (操作生效）即可
```

> 将磁盘挂载到目录

```javascript
mount /dev/vdb/dmdata
```

> 查看是否挂载成功

```javascript
df -h
```

> 查看磁盘分区UUID

```javascript
blkid /dev/vdb1
///dev/vdb1: UUID="0b3040e2-1367-4abb-841d-ddb0b92693df" TYPE="ext4"
```

> 查看磁盘分区UUID

```javascript
blkid /dev/vdb1
///dev/vdb1: UUID="0b3040e2-1367-4abb-841d-ddb0b92693df" TYPE="ext4"
```

> 解决重启失效问题

```javascript
//编辑
vim /etc/fstab
//加一行：
UUID=0b3040e2-1367-4abb-841d-ddb0b92693df   /data               ext4    defaults        0 2
```

