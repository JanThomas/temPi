"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function normDir(source) {
    return source.toString().substr(-1, 1) == "/" ? source : source + "/";
}
exports.normDir = normDir;
function isDir(source) {
    return fs.existsSync(source) && fs.lstatSync(source).isDirectory();
}
exports.isDir = isDir;
function ls(source, expr, includeFiles, includeFolder) {
    if (includeFiles === void 0) { includeFiles = true; }
    if (includeFolder === void 0) { includeFolder = true; }
    var ret = [];
    if (isDir(source)) {
        source = normDir(source);
        fs.readdirSync(source).forEach(function (file) {
            if (expr === null || file.search(expr) > -1) {
                if (isDir(source + file)) {
                    if (includeFolder) {
                        ret.push(file);
                    }
                }
                else if (includeFiles) {
                    ret.push(file);
                }
            }
        });
    }
    return ret;
}
exports.ls = ls;
;
//# sourceMappingURL=functions.js.map