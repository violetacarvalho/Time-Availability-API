import { IAvailabilityRule, IAvailabilityRuleDTO } from "../interfaces/availabilityRule";
import AvailableTimeRepository from "../repositories/availableTime";
import { v4 as uuidv4 } from 'uuid';
import { IErrorMessage } from "../interfaces/errorMessage";
import frequency from "../constants/frequency";
import AvailableTimeServices from "./availableTimeServices";
import { isEqual } from "lodash";
import moment from "moment";

class AvailabilityRulesServices {
    public async create(body: IAvailabilityRuleDTO): Promise<IAvailabilityRule | IErrorMessage> {
        const availableTimeRepository = new AvailableTimeRepository();
        const availabilityRules = availableTimeRepository.read();

        if (body.frequency === frequency.WEEKLY && !body.weekdays) return { 
            statusCode: 400, 
            message: "If frequency is weekly, body must contain the field \"weekdays\"",
        };

        if (body.frequency !== frequency.WEEKLY && body.weekdays) return { 
            statusCode: 400, 
            message: "If frequency is not weekly, body must not contain the field \"weekdays\"",
        };

        if (body.frequency === frequency.ONCE && !body.day) return {
            statusCode: 400,
            message: "If frequency is once, body must contain the field \"day\"",
        };

        if (body.frequency !== frequency.ONCE && body.day) return {
            statusCode: 400,
            message: "If frequency is not once, body must not contain the field \"day\"",
        };

        const matchAvailabilityRules = availabilityRules.filter((rule: IAvailabilityRuleDTO) => {
            delete rule.uuid;
            return isEqual(rule, body);
        });
        
        if (matchAvailabilityRules.length > 0) return {
            statusCode: 400,
            message: "This rule already exists",
        };

        for (const interval of body.intervals) {
            const startMoment = moment(interval.start,'hh:mm');
            const endMoment = moment(interval.end,'hh:mm');
            if (startMoment > endMoment) return {
                statusCode: 400,
                message: "The end of interval cannot be before its start",
            };

        }

        const availableTimeService = new AvailableTimeServices();
        const availableTimes = availableTimeService.getAvailableTimeByRule(availabilityRules);
        
        body.uuid = uuidv4();
        const newTimes = availableTimeService.getAvailableTimeByRule([body as IAvailabilityRule]);

        for (const newTime of newTimes) {
            for (const availableTime of availableTimes) {
                if (availableTime.day === newTime.day) {
                    for (const newInterval of newTime.intervals) {
                        for (const existingInterval of availableTime.intervals) {
                            const newStart = new Date('2000-01-01T00:00:00.000');
                            const newEnd = new Date('2000-01-01T00:00:00.000');
                            const existingStart = new Date('2000-01-01T00:00:00.000');
                            const existingEnd = new Date('2000-01-01T00:00:00.000');
                            
                            newStart.setHours(Number(newInterval.start.split(":")[0]));
                            newStart.setMinutes(Number(newInterval.start.split(":")[1]));

                            newEnd.setHours(Number(newInterval.end.split(":")[0]));
                            newEnd.setMinutes(Number(newInterval.end.split(":")[1]));

                            existingStart.setHours(Number(existingInterval.start.split(":")[0]));
                            existingStart.setMinutes(Number(existingInterval.start.split(":")[1]));

                            existingEnd.setHours(Number(existingInterval.end.split(":")[0]));
                            existingEnd.setMinutes(Number(existingInterval.end.split(":")[1]));

                            if ((newStart >= existingStart && newStart <= existingEnd)
                              || (newEnd >= existingStart && newEnd <= existingEnd)) return {
                                statusCode: 400,
                                message: "New rule cannot overlap another one",
                            }
                        }
                    }
                }
            }
        }
        
        availabilityRules.push(body as IAvailabilityRule);
        availableTimeRepository.write(availabilityRules);
        return body as IAvailabilityRule;
    }

    public list(): IAvailabilityRule[] {
        const availableTimeRepository = new AvailableTimeRepository();
        const availabilityRules = availableTimeRepository.read();
        return availabilityRules;
    }

    public delete(uuid: string): void | IErrorMessage {
        const availableTimeRepository = new AvailableTimeRepository();
        const availabilityRules = availableTimeRepository.read();

        const matchAvailabilityRules = availabilityRules.filter(
            (rule: IAvailabilityRule) => rule.uuid === uuid
        );

        if (matchAvailabilityRules.length === 0) return { 
            statusCode: 404,
            message: "Available time rule not found."
        };

        availableTimeRepository.delete(matchAvailabilityRules[0]);
        return;
    }
}

export default AvailabilityRulesServices;