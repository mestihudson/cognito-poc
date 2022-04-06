import express, { Request, Response } from "express"

import AuthMiddleware from "../middlewares/auth.middleware"

export default class ProtectedController {
  public path = "/protected"
  public router = express.Router()
  private authMiddleware

  constructor() {
    this.authMiddleware = new AuthMiddleware()
    this.initRoutes()
  }

  private initRoutes() {
    this.router.use(this.authMiddleware.verifyToken)
    this.router.get("/secret", this.secret)
  }

  secret(req: Request, res: Response) {
    res.send("agora o segredo pode ser revelado").end()
  }
}
