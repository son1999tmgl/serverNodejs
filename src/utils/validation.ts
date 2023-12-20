import { NextFunction, Request, Response } from "express";
import { ContextRunner, validationResult } from "express-validator";
import { ResultWithContext, ValidationChain } from "express-validator/src/chain";
import { RunnableValidationChains } from "express-validator/src/middlewares/schema";

const validate = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        validation.run(req)
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};