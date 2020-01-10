<template>
    <div>
        <el-scrollbar style="height: 100%;width: 98%">
            <div class="asideButton">
                <el-row>
                    <el-col>
                        <!--搜索表输入框-->
                        <el-autocomplete
                                v-model="filterTableText"
                                prefix-icon="el-icon-search"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="搜索表"
                                size="medium"
                                class="el-input"
                                @select="handleSelect"
                        ></el-autocomplete>
                    </el-col>
                </el-row>
            </div>
            <!--树形-->
        <el-tree
                :props="defaultProps"
                node-key="nodeId"
                ref="dbTableTree"
                @node-contextmenu='rightClick'
                @node-click="nodeClick"
                @node-drop="handleDrop"
                draggable
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                :load="loadNode"
                lazy
                :highlight-current="true"
                style="padding-left: 2%;padding-right:0;margin-right:2%;"
                :default-expanded-keys="expandNodes">
                <span class="slot-t-node" slot-scope="{ node, data }">
                 <i class="fa" :class="iconClsObj[data.type]" :style="{'color' : node.expanded||data.type=='table' ? iconStyleObj[data.type] :'#9c9c9c'}" />
                    <el-tooltip placement="right">
                      <div slot="content" v-html="setToolTip(data)"></div>
                         <span>{{ node.label }}</span>
                    </el-tooltip>
            </span>
        </el-tree>
        </el-scrollbar>
        <!--鼠标右键点击的菜单-->
        <div v-show="menuVisible">
            <el-menu
                    id = "rightClickMenu"
                    class="el-menu-vertical"
                    active-text-color="#fff"
                    @select="handleRightSelect"
                    text-color="#fff">
                <!--menuItemVisible['db'] 选中 数据库节点时 显示的菜单-->
                <!--menuItemVisible['module'] 选中 模块节点时 显示的菜单-->
                <!--menuItemVisible['table'] 选中 表节点时 显示的菜单-->
                <el-menu-item index="6" v-show="menuItemVisible['db']" class="menuItem">
                    <span slot="title">添加模块</span>
                </el-menu-item>
                <el-menu-item index="1" v-show="menuItemVisible['module']" class="menuItem">
                    <span slot="title">添加表</span>
                </el-menu-item>
                <el-tooltip placement="right">
                    <div slot="content" v-html="importTableToolTip"></div>
                    <el-menu-item index="9" v-show="menuItemVisible['module']" class="menuItem">
                        <span slot="title">导入表</span>
                    </el-menu-item>
                </el-tooltip>

                <el-menu-item index="2" v-show="menuItemVisible['module']" class="menuItem">
                    <span slot="title">刷新</span>
                </el-menu-item>

                <el-menu-item index="7" v-show="menuItemVisible['module']" class="menuItem">
                    <span slot="title">修改模块</span>
                </el-menu-item>
                <el-menu-item index="8" v-show="menuItemVisible['module']" class="menuItem">
                    <span slot="title">删除模块</span>
                </el-menu-item>
                <el-menu-item index="3" v-show="menuItemVisible['table']" class="menuItem">
                    <span slot="title">修改字段</span>
                </el-menu-item>
                <el-menu-item index="4" v-show="menuItemVisible['table']" class="menuItem">
                    <span slot="title">修改表信息</span>
                </el-menu-item>
                <el-menu-item index="5"  v-show="menuItemVisible['table']" class="menuItem">
                    <span slot="title">删除表</span>
                </el-menu-item>
            </el-menu>
        </div>
        <!--修改表信息窗口-->
        <db-table-window  ref="dbTableWin" @okEvent="tableWinOkEvent"></db-table-window>
        <!--增加修改模块窗口-->
        <module-window ref="moduleWindow" @okEvent="moduleWindowOkEvent"></module-window>
        <!--导入表窗口-->
        <sync-db-table-window ref="syncDbTableWindow"  @okEvent="syncDbTableWindowOkEvent"></sync-db-table-window>
    </div>
</template>

<script>
    import ModuleWindow from "./ModuleWindow";
    import DbTableWindow from "./DbTableWindow";
    import SyncDbTableWindow from "./SyncDbTableWindow";
    import  {Message} from 'element-ui'
    export default {
        name: "DbTableTree",
        components:{ModuleWindow, DbTableWindow,SyncDbTableWindow},
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    isLeaf:"isLeaf"
                },
                iconClsObj:{
                    "db":"fa-database",
                    "module":"fa-tags",
                    "table":"fa-table"
                },
                iconStyleObj:{
                    "db":"#41AB47",
                    "module":"#ffce15",
                    "table":"#008af0",
                },
                menuVisible:false,
                clickNodeData:{},
                clickNode:{},
                menuItemVisible:{
                    "module":false,
                    "table":false,
                    "db":false
                },
                filterTableText:"",
                expandNodes:[],
                currentKey:"",
                importTableToolTip:"通过数据库中的表解析生成数据库字典数据到当前模块</br>(如已存在相同字典数据将会覆盖)"
            }
        },
        methods: {
            handleRightSelect(key) {
                //菜单点击 事件
                if (key == 1) {
                    //添加表
                    this.tableAdd(this.clickNodeData);
                    this.menuVisible = false;
                } else if (key == 2) {
                    //刷新子节点
                    this.refreshNode(this.clickNodeData["nodeId"],"module");
                    this.menuVisible = false;
                    Message.success({message:"刷新节点成功！！！"});
                } else if (key == 3) {
                    //修改字段
                    this.columnUpdate(this.clickNodeData);
                    this.menuVisible = false;
                } else if(key == 4){
                    //修改表信息
                    this.tableUpdate( this.clickNodeData);
                    this.menuVisible = false;
                }else if(key == 5){
                    //删除表
                    this.tableDelete(this.clickNodeData);
                    this.menuVisible = false;
                }else if(key == 6){
                    //添加模块
                    this.showModuleWin(this.clickNodeData,"add");
                    this.menuVisible = false;
                }else if(key == 7){
                    //修改模块
                    this.moduleUpdate(this.clickNodeData);
                    this.menuVisible = false;
                }else if(key == 8){
                    //删除模块
                    this.moduleDelete(this.clickNodeData);
                    this.menuVisible = false;
                }else if(key==9){
                    //导入表
                    this.showSyncDbTableWindow(this.clickNodeData);
                    this.menuVisible = false;
                }
            },
            rightClick(event, object, value, element) {
                //右键打开菜单方法
                this.clickNodeData=object;
                this.clickNode=element;
                if (this.objectID !== object.id) {
                    this.objectID = object.id;
                    this.menuVisible = true;
                    this.DATA = object;
                    this.NODE = value;
                } else {
                    this.menuVisible = !this.menuVisible;
                }
                document.addEventListener('click',(e)=>{
                    this.menuVisible = false;
                })
                let menu = document.querySelector("#rightClickMenu");
                /* 菜单定位基于鼠标点击位置 */
                menu.style.left = event.clientX +0 + "px";
                menu.style.top = event.clientY -0+ "px";
                menu.style.position = "absolute"; // 为新创建的DIV指定绝对定位
                menu.style.width = 160 + "px";
                /*console.log("右键被点击的左侧:",menu.style.left);
                  console.log("右键被点击的顶部:",menu.style.top);*/
                //        console.log("右键被点击的event:",event);
                // console.log("右键被点击的object:", object);
                // console.log("右键被点击的value:", value);
                // console.log("右键被点击的element:", element);
            },
            //点击树形节点方法
            nodeClick(data,node){
                this.menuVisible = false;
                if(data.type=="table"){
                    //点击表节点修改列
                    this.columnUpdate(data);
                }

            },
            tableAdd(data){
                //新增表 让父组件处理逻辑
                this.$emit('tableAdd',data);
            },
            tableDelete(data){
                //删除表数据
                this.$confirm('此操作将删除表【'+data.obj.tableShowName+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/dict/delTable",data["obj"]).then(respData=>{
                        //刷新模块数据
                        this.refreshNode(data["obj"]["moduleId"],"module")
                        //触发删除表事件
                        this.$emit('tableDeleteEvent',data["obj"]);
                    })
                }).catch(() => {

                });
            },
            tableUpdate(data){
                //修改表
                //弹出表窗口
                this.showTableWin(data,"update");
            },
            columnUpdate(data){
                //修改字段 父组件处理逻辑
                this.$emit('columnUpdate',data);
            },
            showTableWin(data,action){
                //显示表方法
                this.$refs.dbTableWin.showWin(data,action);
            },
            showModuleWin(data,action){
                //显示模块窗口
                this.$refs.moduleWindow.showWin(data,action);
            },
            tableWinOkEvent(data){
                //表窗口保存成功方法 刷新节点数据
                this.refreshNode(data["moduleId"],"module");
                this.$emit("dbTableWindowOkEvent",data,data["tmuid"]);
            },
            moduleWindowOkEvent(data){
                //模块窗口确定按钮回调方法
                let {tmuid,}=data;
                if(tmuid!=""){
                   //修改操作模块
                    this.postRequest("/dict/updModule",data).then(respData=>{
                        //成功刷新树形数据
                        this.refreshNode(data["dbConnId"],"db")
                    })
                }else{
                    //增加的操作
                    this.postRequest("/dict/addModule",data).then(respData=>{
                        //成功刷新树形数据
                        this.refreshNode(data["dbConnId"],"db")
                    })
                }
            },
            moduleUpdate(data){

                let {type,obj:moduleData}=data;
                if(type=="module"){
                    this.showModuleWin(moduleData,"update");
                }else{
                    Message.error({message:"请选择需要修改模块！！！"});
                }
            },
          async  moduleDelete(data){
                //删除模块
                let {nodeId,type}=data;
                //删除前判断表是否存在
                await this.getNodeByPid(nodeId,type).then(data=>{
                    if(data.length>0){
                        Message.error({message:"该模块下存在表数据不能删除！！！"});
                        return data.length;
                    }
                }).then(dataLength=>{
                    //不存在，删除操作
                    if(!dataLength||dataLength==0){
                        this.$confirm('此操作将删除模块【'+data.obj.moduleName+'】, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.postRequest("/dict/delModule",data["obj"]).then(respData=>{
                                //刷新数据库节点
                                this.refreshNode(data["obj"]["dbConnId"],"db")
                            })
                        }).catch(() => {

                        });
                    }

                })

            },
            loadNode(node, resolve) {
                //加载树形节点
                let {data}=node;
                if(!data){
                    data={};
                }
                //默认加载 根节点
                let {nodeId="root",type="root"}=data;
                this.postRequest("/dict/getTree",{nodeId:nodeId,type:type}).then(data=>{
                    resolve(data);
                    //加载后定位节点操作
                    data.forEach((value, index, array)=>{
                        //console.log(this.currentKey===value["nodeId"])
                        if(this.currentKey===value["nodeId"]){
                            this.$refs.dbTableTree.setCurrentKey(this.currentKey);
                            this.currentKey="";

                        }
                    });
                });
            },
            getNodeByPid(pid,type){
                let paramData={nodeId:pid,type:type};
               return  this.postRequest("/dict/getTree",paramData);
            },
            refreshNode(pid,type){
                //刷新指定子节点
                this.getNodeByPid(pid,type).then(data=>{

                    this.$refs.dbTableTree.updateKeyChildren(pid,data);
                    this.$forceUpdate();
                });
            },
            //打卡导入表窗口
            showSyncDbTableWindow(data){
                this.$refs.syncDbTableWindow.showWin(data);
            },
             syncDbTableWindowOkEvent({moduleNodeData,selectTableData}){
                //导入表后确定方法
                 //获取数据库节点
                let dbNode=this.$refs.dbTableTree.getNode(moduleNodeData.obj["dbConnId"]);

                    if(dbNode){
                     //遍历数据库的子节点（模块节点） 刷新该节点数据
                        let {childNodes}=dbNode;
                        childNodes.forEach((value, index, array)=>{
                            this.refreshNode(value.data.nodeId,value.data.type)
                        });
                    }
                 this.$emit("syncDbTableWindowOkEvent",{moduleNodeData,selectTableData})
            },
            //设置节点悬浮提示
            setToolTip(node){
                let {type}=node;
                let result="";
                if(type=="db"){
                    result=`数据库名称:${node.obj.dbName}`;
                }else if(type=="module"){
                    result=`模块名称:${node.obj.moduleName}</br>模块备注:${!node.obj.remark?"":node.obj.remark}`;
                }else if(type=="table"){
                    result=`表名:${node.obj.tableName}</br>备注:${!node.obj.remark?"":node.obj.remark}`;
                }
                return result;
            },
            //搜索表
            querySearchAsync(queryString, cb) {

                this.postKeyValueRequest("/dict/getTableByName",{tableName:queryString}).then(respData=>{
                    cb(respData);
                });
            },
            //点击搜索到的表项目
            handleSelect(item) {
                //进行表节点定位操作
                this.expandNodes=[];
                this.expandNodes.push(item.dbVo["tmuid"]);
                this.expandNodes.push(item.moduleVo["tmuid"]);
                //this.expandNodes.push(item.tableVo["tmuid"]);
                this.$refs.dbTableTree.setCurrentKey(item.tableVo["tmuid"]);
                this.$nextTick(() => {
                    this.currentKey=item.tableVo["tmuid"];
                    this.$refs.dbTableTree.setCurrentKey(item.tableVo["tmuid"]);
                })

            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
               //表节点拖动方法
                let dropNodeData=dropNode.data;
                let draggingNodeData=draggingNode.data;
                if(draggingNodeData.type=="table"){
                    let moduleCode="";
                    let moduleId="";
                    if(dropNodeData.type=="module"&&dropType=="inner"){
                        moduleCode=dropNodeData.obj.moduleCode;
                        moduleId=dropNodeData.obj.tmuid;
                    }else if(dropNode.data.type=="table"){
                        moduleCode=dropNodeData.obj.moduleCode;
                        moduleId=dropNodeData.obj.moduleId;
                    }
                    //给移动后的节点赋值 进行保存
                    let tableObj=draggingNodeData.obj;
                    tableObj.moduleId=moduleId;
                    tableObj.moduleCode=moduleCode;
                    tableObj.loading=false;
                    this.postRequest("/dict/updTable", tableObj).then(respData => {
                    })
                }
            },
            //判断该节点是否可以放下
            allowDrop(draggingNode, dropNode, type) {
                if (dropNode.data.type === 'module') {
                    return type === 'inner';
                } else if(dropNode.data.type === 'table'&&draggingNode.data.obj.moduleCode!=dropNode.data.obj.moduleCode) {
                    return type === 'prev'||type === 'next';
                }else{
                    return  false;
                }
            },
            allowDrag(draggingNode) {
                //判断该节点是否可以拖动
                return draggingNode.data.type==="table";
            }
        },
        watch:{
            clickNodeData(newValue, oldValue){
                //选中新节点后给 菜单进行初始化。
                if(newValue){
                    this.menuItemVisible={ "module":false, "table":false,"db":false}
                    this.menuItemVisible[newValue.type]=true;

                }
            }
        }
    }
</script>

<style lang="css" scoped>
    .slot-tree .slot-t-top{
        margin-bottom: 15px;
    }
    .slot-tree .slot-t-node span{
        display: inline-block;
    }
    .slot-tree .slot-t-node--label{
        font-weight: 600;
    }
    .slot-tree .slot-t-node .slot-t-icons{
        display: none;
        margin-left: 10px;
    }
    .slot-tree .slot-t-icons .el-button+.el-button{
        margin-left: 6px;
    }
    .slot-tree .el-tree-node__content:hover .slot-t-icons{
        display: inline-block;
    }
    .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
    .el-tree>.el-tree-node{
        min-width: 100%;
        display:inline-block;
    }
</style>