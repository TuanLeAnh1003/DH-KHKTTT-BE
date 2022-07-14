import { UserModel } from '../models/UserModel.js'

export const getAllUsers = async (req, res) => {
  try {
    // create sample

    // const user = new UserModel({
    //   username: 'test',
    //   password: 'test',
    //   email: 'test'
    // })
    // user.save()

    // --------------------------------------------------------

    const users = await UserModel.find()

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    // const user = await UserModel.findByIdAndDelete(req.params.id)
    res.status(200).json("Delete successfully")
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
}