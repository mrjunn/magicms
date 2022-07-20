<template>
  <div class="setting" style="display: flex; height: 100%;">
    <div
      style="padding: 15px; background-color: #fff; margin-right: 20px;width:40%;"
    >
      <el-table :data="tableData" height="100%" style="width:100%;">
        <el-table-column
          prop="name"
          label="方案名"
          min-width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="作用对象"
          min-width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          min-width="145"
          align="right"
          v-if="$store.state.userData.role === 'sa'"
        >
          <template slot="header" slot-scope="scope">
            <el-button @click="addProgramme" type="primary" size="mini" :disabled="editing"
              >新增</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="programmeIndex = scope.$index"
              size="mini"
            >
              修改
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="danger"
              size="mini"
              plain
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="flex: 1;padding: 28px 20px 15px; background-color: #fff;">
      <!-- 大模块 子系统 -->
      <div
        style="display: flex;align-items: center;justify-content: space-between;"
      >
        <span>
          <span
            v-for="(item, index) in openTabs"
            :key="index"
            :class="['j-tab-btn', activeTab === item.value ? 'active' : '']"
            @click="activeTab = item.value"
            >{{ item.name }}</span
          >
        </span>

        <span>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="addModule"
            >模块菜单</el-button
          >
          <el-button
            v-if="editing && menuFormValid"
            type="success"
            size="mini"
            icon="el-icon-check"
            @click="saveMenus"
            >保存{{activeTab==='standardMenus'?openTabs[0].name:'新方案'}}</el-button
          >
        </span>
      </div>
      <el-divider><i class="el-icon-setting"></i></el-divider>

      <!-- <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm"> -->
      <el-tree
        class="menu-tree"
        :data="menus"
        show-checkbox
        node-key="id"
        :indent="22"
        default-expand-all
        :expand-on-click-node="false"
        :default-checked-keys="defaultCheckedKeys"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        style="overflow-y: auto;height: calc(100% - 51px);"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <template v-if="editMenuId === data.id">
              <el-input
                v-model="data.label"
                placeholder="菜单名"
                size="mini"
                clearable
                style="width: 120px;"
              ></el-input>
              <el-input
                v-model="data.path"
                placeholder="路径"
                size="mini"
                clearable
                style="width: 120px;margin-left: 10px;"
              ></el-input>
              <el-input
                v-model="data.vuepage"
                placeholder="指定页面（选填）"
                size="mini"
                clearable
                title="如不指定页面会根据path自动匹配"
                style="width: 122px;margin-left: 10px;"
              ></el-input>
            </template>
            <template v-else>
              <template v-if="node.label !== ''">
                {{ node.label }}
              </template>
              <span v-else style="color: #F56C6C;">
                菜单名未配置！
              </span>
              <el-tag
                v-if="data.path !== ''"
                type="info"
                size="small"
                style="margin-left: 8px;"
                >{{ data.path }}</el-tag
              >
              <el-tag
                v-if="data.vuepage !== ''"
                type="warning"
                size="small"
                style="margin-left: 8px;"
                >{{ data.vuepage }}</el-tag
              >
            </template>
            <i
              v-if="data.disabled"
              class="el-icon-lock"
              title="只读"
              style="margin-left: 10px;"
            ></i>
            <el-tag
              size="mini"
              v-if="data.tag != undefined"
              style="margin-left:10px;"
              >{{ data.tag }}</el-tag
            >
          </span>

          <span class="hidden" v-if="$store.state.userData.role === 'sa'">
            <el-button
              size="mini"
              plain
              icon="el-icon-plus"
              circle
              @click="() => append(data)"
              title="追加子菜单"
            >
            </el-button>
            <el-button
              size="mini"
              plain
              icon="el-icon-edit"
              circle
              @click="editMenuId = data.id, editing = true"
              title="编辑"
            >
            </el-button>
            <el-button
              size="mini"
              plain
              :icon="data.disabled ? 'el-icon-unlock' : 'el-icon-lock'"
              circle
              @click="data.disabled = !data.disabled, editing = true"
              :title="data.disabled ? '取消只读' : '只读'"
            >
            </el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              icon="el-icon-delete"
              circle
              @click="() => remove(node, data)"
              title="会连带删除其子菜单"
            >
            </el-button>
          </span>
        </span>
      </el-tree>
      <!-- </el-form> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
let id = 11;
const savedStandardMenus = [
  {
    id: "0",
    label: "业务办公",
    path: "magic",
    vuepage: "", // 指定路由地址对应的vue页面，不采用根据path自动匹配
    tag: "模块菜单",
    disabled: true,
    children: [
      {
        id: "0-0",
        label: "系统设置",
        path: "settings",
        vuepage: "",
        disabled: true,
        children: [
          {
            id: "0-0-0",
            label: "成员管理",
            path: "member",
            vuepage: "",
            disabled: true,
            children: [
              {
                id: "0-0-0-0",
                label: "超级成员",
                path: "supmemb",
                vuepage: "",
                disabled: true
              },
              {
                id: "0-0-0-1",
                label: "企业成员",
                path: "member",
                vuepage: "",
                disabled: true
              }
            ]
          },
          {
            id: "0-0-1",
            label: "菜单配置",
            path: "menu",
            vuepage: "",
            disabled: true,
            children: [
              {
                id: "0-0-1-0",
                label: "魔力菜单（内部）",
                path: "supmemb",
                vuepage: "",
                disabled: true
              },
              {
                id: "0-0-1-1",
                label: "企业成员菜单",
                path: "member",
                vuepage: "",
                disabled: true
              }
            ]
          },
          {
            id: "0-0-2",
            label: "操作日志",
            path: "menu",
            vuepage: "",
            disabled: true,
            children: [
              {
                id: "0-0-2-0",
                label: "内部日志",
                path: "magicLog",
                vuepage: "",
                disabled: true
              },
              {
                id: "0-0-2-1",
                label: "用户日志",
                path: "memberLog",
                vuepage: "",
                disabled: true
              }
            ]
          }
        ]
      }
    ]
  }
];
export default {
  name: "Setting",
  data() {
    return {
      programmeIndex: -1,
      editProgrammeType:'',
      menuFormValid:true,
      editing: false,
      openTabs: [
        {
          name: "标准菜单",
          value: "standardMenus"
        }
      ],
      programme: {
        name: "",
        scope: []
      },
      activeTab: "standardMenus",
      menus: [],
      defaultCheckedKeys: ["0-0-1-0", "0-0-1-1"],
      editMenuId: -1,
      menusModified: false,

      tableData: [
        {
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        }
      ]
    };
  },
  computed: {},
  watch: {
    menus: {
      handler(newVal) {
        console.log("menus", newVal);
        this.menusModified = true;
      },
      deep: true,
      immediate: false // true 后 watch里声明的属性方法会初始化执行
    }
  },
  created() {
    // super admin
    this.menus = localStorage.getItem('standardMenus') ? JSON.parse(localStorage.getItem('standardMenus')):JSON.parse(JSON.stringify(savedStandardMenus))
  },
  mounted() {},
  methods: {
    append(data) {
      this.editing = true
      console.log(data);
      const childIndex = data.children ? data.children.length : 0;
      const newChild = {
        id: data.id + "-" + childIndex,
        label: "",
        path: "",
        vuepage: "",
        disabled: false
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);

      console.log(this.menus);

      this.editMenuId = newChild.id;
    },
    remove(node, data) {
      this.editing = true
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    deleteRow(index, rows) {
      rows.splice(index, 1);
    },

    addProgramme() {
      this.editProgrammeType = 'add'
      this.editing = true
      this.openTabs[1] = { name: "新方案，未命名", value: "programme" };
      this.activeTab = "programme";
      this.menus = JSON.parse(JSON.stringify(savedStandardMenus));
      this.programme = {
        name: "",
        scope: []
      };
    },

    addModule() {
      this.editing = true
      const newModule = {
        id: this.menus.length + "",
        label: "",
        path: "",
        vuepage: "",
        tag: "模块菜单",
        disabled: false,
        children: []
      };
      this.menus.push(newModule);

      this.editMenuId = newModule.id;
    },
    saveMenus() {
      this.editing = false
      this.menusModified = false;
      this.editMenuId = -1;
      console.log(this.menus);
      this.activeTab === 'standardMenus'?this.insertMenuRoutePath():this.updateProgrammes()
    },
    insertMenuRoutePath(){
      let menus = []
      // ------------------------------ 遍历模块菜单
      this.menus.forEach(moduleMenu => {
        // 模块菜单
        if(moduleMenu.path===''){ //首页
          moduleMenu.routePath = '/'
          moduleMenu.vuepage===''?moduleMenu.vuepage='modules/index/Index':''
        }else{
          moduleMenu.routePath = moduleMenu.path
          moduleMenu.vuepage===''?moduleMenu.vuepage=`modules/${moduleMenu.path}/Index`:''

          // 判断模块菜单下是否有一级菜单
          if(moduleMenu.children && moduleMenu.children.length>0){

            // ------------------------------ 遍历一级菜单
            moduleMenu.children.forEach(menu1 => {

              // 判断是否有二级菜单
              if(menu1.children && menu1.children.length>0){

                // ------------------------------ 遍历二级菜单
                menu1.children.forEach(menu2 => {

                  // 判断是否有三级菜单
                  if(menu2.children && menu2.children.length>0){

                    // ------------------------------ 遍历三级菜单
                    menu2.children.forEach(menu3 => {

                      // 判断是否有四级菜单
                      if(menu3.children && menu3.children.length>0){

                        // ------------------------------ 遍历四级菜单
                        menu3.children.forEach(menu4 => {
                          // 四级菜单，暂限制到最多四级菜单
                          menu4.routePath = menu1.path+'/'+menu2.path+'/'+menu3.path+'/'+menu4.path
                          let arr = menu4.path.split('-');
                          let pageName = ''
                          arr.forEach(str => {
                            pageName+=str.charAt(0).toUpperCase() + str.slice(1)
                          });
                          menu4.vuepage===''?menu4.vuepage=`modules/${moduleMenu.path}/${menu1.path}/${menu2.path}/${menu3.path}/${pageName}`:''
                        });
                        // ------------------------------ 遍历二级菜单结束

                      }else{
                        // 三级菜单，且没有子菜单
                        menu3.routePath = menu1.path+'/'+menu2.path+'/'+menu3.path
                        let arr = menu3.path.split('-');
                        let pageName = ''
                        arr.forEach(str => {
                          pageName+=str.charAt(0).toUpperCase() + str.slice(1)
                        });
                        menu3.vuepage===''?menu3.vuepage=`modules/${moduleMenu.path}/${menu1.path}/${menu2.path}/${pageName}`:''
                      }
                    });
                    // ------------------------------ 遍历二级菜单结束

                  }else{
                    // 二级菜单，且没有子菜单
                    menu2.routePath = menu1.path+'/'+menu2.path
                    let arr = menu2.path.split('-');
                    let pageName = ''
                    arr.forEach(str => {
                      pageName+=str.charAt(0).toUpperCase() + str.slice(1)
                    });
                    menu2.vuepage===''?menu2.vuepage=`modules/${moduleMenu.path}/${menu1.path}/${pageName}`:''
                  }
                });
                // ------------------------------ 遍历二级菜单结束

              }else{
                // 一级菜单，且没有子菜单
                if(menu1.path===''){ //首页
                  menu1.routePath = '/'
                  menu1.vuepage===''?menu1.vuepage=`modules/${moduleMenu.path}/Index`:''
                }else{
                  menu1.routePath = menu1.path
                  let arr = menu1.path.split('-');
                  let pageName = ''
                  arr.forEach(str => {
                    pageName+=str.charAt(0).toUpperCase() + str.slice(1)
                  });
                  menu1.vuepage===''?menu1.vuepage=`modules/${moduleMenu.path}/${pageName}`:''
                }
              }
            });
            // ------------------------------ 遍历一级菜单结束
          }
        }
      });
      
      console.log(this.menus)
      localStorage.setItem('standardMenus', JSON.stringify(this.menus));
    },
    updateProgrammes(){
      let type = this.editProgrammeType
      let programmes = localStorage.getItem('programmes') ? JSON.parse(localStorage.getItem('programmes')):[]
      if(type === 'add'){
        programmes.push(this.menus)
      }else if(type === 'modify'){
        programmes[this.programmeIndex] = this.menus
      }else if(type === 'delete'){
        programmes.splice(this.programmeIndex, 1)
      }
      localStorage.setItem('programmes', JSON.stringify(programmes));
    },

    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    }
  },
  destroyed() {},
  components: {}
};
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-divider--horizontal {
  margin: 11px 0;
}
</style>
<style>
.el-tree-node__content {
  padding: 8px 0;
}
.hidden {
  display: none;
}
.el-tree-node__content:hover .hidden {
  display: unset;
}

.menu-tree .el-input__inner {
  padding: 0 10px;
}
.menu-tree .el-input--suffix .el-input__inner {
  padding-right: 22px;
}
.menu-tree .el-input__suffix {
  right: 0px;
}

.j-tab-btn {
  font-size: 15px;
  font-weight: 600;
  color: #909399;
  margin-right: 15px;
  cursor: pointer;
}
.j-tab-btn.active {
  font-size: 17px;
  font-weight: 600;
  color: #555;
}
</style>
