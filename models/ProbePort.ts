export class ProbePort {
    static readonly INVALID_TEMP = 255;

    port: number; //1-6
    name: string;
    path: string; //where to find the devices
    private temperatures: Map<string, number>;

    public temperatur(): number {
        let temp = 0.0;
        let count = 0;
        this.temperatures.forEach((value) => {
            count++;
            temp += value;
        });
        if (count > 0) {
            return Math.round((temp / count) * 100) / 100; //fixed 2
        }
        return ProbePort.INVALID_TEMP;
    }


}