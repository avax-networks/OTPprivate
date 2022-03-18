import bcrypt from 'bcrypt'
import passport from 'passport'
import { selectValues, requiredValues, token } from "../../lib"
import { User } from "../../models"

export default {
    get: async (req, res) => {
        passport.authenticate("local", { session: false }, async (error, user, options) => {
            if (error) {
                return res.status(500).json(`Error validating user > ${error.message}`)
            }

            if (!user) {
                return res.status(401).json("Invalid credentials")
            }

            // generate token
            const generatedToken = token.signNew({
                user_id: user._id,
                username: user.username,
                email: user.email
            }, options)

            // send result
            res.json({ token: generatedToken })
        })(req, res)
    },
    register: requiredValues(["username", "email", "password"], selectValues(["username", "password", "email"], async (req, res) => {
        const { username, password, email, } = req.selectedValues

        User.findOne({ username: username })
            .then((data) => {
                if (data) {
                    return res.status(409).json({ error: "Username is already exists" })
                }

                const hash = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_ROUNDS))

                let document = new User({
                    username: username,
                    email: email,
                    password: hash
                })

                document.save()

                return res.json(document)
            })
            .catch(err => {
                return console.log(err)
            })
    })),
    delete: async (req, res) => {
        const user_id = req.decodedToken.user_id
        const token = req.jwtToken

        if (typeof user_id === "undefined") {
            return res.status(400).send("No session finded")
        }
        if (typeof token === "undefined") {
            return res.status(400).send("No token finded")
        }

        const session = await Session.findOneAndDelete({ user_id, token })

        if (session) {
            return res.send("Session deleted")
        }
        
        return res.status(404).send("Not found")
    },
}