import { Router } from 'express';
import AvailabilityRuleController from '../controllers/availabilityRuleController';

const availabilityRuleRouter = Router();
const availabilityRuleController = new AvailabilityRuleController();

availabilityRuleRouter.post('/', availabilityRuleController.create);
availabilityRuleRouter.get('/', availabilityRuleController.list);
availabilityRuleRouter.delete('/:uuid', availabilityRuleController.delete);

export default availabilityRuleRouter;
