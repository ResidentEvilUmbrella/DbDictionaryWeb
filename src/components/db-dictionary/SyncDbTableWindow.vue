<template>
    <div>
        <!-- modal edit -->
        <el-dialog :title="windowAttr.title" :visible.sync="windowAttr.windowVisible" width="40%">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width:90%;margin: 0px auto;"
                    height="460"
                    @selection-change="handleSelectionChange"
                    border
                    stripe>

                <el-table-column
                        type="selection"
                        width="55"
                        align="center"
                >
                </el-table-column>
                <el-table-column
                        prop="tableShowName"
                        label="表名"
                        align="center">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeWin">取 消</el-button>
                <el-button type="primary" @click="okEvent">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SyncDbTableWindow",
        props:{
            //editData:Object
        },
        data(){
            return {
                tableData: [],
                multipleSelection: [],
                nodeData:null,
                windowAttr:{
                 windowVisible:false,
                    title:"生成数据库字典"
                }
            }
        },
        methods:{
            //显示窗口
            showWin(data){
                this.nodeData=data;
                //获取数据库中的表
                this.postRequest("/dict/getSyncTables").then(respData=>{
                    this.tableData=respData;
                })
                this.windowAttr.windowVisible=true;
            },
            //关闭窗口
            closeWin(){
                this.windowAttr.windowVisible=false;
            },okEvent(){
                //导入表确定事件

                //没有勾选导入表
                if(this.multipleSelection.length==0){
                    this.$message.warning({message: '请勾选需要同步的表！！'});
                    return false;
                }

                this.$confirm('确定要生成选中表的数据字典吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //生成导入的表
                    let data={moduleVo:this.nodeData["obj"],tableVoList:this.multipleSelection};
                    this.postRequest("/dict/syncDictByTables",data).then(respData=>{
                        //导入表后生成 关闭窗口 触发确定事件
                       this.closeWin();
                        let nodeData=this.nodeData;
                        this.$emit("okEvent",{moduleNodeData:nodeData,selectTableData:this.multipleSelection});
                    })
                    /*this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });*/
                }).catch(() => {

                });
            },
            //勾选改变方法
             handleSelectionChange(val) {
            this.multipleSelection = val;
        }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>