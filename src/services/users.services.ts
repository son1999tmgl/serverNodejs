import { Collection, InsertOneResult, ObjectId } from 'mongodb';
import { User } from '~/models/schemas/User.schema';
import database from './database.services';
import { JwtPayloadL, RegisterRequestBody } from '~/models/request/User.request';
import { sha256_encode } from '~/utils/crypto';
import { signToken } from '~/utils/jwt';
import { httpStatusCode } from '~/constants/httpStatus';
import { RefreshToken } from '~/models/schemas/RefreshToken';
import { USER_MESSAGE } from '~/constants/message';
import { TokenType } from '~/constants/enums';

class UserService {
    users: Collection<User>;
    refreshToken: Collection<RefreshToken>;
    constructor() {
        this.users = database.users;
        this.refreshToken = database.refreshToken;
    }

    /**
     * Tạo access token
     * @param user_id
     * @returns
     */
    private assignAccessToken(user_id: string): Promise<string> {
        return signToken({
            payload: {
                user_id: user_id,
                token_type: TokenType.AccessToken
            },
            options: {
                algorithm: 'HS256',
                expiresIn: USER_MESSAGE.ACCESS_TOKEN_EXPIRED_IN
            }
        });
    }

    /**
     * Tạo refresh token
     * @param user_id
     * @returns
     */
    private assignRefreshToken(user_id: string): Promise<string> {
        return signToken({
            payload: {
                user_id: user_id,
                token_type: TokenType.RefreshToken
            },
            options: {
                algorithm: 'HS256',
                expiresIn: USER_MESSAGE.REFRESH_TOKEN_EXPIRED_IN
            }
        });
    }

    /**
     * Tạo emailVerify
     * @param user_id
     * @returns
     */
    private assignEmailVerifyToken(user_id: string): Promise<string> {
        return signToken({
            payload: {
                user_id: user_id,
                token_type: TokenType.EmailVarifyToken
            },
            options: {
                algorithm: 'HS256',
                expiresIn: USER_MESSAGE.VERIFY_EMAIL_TOKEN_EXPIRED_IN
            }
        });
    }

    /**
     * Tạo access và refresh token
     * @param user_id
     * @returns
     */
    private signAcessTokenAndRefreshToken(user_id: string): Promise<[string, string]> {
        return Promise.all([this.assignAccessToken(user_id?.toString()), this.assignRefreshToken(user_id?.toString())]);
    }

    /**
     * insert refresh token vào db
     * @param refreshToken
     * @param user_id
     */
    private async insertRefreshToken(refreshToken: string, user_id: ObjectId) {
        await this.refreshToken.insertOne(
            new RefreshToken({
                token: refreshToken,
                user_id: user_id
            })
        );
    }

    /**
     * register
     * @param payload
     * @returns
     */
    async register(payload: RegisterRequestBody) {
        const user_id = new ObjectId();
        let { name, email, password, date_of_birth } = payload;
        password = sha256_encode(password);
        const [accessToken, refreshToken]: [string, string] = await this.signAcessTokenAndRefreshToken(
           user_id.toString()
        );
        const email_verify_token = await this.assignEmailVerifyToken(user_id.toString());
        const user: InsertOneResult<User> = await this.users.insertOne(
            new User({ name, email, password, date_of_birth: new Date(date_of_birth) })
        );
        await this.insertRefreshToken(refreshToken, user.insertedId);
        return {
            status: 'success',
            user: user,
            accessToken,
            refreshToken
        };
    }

    /**
     * Login
     * @param user
     * @returns
     */
    async login(user: User) {
        const [accessToken, refreshToken] = await this.signAcessTokenAndRefreshToken(user._id.toString());
        await this.insertRefreshToken(refreshToken, user._id);
        return {
            status: httpStatusCode.ACCEPTED,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

    async logout(refreshToken: string, decoded_refreshToken: JwtPayloadL) {
        await database.refreshToken.deleteOne({ token: refreshToken });
        return {
            status: httpStatusCode.SUCCESS,
            message: USER_MESSAGE.LOGOUT_SUCCESS
        };
    }
}

const userService = new UserService();
export default userService;
