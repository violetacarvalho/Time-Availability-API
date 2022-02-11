import { Request, Response } from 'express';
import AvailableTimeServices from '../services/availableTimeServices';

export default class AvailableTimeController {
    public list = (
        request: Request,
        response: Response,
    ): Response => {
        try {
            const availableTimeServices = new AvailableTimeServices();
            const availableTime = availableTimeServices.list();
            return response.status(200).json(availableTime);
        } catch (e) {
            if (e instanceof Error) {
              return response.status(e.statusCode | 500).json({ message: e.message });
            }
            return response.status(e.statusCode | 500).json({ message: 'Unknown Error.' });
        }
    };
}
