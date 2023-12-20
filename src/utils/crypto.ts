import CryptoJS from 'crypto-js';
require('dotenv').config();

/** Mã hoá */
export const sha256_encode = (str: string) => {
    return CryptoJS.AES.encrypt(str, process.env.SECRET_KEY as string).toString();
}

/** Giải mã */
export const sha256_decode = (str: string) => {
    return CryptoJS.AES.decrypt(str, process.env.SECRET_KEY as string).toString(CryptoJS.enc.Utf8);
}