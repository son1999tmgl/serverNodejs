import { Collection } from "mongodb";
import { User } from "~/models/schemas/User.schema";
import database from "./database.services";
import { RegisterRequestBody } from "~/models/request/User.request";
import { sha256_decode, sha256_encode } from "~/utils/crypto";
import { signToken } from "~/utils/sign";

class UserService {
    users: Collection<User>
    constructor() {
        this.users = database.users;
    }


    private assignAccessToken(user_id: string) {
        return signToken({
            payload: {
                user_id: user_id
            },
            options: {
                algorithm: 'HS256',
                expiresIn: '15m'
            }
        })
    }

    private refreshAccessToken(user_id: string) {
        return signToken({
            payload: {
                user_id: user_id
            },
            options: {
                algorithm: 'HS256',
                expiresIn: '100 days'
            }
        })
    }

    async register(payload: RegisterRequestBody) {
        let { name, email, password, date_of_birth } = payload;
        const checkEmailExists = await this.checkEmailExists(email);
        if (checkEmailExists) {
            return {
                status: false,
                errorMessage: 'Email exists',
            }
        }
        password = sha256_encode(password)
        const user = await this.users.insertOne(new User({ name, email, password, date_of_birth: new Date(date_of_birth) }))
        return {
            status: 'success',
            user: user
        }
    }

    async login(payload: RegisterRequestBody) {
        const { email, password } = payload;
        const user = await this.users.findOne({ email });
        if (user) {
            const paswword_check = sha256_decode(user.password)
            if (password === paswword_check) {
                try {
                    const resolve = await Promise.all([this.assignAccessToken(user._id?.toString()), this.refreshAccessToken(user._id?.toString())])
                    return {
                        status: 'success',
                        accessToken: resolve[0],
                        refreshToken: resolve[1],
                    }
                } catch (error) {
                    return {
                        status: 'error',
                        errorMessage: error
                    }
                }
            }
            return {
                status: 'error',
                errorMessage: "Password is incorrect",
            }
        }
        return {
            status: 'error',
            errorMessage: "User not exist",
        }
    }

    async checkEmailExists(email: string): Promise<Boolean> {
        const user = await this.users.findOne({ email });
        return Boolean(user);
    }
}

const userService = new UserService();
export default userService;