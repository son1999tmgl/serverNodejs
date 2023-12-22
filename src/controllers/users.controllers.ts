import { NextFunction, Request, Response } from 'express';
import userService from '~/services/users.services';
import { ParamsDictionary } from "express-serve-static-core";
import { RegisterRequestBody } from '~/models/request/User.request';
import { EntityError } from '~/utils/errors';
import { httpStatusCode } from '~/constants/httpStatus';
import { User } from '~/models/schemas/User.schema';
require('dotenv').config();

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    const { user }: any | undefined = req;
    const result: any = await userService.login(user);
    return res.json({
        status: result.status,
        message: 'Login successful',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
    })
};

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response, next: NextFunction) => {
    const result = await userService.register(req.body);
    if (result.status == 'success') {
        return res.json({
            status: result.status,
            user: result
        })
    }
    next(result)
};
