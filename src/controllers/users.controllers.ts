import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '~/models/schemas/User.schema';
import database from '~/services/database.services';
import bcrypt from "bcrypt";
import { config } from 'dotenv';
import { UserInfo } from 'os';

config()
export const loginController = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    const u = await database.user().findOne({ name });
    if (u) {
        const hash = u.password
        if (bcrypt.compareSync(password, hash)) {
            return res.status(200).json({
                status: 'success',
                message: 'Login successful',
                user: u
            })
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Login failed',
            })
        }
    }
    return res.status(404).json({
        status: 'error',
        message: 'Can not find',
    })
};

export const registerController = async (req: Request, res: Response) => {
    try {
        let { name, password, email } = req.body;
        console.log('process.env.SALT_ROUND: ', process.env.SALT_ROUND);
        password = bcrypt.hashSync(password, Number(process.env.SALT_ROUND));
        if (name && password) {
            const result = await database.user().insertOne(new User({ name, password, email }));
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
