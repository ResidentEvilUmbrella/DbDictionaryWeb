<template>
    <div>
        <!-- modal edit -->
        <el-dialog :title="windowAttr.title" :visible.sync="windowAttr.windowVisible" width='30%'>
            <el-form :model="editObj" label-width="auto">
                <el-form-item label="模块名称">
                    <el-input
                            autocomplete="off"
                            placeholder="请输入模块名称"
                            v-model="editData.tableName">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                            :row="10"
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
        name: "ModuleWindow",
        props:{
            //editData:Object
        },
        data(){
            return{
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
                    dbConnTmuid:"",
                    remark:"",
                    used:""
                },

            }
        },
        methods:{
            showWin(data){
                this.editData=data;
                this.windowAttr.windowVisible=true;
            },
            closeWin(){
                this.windowAttr.windowVisible=false;
            },okEvent(){
                //确定事件
                console.log(this.editData);
                this.closeWin();
            }
        }
    }
</script>

<style scoped>

</style>