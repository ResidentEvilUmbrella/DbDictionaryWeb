<template>
    <div>
        <!-- modal edit -->
    <el-dialog :title="windowAttr.title" :visible.sync="windowAttr.windowVisible" width='30%'>
        <el-form :model="editData" :rules="rules"  ref="form" label-width="auto">
            <el-form-item label="所属模块" v-show="action=='add'">
                <!--<el-select v-model="editData.moduleCode" placeholder="请选择">
                    <el-option
                            v-for="item in moduleList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>-->
                <el-input
                        v-model="editData.moduleName"
                        :disabled="true">
                </el-input>

            </el-form-item>
            <el-form-item label="表名" prop="tableName">
                <el-input
                        autocomplete="off"
                        placeholder="请输入表名"
                        v-model.trim="editData.tableName">
                </el-input>
            </el-form-item>
            <el-form-item label="表名（中文含义）" prop="tableShowName">
                <el-input
                        autocomplete="off"
                        placeholder="请输入中文表名"
                        v-model.trim="editData.tableShowName">
                </el-input>
            </el-form-item>

            <el-form-item label="备注">
                <el-input
                        :row="10"
                        type="textarea"
                        autocomplete="off"
                        placeholder=""
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
        name: "DbTableWindow",
        props:{
            //editData:Object
        },
        data(){
            return{
                rules: {
                    tableName: [
                        { required: true, message: '请输入表名', trigger: 'blur,change' }
                    ],
                    tableShowName: [
                        { required: true, message: '请输入表名中文含义', trigger: 'blur,change' }
                    ]
                },
                editObj:{
                    name
                },
                windowAttr:{
                    windowVisible:false,
                    title:""
                },
                editData:{
                    tableName:"",
                    tableShowName:"",
                    moduleCode:"",
                    moduleId:"",
                    dbConnId:"",
                    remark:"",
                    used:true,
                    sort:"",
                    tmuid:""
                },
                editDataTemplate:{
                    tableName:"",
                    tableShowName:"",
                    moduleCode:"",
                    moduleId:"",
                    dbConnId:"",
                    remark:"",
                    used:true,
                    sort:"",
                    tmuid:""
                },
                moduleList:[],
                action:"",
            }
        },
        methods:{
            showWin(data,action){
                this.editData={ ...this.editDataTemplate};
                this.action=action;
                if(action=="add"){
                    console.log(data)
                    //获取选择的节点的tmuid 作为连接数据库的tmuid
                    this.windowAttr.title="添加表"
                    this.editData["dbConnId"]=data.obj["dbConnId"];
                    this.editData["moduleCode"]=data.obj["moduleCode"];
                    this.editData["moduleId"]=data.obj["tmuid"];
                    this.editData["moduleName"]=data.obj["moduleName"];
                    //添加
                } else if(action=="update"){
                    //修改
                    this.windowAttr.title="修改表"
                    this.editData={...data["obj"]};
                }
                this.windowAttr.windowVisible=true;
            },
            closeWin(){
                this.windowAttr.windowVisible=false;
            },okEvent(){
                //确定事件
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        if (this.editData.tmuid != "") {
                            this.postRequest("/dict/updTable", this.editData).then(respData => {
                                this.$emit("okEvent",this.editData);
                                this.closeWin();
                            })
                        } else {
                            this.postRequest("/dict/addTable", this.editData).then(respData => {
                                this.$emit("okEvent",respData["body"]);
                                this.closeWin();
                            })
                        }
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });


            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>