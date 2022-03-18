export default {
    user_id: { type: 'string', required: true },
    allowed_chats: { type: 'array', items: { type: 'string' } },
}