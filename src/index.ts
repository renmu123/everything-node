import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Result {
  type: "dir" | "file";
  path: string;
  lastModified: string;
  size?: string;
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

export default class Everything {
  readonly options: string[] = ["-size", "-dm", "-date-format 1"];
  private searchText: string = "";
  rawData: string[] = [];

  constructor() {}
  addOptions(vaule: string) {
    this.options.push(vaule);
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
          size: (match[1] ?? "").replaceAll(",", ""),
        };

        result.push(item2);
      }
    }
    return result;
  }
  async run(): Promise<Result[]> {
    let data = await this.spawnChild([...this.options, this.searchText]);

    this.rawData = data
      .split("\r\n")
      .map(item => item.trim())
      .filter(item => item !== "");

    const result = this.parse(this.rawData);
    return result;
  }

  private async spawnChild(options?: string[]) {
    const execPath = path.join(__dirname, "bin", "es.exe");

    const child = spawn(execPath, options, {
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
      throw new Error(`${error}`);
    }
    return data;
  }
  addSearchText(text: string) {
    this.searchText = text;
    return this;
  }
  addLimit(size: Number) {
    this.options.push(`-n ${size}`);
    return this;
  }
  sortBy(values: SortValue[]) {
    values.forEach(value => {
      this.options.push(`-sort-${value}`);
    });
  }
  async esVersion() {
    let version = await this.spawnChild(["-version"]);
    return version;
  }
  async everythingVersion() {
    let version = await this.spawnChild(["-get-everything-version"]);
    return version;
  }
  async getTotal() {
    let count = await this.spawnChild([
      ...this.options,
      "-get-result-count",
      this.searchText,
    ]);
    return Number(count);
  }
}
