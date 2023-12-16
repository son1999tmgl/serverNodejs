import { Router } from 'express';
import { loginController, registerController } from '~/controllers/users.controllers';
import { loginMiddleware, registerMiddleware } from '~/middlewares/users.middlewares';
const userRouter = Router();

userRouter.post('/login', loginMiddleware, loginController);
userRouter.post('/register', registerMiddleware, registerController);

export default userRouter;
