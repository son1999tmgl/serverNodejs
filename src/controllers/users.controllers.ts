import { Request, Response } from 'express';
import { User } from '~/models/schemas/User.schema';
import database from '~/services/database.services';
export const loginController = (req: Request, res: Response) => {
    const { user } = req.body;
    if (user == 'son') {
        return res.json({
            message: 'Xin chào'
        });
    } else {
        return res.status(400).json({
            message: 'Tên đn sai'
        });
    }
};

export const registerController = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name;
        const password: string = req.body.password;
        if (name && password) {
            const result = await database.user().insertOne(new User({ name, password }));
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
