import { Request, Response, NextFunction } from 'express'
export const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { user, password } = req.body
  if (!user || !password) {
    return res.status(400).json({
      message: 'user, password ko đc để trống'
    })
  }
  next()
}
