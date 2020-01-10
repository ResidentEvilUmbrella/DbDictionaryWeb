let proxyObj={}

proxyObj["/"]={
    ws:false,
    target:"http://192.168.1.38:8081",
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