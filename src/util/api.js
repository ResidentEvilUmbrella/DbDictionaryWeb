import  axios from  'axios'
import qs from 'qs'
import store from "../store"
import  {Message} from 'element-ui'

/*!
* developer：zhang.lw
* axios 配置文件文件
*/


/**
 * 响应拦截器
 */
axios.interceptors.response.use(sussess=>{
        //加载框关闭
        store.state.loadding=false;

        //在这里对返回的数据进行处理

        //逻辑错误信息
     if(sussess.status&&sussess.status==200&&sussess.data.status==500){
                Message.error({message:sussess.data.msg});
                //返回空数据
                return;
     }
     //成功消息
    if(sussess.data.msg){
        Message.success({message:sussess.data.msg});
    }
        //将数据返回给前台处理
        return sussess.data;
},error =>{

    //错误消息处理
    let status = error.response.status;
    if(status==504||status==404){
        Message.error({message:"服务器被吃了。。。"});
    }else if(status==403){
        Message.error({message:"权限不足，清联系管理员！"});
    }else if(status==401){
        Message.error({message:"尚未登录，请登录。！"});
    }else{
        if(error.response.data.msg){
            Message.error({message:error.response.data.msg});
        }else{
            Message.error({message:"未知错误！！"});
        }
    }
         return;
    }
 )
let loading="";

/**
 * 请求拦截器
 */
axios.interceptors.request.use(config=>{

    let url=config["url"];
    //获取请求 数据
    let paramObj=qs.parse(config.data);
    let {loading=true}=paramObj;

    //截取前台url代码
    let actionName=url.substring(url.lastIndexOf("/")+1);
    //请求不是获取数据并且需要加载数据 进行加载进度条
    if(!actionName.toLocaleLowerCase().startsWith("get")&&loading){
        store.state.loadding=true;
    }else{
        //不加载
        store.state.loadding=false;
    }
    return config;
})

let base="";

export  const  postKeyValueRequest=(url,params)=>{
    return axios({
            method:"post",
            url:`${base}${url}`,
            data:params,
            transformRequest:data=>{
                   let ret="";
                   for(let i in data){
                       ret+=encodeURIComponent(i)+"="+encodeURIComponent(data[i])+"&"
                   }
                   return ret;
            },
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            }

    })
};

export  const  postRequest=(url,params)=>{
    return axios({
        method:"post",
        url:`${base}${url}`,
        data:params

    })
};

export  const  putRequest=(url,params)=>{
    return axios({
        method:"put",
        url:`${base}${url}`,
        data:params

    })
};

export  const  deleteRequest=(url,params)=>{
    return axios({
        method:"delete",
        url:`${base}${url}`, data:params

    })
};

export  const  getRequest=(url,params)=>{
    return axios({
        method:"get",
        url:`${base}${url}`,
        data:params

    })
};