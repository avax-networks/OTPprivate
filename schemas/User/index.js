export default {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    email: String,
}