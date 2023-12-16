import { Request, Response, NextFunction } from 'express'
import { ValidationChain, checkSchema, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
export const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { user, password } = req.body
    if (!user || !password) {
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
            isEmail: true
        }
    })
    await schemaRegister.run(req);
    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json({
            status:'error',
            error: error.mapped(),
            fullError1: error.array(),
        })
    }else{
        next()
    }
}