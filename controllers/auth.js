import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Register User
export const register = async (req, res) => {
  try {
    const { username, password } = req.body
    const isUsed = await User.findOne({ username })
    if (isUsed) {
      return res.json({
        message: 'Пользователь с таким именем уже существует.',
      })
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      password: hash,
    })

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      },
    )

    await newUser.save()

    res.json({
      newUser,
      token,
      message: ' Регистрация прошла успешно!',
    })
  } catch (error) {
    res.json({
      message: 'Ошибка при создании пользователя.',
    })
  }
}

//Login User
export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) res.json({ message: 'Такого пользователя не существует!' })

    const isPassCorrect = await bcrypt.compare(password, user.password)

    if (!isPassCorrect) res.json({ message: 'Неверный логин или пароль!' })

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      },
    )
    res.json({ token, user, message: 'Вы вошли в систему.' })
  } catch (error) {
    return res.json({ message: 'Ошибка при логинизации пользователя.' })
  }
}

//Get Me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) res.json({ message: 'Такого пользователя не существует!' })

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      },
    )
    res.json({ user, token })
  } catch (error) {
    res.json({ message: 'Нет доступа.' })
  }
}
