<template>
  <el-container style="border: 1px solid #eee;height: 100%;"  v-loading.fullscreen.lock="this.$store.state.loadding"
                element-loading-text="程序处理中,请稍等。。。。"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.5)">
    <el-main style="padding: 0px;">
      <el-row >
        <el-col :span="4" :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="aside">
          <el-aside style="padding-top:10px;margin: 0px;width:98%;"  >
            <!--左侧树形-->
            <db-table-tree
                    v-on:tableAdd="tableAdd"
                    @columnUpdate="columnUpdate"
                    @tableUpdate="tableUpdate"
                    @dbTableWindowOkEvent="dbTableWindowOkEvent"
                    @tableDeleteEvent="tableDelete"
                    @syncDbTableWindowOkEvent="syncDbTableWindowOkEvent"
                    ref="dbTableTree"
                    style="padding-left: 2%;padding-right:0;margin-right:2%;width:98%;"
            ></db-table-tree>
          </el-aside>
        </el-col>
        <el-col :span="19" :xs="19" :sm="19" :md="19" :lg="19" :xl="19">
          <el-container>
            <el-main>
              <!--右侧选项卡页面-->
              <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="tabClick" class="dbTableTabs">
                <el-tab-pane
                        v-for="(item) in editableTabs"
                        :key="item.index"
                        :label="item.title"
                        :name="item.name">
                  <!-- 组件会在 `currentTabComponent` 改变时改变 -->
                  <component v-bind:is="item.content" :nodeData="item.nodeData" :panelId="item.name" v-if="item.refColumnTable==true" @dbTableWindowOkEvent="dbTableWindowOkEvent"></component>

                </el-tab-pane>
              </el-tabs>
            </el-main>
          </el-container>
        </el-col>
      </el-row>

    </el-main>
  </el-container>

</template>
<script>
  import ElCol from "element-ui/packages/col/src/col";
  import DbTableColumnGrid from "./components/db-dictionary/DbTableColumnGrid";
  import DbTableTree from "./components/db-dictionary/DbTableTree";

  export default {
    components: {DbTableTree, ElCol,DbTableColumnGrid },
    data() {
      return {
        editableTabsValue: '0',
        editableTabs: [],
        tabIndex:0,
        tableWindowVisible:false
      }
    },
    methods: {
      //添加表方法
      tableAdd(data){
        //添加一个tab页
        this.addTab(this.editableTabsValue,data);
      },
      //修改表
      tableUpdate(data){
        //显示修改表窗口
       this.showTableWin(data);
      },
      tableDelete(data){
        this.removeTab(data["tmuid"]);
      },
      //修改字段
      columnUpdate(data){
        //添加一个选项卡
        this.addTab(this.editableTabsValue,data);
        //console.log(data)
      },
      //添加选项卡
      addTab(targetName,data) {
          //console.log(data)
        let {nodeId,type,label}=data;
        let newTabName ="";
        let existsTable=false;
        let tabIndex='';
        //选择的表节点 修改操作
        if (type=="table"){
          newTabName=label;
          tabIndex=nodeId;
        }else{
          //其他节点新增表
          newTabName="新建表"+tabIndex;
          tabIndex=++this.tabIndex + '';
        }
        let tabs = this.editableTabs;
        //判断面板id是否存在 不存在的时候增加 存在时 激活该面板
        let activeTab=null;
        tabs.forEach((tab, index) => {
          if (tab.name === tabIndex) {
            existsTable=true;
            activeTab=tab;
            return false;
          }
        });
        if(!existsTable){
          //不存在时，新增面板
          this.editableTabs.push({
                title: newTabName,
                name: tabIndex,
                content: 'DbTableColumnGrid',
                nodeData:data,
                refColumnTable:true
          });
        }else{
          //存在时激活该面板
          if(activeTab){
            this.tabClick(activeTab);
          }
        }
        this.editableTabsValue =tabIndex;

      },
      removeTab(targetName) {
        //关闭选项卡

        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      dbTableWindowOkEvent(data,panelId){
        //添加修改表后的回调函数
        let tabs = this.editableTabs;
        //遍历所有选项卡
        tabs.forEach((tab, index) => {
          if (tab.name === panelId) {
           // 如果和保存的表属于同一个表 改变选项卡的名称、id和节点数据
              tab.name=data["tmuid"];
              tab.title=data["tableShowName"];
            tab.nodeData={obj:data,type:"table",nodeId:data["tmuid"]};
            this.editableTabsValue =data["tmuid"];
          }
        });
        //刷新树形对应的模块节点数据
        if(data){
          this.$refs.dbTableTree.refreshNode(data["moduleId"],"module");
        }
      },
        syncDbTableWindowOkEvent({moduleNodeData,selectTableData}){
            //导入表后保存2020年1月10日10:11:07
            let selectTableDataMap={};
            selectTableData.forEach((item)=>{
                selectTableDataMap[item["tmuid"]]=item;
            })
            let tabs = this.editableTabs;
            //遍历所有打开的选项卡
            tabs.forEach((tab, index) => {
                //如果重新导入已经打开的选项卡时 销毁该选项卡对应的表格 重新渲染
                if (selectTableDataMap[tab.name]){
                    //
                    if(this.editableTabsValue==tab.name){
                      //如果已经激活的选项卡重新导入后 直接销毁重建
                      //销毁选项卡
                      tab.refColumnTable=false;
                      // 重新创建表格
                      this.$nextTick(() => {
                        tab.refColumnTable=true;
                      });
                    }else{
                      // 需要从新刷新表格标识
                      tab.refColumnTableRedy=true;
                    }

                }
            });
        },
        //激活tab方法
        tabClick(tab){
          let tabs = this.editableTabs;
          tabs.forEach((item, index) => {
            if (tab.name==item.name){
                let{refColumnTableRedy=false}=item;
                //该节点需要重新渲染 进行 销毁渲染操作
                if(refColumnTableRedy){
                  item.refColumnTable=false;
                  this.$nextTick(() => {
                    item.refColumnTable=true;
                  });
                  item.refColumnTableRedy=false;
                }
              }
          });



        }
    }
  };
</script>
<style lang="less" scoped>
  .popover-new {
    // position: absolute!important;
    // right: 0;
    // bottom: 0;
  }
  /*顶部按钮*/
  .slot-tree .slot-t-top{
    margin-bottom: 15px;
  }
  .slot-tree .slot-t-node span{
    display: inline-block;
  }
  /*节点*/
  .slot-tree .slot-t-node--label{
    font-weight: 600;
  }
  /*输入框*/
  .slot-tree .slot-t-input .el-input__inner{
    // height: 26px;
    // line-height: 26px;
  }
  /*按钮列表*/
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
</style>

