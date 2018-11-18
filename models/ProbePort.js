"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions_1 = require("../functions");
var fs = require("fs");
var ProbePort = /** @class */ (function () {
    function ProbePort() {
        this.self = ProbePort;
    }
    ProbePort.prototype.temperatur = function () {
        var _this = this;
        var me = this;
        return new Promise(function (resolve, reject) {
            me.checkProbes().catch(reject).then(function (temperatures) {
                if (temperatures && temperatures.length) {
                    var temp = 0.0;
                    var count = 0;
                    for (var _i = 0, temperatures_1 = temperatures; _i < temperatures_1.length; _i++) {
                        var value = temperatures_1[_i];
                        if (value != _this.self.INVALID_TEMP) {
                            count++;
                            temp += value;
                        }
                    }
                    if (count > 0) {
                        resolve(Math.round((temp / count) * 100) / 100);
                    }
                    else {
                        reject();
                    }
                }
                else {
                    reject();
                }
            });
        });
    };
    ProbePort.prototype.checkProbes = function () {
        var _this = this;
        var promises = [];
        functions_1.ls(this.path, this.self.PROBE_MATCH, false).forEach(function (probeName) {
            var dataFile = functions_1.normDir(functions_1.normDir(_this.path) + probeName) + _this.self.PROBE_DATAFILE;
            if (fs.existsSync(dataFile)) {
                //this is a valid probe
                promises.push(_this.self.parseTemp(dataFile));
            }
        });
        return Promise.all(promises);
    };
    ProbePort.parseTemp = function (file) {
        return new Promise(function (resolve, reject) {
            fs.readFile(file, function (err, dataB) {
                if (err)
                    throw err;
                var data = dataB + "";
                if (data.indexOf("t=") > -1) {
                    var temp = parseInt(data.split("t=")[1]) / 1000;
                    resolve(temp);
                }
                else {
                    reject();
                }
            });
        });
    };
    ProbePort.checkPorts = function (path) {
        var _this = this;
        if (path.substr(0, 1) != "/") {
            throw new Error('path has to be absolute');
        }
        path = functions_1.normDir(functions_1.normDir);
        if (!functions_1.isDir(path)) {
            throw new Error("path must be a valid directory");
        }
        //clear port list
        var validPorts = [];
        functions_1.ls(path, this.PORT_MATCH, false).forEach(function (value) {
            var port;
            var PortNum = parseInt(value.replace(_this.PORT_TRIM, ""), 10);
            for (var _i = 0, _a = _this.ports; _i < _a.length; _i++) {
                var pCheck = _a[_i];
                if (pCheck.port == PortNum) {
                    port = pCheck;
                    break;
                }
            }
            if (!port) {
                port = new ProbePort();
                port.port = PortNum;
            }
            port.path = functions_1.normDir(path + value);
            port.name = value;
            validPorts.push(port);
        });
        return this.ports = validPorts;
    };
    ProbePort.INVALID_TEMP = 255;
    ProbePort.PORT_MATCH = /^w1_bus_master[0-9][0-9]*$/gi;
    ProbePort.PORT_TRIM = /^w1_bus_master/gi;
    ProbePort.PROBE_MATCH = /^28-/gi;
    ProbePort.PROBE_DATAFILE = "w1_slave";
    ProbePort.ports = [];
    return ProbePort;
}());
exports.ProbePort = ProbePort;
//# sourceMappingURL=ProbePort.js.map