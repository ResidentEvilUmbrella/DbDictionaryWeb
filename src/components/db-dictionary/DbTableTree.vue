<template>
    <div>
        <el-scrollbar style="height: 100%;width: 98%">
        <el-tree
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                ref="SlotMenuList"
                @node-contextmenu='rightClick'
                @node-click="nodeClick"
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

        <module-window ref="moduleWindow"></module-window>
    </div>
</template>

<script>
    import ModuleWindow from "./ModuleWindow";
    import DbTableWindow from "./DbTableWindow";

    export default {
        name: "DbTableTree",
        components:{ModuleWindow, DbTableWindow},
        data() {
            return {
                treeData: [{
                    label: '系统库(mySql)',
                    nodeId:"db1",
                    dataId:"dbData1",
                    type:"db",
                    children: [{
                        label: '系统主框架',
                        type:"module",
                        nodeId:"db1module1",
                        dataId:"moduleData1",
                        children: [{
                            label: '系统参数配置表',
                            name:"sys_paramCfg",
                            type:"table",
                            nodeId:"sys_paramCfg",
                            dataId:"sys_paramCfg"
                        }, {
                            label: '数据库字典表信息存储表',
                            name:"sys_dbDictionary_table",
                            type:"table",
                            nodeId:"sys_dbDictionary_table",
                            dataId:"sys_dbDictionary_table"
                        }, {
                            label: '数据库字典字段信息存储表',
                            name:"sys_dbDictionary_column",
                            type:"table",
                            nodeId:"sys_dbDictionary_column",
                            dataId:"sys_dbDictionary_column"
                        }, {
                            label: 'XXX表',
                            name:"xxx",
                            type:"table",
                            nodeId:"xxx",
                            dataId:"xxx"
                        }]
                    }, {
                        label: '人事管理模块',
                        type:"module",
                        nodeId:"db1module2",
                        dataId:"module2",
                        children: [{
                            label: '人员信息表',
                            name:"sys_empInfo",
                            type:"table",
                            nodeId:"sys_empInfo",
                            dataId:"sys_empInfo"
                        }]
                    }, {
                        label: '组织架构模块',
                        type:"module",
                        nodeId:"db1module3",
                        dataId:"module3",
                        children: []
                    }, {
                        label: 'XXX模块',
                        type:"module",
                        nodeId:"db1XXX",
                        dataId:"db1XXX",
                        children: []
                    }]
                }, {
                    label: '扩展库(mySql)',
                    type:"db",
                    nodeId:"db2",
                    dataId:"db2",
                    children: [{
                        label: '系统主框架',
                        type:"module",
                        nodeId:"db2module1",
                        dataId:"db2module1",
                        children: []
                    }, {
                        label: '人事管理模块',
                        type:"module",
                        nodeId:"db2module2",
                        dataId:"db2module2",
                        children: []
                    }, {
                        label: '组织架构模块',
                        type:"module",
                        nodeId:"db2module3",
                        dataId:"db2module3",
                        children: []
                    }, {
                        label: 'XXX模块',
                        nodeId:"db2xxx",
                        dataId:"db2xxx",
                        type:"module",
                        children: []
                    }, {
                        label: 'XXX模块',
                        type:"module",
                        nodeId:"db2xxx1",
                        dataId:"db2xxx1",
                        children: []
                    }]
                }, {
                    label: '扩展库(oracle)',
                    type:"db",
                    nodeId:"db3",
                    dataId:"db3",
                    children: [{
                        label: '系统主框架',
                        type:"module",
                        nodeId:"db3module1",
                        dataId:"db3module1",
                        children: []
                    }, {
                        label: '人事管理模块',
                        type:"module",
                        nodeId:"db3module2",
                        dataId:"db3module2",
                        children: []
                    }, {
                        label: '组织架构模块',
                        type:"module",
                        nodeId:"db3module3",
                        dataId:"db3module3",
                        children: []
                    }, {
                        label: 'XXX模块',
                        type:"module",
                        nodeId:"db3module4",
                        dataId:"db3module4",
                        children: []
                    }, {
                        label: 'XXX模块',
                        type:"module",
                        nodeId:"db3module5",
                        dataId:"db3module5",
                        children: []
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
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
                console.log(key);
                if (key == 1) {
                    //添加表
                    this.tableAdd(this.clickNode, this.clickNodeData);
                    this.menuVisible = false;
                } else if (key == 2) {
                    //刷新子节点
                    this.refreshNode(this.clickNodeData);
                    this.menuVisible = false;
                } else if (key == 3) {
                    //修改字段
                    this.columnUpdate(this.clickNode, this.clickNodeData);
                    this.menuVisible = false;
                } else if(key == 4){
                    console.log('4')
                    //修改表信息
                    this.tableUpdate(this.clickNode, this.clickNodeData);
                    this.menuVisible = false;
                }else if(key == 5){
                    console.log('5')
                    //删除表
                    this.tableDelete(this.clickNode, this.clickNodeData);
                    this.menuVisible = false;
                }else if(key == 6){
                    //console.log('6')
                    //添加模块
                    this.showModuleWin(this.clickNodeData);
                    this.menuVisible = false;
                }else if(key == 7){
                    console.log('7')
                    //修改模块
                    this.tableDelete(this.clickNode, this.clickNodeData);
                    this.menuVisible = false;
                }else if(key == 8){
                    console.log('8')
                    //删除模块
                    this.tableDelete(this.clickNode, this.clickNodeData);
                    this.menuVisible = false;
                }
            },
            rightClick(event, object, value, element) {
                console.log(object)
                this.clickNodeData=object;
                this.clickNode=element;
               /* if(object["type"]!=="db"){

                }else{
                    this.menuVisible =false;
                    return;
                }*/

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
            tableAdd(node,data){
                //新增表
                this.$emit('tableAdd',{data,node});
            },
            tableDelete(node,data){
                //删除表
                this.$emit('tableDelete',{data,node});
            },
            tableUpdate(node,data){
                //修改表
                //弹出窗口
                this.showTableWin(data);
            },
            columnUpdate(node,data){
                //修改字段
                this.$emit('columnUpdate',{data,node});
            },
            refreshNode(data){
                //刷新节点
                //this.$emit('refreshNode',{data,node});
            },
            showTableWin(data){
                this.$refs.dbTableWin.showWin(data);
            },
            showModuleWin(data){
                this.$refs.moduleWindow.showWin(data);
            },
            tableWinOkEvent(data){
                console.log(data);
            }
        },
        watch:{
            clickNodeData(newValue, oldValue){
                console.log("new"+newValue)
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