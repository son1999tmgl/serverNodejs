import { NextFunction, Request, Response, Router } from 'express';
import { loginController, logoutController, registerController } from '~/controllers/users.controllers';
import { loginMiddleware, logoutMiddleware, registerMiddleware } from '~/middlewares/users.middlewares';
import { wrap } from '~/utils/handler';
const userRouter = Router();

userRouter.post('/login', loginMiddleware, wrap(loginController));
userRouter.post('/register', registerMiddleware, wrap(registerController));
userRouter.post('/logout', logoutMiddleware, wrap(logoutController));

export default userRouter;
