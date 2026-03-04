import "dotenv/config.js"
import express from "express"
import User from "./models/User.js"
import Sequelize from "sequelize"
import config from "./config/database.js"
import privateRoutes from "./routes/privateRoutes.js"
import publicRoutes from "./routes/publicRoutes.js"
import auth from "./middlewares/auth.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

const sequelize = new Sequelize(config)
User.init(sequelize)

app.use("/usuarios", auth, privateRoutes)
app.use("/", publicRoutes)

sequelize
  .authenticate()
  .then(() => {
    console.log("Banco Conectado!")
    app.listen(3000, () => console.log("Servidor ok!"))
  })
  .catch((err) => {
    console.error(err)
  })
