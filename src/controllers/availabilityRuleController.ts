import { Request, Response } from 'express';
import AvailabilityRuleServices from '../services/availabilityRuleServices';
import availabilityRule from '../schemas/availabilityRuleSchema';

export default class AvailabilityRuleController {
    public create = async (
        request: Request,
        response: Response,
    ): Promise<Response> => {
        try {
            let { body } = request;
            const validatedBody = availabilityRule.validate(body);
            if (validatedBody.error) return response.status(400).json(
                validatedBody.error.details[0].message
            );
            const availabilityRuleServices = new AvailabilityRuleServices();
            const rule = await availabilityRuleServices.create(validatedBody.value);
            if (rule?.statusCode) {
                return response.status(rule.statusCode).json({ message: rule.message })
            }
            return response.status(201).json(rule);
        } catch (e) {
            if (e instanceof Error) {
              return response.status(e.statusCode | 500).json({ message: e.message });
            }
            return response.status(e.statusCode | 500).json({ message: 'Unknown Error.' });
        }
    };

    public list = (
        request: Request,
        response: Response,
    ): Response => {
        try {
            const availabilityRuleServices = new AvailabilityRuleServices();
            const availabilityRule = availabilityRuleServices.list();
            return response.status(200).json(availabilityRule);
        } catch (e) {
            if (e instanceof Error) {
              return response.status(e.statusCode | 500).json({ message: e.message });
            }
            return response.status(e.statusCode | 500).json({ message: 'Unknown Error.' });
        }
    };

    public delete = (
        request: Request,
        response: Response,
    ): Response => {
        try {
            const { uuid } = request.params;
            const availabilityRuleServices = new AvailabilityRuleServices();
            const rule = availabilityRuleServices.delete(uuid);
            if (rule && rule?.statusCode) {
                return response.status(rule.statusCode).json({ message: rule.message })
            }
            return response.status(204).json();
        } catch (e) {
            if (e instanceof Error) {
              return response.status(e.statusCode | 500).json({ message: e.message });
            }
            return response.status(e.statusCode | 500).json({ message: 'Unknown Error.' });
        }
    };
}
