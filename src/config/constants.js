module.exports = {
    PORT_HTTP: process.env.PORT_HTTP || 3000,
    WHITELIST: {
        user: {
            create: ['first_name', 'last_name', 'password', 'email'],
            update: ['first_name', 'last_name', 'password', 'email']
        }
    },
    SIDEBAR: [
        {
            name: "Dashboard",
            url: "/app",
            admin: false,
            icon: "fa fa-dashboard",
            /*subs: [
                {
                    name: "Import",
                    url: "/app#import",
                    admin: false,
                    icon: ""
                },
                {
                    name: "Search",
                    url: "/app#search",
                    admin: false,
                    icon: ""
                },
                {
                    name: "Edit",
                    url: "/app#data",
                    admin: false,
                    icon: ""
                }
            ]*/
        },
        {
            name: "My songs",
            url: "#",
            admin: false,
            icon: "fa fa-music"
        },
        {
            name: "Admin zone",
            url: "#",
            admin: true,
            icon: "fa fa-danger"
        }
    ]
};