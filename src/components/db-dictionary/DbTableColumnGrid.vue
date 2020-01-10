<template>
    <div >
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
                            <el-button type="primary" size="mini" @click="saveDataEvent"><i
                                    class="fa fa-floppy-o gridIconCls" aria-hidden="true"></i>保存
                            </el-button>

                                <el-tooltip placement="right">
                                    <div slot="content" v-html="syncTableToolTip"></div>
                                    <el-button type="warning" size="mini" @click="generaterTable" v-show="nodeType=='table'">
                                    <i class="fa fa-table gridIconCls"
                                       aria-hidden="true"></i>
                                         同步数据表
                                    </el-button>
                                </el-tooltip>


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
                        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true,showIcon:false, activeMethod: activeCellMethod}">
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
                    <vxe-table-column field="dataType" title="数据类型"  :edit-render="{name: 'select',options:dataTypeList,events:{change:dataTypeChange}}">
                    </vxe-table-column>

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
                                      :edit-render="{name: 'input'}">
                        <template v-slot:edit="{ row }">
                            <el-input v-model.number="row.columnDecimalPlace"></el-input>
                        </template>
                        <template v-slot="{ row }">
                            {{row.columnDecimalPlace}}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="notNull" align="center" title="不允许为NULL" :edit-render="{name: 'input'}">
                        <template v-slot:edit="{ row }">
                            <el-switch v-model="row.notNull" ></el-switch>
                            <!--<input type="date" v-model="row.date3" class="custom-input">-->
                        </template>
                        <template v-slot="{ row }">
                            <el-switch v-model="row.notNull" ></el-switch>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="primaryKey" align="center" title="主键"  :edit-render="{name: 'ElSwitch', type: 'visible',events:{change:primaryKeyChange} }"  >
                        <template v-slot:header="{column,columnIndex,$columnIndex,fixed,isHidden}">
                            <i class="fa fa-key" style="margin-right:0px;color: #FFDB23"/>
                            主键
                        </template>
                        <template v-slot="{ row }">
                            <el-switch v-model="row.primaryKey" ></el-switch>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="remark" title="列说明" :edit-render="{name: 'input'}"></vxe-table-column>
                </vxe-table>
            </el-col>
        </el-row>
        <!--修改表信息窗口-->
        <db-table-window ref="dbTableWin" @okEvent="dbTableWindowOkEvent"></db-table-window>
    </div>
</template>

<script>
    import DbTableWindow from "./DbTableWindow";

    export default {
        name: "DbTableColumnGrid",
        components: {DbTableWindow},
        props:["nodeData","panelId","refColumnTable"],
        data() {
            return {
                tableData: [],
                nodeType:"",
                syncTableToolTip:"根据字典设置自动更新数据库表</br>(支持创建表、增/删/改字段)",
                //表格验证规则
                validRules: {
                    columnName: [
                        {
                            validator:(rule, val, callback, {rules,row,column,rowIndex,columnIndex})=>{

                                let insertRecords = this.$refs.xTable.getInsertRecords();
                                let updateRecords = this.$refs.xTable.getUpdateRecords();
                                let records = this.tableData;
                                let columnNameMap={};
                                //按照列名分组
                                if(insertRecords.length>0){
                                    insertRecords.forEach((value, index, array)=>{
                                        if(!columnNameMap[value["columnName"]]){
                                            columnNameMap[value["columnName"]]=[];
                                        }
                                        columnNameMap[value["columnName"]].push({tmuid:"1",value});
                                    });
                                }
                                if(records.length>0){
                                    records.forEach((value, index, array)=>{
                                        if(!columnNameMap[value["columnName"]]){
                                            columnNameMap[value["columnName"]]=[];
                                        }
                                        columnNameMap[value["columnName"]].push(value);
                                    });
                                }

                                let columnNameArr=columnNameMap[val];
                                if((val+"").length==0){
                                    return callback(new Error("请输入字段名称"))
                                }else if(columnNameArr&&columnNameArr.length>1){
                                    //列名重复给出提示
                                    return   callback(new Error("字段名称不能重复"));
                                }
                                return  callback();

                            }
                        }
                    ],
                    columnLength: [
                        {
                            validator:(rule, value, callback, {rules,row,column,rowIndex,columnIndex})=>{
                               let dataType={};
                             let  dataTypeList=this.dataTypeList;
                                dataTypeList.forEach(item=>{
                                    if(row.dataType==item.value){
                                        dataType=item;
                                    }
                                })
                                    let {checkLength=false}=dataType;
                                    if(!checkLength){
                                        return  callback();
                                    }else if((value+"").length==0){
                                               return callback(new Error("请输入字段长度"))
                                    }else{
                                        if(value<=0||value>8000){
                                          return   callback(new Error("字段长度只能输入1-8000之间的整数"))
                                        }
                                    }
                                            return  callback();

                                    }
                        }
                    ],
                    dataType: [
                        {required: true, message: '请选择数据类型'}
                    ],
                    columnShowName: [
                        {required: true, message: '请输入中文字段名称'},
                        {pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,message:"中文字段名称不能包含空格和特殊字符"}
                    ],
                    columnDecimalPlace: [
                        {validator:function(rule, value, callback, {rules,row,column,rowIndex,columnIndex}){
                                if(value<0||value>8){
                                  return   callback(new Error("小数位数只能输入1-8之间的整数"))
                                }
                                return  callback();
                            }
                        }
                    ],
                    notNull: [
                        {validator:function(rule, value, callback, {rules,row,column,rowIndex,columnIndex}){
                            //主键列不能空
                            if(row.primaryKey&&!row.notNull){
                                  return   callback(new Error("主键列字段不能为空"))
                                }
                                return  callback();
                            }
                        }
                    ]

                },
                recordTemplate: {
                    tmuid: "",
                    columnName: "",
                    columnShowName: "",
                    tableTmuid: "",
                    dataType: "",
                    notNull:false,
                    primaryKey:false,
                    remark: "",
                    used: true,
                    sort: 0,
                    columnDecimalPlace:"",
                    columnLength:"",
                },
                //数据类型数据
                dataTypeList: [
                    {label:"",value:""},
                    {label: 'varchar', value: 'varchar',columnLength:255,columnDecimalPlace:"",checkLength:true},
                    {label: 'int', value: 'int',columnLength:"",columnDecimalPlace:""},
                    {label: 'decimal', value: 'decimal',columnLength:18,columnDecimalPlace:4,checkLength:true},
                    {label: 'float', value: 'float',columnLength:"",columnDecimalPlace:""},
                    {label:"text",value:"text"},
                    {label:"datetime",value:"datetime"}]
            }
        },
        methods: {
            //添加列
            async addColumn() {
                //-1 添加到最后一行
                let record = {
                    ...this.recordTemplate
                }
                let row = -1;
                let {row: newRow} = await this.$refs.xTable.insertAt(record, row)
                await this.$refs.xTable.setActiveCell(newRow, 'columnName')
            },
            //删除列
            deleteColumn() {
                let removeRecords = this.$refs.xTable.getCheckboxRecords();
                let primaryKeyCol=null;
                //查找主键列
                removeRecords.forEach((value, index, array)=>{
                    if(value["primaryKey"]){
                        primaryKeyCol=value;
                        return false;
                    }
                });
                //存在主键列给出提示
                if(primaryKeyCol){
                    this.$message.error({message: '不能删除主键列！！'});
                    return false;
                }else if(removeRecords.length>0){
                    this.$refs.xTable.removeSelecteds()
                }else{
                    this.$message.warning({message: '请选择需要删除的数据!!'});
                }

            },
            //保存数据方法
            async saveDataEvent() {
                let insertRecords = this.$refs.xTable.getInsertRecords();
                let removeRecords = this.$refs.xTable.getRemoveRecords();
                let updateRecords = this.$refs.xTable.getUpdateRecords();
                if(insertRecords.length==0&&removeRecords.length==0&&updateRecords==0){
                    this.$message.warning({message: '没有需要保存的数据'});
                    return ;
                }
                try {
                    await this.$refs.xTable.validate()
                    let {type}=this.nodeData;
                    if(type=="module"){
                        //添加
                        //打开添加表格窗口
                        this.showTableWin(this.nodeData,"add");
                    }else if(type=="table"){
                        //修改
                        //直接保存列数据到数据库
                        this.saveDataToDb(this.nodeData["obj"]);
                    }
                } catch (errMap) {
                    this.$XModal.message({status: 'error', message: '字段校验不通过！'})
                }
            },
            //保存数据到数据库
            saveDataToDb(tableData){

                let {tmuid:tableTmuid}=tableData;
                let insertRecords = this.$refs.xTable.getInsertRecords();
                let removeRecords = this.$refs.xTable.getRemoveRecords();
                let updateRecords = this.$refs.xTable.getUpdateRecords();
                let saveRecords=[];
                if(insertRecords.length>0){
                    insertRecords.forEach((value, index, array)=>{
                        //增加的数据
                        value["flag"]=1;
                        value["tableId"]=tableTmuid;
                        saveRecords.push(value);
                    });
                }

                if(updateRecords.length>0){
                    updateRecords.forEach((value, index, array)=>{
                        //修改的数据
                        value["flag"]=0;
                        value["tableId"]=tableTmuid;
                        //console.log(value);
                        saveRecords.push(value);
                    });
                    /*this.postRequest("/dict/updCol",insertRecords).then(respData=>{
                    })*/
                }

                if(removeRecords.length>0){
                    removeRecords.forEach((value, index, array)=>{
                        //删除的数据
                        value["flag"]=-1;
                        value["tableId"]=tableTmuid;
                        saveRecords.push(value);
                    });

                }
                //保存方法 保存后重新加载数据
                this.postRequest("/dict/saveCol",saveRecords).then(respData=>{
                    this.loadData();
                })
            },
            //加载数据
            loadData(){
                let {type,nodeId}=this.nodeData;
                if(type=="table"){
                    this.postKeyValueRequest("/dict/getCol",{tableId:nodeId}).then(data=>{
                        this.tableData=data;
                    })
                }
            },
            showTableWin(data,action) {
                this.$refs.dbTableWin.showWin(data,action);
            },
            //新增表确定按钮事件
            dbTableWindowOkEvent(data){
                //增加列操作
                this.saveDataToDb(data);
                this.$emit("dbTableWindowOkEvent",data,this.panelId);
            },
            generaterTable(){
                //正向生成表
                if(this.nodeData["type"]=="table"){
                    this.$confirm('确定要在数据库中同步生成表【'+this.nodeData.obj.tableShowName+'】的结构吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data={tableVo:this.nodeData["obj"],colVoList:this.tableData};
                        this.postRequest("/dict/syncDb",data).then(respData=>{
                        })
                        /*this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });*/
                    }).catch(() => {

                    });
                }

            },
            //数据类型改变事件
            dataTypeChange({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex},event){
             //类型改变时 联动 字段长度和小数位数列
                this.dataTypeList.forEach(item=>{
                    if(event.target.value==item.value){
                        let {columnLength='',columnDecimalPlace=''}=item;
                        row.columnLength=columnLength;
                        row.columnDecimalPlace=columnDecimalPlace;
                    }
                })
            },
            //主键改变事件
            primaryKeyChange( {row,rowIndex,column,columnIndex},newValue){
                //主键选中 勾选非空列
                if(newValue){
                    row.notNull=newValue;
                }
            },
            //判断表格是否可以编辑方法
            activeCellMethod ({row, rowIndex, column, columnIndex}) {
                //console.log(row,column)
                if(column.property=="columnDecimalPlace"||column.property=="columnLength"){
                    let dataTypeObj=null;
                    this.dataTypeList.forEach(item=>{
                        if(row.dataType==item.value){
                            dataTypeObj=item;
                            return false;
                        }
                    })
                    //varchar类型不能编辑小数位数
                    if(row.dataType=="varchar"&&column.property=="columnDecimalPlace"){
                        return false;
                    }
                    //初始字段长度为0或空不能编辑
                    let {columnLength=0}=dataTypeObj;
                    if(columnLength==0){
                        return false;
                    }else{
                        return true;
                    }

                }

                return true
            }
        },mounted() {
            //页面渲染成功 加载数据
            this.loadData();
            this.nodeType=this.nodeData.type;
        },
        watch:{
            nodeData(newValue, oldValue){
               //监听nodeData 变量 实时获取选中节点的类型
                this.nodeType=newValue.type;
            }
        }
    }
</script>

<style scoped>
    .gridIconCls {
        margin-right: 5px;
    }
</style>