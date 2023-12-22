import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { User } from "~/models/schemas/User.schema";
import database from "./database.services";
import { RegisterRequestBody } from "~/models/request/User.request";
import { sha256_decode, sha256_encode } from "~/utils/crypto";
import { signToken } from "~/utils/sign";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { httpStatusCode } from "~/constants/httpStatus";
import { RefreshToken } from "~/models/schemas/RefreshToken";

class UserService {
    users: Collection<User>
    refreshToken: Collection<RefreshToken>
    constructor() {
        this.users = database.users;
        this.refreshToken = database.refreshToken;
    }

    private assignAccessToken(user_id: string): Promise<string> {
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

    private refreshAccessToken(user_id: string): Promise<string> {
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

    signAcessTokenAndRefreshToken(user_id: string): Promise<[string, string]> {
        return Promise.all([this.assignAccessToken(user_id?.toString()), this.refreshAccessToken(user_id?.toString())])
    }

    private async insertRefreshToken(refreshToken: string, user_id: ObjectId) {
        await this.refreshToken.insertOne(new RefreshToken({
            token: refreshToken,
            user_id: user_id
        }))
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
        const user: InsertOneResult<User> = await this.users.insertOne(new User({ name, email, password, date_of_birth: new Date(date_of_birth) }))
        const [accessToken, refreshToken]: [string, string] = await this.signAcessTokenAndRefreshToken(user.insertedId.toString())
        await this.insertRefreshToken(refreshToken, user.insertedId)
        return {
            status: 'success',
            user: user,
            accessToken,
            refreshToken
        }
    }


    async login(user: User) {
        const [accessToken, refreshToken] = await this.signAcessTokenAndRefreshToken(user._id.toString())
        await this.insertRefreshToken(refreshToken, user._id)
        return {
            status: httpStatusCode.ACCEPTED,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    }

    async checkEmailExists(email: string): Promise<Boolean> {
        const user = await this.users.findOne({ email });
        return Boolean(user);
    }
}

const userService = new UserService();
export default userService;