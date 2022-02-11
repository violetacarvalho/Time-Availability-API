import * as Joi from 'joi';
import frequency from '../constants/frequency';
import weekdays from '../constants/weekdays';

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const availabilityRuleSchema = Joi.object().keys({
    frequency: Joi.string().valid(
        frequency.DAILY,
        frequency.WEEKLY,
        frequency.ONCE,
    ).trim().required(),
    day: Joi.string().regex(dateRegex),
    weekdays: Joi.array().items(
        Joi.string().valid(
            weekdays.SUNDAY,
            weekdays.MONDAY,
            weekdays.TUESDAY,
            weekdays.WEDNESDAY,
            weekdays.THURSDAY,
            weekdays.FRIDAY,
            weekdays.SATURDAY,
        )
    ).unique(),
    intervals: Joi.array().items(
        Joi.object().keys({
            start: Joi.string().regex(timeRegex).required(),
            end: Joi.string().regex(timeRegex).required(),
        }),
    ).required().unique(
        (a, b) => a.start === b.start && a.end === b.end
    ),
});

export default availabilityRuleSchema;