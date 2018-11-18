import * as fs from "fs";

export function normDir(source) {
    return source.substr(-1, 1) == "/" ? source : source + "/";
}

export function isDir(source) {
    return fs.existsSync(source) && fs.lstatSync(source).isDirectory();
}

export function ls(source: string, expr: RegExp, includeFiles = true, includeFolder = true): string[] {
    let ret: string[] = [];
    if (isDir(source)) {
        source = normDir(source);
        fs.readdirSync(source).forEach(file => {
            if (expr === null || file.search(expr) > -1) {
                if (isDir(source + file)) {
                    if (includeFolder) {
                        ret.push(file);
                    }
                } else if (includeFiles) {
                    ret.push(file);
                }
            }
        });
    }
    return ret;
};
