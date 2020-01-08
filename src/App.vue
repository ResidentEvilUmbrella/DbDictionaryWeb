<template>
  <el-container style="border: 1px solid #eee"  v-loading.fullscreen.lock="this.$store.state.loadding"
                element-loading-text="程序处理中,请稍等。。。。"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.5)">

    <el-row style="width: 100%;height: 100%;">
      <el-col :span="4" :xs="3" :sm="3" :md="8" :lg="5" :xl="4" class="aside">
        <!--<div class="asideButton">
          <el-row>
            <el-col>
              <el-button type="primary" style="width: 220px" size="medium" plain round @click="handleNew">发布新地址</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-input
                      placeholder="搜索分类"
                      prefix-icon="el-icon-search"
                      v-model="filterText"
                      size="medium">
              </el-input>
            </el-col>
    </el-row>
        </div>-->
        <el-aside style="padding-top:10px;margin: 0px;" width="100%" >
          <!--左侧树形-->
          <db-table-tree
          v-on:tableAdd="tableAdd"
          @columnUpdate="columnUpdate"
          @tableUpdate="tableUpdate"
          @dbTableWindowOkEvent="dbTableWindowOkEvent"
          @tableDeleteEvent="tableDelete"
          @syncDbTableWindowOkEvent="syncDbTableWindowOkEvent"
          ref="dbTableTree"
          ></db-table-tree>
        </el-aside>
      </el-col>
      <el-col :span="20" :xs="17" :sm="17" :md="16" :lg="18" :xl="20">
        <el-container>
          <el-main>
            <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
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
  </el-container>

</template>
<script>
  import ElCol from "element-ui/packages/col/src/col";
  import DbTableColumnGrid from "./components/db-dictionary/DbTableColumnGrid";
  import DbTableTree from "./components/db-dictionary/DbTableTree";

  export default {
    components: {DbTableTree, ElCol,DbTableColumnGrid },
    data() {
      const item = {
        tagID: "ID001",
        name: "地区",
        description: "此处是改内容的详细描述...",
        creatorID: "Admin",
        regeneratorID: "Admin"
      };
      return {
        DATA: null,
        NODE: null,
        editableTabsValue: '0',
        editableTabs: [],
        tabIndex:0,
        tableWindowVisible:false
      }
    },
    methods: {
      //添加表
      tableAdd(data){
        this.addTab(this.editableTabsValue,data);
        //console.log(data)
      },
      //修改表
      tableUpdate(data){
       this.showTableWin(data);
      },
      tableDelete(data){
        this.removeTab(data["tmuid"]);
      },
      //修改字段
      columnUpdate(data){
        this.addTab(this.editableTabsValue,data);
        //console.log(data)
      },

      addTab(targetName,data) {
          //console.log(data)
        let {nodeId,type,label}=data;
        let newTabName ="";
        let existsTable=false;
        let tabIndex='';
        if (type=="table"){
          newTabName=label;
          tabIndex=nodeId;
        }else{
          newTabName="新建表"+tabIndex;
          tabIndex=++this.tabIndex + '';
        }
        let tabs = this.editableTabs;
        //判断面板id是否存在 不存在的时候增加 存在时 激活该面板
        tabs.forEach((tab, index) => {
          if (tab.name === tabIndex) {
            existsTable=true;
            return false;
          }
        });
        if(!existsTable){
          this.editableTabs.push({
                title: newTabName,
                name: tabIndex,
                content: 'DbTableColumnGrid',
                nodeData:data,
                refColumnTable:true
          });
        }


        this.editableTabsValue =tabIndex;
      },
      removeTab(targetName) {
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
        let tabs = this.editableTabs;
        tabs.forEach((tab, index) => {
          if (tab.name === panelId) {
              tab.name=data["tmuid"];
              tab.title=data["tableShowName"];
            tab.nodeData={obj:data,type:"table",nodeId:data["tmuid"]};
            this.editableTabsValue =data["tmuid"];
          }
        });
        //刷新树形数据
        if(data){
          this.$refs.dbTableTree.refreshNode(data["moduleId"],"module");
        }
      },
        syncDbTableWindowOkEvent({moduleNodeData,selectTableData}){
            let selectTableDataMap={};
            selectTableData.forEach((item)=>{
                selectTableDataMap[item["tmuid"]]=item;
            })
            let tabs = this.editableTabs;
            tabs.forEach((tab, index) => {
                if (selectTableDataMap[tab.name]){
                    // 销毁子标签

                    if(this.editableTabsValue==tab.name){
                      tab.refColumnTable=false;
                      // 重新创建子标签
                      this.$nextTick(() => {
                        tab.refColumnTable=true;
                      });
                    }else{
                      tab.refColumnTableRedy=true;
                    }

                }
            });
        },
        tabClick(tab){

          let tabs = this.editableTabs;
          tabs.forEach((item, index) => {
            if (tab.name==item.name){
                let{refColumnTableRedy=false}=item;
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

