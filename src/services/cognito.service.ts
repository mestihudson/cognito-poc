import AWS from "aws-sdk"
import crypto from "crypto"
import fs from "fs"

export default class CognitoService {
  private config = {
    region: process.env.COGNITO_POOL_REGION
  }

  private secretHash: string = process.env.COGNITO_CLIENT_SECRET
  private clientId: string = process.env.COGNITO_CLIENT_ID
  private cognitoIdentity

  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
  }

  public async signUpUser(username: string, password: string, userAttr: Array<any>) {
    const params = {
      ClientId: this.clientId,
      Password: password,
      Username: username,
      UserAttributes: userAttr,
    }
    try {
      const data = await this.cognitoIdentity.signUp(params).promise()
      console.log(data)
      return true
    } catch(error) {
      console.error(error)
      return false
    }
  }

  public async verifyAccount(username: string, code: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
    }
    try {
      const data = await this.cognitoIdentity.confirmSignUp(params).promise()
      console.log(data)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  public async signInUser(username: string, password: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        "USERNAME": username,
        "PASSWORD": password,
      },
    }
    try {
      const data = await this.cognitoIdentity.initiateAuth(params).promise()
      fs.writeFileSync("ACCESS_TOKEN", data.AuthenticationResult.AccessToken)
      fs.writeFileSync("ID_TOKEN", data.AuthenticationResult.IdToken)
      fs.writeFileSync("REFRESH_TOKEN", data.AuthenticationResult.RefreshToken)
      console.log(data)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  public async refreshUserToken(token: string): Promise<boolean> {
    const params = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      AuthParameters: {
        "REFRESH_TOKEN": token,
      },
      ClientId: this.clientId,
    }
    try {
      const data = await this.cognitoIdentity.initiateAuth(params).promise()
      fs.writeFileSync("ACCESS_TOKEN", data.AuthenticationResult.AccessToken)
      fs.writeFileSync("ID_TOKEN", data.AuthenticationResult.IdToken)
      console.log(data)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  public async revokeUserToken(token: string): Promise<boolean> {
    const params = {
      Token: token,
      ClientId: this.clientId,
    }
    console.log(params)
    try {
      const data = await this.cognitoIdentity.revokeToken(params).promise()
      console.log(data)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  public async signOutUser(token: string): Promise<boolean> {
    const params = {
      AccessToken: token,
    }
    console.log(params)
    try {
      const data = await this.cognitoIdentity.globalSignOut(params).promise()
      console.log(data)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  private generateHash(username: string): string {
    return crypto.createHmac("SHA256", this.secretHash)
      .update(username + this.clientId)
      .digest("base64")
  }
}
