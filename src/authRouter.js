const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')
router.post('/registration',
    [
        check('username', "Username incorrect").notEmpty(),
        check('password', "Password incorrect").isLength({min: 4})
    ],
    controller.registration)
router.post('/login', controller.login)
router.post('/createRoles', controller.createRoles)
router.get('/users',roleMiddleware("ADMIN"), controller.getUsers)


module.exports = router