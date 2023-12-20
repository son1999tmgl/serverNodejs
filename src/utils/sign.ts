import jwt, { SignOptions } from 'jsonwebtoken'
require('dotenv').config();

export const signToken = ({ payload, secretOrPrivateKey = process.env.JWT_SECRET as string, options = {} }: { payload: any, secretOrPrivateKey?: string, options?: SignOptions }) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
            if (err) {
                throw reject(err);
            }
            resolve(token)
        })
    })
} 