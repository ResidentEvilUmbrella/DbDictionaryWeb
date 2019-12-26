<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-form size="mini" :inline="true" ref="headerrow">
                    <el-form-item>
                        <template>
                            <el-button type="success" size="mini" @click.native="addColumn"><i
                                    class="fa fa-plus gridIconCls" aria-hidden="true"></i>增加字段
                            </el-button>
                            <el-button type="danger" size="mini" @click="deleteColumn"><i
                                    class="fa fa-minus gridIconCls" aria-hidden="true"></i>删除字段
                            </el-button>
                            <el-button type="warning" v-show="false" size="mini"><i class="fa fa-key gridIconCls"
                                                                                    aria-hidden="true"></i>主键
                            </el-button>
                            <el-button type="warning" size="mini"><i class="fa fa-table gridIconCls"
                                                                     aria-hidden="true"></i>生成数据表
                            </el-button>
                            <el-button type="primary" size="mini" @click="saveData"><i
                                    class="fa fa-floppy-o gridIconCls" aria-hidden="true"></i>保存
                            </el-button>
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
                        :edit-rules="validRules"
                        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true,showIcon:false}">
                    <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                    <vxe-table-column type="seq" width="60"></vxe-table-column>
                    <vxe-table-column field="columnName" title="字段名称"
                                      :edit-render="{name: 'input',}">
                        <template v-slot:edit="{ row }">
                            <el-input v-model.trim="row.columnName"></el-input>
                        </template>
                        <template v-slot="{ row }">
                            {{row.columnName}}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="columnShowName" title="字段中文名称"
                                      :edit-render="{name: 'input'}">
                        <template v-slot:edit="{ row }">
                            <el-input v-model.trim="row.columnShowName"></el-input>
                        </template>
                        <template v-slot="{ row }">
                            {{row.columnShowName}}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="dataType" title="数据类型"
                                      :edit-render="{name: 'select', options: dataTypeList}"></vxe-table-column>
                    <vxe-table-column field="columnLength" title="字段长度"
                                      :edit-render="{name: 'input'}">
                        <template v-slot:edit="{ row }">
                            <el-input v-model.number="row.columnLength"></el-input>
                        </template>
                        <template v-slot="{ row }">
                            {{row.columnLength}}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="columnDecimalPlace" title="小数位数"
                                      :edit-render="{name: 'input'}"></vxe-table-column>
                    <vxe-table-column field="notNull" align="center" title="不允许为NULL" :edit-render="{name: 'input'}">
                        <template v-slot:edit="{ row }">
                            <el-switch v-model="row.notNull" active-value="1"
                                       inactive-value="0"></el-switch>
                            <!--<input type="date" v-model="row.date3" class="custom-input">-->
                        </template>
                        <template v-slot="{ row }">
                            <el-switch v-model="row.notNull" active-value="1"
                                       inactive-value="0"></el-switch>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="primaryKey" align="center" title="主键" :edit-render="{name: 'input'}">
                        <template v-slot:header="{column,columnIndex,$columnIndex,fixed,isHidden}">
                            <i class="fa fa-key" style="margin-right:0px;color: #FFDB23"/>
                            主键
                        </template>
                        <template v-slot:edit="{ row }">
                            <el-switch v-model="row.primaryKey" active-value="1"
                                       inactive-value="0"></el-switch>
                            <!--<input type="date" v-model="row.date3" class="custom-input">-->
                        </template>
                        <template v-slot="{ row }">
                            <el-switch v-model="row.primaryKey" active-value="1"
                                       inactive-value="0"></el-switch>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="remark" title="列说明" :edit-render="{name: 'input'}"></vxe-table-column>
                </vxe-table>
            </el-col>
        </el-row>
        <!--修改表信息窗口-->
        <db-table-window ref="dbTableWin"></db-table-window>
    </div>
</template>

<script>
    import DbTableWindow from "./DbTableWindow";

    export default {
        name: "DbTableColumnGrid",
        components: {DbTableWindow},
        data() {
            return {
                tableData: [],
                validRules: {
                    columnName: [
                        {required: true, message: '请输入字段名称'},
                        {pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,message:"字段名称不能包含空格和特殊字符"}
                    ],
                    columnLength: [
                        {required: true, message: '请输入字段长度'},
                        {pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,message:"中文字段名称不能包含空格和特殊字符"},
                        {validator:function(rule, value, callback, {rules,row,column,rowIndex,columnIndex}){
                                            if(!value){
                                                callback(new Error("请输入字段长度"))
                                            }else{
                                                if(value<=0||value>8000){
                                                    callback(new Error("字段长度为1-8000之间"))
                                                }
                                            }

                                    }
                        }
                    ],
                    dataType: [
                        {required: true, message: '请选择数据类型'}
                    ],
                    columnShowName: [
                        {required: true, message: '请输入中文字段名称'},
                        {pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,message:"中文字段名称不能包含空格和特殊字符"}
                    ]

                },
                recordTemplate: {
                    tmuid: "",
                    columnName: "",
                    columnShowName: "",
                    tableTmuid: "",
                    dataType: "",
                    notNull: "",
                    primaryKey: "",
                    remark: "",
                    used: "",
                    sort: ""
                },
                dataTypeList: [{label: '', value: ''},
                    {label: 'varchar', value: 'varchar'},
                    {label: 'int', value: 'int'},
                    {label: 'decimal', value: 'decimal'},
                    {label: 'float', value: 'float'},
                    {label: 'double', value: 'double'}],
                nodeData: {},
            }
        },
        methods: {
            validEvent() {
            },
            async addColumn() {
                //-1 添加到最后一行
                let record = {
                    ...this.recordTemplate
                }
                let row = -1;
                let {row: newRow} = await this.$refs.xTable.insertAt(record, row)
                await this.$refs.xTable.setActiveCell(newRow, 'columnName')
            },
            deleteColumn() {
                this.$refs.xTable.removeSelecteds()
            },
            async saveData() {
                try {
                    await this.$refs.xTable.validate()
                    this.$XModal.message({status: 'success', message: '校验成功！'})
                } catch (errMap) {
                    this.$XModal.message({status: 'error', message: '校验不通过！'})
                }
                /*if(nodeData.dataTmuid&&nodeData.type=="table"){
                    //修改操作
                }else{
                    //增加操作,需要弹出窗口
                    this.showTableWin(this.nodeData);
                }*/
                console.log("执行我了！！！")
            },
            showTableWin(data) {
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

    .gridIconCls {
        margin-right: 5px;
    }
</style>