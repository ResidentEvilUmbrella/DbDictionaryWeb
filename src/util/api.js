import  axios from  'axios'
import  {Message} from 'element-ui'


axios.interceptors.response.use(sussess=>{
            if(sussess.status&&sussess.status==200&&sussess.data.status==500){
                Message.error({message:sussess.data.msg});
                return;
            }
            if(sussess.data.msg){
                Message.success({message:sussess.data.msg});
            }
            return sussess.data;
},error =>{
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