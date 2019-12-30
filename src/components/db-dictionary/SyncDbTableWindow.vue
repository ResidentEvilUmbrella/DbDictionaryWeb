<template>
    <div>
        <!-- modal edit -->
        <el-dialog :title="windowAttr.title" :visible.sync="windowAttr.windowVisible" >
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="日期"
                        width="120">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        show-overflow-tooltip>
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
                tableData: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                multipleSelection: [],
                windowAttr:{
                 windowVisible:false,
                    title:"生成数据库字典"
                }
            }
        },
        methods:{
            showWin(data){
                this.editData={ ...this.editDataTemplate};
                this.postRequest("/dict/getSyncTables").then(respData=>{
                    console.log(respData);
                })
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