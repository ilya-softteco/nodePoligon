const User = require('./models/Users')
const Role = require('./models/Role')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')
const generateJwt = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, secret, {expiresIn: '1h'})
}

class AuthController {
    async registration(req, res) {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json({message: "Error", error})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username: username})
            if (candidate) {
                return res.status(400).json({message: "Username exist"})
            }
            const passwordHash = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({
                username: username,
                password: passwordHash,
                role: [userRole.value]
            })
            await user.save()
            return res.json({message: "User registered"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Error"})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username: username})
            if (!user) {
                return res.status(400).json({message: `Username or password incorrect`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)

            if (!validPassword) {
                return res.status(400).json({message: `Username or password incorrect`})
            }
            const token = generateJwt(user._id, user.role)

            return res.json({token: token})

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Error"})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            return res.json(users)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Error"})
        }
    }

    async createRoles(req, res) {
        try {

            const roles = [
                new Role(),
                new Role({value: 'ADMIN'})
            ]
            for (const element of roles) {
                const candidateRole = await Role.findOne({value: element.value})
                if (!candidateRole) {
                    element.save()
                }
            }
            return res.json('done')
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Error"})
        }
    }
}

module.exports = new AuthController()