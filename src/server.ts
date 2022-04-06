import bodyParser from "body-parser"

import App from "./app"
import AuthController from "./controllers/auth.controller"
import HomeController from "./controllers/home.controller"
import ProtectedController from "./controllers/protected.controller"

const app = new App({
  port: parseInt(process.env.PORT),
  controllers: [
    new HomeController(),
    new AuthController(),
    new ProtectedController(),
  ],
  middlewares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
  ],
})

app.listen()
