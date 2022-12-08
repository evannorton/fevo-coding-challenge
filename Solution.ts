import { PathLike } from "fs";
import { FileHandle, readFile } from "fs/promises";
import { AccountMerger } from "./AccountMerger";

class Solution {
    public async solve(jsonFileName: PathLike | FileHandle) {
        const accounts = await this.readJsonFile(jsonFileName);
        return new AccountMerger().merge(accounts);
    }

    private async readJsonFile(path: PathLike | FileHandle) {
        const file = await readFile(path, "utf-8");
        return JSON.parse(file);
    }
}

const solution = new Solution();
solution.solve(process.argv.slice(2)[0]).then(console.log).catch(e => console.log(e.message));
