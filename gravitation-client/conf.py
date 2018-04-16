config = {
    "lattice": {
        "size": 19,
        "width": 30
    },

    "playerId": "ljx",

    "domain": "192.168.1.3:8080",
    "service": {
        "login": "http://%(domain)s/login/%(playerId)s",
        "get": "http://%(domain)s/get/%(playerId)s",
        "attack": "http://%(domain)s/attack/%(x)d/%(y)d/of/%(playerId)s",
        "chat": "http://%(domain)s/chat",
    }
}
