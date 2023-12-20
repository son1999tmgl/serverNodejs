import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '~/models/schemas/User.schema';
import database from '~/services/database.services';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import userService from '~/services/users.services';
config();

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const u = await userService.login({ email });
    if (u) {
        const hash = u.password;
        if (bcrypt.compareSync(password, hash)) {
            return res.status(200).json({
                status: 'success',
                message: 'Login successful',
                user: u
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Login failed'
            });
        }
    }
    return res.status(404).json({
        status: 'error',
        message: 'Can not find'
    });
};

export const registerController = async (req: Request, res: Response) => {
    try {
        let { name, password, email, date_of_birth } = req.body;
        password = bcrypt.hashSync(password, Number(process.env.SALT_ROUND));
        if (name && password) {
            const result = await userService.register({ name, email, password, date_of_birth });
            return res.json({
                status: 'success',
                result: result
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Name or password incorrect'
            });
        }
    } catch (error) {
        console.log(error);
    }
};
