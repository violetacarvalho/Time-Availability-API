import { Router } from 'express';
import AvailableTimeController from '../controllers/availableTimeController';

const availableTimeRouters = Router();
const availableTimeController = new AvailableTimeController();

availableTimeRouters.get('/', availableTimeController.list);

export default availableTimeRouters;
