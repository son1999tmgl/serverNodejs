import {Request} from 'express';
import { User } from './models/schemas/User.schema';
import { JwtPayload } from 'jsonwebtoken';
declare module 'express' {
    interface Request {
        user?: User,
        decoded_accessToken?: JwtPayloadL,
        decoded_refreshToken?: JwtPayloadL,
    }
}