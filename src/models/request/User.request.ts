import { JwtPayload } from "jsonwebtoken"

export interface RegisterRequestBody {
    name: string,
    password: string,
    email: string,
    date_of_birth: string,
    [key:string]: any
}

export interface LogoutRequestBody {
    refresh_token: string,
    [key:string]: any
}
export interface JwtPayloadL extends JwtPayload {
    user_id: string,
    [key:string]: any
}

