import { Router } from 'express';
import { loginController, registerController } from '~/controllers/users.controllers';
import { loginMiddleware } from '~/middlewares/users.middlewares';
const userRouter = Router();

userRouter.post('/login', loginMiddleware, loginController);
userRouter.post('/register', registerController);

export default userRouter;
