
<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="true"
      label-width="80px"
      class="login-box"
    >
      <el-form-item class="aMargin" prop="userName">
        <el-input
          prefix-icon="el-icon-user"
          type="text"
          placeholder="请输入账号"
          v-model="form.userName"
        />
      </el-form-item>
      <el-form-item class="aMargin" prop="passWord">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          placeholder="请输入密码"
          v-model="form.passWord"
        />
      </el-form-item>
      <el-form-item>
        <div class="lf">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div>
        <div class="rf">忘记密码？</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('loginForm')" class="loginBtn">登录</el-button>
      </el-form-item>
      <el-form-item class="gozc">
        <span class="NoUser" @click="goReg">没有账号，去注册>></span>
      </el-form-item>
    </el-form>
    <div class="loginTips">绿图科技有限公司版权所有</div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        userName: "",
        passWord: "",
      },
      // userErrorMsg:"",//账户输入错误提示
      // passErrorMsg:"",//密码输入错误提示
      checked: true,
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        userName: [
          { required: true, message: "账号不可为空", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "密码不可为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    goReg() {
      console.log(11);
      this.$router.push("/register");
    },
    onSubmit(formName) {
      // console.log(this.$cookie)
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.userErrorMsg='请输入正确账户'
          // console.log(this.$cookie.get('cookieId'))
          // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
          // this.$router.push("/main");
          // console.log(this.form)
          this.$axios
            .post("/org/client/login", this.form)
            .then((res) => {
              if (res.data.code == 200) {
                // Vue.prototype.$id = res.data.data.id;
                // console.log(this.$id)
                // 记住密码
                if (this.checked == true) {
                  window.sessionStorage.setItem("orgId", res.data.data.id);
                  window.sessionStorage.setItem(
                    "orgPower",
                    res.data.data.power
                  );
                  this.$cookie.set("cookieId", res.data.data, 7 * 60 * 60 * 24);
                } else {
                  window.sessionStorage.setItem("orgId", res.data.data.id);
                  window.sessionStorage.setItem(
                    "orgPower",
                    res.data.data.power
                  );
                }
                // this.$router.push("/home");
                this.$router.push("/MatchList");
                // console.log(this.$cookie.get("cookieId"));
              } else {
                this.$message.error("该账号未注册");
              }
            })
            .catch((err) => {
              this.$message.error("该账号未注册");
            });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    // console.log(this.$store.state.id)
    // let cook = this.$cookie.get("cookieId");
    // if (cook && cook.remPas && cook.remPas == true) {
    //   this.$router.push("/home");
    // }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/logon/login";
</style>