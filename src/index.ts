import express, { NextFunction, Request, Response } from 'express';
import userRouter from './routes/users.routes';
import database from './services/database.services';
import { wrap } from './utils/handler';
import { ErrorHandlerDefault } from './utils/errors';
database.connect();
const app = express();
const PORT = 3000;
app.use(express.json());


app.use('/users', userRouter);

app.use(ErrorHandlerDefault)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
