import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import CognitoService from "../services/cognito.service"

export default class AuthController {
  public path = "/auth"
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.post("/signUp", this.validateBody("signUp"), this.signUp)
    this.router.post("/signIn", this.validateBody("signIn"), this.signIn)
    this.router.post("/verify", this.validateBody("verify"), this.verify)
    this.router.post("/refresh", this.validateBody("refresh"), this.refresh)
    this.router.post("/revoke", this.validateBody("revoke"), this.revoke)
    this.router.post("/signOut", this.validateBody("signOut"), this.signOut)
  }

  signUp(req: Request, res: Response) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
    console.log("signUp body is valid")
    const { username, password } = req.body
    const userAttr = [
    ]
    new CognitoService().signUpUser(username, password, userAttr)
      .then((success) => {
        if (success) {
          return res.status(200).end()
        }
        return res.status(500).end()
      })
  }

  signIn(req: Request, res: Response) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
    console.log("signIn body is valid")
    const { username, password } = req.body
    new CognitoService().signInUser(username, password)
      .then((success) => {
        if (success) {
          return res.status(200).end()
        }
        return res.status(500).end()
      })
  }

  verify(req: Request, res: Response) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
    console.log("verify body is valid")
    const { username, code } = req.body
    new CognitoService().verifyAccount(username, code)
      .then((success) => {
        if (success) {
          return res.status(200).end()
        }
        return res.status(500).end()
      })
  }

  refresh(req: Request, res: Response) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
    console.log("refresh body is valid")
    const { token } = req.body
    console.log(token)
    new CognitoService().refreshUserToken(token)
      .then((success) => {
        if (success) {
          return res.status(200).end()
        }
        return res.status(500).end()
      })
  }

  revoke(req: Request, res: Response,) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
    console.log("revoke body is valid")
    const { token } = req.body
    console.log(token)
    new CognitoService().revokeUserToken(token)
      .then((success) => {
        if (success) {
          return res.status(200).end()
        }
        return res.status(500).end()
      })
  }

  signOut(req: Request, res: Response,) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
    console.log("signOut body is valid")
    const { token } = req.body
    console.log(token)
    new CognitoService().signOutUser(token)
      .then((success) => {
        if (success) {
          return res.status(200).end()
        }
        return res.status(500).end()
      })
  }

  private validateBody(type: string) {
    switch(type) {
      case "signUp":
        return [
          body("username").normalizeEmail().isEmail(),
          body("password").isString().isLength({ min: 8 }),
        ]
      case "signIn":
        return [
          body("username").normalizeEmail().isEmail(),
          body("password").isString().isLength({ min: 8 }),
        ]
      case "verify":
        return [
          body("username").normalizeEmail().isEmail(),
          body("code").isString().isLength({ min: 6, max: 6 }),
        ]
      case "refresh":
        return [
          body("token").isString().notEmpty(),
        ]
      case "revoke":
        return [
          body("token").isString().notEmpty(),
        ]
      case "signOut":
        return [
          body("token").isString().notEmpty(),
        ]
    }
  }
}
