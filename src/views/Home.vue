<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <el-container style="height: 100vh;">
      <el-header
        style="background-color: #fff;display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid #e1e1e1;"
      >
        <!-- header -->
        <div style="display: flex;align-items: center;">
          <svg
            class="iconfont-symbol"
            aria-hidden="true"
            style="width: 42px;height:42px;"
          >
            <use xlink:href="#icon-dianping"></use>
          </svg>
          <span
            style="font-size: 26px; margin-left: 10px; letter-spacing: 2px;color: #444;text-shadow: rgb(0 0 0 / 20%) 1px 3px 3px;"
          >
            魔力的管理系统
          </span>
          <el-popover
            placement="top"
            trigger="hover"
            :open-delay="500"
            width="120"
            v-model="versionPopvisible"
          >
            <p style="text-align: center;">
              <i class="el-icon-question"></i> 查看版本更新摘要？
            </p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="versionPopvisible = false"
                >不用了</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="versionPopvisible = false"
                >查看</el-button
              >
            </div>
            <el-tag
              slot="reference"
              style="font-size: 15px;margin: 0 30px 0 10px;text-shadow: rgb(0 0 0 / 20%) 1px 3px 3px;cursor: pointer;"
              >企业版
              <span
                style="font-size: 18px; letter-spacing: 0px;color: #ff9800;font-style: italic;text-shadow: 3px 6px 3px rgb(255 152 0 / 50%);"
                >v1.0</span
              ></el-tag
            >
          </el-popover>

          <!-- 多个业务办公模块 才需要各自模块带模块统计首页（默认显示, path:'/'） -->
          <el-button
            :plain="currentModule !== '/'"
            :type="currentModule === '/' ? 'primary' : ''"
            size="small"
            @click="changeCurrentModule('/')"
            >仪 表 板</el-button
          >
          <el-button
            :plain="currentModule !== '/magic'"
            :type="currentModule === '/magic' ? 'primary' : ''"
            size="small"
            @click="changeCurrentModule('/magic')"
            >魔力业务办公</el-button
          >
          <el-button
            :plain="currentModule !== '/office'"
            :type="currentModule === '/office' ? 'primary' : ''"
            size="small"
            @click="changeCurrentModule('/office')"
            >成员业务办公</el-button
          >
        </div>

        <div style="display: flex;align-items: center;">
          <el-badge is-dot class="func-btn" hidden title="暂无报警">
            <svg
              class="iconfont-symbol"
              aria-hidden="true"
              style="width: 24px;height:24px;"
            >
              <use xlink:href="#icon-gonggao"></use>
            </svg>
          </el-badge>
          <el-badge is-dot class="func-btn" title="3 条未读消息">
            <svg
              class="iconfont-symbol"
              aria-hidden="true"
              style="width: 24px;height:24px;"
            >
              <use xlink:href="#icon-xiaoxi"></use>
            </svg>
          </el-badge>
          <el-divider direction="vertical"></el-divider>
          <el-avatar class="func-btn" :size="36" src="https://empty" @error="errorHandler">
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
          <el-dropdown class="func-btn" style="margin-left: 0px;">
            <span class="el-dropdown-link">
              周俊楠
              <!-- <el-tag size="mini">成员</el-tag>
              <el-tag type="success" size="mini">管理员</el-tag>
              <el-tag type="warning" size="mini">代理商</el-tag>
              <el-tag type="warning" size="mini">超级成员</el-tag> -->
              <el-tag type="danger" size="mini">超级管理员</el-tag>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>切换企业</el-dropdown-item>
              <el-dropdown-item disabled>周边商城</el-dropdown-item>
              <el-dropdown-item divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main style="padding: 0;">
        <!-- page container -->
        <router-view />
      </el-main>
    </el-container>

    <!-- <div class="page-container"></div> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      versionPopvisible: false,
      currentModule: "/"
    };
  },
  computed: {},
  watch: {
    // tableParams: {
    //   handler(newVal) {
    //     console.log("tableParams", newVal);
    //     this.getTableData(newVal);
    //   },
    //   deep: true,
    //   immediate: false // true 后 watch里声明的属性方法会初始化执行
    // },
    // currentModule(newPath) {}
  },
  created() {
    // if (this.$store.state.userData.token === "") {
    //   this.$router.replace({ path: "/office/qyxx" });
    //   return;
    // }

    this.currentModule = this.$route.matched[1].path;

  },
  mounted() {},
  methods: {
    errorHandler() {
      return true;
    },
    changeCurrentModule(newPath) {
      this.$router.replace({ path: newPath });
      this.currentModule = newPath;
    },
  },
  destroyed() {},
  components: {}
};
</script>
<style scoped>
  .func-btn{
    margin: 0 8px;
    cursor: pointer;
  }
</style>
