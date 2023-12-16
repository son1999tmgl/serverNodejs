import { Request, Response, NextFunction } from 'express'
import { ValidationChain, checkSchema, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { User } from '~/models/schemas/User.schema'
import database from '~/services/database.services'
export const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({
            message: 'user, password ko đc để trống'
        })
    }
    next()
}

export const registerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const schemaRegister: RunnableValidationChains<ValidationChain> = checkSchema({
        name: {
            notEmpty: true,
            isString: true,
            isLength: {
                options: {
                    min: 1,
                    max: 50
                }
            },
            trim: true
        },
        password: {
            notEmpty: true,
            isStrongPassword: {
                options: {
                    minLength: 6,
                }
            },
            trim: true
        },
        confirmPassword: {
            notEmpty: true,
            trim: true,
            custom: {
                options: (value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error('Passwords do not match');
                    }
                    return true;
                }
            }
        },
        email: {
            notEmpty: true,
            isEmail: true,
            custom: {
                options: async (value) => {
                    const user = await database.user().findOne({ email: value });
                    if (user) {
                        throw new Error('email đã tổn tại');
                    } else {
                        return true;
                    }
                }
            }
        }
    })
    await schemaRegister.run(req);
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            error: error.mapped(),
        })
    } else {
        next()
    }
}