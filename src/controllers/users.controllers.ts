import { Request, Response } from 'express'
export const loginController = (req: Request, res: Response) => {
  const { user } = req.body
  if (user == 'son') {
    return res.json({
      message: 'Xin chào'
    })
  } else {
    return res.status(400).json({
      message: 'Tên đn sai'
    })
  }
}
