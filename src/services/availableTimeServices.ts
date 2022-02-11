import frequency from "../constants/frequency";
import weekdaysOrder from "../constants/weekdaysOrder";
import { IAvailableTime } from "../interfaces/availableTime";
import { IAvailabilityRule } from "../interfaces/availabilityRule";
import AvailableTimeRepository from "../repositories/availableTime";
import { format } from "date-and-time";

class AvailableTimeServices {
    public  list(): IAvailableTime[] {
        const availableTimeRepository = new AvailableTimeRepository();
        const availabilityRules = availableTimeRepository.read();

        const availableTimes = this.getAvailableTimeByRule(availabilityRules);
        return availableTimes;
    }

    public getAvailableTimeByRule(
        availabilityRules: IAvailabilityRule[],
    ): IAvailableTime[] {
        const availableTimes: IAvailableTime[] = [];
        availabilityRules.map((rule: IAvailabilityRule) => {
            if (rule.frequency === frequency.WEEKLY && rule.weekdays) {
                for (const weekDay of rule.weekdays) {
                    let index;
                    const day = this.getDayByWeekDay(weekDay);
                    const newTime = { day, intervals: rule.intervals };
                    availableTimes.map((time, i) => {
                        if (time.day === day) {
                            index = i;
                        }
                    });
                    if (!index && index !== 0) availableTimes.push(newTime);
                    else {
                        for (const interval of newTime.intervals) {
                            availableTimes[index].intervals.push(interval);
                        }
                    }
                }
            } else if (rule.frequency === frequency.DAILY) {
                const calculatedAvailableTimes = this.getTimeByDailyRule(rule);
                for (const availableTime of calculatedAvailableTimes) {
                    let index;
                    availableTimes.map((time, i) => {
                        if (time.day === availableTime.day) {
                            index = i;
                        }
                    });
                    if (!index && index !== 0) {
                        availableTimes.push(availableTime);
                    }
                    else {
                        for (const interval of availableTime.intervals) {
                            if (!availableTimes[index].intervals.includes(interval))
                                availableTimes[index].intervals.push(interval);
                        }
                    }
                }
            } else if (rule.frequency === frequency.ONCE && rule.day) {
                let index;
                availableTimes.map((time, i) => {
                    if (time.day === rule.day) {
                        index = i;
                    }
                });
                if (!index && index !== 0) availableTimes.push({
                    day: rule.day,
                    intervals: rule.intervals,
                });
                else {
                    for (const interval of rule.intervals) {
                        availableTimes[index].intervals.push(interval);
                    }
                }
            }
        });

        return availableTimes;
    }

    public getTimeByDailyRule(rule: IAvailabilityRule): IAvailableTime[] {
        const today = this.getNewDate();
        const availableTimes: IAvailableTime[] = [];
        
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + i
            );
            const formattedCurrentDay = format(currentDay, "YYYY-MM-DD");
            availableTimes.push({
                day: formattedCurrentDay,
                intervals: rule.intervals,
            })
        }

        return availableTimes;
    }

    public getDayByWeekDay(weekday: string): string {
        const today = this.getNewDate();
        const todayWeekDayIndex = today.getDay();
        const weekdayIndex = weekdaysOrder.indexOf(weekday);
        let indexDifference = weekdayIndex - todayWeekDayIndex;
        
        if (indexDifference === 0) return format(today, "YYYY-MM-DD");
        if (indexDifference < 0) indexDifference += 7;

        const weekdayDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + indexDifference
        );

        return format(weekdayDate, "YYYY-MM-DD");
    }

    public getNewDate(): Date {
        return new Date();
    }
}

export default AvailableTimeServices;