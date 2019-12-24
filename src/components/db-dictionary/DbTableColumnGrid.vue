<template>
    <div>
            <el-row >
                <el-col :span="24">
                    <el-form size="mini" :inline="true" ref="headerrow">
                        <el-form-item>
                            <template>
                                <el-button type="success"  size="mini"  @click.native="addColumn" ><i class="fa fa-plus gridIconCls" aria-hidden="true" ></i>增加字段</el-button>
                                <el-button type="danger"  size="mini" @click="deleteColumn"  ><i class="fa fa-minus gridIconCls" aria-hidden="true" ></i>删除字段</el-button>
                                <el-button type="warning" v-show="false"  size="mini"><i class="fa fa-key gridIconCls" aria-hidden="true" ></i>主键</el-button>
                                <el-button type="warning"  size="mini"  ><i class="fa fa-table gridIconCls" aria-hidden="true" ></i>生成数据表</el-button>
                                <el-button type="primary"  size="mini" @click="saveData"><i class="fa fa-floppy-o gridIconCls" aria-hidden="true" ></i>保存</el-button>
                            </template>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <vxe-table
                            border
                            show-overflow
                            ref="xTable"
                            class="my_table_status"
                            :data="tableData"
                            :edit-config="{trigger: 'click', mode: 'cell', showStatus: true,showIcon:false}">
                        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                        <vxe-table-column type="seq" width="60" ></vxe-table-column>
                        <vxe-table-column field="columnName" title="字段名称" :edit-render="{name: 'input',icon:'fa fa-edit',showIcon:true}"></vxe-table-column>
                        <vxe-table-column field="columnShowName" title="字段中文名称" :edit-render="{name: 'input'}"></vxe-table-column>
                        <vxe-table-column field="dataType" title="数据类型" :edit-render="{name: 'select', options: dataTypeList}"></vxe-table-column>
                        <vxe-table-column field="columnLength" title="字段长度" :edit-render="{name: 'input'}"></vxe-table-column>
                        <vxe-table-column field="columnDecimalPlace" title="小数点" :edit-render="{name: 'input'}"></vxe-table-column>
                        <vxe-table-column field="notNull" align="center"  title="不允许为NULL" :edit-render="{name: 'input'}">
                            <template v-slot:edit="{ row }">
                                <el-switch v-model="row.notNull"  active-value="1"
                                           inactive-value="0"></el-switch>
                                <!--<input type="date" v-model="row.date3" class="custom-input">-->
                            </template>
                            <template v-slot="{ row }">
                                <el-switch v-model="row.notNull"  active-value="1"
                                           inactive-value="0"></el-switch>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column field="primaryKey"  align="center" title="主键" :edit-render="{name: 'input'}">
                            <template v-slot:header="{column,columnIndex,$columnIndex,fixed,isHidden}">
                                <i class="fa fa-key"  style="margin-right:0px;color: #FFDB23"/>
                                主键
                            </template>
                            <template v-slot:edit="{ row }">
                                <el-switch v-model="row.primaryKey"  active-value="1"
                                           inactive-value="0"></el-switch>
                                <!--<input type="date" v-model="row.date3" class="custom-input">-->
                            </template>
                            <template v-slot="{ row }">
                                <el-switch v-model="row.primaryKey"  active-value="1"
                                           inactive-value="0"></el-switch>
                             </template>
                        </vxe-table-column>
                        <vxe-table-column field="remark" title="列说明" :edit-render="{name: 'input'}"></vxe-table-column>
                    </vxe-table>
                </el-col>
            </el-row>
        <!--修改表信息窗口-->
        <db-table-window  ref="dbTableWin"></db-table-window>
    </div>
</template>

<script>
    import DbTableWindow from "./DbTableWindow";

    export default {
        name: "DbTableColumnGrid",
        components:{DbTableWindow},
        data() {
            return {
                tableData: [/*{
                    columnName: '2016-05-02',
                    columnShowName: '王小虎',
                    dataType: '上海市普陀区金沙江路 1518 弄',
                    notNull:"",
                    primaryKey:"",
                    remark:""
                }, {
                    columnName: '2016-05-02',
                    columnShowName: '王小虎',
                    dataType: '上海市普陀区金沙江路 1518 弄',
                    notNull:"",
                    primaryKey:"",
                    remark:""
                }, {
                    columnName: '2016-05-02',
                    columnShowName: '王小虎',
                    dataType: '上海市普陀区金沙江路 1518 弄',
                    notNull:"",
                    primaryKey:"",
                    remark:""
                }, {
                    columnName: '2016-05-02',
                    columnShowName: '王小虎',
                    dataType: '上海市普陀区金沙江路 1518 弄',
                    notNull:"",
                    primaryKey:"",
                    remark:""
                }*/],
                recordTemplate:{
                    tmuid:"",
                    columnName:"测试呀",
                    columnShowName:"",
                    tableTmuid:"",
                    dataType:"",
                    notNull:"",
                    primaryKey:"",
                    remark:"",
                    used:"",
                    sort:""
                },
                dataTypeList:[{ label: '', value: '' },
                    { label: 'varchar', value: 'varchar' },
                    { label: 'int', value: 'int' },
                    { label: 'decimal', value: 'decimal' },
                    { label: 'float', value: 'float' },
                    { label: 'double', value: 'double' }],
                nodeData:{},
            }
        },
        methods:{
            async   addColumn(){
                //-1 添加到最后一行
                let record = {
                    ...this.recordTemplate
                }
                let row=-1;
                let { row: newRow } = await this.$refs.xTable.insertAt(record, row)
                await this.$refs.xTable.setActiveCell(newRow, 'sex')
            },
            deleteColumn(){
                this.$refs.xTable.removeSelecteds()
            },
            saveData(){
                if(nodeData.dataTmuid&&nodeData.type=="table"){
                    //修改操作
                }else{
                    //增加操作,需要弹出窗口
                    this.showTableWin(this.nodeData);
                }
                console.log("执行我了！！！")
            },
            showTableWin(data){
                this.$refs.dbTableWin.showWin(data);
            }
        }
    }
</script>

<style scoped>
.dbDictionaryGridMain {
    margin: 0px;
    padding: 0px;
}
 .dbDictionaryGridHead {
     margin: 0px;
     padding: 0px;
 }
    .gridIconCls{
        margin-right:5px;
    }
</style>