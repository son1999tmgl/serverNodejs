import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationChain } from 'express-validator/src/chain';
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema';
import { EntityError, ErrorWidthStatus,ErrorsType } from './errors';
import { httpStatusCode } from '~/constants/httpStatus';

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await validation.run(req);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const arrErr = errors.mapped();
        console.log(arrErr);
        
        let errEntity:EntityError = new EntityError({errors: {}})
        for(const key in arrErr) {
            const {msg} = arrErr[key];
            console.log(msg instanceof ErrorWidthStatus);
            
            if(msg instanceof ErrorWidthStatus && msg.status !== httpStatusCode.UNPROCESSABLE_ENTITY) {
                next(msg);
            }else{
                errEntity.errors[key] = arrErr[key]
            }
        }
        next(errEntity)
    };
};
