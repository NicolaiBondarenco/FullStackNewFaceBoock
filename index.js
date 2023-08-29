import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'
import commentRoute from './routes/comments.js'

const app = express()
dotenv.config()

//Constants
const PORT = process.env.PORT
const DB_NAME = process.env.DB_NAME
const DB_PASS = process.env.DB_PASSWORD
const DB_USER = process.env.DB_USER

//Middleware
app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.static('uploads'))

app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@fsproject.n25immw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    )
    app.listen(PORT, () => console.log(`Server started on ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}
start()