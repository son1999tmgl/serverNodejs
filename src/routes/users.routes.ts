import { Router } from 'express';
import { loginController, registerController } from '~/controllers/users.controllers';
import { loginMiddleware, registerMiddleware } from '~/middlewares/users.middlewares';
import { wrap } from '~/utils/handler';
const userRouter = Router();

userRouter.post('/login', loginMiddleware, wrap(loginController));
userRouter.post('/register', registerMiddleware, wrap(registerController));

export default userRouter;
