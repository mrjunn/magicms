import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : { name: '', role: '', tel: '', id: '', avatar: '', company: '', dept: '', title: '', token: ''},
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    menus: localStorage.getItem('menus') ? JSON.parse(localStorage.getItem('menus')) : [],
  },
  mutations: {
    updateToken(state, token) {
      state.token = token
      // 写入到localStorage中
      if (token === '') localStorage.removeItem('token')
      else localStorage.setItem('token', token);
    },
    updateUserData(state, userData) {
      state.userData = userData
      // 写入到localStorage中
      if (Object.keys(userData).length === 0) localStorage.removeItem('userData')
      else localStorage.setItem('userData', JSON.stringify(userData));
    },
    updateMenus(state, menus) {
      state.menus = menus;
      // 写入到localStorage中
      if (menus.length === 0) localStorage.removeItem('menus')
      else localStorage.setItem('menus', JSON.stringify(menus));
    },
  },
  actions: {
  },
  modules: {
  }
})
