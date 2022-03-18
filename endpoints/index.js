module.exports = [
    {
        route: "/register",
        method: "post",
        fn: "AuthorizationController.register"
    },
    {
        route: "/session",
        method: "get",
        middleware: ["onlyAuthenticated"],
        fn: "AuthorizationController.get"
    },
    {
        route: "/session",
        method: 'del',
        middleware: ["onlyAuthenticated"],
        fn: "AuthorizationController.delete",
    },
]