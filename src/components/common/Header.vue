<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <!-- <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>-->
        <!-- @click="collapseChage" -->
        <div class="logo" :class="{'sm':collapse,'sfact':$newActive}" >
            <i></i>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" content="全屏" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div> -->
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                            <i class="el-icon-bell"></i>
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="static/images/img.png">
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{companyName}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item>账户</el-dropdown-item> -->
                        <!-- <el-dropdown-item>账户管理</el-dropdown-item>
                        <el-dropdown-item>支付记录</el-dropdown-item> -->
                        <!-- divided 线 -->
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      companyName:'',
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2
    };
  },
  computed: {
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        // localStorage.removeItem('ms_username')
        sessionStorage.removeItem('orgId')
        let cook=this.$cookie.get("cookieId")
        if(cook){
          this.$cookie.remove('cookieId')
        }
        this.$router.push("/");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  mounted() {
        let cook=this.$cookie.get("cookieId")
        this.companyName=cook.companyName
        // console.log(cook)
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  /* color: #fff; */
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  /* cursor: pointer; */
  float: left;
  width: 200px;
  height: 70px;
  line-height: 70px;
  background: linear-gradient(
    90deg,
    rgba(96, 197, 255, 1) 0%,
    rgba(66, 138, 245, 1) 100%
  );
}
.header .logo i {
  width: 200px;
  height: 70px;
  float: left;
  background: url("/static/images/bigLogo.png") no-repeat center center;
  background-size: 80%;
}
.header .logo.sfact i{
  background: url("/static/images/sf.jpg") no-repeat center center;
  background-size: 100% 100%;
  /* background-size: contain; */
}
/* .header .logo.sm {
  width: 64px;
}
.header .logo.sm i {
  width: 64px;
  height: 70px;
  float: left;
  background: url("/static/images/smLogo.png") no-repeat center center;
  background-size: 80%;
} */
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  /* color: #fff; */
}
.btn-bell .el-icon-bell {
  /* color: #fff; */
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  /* color: #fff; */
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
