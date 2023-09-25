# 介绍

这个一个 everything CLI 的包装项目

es.exe version 1.1.0.26
everything version 1.4.x

# 警告

请勿添加如 `-size-format` 等格式化参数，否则会破坏格式化代码运行，那你只能自行格式化了

# 示例

## 简单搜索示例

```js
const everything = new Everything();
everything.limit(10);
everything.addSearchText("内容");
const data = await everything.run();
console.log(data);
```

## 展示最大的十个文件

```js
const everything = new Everything();
everything.limit(10);
everything.sortBy("size");
const data = await everything.run();
console.log(data);
```

# API

## addSearchText(text, options): 添加搜索参数

```ts
interface SearchOptions {
  matchCase?: boolean; // 区分大小写
  regex?: boolean; // 正则
  wholeWord?: boolean; // 全字匹配
  matchPath?: boolean; // 路径匹配
  folderOnly?: boolean; // 仅有文件夹
  fileOnly?: boolean; // 仅有文件
  diacritics?: boolean; // 匹配重音标识
}
```

## limit(num): 添加限制

## offset(num): 添加偏移

## sortBy(valus): 排序

`"name"|"path"|"size"|"extension"|"date"|"date-created"|"date-modified"|"date-accessed"|"attributes" |"date-recently-changed"|"run-count"|"date-recently-changed"|"date-run"|"ascending"|"descending";`

## getTotal(): 获取搜索的总条数

## addOptions(args): 添加原始参数

`addOptions("-whole-words")`

## promise run(): 运行搜索命令

返回值

```ts
interface Result {
  type: "dir" | "file";
  path: string;
  lastModified: string;
  size?: number;
}
[];
```

## setExecPath(path): 设置可执行文件路径，不使用默认 es.exe

## generateOptions(): 获取搜索时传递给命令行的参数

## esVersion(): 获取 es.exe 的版本

## version(): 获取 everything 版本

# Error Code

| Errorlevel | Description                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| 0          | No known error, search successful.                                                         |
| 1          | Failed to register window class.                                                           |
| 2          | Failed to create listening window.                                                         |
| 3          | Out of memory.                                                                             |
| 4          | Expected an additional command line option with the specified switch.                      |
| 5          | Failed to create export output file.                                                       |
| 6          | Unknown switch.                                                                            |
| 7          | Failed to send Everything IPC a query.                                                     |
| 8          | Everything IPC window not found. Please make sure the Everything search client is running. |
