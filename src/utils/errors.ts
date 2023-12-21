import { NextFunction, Request, Response } from "express";
import { httpStatusCode } from "~/constants/httpStatus";
import { USER_MESSAGE } from "~/constants/message";
export type ErrorsType = Record<string, {
    msg: string,
    [key:string]: any
}>

export class ErrorWidthStatus {
    message: string
    status: number
    constructor({ message, status }: { message: string, status: number }) {
        this.message = message;
        this.status = status;
    }
}

export class EntityError extends ErrorWidthStatus {
    errors: ErrorsType
    constructor({ message = USER_MESSAGE.input_validation, status = httpStatusCode.UNPROCESSABLE_ENTITY, errors }: { message?: string, status?: number, errors: ErrorsType }) {
        super({ message, status });
        this.errors = errors;
    }
}

export const ErrorHandlerDefault = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status | 500).json({
        error: err
    });
}