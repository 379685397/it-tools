## 配置

设置全局配置：

```shell
git config --global user.name "[name]"
git config --global user.email "[email]"
```

## 开始使用

创建一个 Git 仓库：

```shell
git init
```

克隆一个已有的 Git 仓库：

```shell
git clone [url]
```

## 提交

提交所有已跟踪文件的变更：

```shell
git commit -am "[commit message]"
```

将新修改追加到上一次提交（不修改提交信息）：

```shell
git commit --amend --no-edit
```

## 我犯了个错误

修改上一次提交的提交信息：

```shell
git commit --amend
```

撤销最近一次提交并保留工作区修改：

```shell
git reset HEAD~1
```

撤销最近 `N` 次提交并保留工作区修改：

```shell
git reset HEAD~N
```

撤销最近一次提交并丢弃工作区修改：

```shell
git reset HEAD~1 --hard
```

将分支重置为远端状态：

```shell
git fetch origin
git reset --hard origin/[branch-name]
```

## 其他

将本地 master 分支重命名为 main：

```shell
git branch -m master main
```
