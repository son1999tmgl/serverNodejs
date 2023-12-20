import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '~/models/schemas/User.schema';
import database from '~/services/database.services';
import bcrypt from 'bcrypt';
import userService from '~/services/users.services';
import { ParamsDictionary } from "express-serve-static-core";
import { RegisterRequestBody } from '~/models/request/User.request';
require('dotenv').config();

export const loginController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
    const result: any = await userService.login(req.body);
    if (result.status == 'success') {
        return res.json({
            status: result.status,
            message: 'Login successful',
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        })
    }
    return res.status(404).json({
        status: result.status,
        message: result.errorMessage
    });
};

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
    try {
        const result = await userService.register(req.body);
        if (result.status == 'success') {
            return res.json({
                status: result.status,
                user: result.user
            })
        }
        return res.status(404).json({
            status: result.status,
            message: result.errorMessage
        });

    } catch (error) {
        console.log(error);
    }
};
