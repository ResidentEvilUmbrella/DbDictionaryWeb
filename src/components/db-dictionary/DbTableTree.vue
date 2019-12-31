<template>
    <div>
        <el-scrollbar style="height: 100%;width: 98%">
        <el-tree
                :props="defaultProps"
                node-key="nodeId"
                ref="dbTableTree"
                @node-contextmenu='rightClick'
                @node-click="nodeClick"
                :load="loadNode"
                lazy
                highlight-current
                style="padding-left: 2%;padding-right:0;margin-right:0;width:95%;">
                <span class="slot-t-node" slot-scope="{ node, data }">
                 <i class="fa" :class="iconClsObj[data.type]" :style="{'color' : node.expanded||data.type=='table' ? iconStyleObj[data.type] :'#9c9c9c'}" />
                <span>{{ node.label }}</span>
            </span>
        </el-tree>
        </el-scrollbar>
        <!--鼠标右键点击出现页面-->
        <div v-show="menuVisible">
            <el-menu
                    id = "rightClickMenu"
                    class="el-menu-vertical"
                    active-text-color="#fff"
                    @select="handleRightSelect"
                    text-color="#fff">
                <el-menu-item index="6" v-show="menuItemVisible['db']" class="menuItem">
                    <span slot="title">添加模块</span>
                </el-menu-item>
                <el-menu-item index="1" v-show="menuItemVisible['module']" class="menuItem">
                    <span slot="title">添加表</span>
                </el-menu-item>
                <el-menu-item index="9" v-show="menuItemVisible['module']" class="menuItem">
                    <span slot="title">导入表</span>
                </el-menu-item>
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

        <module-window ref="moduleWindow" @okEvent="moduleWindowOkEvent"></module-window>

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
                    isLeaf(data, node){
                        console.log(data,node)
                    }
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
                }
            }
        },
        methods: {
            handleRightSelect(key) {
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
            nodeClick(){
                this.menuVisible = false;
            },
            tableAdd(data){
                //新增表
                this.$emit('tableAdd',data);
            },
            tableDelete(data){

                this.$confirm('此操作将删除表【'+data.obj.tableShowName+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest("/dict/delTable",data["obj"]).then(respData=>{
                        this.refreshNode(data["obj"]["dbConnId"],"db")
                        //删除表事件
                        this.$emit('tableDeleteEvent',data["obj"]);
                    })
                    /*this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });*/
                }).catch(() => {

                });



            },
            tableUpdate(data){
                //修改表
                //弹出窗口
                this.showTableWin(data,"update");
            },
            columnUpdate(data){
                //修改字段
                this.$emit('columnUpdate',data);
            },
            showTableWin(data,action){
                this.$refs.dbTableWin.showWin(data,action);
            },
            showModuleWin(data,action){
                this.$refs.moduleWindow.showWin(data,action);
            },
            tableWinOkEvent(data){
                //console.log(data);
                this.refreshNode(data["moduleId"],"module");
                this.$emit("dbTableWindowOkEvent",data,data["tmuid"]);
            },
            moduleWindowOkEvent(data){
                let {tmuid,}=data;
                if(tmuid!=""){
                   //修改操作模块
                    this.postRequest("/dict/updModule",data).then(respData=>{
                        this.refreshNode(data["dbConnId"],"db")
                    })
                }else{
                    //增加的操作
                    this.postRequest("/dict/addModule",data).then(respData=>{
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
                let {nodeId,type}=data;
                await this.getNodeByPid(nodeId,type).then(data=>{
                    if(data.length>0){
                        Message.error({message:"该模块下存在表数据不能删除！！！"});
                        return data.length;
                    }
                }).then(dataLength=>{
                    if(!dataLength||dataLength==0){
                        this.$confirm('此操作将删除模块【'+data.obj.moduleName+'】, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.postRequest("/dict/delModule",data["obj"]).then(respData=>{
                                this.refreshNode(data["obj"]["dbConnId"],"db")
                            })
                            /*this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });*/
                        }).catch(() => {

                        });
                    }

                })

            },
            loadNode(node, resolve) {
                let {data}=node;
                if(!data){
                    data={};
                }
                let {nodeId="root",type="root"}=data;
                this.postRequest("/dict/getTree",{nodeId:nodeId,type:type}).then(data=>{
                    resolve(data);
                });
            },
            getNodeByPid(pid,type){
                let paramData={nodeId:pid,type:type};
               return  this.postRequest("/dict/getTree",paramData);
            },
            refreshNode(pid,type){
                this.getNodeByPid(pid,type).then(data=>{
                    this.$refs.dbTableTree.updateKeyChildren(pid,data);
                });
            },
            showSyncDbTableWindow(data){
                this.$refs.syncDbTableWindow.showWin(data);
            },
            syncDbTableWindowOkEvent(moduleNodeData){
                this.refreshNode(moduleNodeData["nodeId"],moduleNodeData["type"])
            }
        },
        watch:{
            clickNodeData(newValue, oldValue){
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