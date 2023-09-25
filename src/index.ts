import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Result {
  type: "dir" | "file";
  path: string;
  lastModified: string;
  size?: number;
}

type SortValue =
  | "name"
  | "path"
  | "size"
  | "extension"
  | "date"
  | "date-created"
  | "date-modified"
  | "date-accessed"
  | "attributes"
  | "file-list-file-name"
  | "run-count"
  | "date-recently-changed"
  | "date-run"
  | "ascending"
  | "descending";

interface SearchOptions {
  matchCase?: boolean;
  regex?: boolean;
  wholeWord?: boolean;
  matchPath?: boolean;
  folderOnly?: boolean;
  fileOnly?: boolean;
  diacritics?: boolean;
}

export default class Everything {
  readonly rawOptions: string[] = [
    "-size",
    "-dm",
    "-date-format 1",
    "-no-digit-grouping",
  ];
  readonly options: {
    limit?: number;
    offset?: number;
    sortBy?: SortValue[];
    searchText?: string;
    searchOptions?: SearchOptions;
  } = {
    searchText: "",
    sortBy: [],
  };
  rawData: string[] = [];
  execPath: string = path.join(__dirname, "bin", "es.exe");

  constructor() {}
  addOptions(value: string) {
    // if (value.startsWith("-sort")) {
    //   console.warn("If you want to sort, use the sortBy method.");
    // } else if (value.startsWith("-n") || value.startsWith("-max-result")) {
    //   console.warn("If you want to add limit, use the limit method.");
    // } else if (value.startsWith("-o") || value.startsWith("-offset")) {
    //   console.warn("If you want to add offset, use the offset method.");
    // } else if (value.startsWith("-r")) {
    //   console.warn(
    //     "If you want to add search text, use the addSearchText method."
    //   );
    // } else if (value.startsWith("-regex")) {
    //   console.warn(
    //     "If you want to add search text, use the addSearchText method."
    //   );
    // }
    this.rawOptions.push(value);
  }

  parse(items: string[]): Result[] {
    const result = [];
    for (const item of items) {
      if (item.startsWith("<DIR>")) {
        const regexPattern = /^<DIR>\s+(\S+)\s+(.+)$/;
        const match = item.match(regexPattern);

        const item2: Result = {
          type: "dir",
          path: match[2] ?? "",
          lastModified: match[1] ?? "",
        };
        result.push(item2);
      } else {
        const regexPattern = /^(\S+)\s+(\S+)\s+(.+)$/;
        const match = item.match(regexPattern);

        const item2: Result = {
          type: "file",
          path: match[3] ?? "",
          lastModified: match[2] ?? "",
          size: Number(match[1]) ?? 0,
        };

        result.push(item2);
      }
    }
    return result;
  }
  async run(): Promise<Result[]> {
    const options = this.generateOptions();
    let data = await this.spawnChild(options);

    this.rawData = data
      .split("\r\n")
      .map(item => item.trim())
      .filter(item => item !== "");

    const result = this.parse(this.rawData);
    return result;
  }

  private async spawnChild(options?: string[]) {
    return new Promise<string>(async (resolve, reject) => {
      const child = spawn(this.execPath, options, {
        shell: true,
      });

      let data = "";
      for await (const chunk of child.stdout) {
        data += chunk;
      }
      let error = "";
      for await (const chunk of child.stderr) {
        error += chunk;
      }
      const exitCode = await new Promise((resolve, reject) => {
        child.on("close", resolve);
      });

      if (exitCode) {
        reject(`${error}`);
      }
      resolve(data);
    });
  }
  addSearchText(text: string, options: SearchOptions = {}) {
    const searchOptions = {
      matchCase: false,
      regex: false,
      wholeWord: false,
      matchPath: false,
      folderOnly: false,
      fileOnly: false,
      diacritics: false,
      ...options,
    };
    this.options.searchOptions = searchOptions;
    this.options.searchText = text;
    return this;
  }
  limit(size: number) {
    this.options.limit = size;
    return this;
  }
  offset(size: number) {
    this.options.offset = size;
    return this;
  }
  sortBy(values: SortValue[]) {
    this.options.sortBy = values;
  }
  async esVersion() {
    let version = await this.spawnChild(["-version"]);
    return version;
  }
  async version() {
    let version = await this.spawnChild(["-get-everything-version"]);
    return version;
  }
  async getTotal() {
    const options = this.generateOptions();
    let count = await this.spawnChild([...options, "-get-result-count"]);
    return Number(count);
  }
  generateOptions() {
    const options = [];
    if (this.options.limit) {
      options.push(`-n ${this.options.limit}`);
    }
    if (this.options.offset) {
      options.push(`-offset ${this.options.offset}`);
    }
    if (this.options.sortBy) {
      this.options.sortBy.forEach(value => {
        options.push(`-sort-${value}`);
      });
    }

    if (this.options.searchText) {
      if (this.options.searchOptions?.folderOnly) {
        options.push("-ad");
      }
      if (this.options.searchOptions?.fileOnly) {
        options.push("-a-d");
      }
      if (this.options.searchOptions?.diacritics) {
        options.push("-diacritics");
      }
      if (this.options.searchOptions?.matchCase) {
        options.push("-case");
      }
      if (this.options.searchOptions?.wholeWord) {
        options.push("-whole-word");
      }
      if (this.options.searchOptions?.matchPath) {
        options.push("-match-path");
      }

      if (this.options.searchOptions?.regex) {
        options.push(`-regex "${escaped(this.options.searchText)}"`);
      } else {
        options.push(`-r ${escaped(this.options.searchText)}`);
      }
    }
    return [...this.rawOptions, ...options];
  }
  setExecPath(path: string) {
    this.execPath = path;
    return this;
  }
}

// Use ^ to escape \, &, |, >, < and ^.
export const escaped = (s: string) => {
  return s.replaceAll(/([\\&|><^])/g, "^$1");
};
