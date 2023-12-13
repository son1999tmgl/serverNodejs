import express from 'express'
import userRouter from './routes/users.routes'
const app = express()
const PORT = 3000
app.use(express.json())

app.use('/users', userRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

