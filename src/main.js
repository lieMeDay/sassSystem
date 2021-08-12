// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


// 自定义指令
import '@/assets/directive.js'

import '@/assets/style/common.css' //公共样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import fun from '../static/common'
Vue.use(fun);//将全局函数当做插件来进行注册
// 富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor);

// axios
import axios from 'axios'
Vue.prototype.$axios = axios;
// axios.defaults.baseURL = 'http://192.168.62.63:9898'
axios.defaults.baseURL = 'http://report.lvtutech.com/game/'
// Vue.prototype.$img_url = 'http://192.168.0.109:9898'
Vue.prototype.$img_url = 'http://report.lvtutech.com/game/'

// cookie
import VueCookies from 'vue-cookies'
Vue.prototype.$cookie = VueCookies;

function nnGo(cook, to, next) {
  // console.log(cook)
  // cook.id
  window.sessionStorage.setItem('orgId', cook.id)
  window.sessionStorage.setItem('orgPower', cook.power)
  if (cook.power == 4) {
    Vue.prototype.$newActive = true
  } else {
    Vue.prototype.$newActive = false
  }
  if (to.path == '/') {
    // next({
    //   path: '/home'
    // })

    next({
      path: '/MatchList'
    })
  } else {
    next()
  }
}
// 判断登录
router.beforeEach((to, from, next) => {
  let cook = VueCookies.get("cookieId")
  // let sess = window.sessionStorage.getItem('orgId')
  // let sessP= window.sessionStorage.getItem('orgPower')

  if (cook) {
    if (window.performance.navigation.type == 1) {
      // console.log("页面被刷新")
      nnGo(cook, to, next)
    } else if (window.performance.navigation.type == 0) {
      // console.log("首次被加载")
      let user = {
        userName: cook.eMail,
        passWord: cook.passWord
      }
      axios.post("/org/client/login", user).then(res => {
        if (res.data.code == 200) {
          VueCookies.set("cookieId", res.data.data, 7 * 60 * 60 * 24);
          cook = res.data.data
          nnGo(cook, to, next)
        } else {
          VueCookies.remove('cookieId')
          router.push('/')
        }
      }).catch(err => {
        VueCookies.remove('cookieId')
        router.push('/')
      })
    } else {
      nnGo(cook, to, next)
    }
  } else if (to.path == '/' || to.path == '/register') {
    next()
  } else {
    router.push('/')
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
