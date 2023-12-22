import { checkSchema } from 'express-validator'
import { USER_MESSAGE } from '~/constants/message'
import database from '~/services/database.services'
import { sha256_decode } from '~/utils/crypto'
import { ErrorWidthStatus } from '~/utils/errors'
import { validate } from '~/utils/validation'
export const loginMiddleware = validate(
    checkSchema({
        email: {
            notEmpty: {
                errorMessage: USER_MESSAGE.EMAIL.NOT_EMPTY
            },
            isEmail: {
                errorMessage: USER_MESSAGE.EMAIL.IS_EMAIL
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await database.users.findOne({ email: value });
                    if (!user || sha256_decode(user.password) !== req.body.password) {
                        throw new ErrorWidthStatus({ status: 422, message: USER_MESSAGE.EMAIL.EMAIL_OR_PASSWORD_FAIL });
                    } else {
                        req.user = user;
                        return true;
                    }
                }
            }
        },
        password: {
            notEmpty: {
                errorMessage: USER_MESSAGE.PASSWORD.NOT_EMPTY
            },
            trim: true
        }
    })
)

export const registerMiddleware = validate(
    checkSchema({
        name: {
            notEmpty: {
                errorMessage: USER_MESSAGE.NAME.NOT_EMPTY
            },
            isString: {
                errorMessage: USER_MESSAGE.NAME.IS_STRING
            },
            isLength: {
                options: {
                    min: 1,
                    max: 50
                },
                errorMessage: USER_MESSAGE.NAME.LENGTH
            },
            trim: true
        },
        password: {
            notEmpty: {
                errorMessage: USER_MESSAGE.PASSWORD.NOT_EMPTY
            },
            isStrongPassword: {
                options: {
                    minLength: 6,
                },
                errorMessage: USER_MESSAGE.PASSWORD.STRONG
            },
            trim: true
        },
        confirmPassword: {
            notEmpty: {
                errorMessage: USER_MESSAGE.CONFIRM_PASSWORD.NOT_EMPTY
            },
            trim: true,
            custom: {
                options: (value, { req }) => {
                    if (value !== req.body.password) {
                        throw new ErrorWidthStatus({ status: 422, message: USER_MESSAGE.CONFIRM_PASSWORD.MATCH });
                    }
                    return true;
                }
            }
        },
        email: {
            notEmpty: {
                errorMessage: USER_MESSAGE.EMAIL.NOT_EMPTY
            },
            isEmail: {
                errorMessage: USER_MESSAGE.EMAIL.IS_EMAIL
            },
            custom: {
                options: async (value) => {
                    const user = await database.users.findOne({ email: value });
                    if (user) {
                        throw new ErrorWidthStatus({ status: 422, message: USER_MESSAGE.EMAIL.EXISTS });
                    } else {
                        return true;
                    }
                }
            }
        },
        date_of_birth: {
            isISO8601: {
                errorMessage: USER_MESSAGE.DATE_OF_BIRTH.ISO8601
            }
        }
    })

)