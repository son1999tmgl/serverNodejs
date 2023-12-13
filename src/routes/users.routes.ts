import { Router } from 'express';
import { loginController } from '~/controllers/users.controllers';
import { loginMiddleware } from '~/middlewares/users.middlewares';
const userRouter = Router();

userRouter.post('/login', loginMiddleware, loginController);

export default userRouter;
