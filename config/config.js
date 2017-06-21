module.exports = {
    secret: "thisismysecret",
    audience: "nodejs-jwt-auth",
    issuer: "https://sagar.com",
    filemaker:{
        protocol: "https",
        ip:"192.168.2.51",
        solution:"MAI",
        headers : {"Content-Type" : "application/json"},
        body : {"user" : "sagar", "password" : "sagar2017", "layout": "L121_PROJECTS_List_View"},
        selfSignedCertificate : false
    }
}
