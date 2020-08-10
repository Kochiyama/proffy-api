import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UsersController from './controllers/UsersController';
import checkJwt from './middlewares/checkJwt';

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const usersController = new UsersController();

routes.post('/register', usersController.register);
routes.post('/authenticate', usersController.authenticate);

routes.post('/classes', checkJwt, classesController.create);
routes.get('/classes', checkJwt, classesController.index);

routes.post('/connections', checkJwt, connectionsController.create);
routes.get('/connections', checkJwt, connectionsController.index);

export default routes;