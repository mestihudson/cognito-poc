import fetch from "node-fetch"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import jwkToPem from "jwk-to-pem"

const pems = {}

export default class AuthMiddleware {
  private region: string = process.env.COGNITO_POOL_REGION
  private userPoolId: string = process.env.COGNITO_POOL_ID

  constructor() {
    this.setUp()
  }

  verifyToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.header("Auth")
    if (!token) {
      res.status(401).end()
    }

    let decodeJwt: any = jwt.decode(token, { complete: true })
    if (!decodeJwt) {
      res.status(401).end()
    }

    const { kid } = decodeJwt.header
    const pem = pems[kid]
    if (!pem) {
      res.status(401).end()
    }

    jwt.verify(token, pem, (error, payload) => {
      if (error) {
        res.status(401).end()
      }
      next()
    })
  }

  private async setUp() {
    const URL = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`
    try {
      const response = await fetch(URL)
      if (response.status !== 200) {
        throw `request not successful`
      }
      const data = await response.json()
      const { keys } = data
      for (let index = 0; index < keys.length; index++) {
        const { kid, kty, n, e } = keys[index]
        pems[kid] = jwkToPem({ kty, n, e })
      }
      console.log("got all pems")
    } catch (error) {
      console.error("sorry. could not fetch jwks: ", error)
    }
  }
}
