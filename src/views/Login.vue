<template>
  <div class="login">
    <el-button type="primary" @click="login">login</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Login",
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
    if (this.$store.state.userData.token !== "") this.$router.replace({ path: "/" });
  },
  mounted() {},
  methods: {
    login() {
      // 存到store中
      let token = "b6153be0a96c49919816bf57d84771fb3230143e";
      this.$store.commit("updateToken", token);

      let userData = { name: '周俊楠', role: 'sa', tel: '18861245080', id: 'gfkj_syss_', avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F17%2F20190117141205_tabod.thumb.700_0.jpg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637205534&t=fcb51b9466c0c0abfc0c50e34b756640', company: '国防科技集团', dept: '软件系统与信息安全部', title: '总工程师', token: token}
      this.$store.commit("updateUserData", userData);

      this.$router.replace({ path: "/" });
    }
  },
  destroyed() {},
  components: {}
};
</script>
