<template>
    <div>
        <!-- modal edit -->
        <el-dialog :title="windowAttr.title" :visible.sync="windowAttr.windowVisible" width='30%'>
            <el-form :model="editData"  :rules="rules" ref="form" label-width="auto">
                <el-form-item label="模块名称" prop="moduleName">
                    <el-input
                            autocomplete="off"
                            placeholder="请输入模块名称"
                            v-model.trim="editData.moduleName">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                            type="textarea"
                            :row="10"
                            autocomplete="off"
                            placeholder=""
                            :autosize="{ minRows: 5, maxRows: 10}"
                            v-model="editData.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeWin">取 消</el-button>
                <el-button type="primary" @click="okEvent">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ModuleWindow",
        props:{
            //editData:Object
        },
        data(){

            return{
                treeNodeData:{
                },
                windowAttr:{
                    windowVisible:false,
                    title:""
                },
                editData:{
                    tmuid:"",
                    moduleCode:"",
                    moduleName:"",
                    moduleType:"",
                    used:"",
                    remark:"",
                    sort:"",
                    dbConnId:""
                },
                editDataTemplate:{
                    tmuid:"",
                    moduleCode:"",
                    moduleName:"",
                    moduleType:"",
                    used:"",
                    remark:"",
                    sort:"",
                    dbConnId:""
                },
                rules: {
                    moduleName: [
                        { required: true, message: '请输入模块名称', trigger: 'blur,change' }
                    ]
                }
            };
        },
        methods:{
            showWin(data,action){
                this.editData={ ...this.editDataTemplate};
                if(action=="add"){
                  //console.log(data)
                    //获取选择的节点的tmuid 作为连接数据库的tmuid
                    this.editData["dbConnId"]=data.obj["tmuid"];
                    //添加
                } else if(action=="update"){
                    //修改
                    this.editData={...data};
                }

                this.windowAttr.windowVisible=true;
            },
            closeWin(){
                this.windowAttr.windowVisible=false;
            },okEvent(){
                //确定事件
                //console.log(this.editData);
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$emit("okEvent",this.editData)
                        this.closeWin();
                        } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });

            }
        }
    }
</script>

<style scoped>

</style>