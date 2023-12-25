import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { JwtPayloadL } from '~/models/request/User.request';
require('dotenv').config();

export const signToken = ({
    payload,
    secretOrPrivateKey = process.env.JWT_SECRET as string,
    options = {}
}: {
    payload: any;
    secretOrPrivateKey?: string;
    options?: SignOptions;
}) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
            if (err) {
                throw reject(err);
            }
            resolve(token as string);
        });
    });
};

export const verifyToken = ({
    token,
    secretOrPrivateKey = process.env.JWT_SECRET as string
}: {
    token: string;
    secretOrPrivateKey?: string;
}) => {
    return new Promise<JwtPayloadL>((resolve, reject) => {
        jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
            if (err) {
                reject(err)
            }
            resolve(decoded as JwtPayloadL)
        });
    });
};
