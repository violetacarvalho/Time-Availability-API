import * as fs from 'fs';
import { IAvailabilityRule } from "../interfaces/availabilityRule";

class AvailableTimeRepository {
    fileName = "src/data/availabilityRules.json";
    availableTimeMock: IAvailabilityRule[] = JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
    
    public write(availabilityRules: IAvailabilityRule[]): IAvailabilityRule[] {
        // this.availableTimeMock.push(availableTimeRule);
        fs.writeFileSync(
            this.fileName,
            JSON.stringify(availabilityRules, null, 4),
            { encoding: 'utf-8', flag: 'w'},
        );
        return availabilityRules;
    };

    public read(): IAvailabilityRule[] { return this.availableTimeMock };

    public delete(availabilityRule: IAvailabilityRule): void {
        const availabilityRules = this.availableTimeMock.filter(rule => rule !== availabilityRule);
        fs.writeFileSync(
            this.fileName,
            JSON.stringify(availabilityRules, null, 4),
            { encoding: 'utf-8', flag: 'w'},
        );
    }
}

export default AvailableTimeRepository;