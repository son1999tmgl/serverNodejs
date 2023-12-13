import express from 'express';
import userRouter from './routes/users.routes';
import database from './services/database.services';
const app = express();
const PORT = 3000;
app.use(express.json());

database.connect();
app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
