import { checkSchema } from 'express-validator'
import database from '~/services/database.services'
import { ErrorWidthStatus } from '~/utils/errors'
import { validate } from '~/utils/validation'
export const loginMiddleware = validate(
    checkSchema({
        email: {
            notEmpty: true,
            isEmail: true
        },
        passwords: {
            notEmpty: true,
            trim: true
        }
    })
)

export const registerMiddleware = validate(
    checkSchema({
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
                        throw new ErrorWidthStatus({status: 422, message: 'Passwords do not match'})
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
                    const user = await database.users.findOne({ email: value });
                    if (user) {
                        throw new ErrorWidthStatus({status: 422, message: 'Email exists'});
                    } else {
                        return true;
                    }
                }
            }
        },
        date_of_birth: {
            isISO8601: true
        }
    })
)