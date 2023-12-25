import { NextFunction, Request, Response } from 'express';
import userService from '~/services/users.services';
import { ParamsDictionary } from "express-serve-static-core";
import { JwtPayloadL, LogoutRequestBody, RegisterRequestBody } from '~/models/request/User.request';
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

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
    const decoded_refreshToken: JwtPayloadL = req.decoded_refreshToken;
    const refresh_token = req.body.refresh_token;
    const result =  await userService.logout(refresh_token, decoded_refreshToken)
    return res.json(result)
};
