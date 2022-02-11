import { Router } from 'express';
import availableTimeRouters from './availableTime';
import availabilityRuleRouters from './availabilityRule';

const routes = Router();

routes.use('/availabilityRule', availabilityRuleRouters);
routes.use('/availableTime/', availableTimeRouters);

export default routes;