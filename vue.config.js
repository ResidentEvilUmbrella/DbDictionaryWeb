let proxyObj={}

proxyObj["/"]={
    ws:false,
    target:"http://192.168.0.198:8080",
    changeOrigin:true,
    pathRewrite:{
        '^/':"/"
    }

}

module.exports={
    devServer:{
        //host:"localhost",
        port:8081,
        proxy:proxyObj
    }
}