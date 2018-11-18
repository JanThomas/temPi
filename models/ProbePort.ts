import {isDir, ls, normDir} from "../functions";
import * as fs from "fs";

export class ProbePort {
    static readonly INVALID_TEMP = 255;
    static readonly PORT_MATCH = /^w1_bus_master[0-9][0-9]*$/gi;
    static readonly PORT_TRIM = /^w1_bus_master/gi;
    static readonly PROBE_MATCH = /^28-/gi;
    static readonly PROBE_DATAFILE = "w1_slave";

    static ports: ProbePort[] = [];

    public readonly self = ProbePort;

    port: number; //1-6
    name: string;
    path: string; //where to find the devices

    public temperatur(): Promise<number> {
        const me = this;
        return new Promise<number>((resolve, reject) => {
            me.checkProbes().catch(reject).then(temperatures => {
                if (temperatures && temperatures.length) {
                    let temp = 0.0;
                    let count = 0;
                    for (const value of temperatures) {
                        if (value != this.self.INVALID_TEMP) {
                            count++;
                            temp += value;
                        }
                    }
                    if (count > 0) {
                        resolve(Math.round((temp / count) * 100) / 100);
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            })
        });
    }

    public checkProbes(): Promise<number[]> {
        const promises: Promise<number>[] = [];

        ls(this.path, this.self.PROBE_MATCH, false).forEach(probeName => {
            const dataFile = normDir(normDir(this.path) + probeName) + this.self.PROBE_DATAFILE;
            if (fs.existsSync(dataFile)) {
                //this is a valid probe
                promises.push(this.self.parseTemp(dataFile));
            }
        });

        return Promise.all(promises);
    }

    private static parseTemp(file): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            fs.readFile(file, (err, dataB) => {
                if (err) throw err;
                const data = dataB + "";
                if (data.indexOf("t=") > -1) {
                    const temp = parseInt(data.split("t=")[1]) / 1000;
                    resolve(temp);
                } else {
                    reject();
                }
            });
        });
    }


    static checkPorts(path: string): ProbePort[] {

        if (path.substr(0, 1) != "/") {
            throw new Error('path has to be absolute');
        }

        path = normDir(path);

        if (!isDir(path)) {
            throw new Error("path must be a valid directory");
        }

        //clear port list
        const validPorts: ProbePort[] = [];


        ls(path, this.PORT_MATCH, false).forEach(value => {
            let port: ProbePort;
            let PortNum = parseInt(value.replace(this.PORT_TRIM, ""), 10);
            for (const pCheck of this.ports) {
                if (pCheck.port == PortNum) {
                    port = pCheck;
                    break;
                }
            }
            if (!port) {
                port = new ProbePort();
                port.port = PortNum;
            }
            port.path = normDir(path + value);
            port.name = value;

            validPorts.push(port);
        });

        return this.ports = validPorts;

    }

}