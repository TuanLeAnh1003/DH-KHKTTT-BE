import { UserModel } from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(req.body.password, salt)

    //Create new user
    const newUser = await new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashed
    })

    const user = await newUser.save()
    res.status(200).json(user)

  } catch (err) {
    res.status(500).json(err)
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username })

    if (!user) {
      res.status(404).json("Wrong username!!")
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      res.status(404).json("Wrong password!!")
    }

    if (user && validPassword) {
      const accessToken = jwt.sign({
        id: user._id,
        admin: user.admin
      }, process.env.ACCESS_TOKEN, { expiresIn: "30d" })

      const { password, ...rest } = user._doc;

      res.status(200).json({...rest, accessToken})
    }

  } catch (err) {
    res.status(500).json(err)
  }
}