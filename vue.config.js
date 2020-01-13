
module.exports={
    publicPath:"/tm4-dict-zjt-8992-web",
    lintOnSave:true,
    productionSourceMap:false,
    devServer:{
        //host:"localhost",
        port:8992,
        proxy:{
            "./":{
                ws:false,
                target:"http://localhost:8080/",
                changeOrigin:true,
                pathRewrite:{
                    '^/api':"/"
                }

            }
        }
    }
}