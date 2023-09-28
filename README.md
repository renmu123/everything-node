# introduction

This is a Everything CLI wrapper.

es.exe version 1.1.0.26
everything version >1.4

# warning

Dont add format options like `-size-format` , it will disturb formatting, if you must add it you may format by yourself.

# example

## serach exmaple

```js
const everything = new Everything();
everything.limit(10);
everything.addSearchText("内容");
const data = await everything.run();
console.log(data);
```

## show largest 10 file

```js
const everything = new Everything();
everything.limit(10);
everything.sortBy("size");
const data = await everything.run();
console.log(data);
```

# API

## addSearchText(text, options): add serach text

```ts
interface SearchOptions {
  matchCase?: boolean;
  regex?: boolean;
  wholeWord?: boolean;
  matchPath?: boolean;
  folderOnly?: boolean;
  fileOnly?: boolean;
  diacritics?: boolean;
}
```

## limit(num): add limit

## offset(num): add offset

## sortBy(valus): sort values

`"name"|"path"|"size"|"extension"|"date"|"date-created"|"date-modified"|"date-accessed"|"attributes" |"date-recently-changed"|"run-count"|"date-recently-changed"|"date-run"|"ascending"|"descending";`

## getTotal(): get total

## addOptions(args): add origin options

`addOptions("-whole-words")`

## promise run(): run command

return

```ts
interface Result {
  type: "dir" | "file";
  path: string;
  lastModified: string;
  size?: number;
}
[];
```

## setExecPath(path): set es.cli path.

## generateOptions(): get origin options for cli

## esVersion(): get es.exe version

## version(): get everything version

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
