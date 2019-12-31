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
            showWin(data){
                this.nodeData=data;
                this.postRequest("/dict/getSyncTables").then(respData=>{
                    console.log(respData);
                    this.tableData=respData;
                })
                this.windowAttr.windowVisible=true;
            },
            closeWin(){
                this.windowAttr.windowVisible=false;
            },okEvent(){
                //确定事件
                if(this.multipleSelection.length==0){
                    this.$message.warning({message: '请勾选需要同步的表！！'});
                    return false;
                }
                this.$confirm('确定要生成选中表的数据字典吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data={moduleVo:this.nodeData["obj"],tableVoList:this.multipleSelection};
                    this.postRequest("/dict/syncDictByTables",data).then(respData=>{
                        this.$emit("okEvent",this.nodeData);
                    })
                    /*this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });*/
                }).catch(() => {

                });
            },
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