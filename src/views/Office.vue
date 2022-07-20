<template>
  <div class="office" style="height: 100%;">
    <el-container style="height: 100%;">
      <!-- menus -->
      <el-aside style="background-color: #545c64">
        <!-- 左侧菜单 打开页tag拦收缩起来后 在左侧加入展开按钮 -->
        <li
          class="collapse-pages-header"
          v-if="isCollapse && !pageTagLock"
          @click="isCollapse = false"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="展开菜单并显示打开页标签栏"
            placement="right"
            style="position: absolute; left: 0px; top: 0px; height: 100%; width: 100%; display: inline-block; box-sizing: border-box; padding: 0px 20px;"
          >
            <i
              class="el-icon-s-unfold"
              style="font-size: 18px;line-height: 56px;text-align: center;"
            ></i>
          </el-tooltip>
        </li>
        <el-menu
          router
          :default-active="menuActive"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          style="border-right: 0px;"
          @select="handleMenuSelect"
        >
          <template v-for="(item, index) in menu">
            <el-submenu v-if="item.children.length > 0" :index="item.path">
              <!-- 带二级菜单的一级菜单 -->
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
              </template>

              <!-- 遍历看二级菜单中是否还有三级菜单 -->
              <template v-for="(item2, index2) in item.children">
                <el-submenu v-if="item2.children.length > 0" :index="item2.path">
                  <!-- 带三级菜单的二级菜单 -->
                  <template slot="title">
                    <i :class="item2.icon"></i>
                    <span>{{ item2.text }}</span>
                  </template>

                  <!-- 遍历看三级菜单中是否还有四级菜单 -->
                  <template v-for="(item3, index3) in item2.children">
                    <el-submenu
                      v-if="item3.children.length > 0"
                      :index="item3.path"
                    >
                      <template slot="title">
                        <i :class="item3.icon"></i>
                        <span>{{ item3.text }}</span>
                      </template>
                      <!-- 四级菜单（目前设计到四级菜单） -->
                      <el-menu-item
                        v-for="(item4, index4) in item3.children"
                        :index="item4.path"
                      >
                        <i :class="item4.icon"></i>
                        <span slot="title">{{ item4.text }}</span>
                      </el-menu-item>
                    </el-submenu>

                    <!-- 三级菜单 -->
                    <el-menu-item v-else :index="item3.path">
                      <i :class="item3.icon"></i>
                      <span slot="title">{{ item3.text }}</span>
                    </el-menu-item>
                  </template>
                </el-submenu>

                <!-- 二级菜单 -->
                <el-menu-item v-else :index="item2.path">
                  <i :class="item2.icon"></i>
                  <span slot="title">{{ item2.text }}</span>
                </el-menu-item>
              </template>
            </el-submenu>

            <!-- 一级菜单 -->
            <el-menu-item v-else :index="item.path">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.text }}</span>
            </el-menu-item>
          </template>

          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>

      <!-- pages container -->
      <el-container>
        <!-- 打开的菜单页标签 -->
        <el-header
          v-if="!isCollapse || pageTagLock"
          class="open-page-tags"
          style="height: 50px;background-color: #fff; display: flex;align-items: center;padding: 0px;box-shadow: 0px 2px 8px 2px rgb(0 0 0 / 3%);"
        >
          <i
            class="func-btn el-icon-s-unfold"
            :style="
              isCollapse
                ? 'cursor: pointer'
                : 'transform: rotate(180deg);cursor: pointer'
            "
            @click="isCollapse = !isCollapse"
          ></i>
          <i
            :class="
              pageTagLock
                ? 'func-btn el-icon-lock clr-green'
                : 'func-btn el-icon-unlock'
            "
            style="position: absolute; right: 0px;"
            @click="pageTagLock = !pageTagLock"
          ></i>

          <!-- <router-link to="/home/office/qyxx">点击进入新闻中心</router-link> -->
        </el-header>

        <!-- 当前菜单页 -->
        <el-main style="margin: 24px; padding: 0px;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Office",
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      menuActive: '/',
      menu: [
        {
          id: "3",
          text: "系统设置",
          path: "setting",
          icon: "el-icon-s-tools",
          children: [
            {
              id: "3-0",
              text: "成员管理",
              path: "member",
              icon: "el-icon-s-custom",
              children: [
                {
                  id: "3-0-0",
                  text: "超级成员",
                  path: "super-member",
                  icon: "el-icon-document",
                  children: []
                },
                {
                  id: "3-0-1",
                  text: "企业用户",
                  path: "company-member",
                  icon: "el-icon-document",
                  children: []
                }
              ]
            },
            {
              id: "3-1",
              text: "菜单配置",
              path: "menu",
              icon: "el-icon-menu",
              children: [
                {
                  id: "3-1-0",
                  text: "魔力菜单（内部）", 
                  path: "super-menu",
                  icon: "el-icon-document",
                  children: []
                },
                {
                  id: "3-1-1",
                  text: "用户菜单", // 企业业务逻辑办公用的
                  path: "company-menu",
                  icon: "el-icon-document",
                  children: []
                }
              ]
            },
            {
              id: "3-2",
              text: "操作日志",
              path: "log",
              icon: "el-icon-s-order",
              children: [
              {
                  id: "3-2-0",
                  text: "内部日志", 
                  path: "super-log",
                  icon: "el-icon-document",
                  children: []
                },
                {
                  id: "3-2-1",
                  text: "用户日志", // 企业业务逻辑办公用的
                  path: "company-log",
                  icon: "el-icon-document",
                  children: []
                }
              ]
            },
          ]
        }
      ],
      isCollapse: true, // 菜单收展
      pageTagLock: true,
      tableData: Array(20).fill(item)
    };
  },
  computed: {},
  watch: {
    // menuActive(newPath) {
    //   this.$router.replace({ path: `/office/${newPath}` });
    // }
  },
  created() {
      console.log(this.$store.state.menus)

      this.$route.matched.length === 3 ? this.menuActive = this.$route.path.split('/')[2] : '';
      this.menuActive === ''?this.menuActive = '/':'';

      let currentModule = this.$route.matched[1].path;
      // this.menu
  },
  mounted() {},
  methods: {
    handleMenuSelect(index, path){
      this.menuActive = index
    },
  },
  destroyed() {},
  components: {}
};
</script>

<style scoped>
.el-aside {
  width: auto !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
  min-height: 400px;
}

.collapse-pages-header {
  height: 56px;
  line-height: 56px;
  position: relative;
  -webkit-box-sizing: border-box;
  white-space: nowrap;
  list-style: none;
  font-size: 14px;
  color: #303133;
  padding: 0 20px;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  box-sizing: border-box;
  padding-left: 20px;
  color: rgb(255, 255, 255);
  background-color: rgb(84, 92, 100);
}

.collapse-pages-header:hover {
  background-color: #434a50;
}

.collapse-pages-header [class^="el-icon-"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
.collapse-pages-header i {
  color: #909399;
}

.open-page-tags .func-btn {
  line-height: 50px;
  padding: 0px 15px;
  cursor: pointer;
  font-size: 20px;
}
.open-page-tags .func-btn:hover {
  background-color: rgba(0, 0, 0, 0.025);
}
</style>
