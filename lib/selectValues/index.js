export default (query = [], fn) => {
    return async (req, res, next) => {
        if (typeof fn === "function") {
            const obj = {}
            
            if (Array.isArray(query)) {
                query.forEach(key => {
                    const source = req.body[key] ?? req.params[key] ?? req.query[key]
                    
                    if (typeof source !== "undefined") {
                        obj[key] = source
                    }
                })
            }

            req.selectedValues = obj

            return await fn(req, res, next)
        }
    }
}