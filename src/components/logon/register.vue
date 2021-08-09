
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
      <el-form-item class="aMargin" prop="companyName">
        <el-input
          prefix-icon="el-icon-user"
          type="text"
          placeholder="请输入企业名称"
          v-model="form.companyName"
        />
      </el-form-item>
      <el-form-item class="aMargin" prop="eMail">
        <el-input prefix-icon="el-icon-lock" placeholder="请输入企业邮箱" v-model="form.eMail" />
      </el-form-item>
      <el-form-item class="aMargin" prop="bizLicense">
        <div class="imgBtn">
          上传营业执照
          <input type="file" name id accept="image/*" @change="upImg" />
        </div>
        <div class="imgBox" v-show="form.bizLicense">
          <i class="el-icon-document"></i>
          <span>{{picName}}</span>
          <i class="el-icon-close delPic" @click="form.bizLicense='';picName=''"></i>
        </div>
      </el-form-item>
      <el-form-item class="aMargin" prop="contacts">
        <el-input prefix-icon="el-icon-lock" placeholder="请输入企业联系人" v-model="form.contacts" />
      </el-form-item>
      <el-form-item class="aMargin" prop="idCard">
        <el-input prefix-icon="el-icon-lock" placeholder="请输入证件号" v-model="form.idCard" />
      </el-form-item>
      <el-form-item class="aMargin" prop="phone">
        <el-input prefix-icon="el-icon-lock" placeholder="请输入手机号" v-model="form.phone" />
      </el-form-item>
      <el-form-item class="aMargin code">
        <el-input v-model="form.sendcode" placeholder="请输入验证码"></el-input>
        <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==false">发送验证码</el-button>
        <el-button
          type="button"
          @click="sendcode"
          :disabled="disabled"
          v-if="disabled==true"
        >{{btntxt}}</el-button>
      </el-form-item>
      <el-form-item class="aMargin" prop="passWord">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          placeholder="请设置密码"
          v-model="form.passWord"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('loginForm')" class="loginBtn">注册</el-button>
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
        companyName: "", // 企业名称；
        eMail: "", // 邮箱；
        bizLicense: "", // 营业执照；
        contacts: "", //  联系人；
        idCard: "", //  证件号；
        phone: "", // 手机号；
        passWord: "", //  密码；
        sendcode: "", //验证码 ==>提交时删除
        state: "0",
        power: "0",
      },
      code: "", //发送过来的验证码
      picName: "",
      disabled: false,
      time: 0,
      btntxt: "重新发送",
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        companyName: [
          { required: true, message: "企业名称不可为空", trigger: "blur" },
        ],
        eMail: [
          { required: true, message: "邮箱不可为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        bizLicense: [
          { required: true, message: "营业执照不可为空", trigger: "blur" },
        ],
        contacts: [
          { required: true, message: "联系人不可为空", trigger: "blur" },
        ],
        idCard: [
          { required: true, message: "证件号不可为空", trigger: "blur" },
        ],
        phone: [{ required: true, message: "手机号不可为空", trigger: "blur" }],
        sendcode: [
          { required: true, message: "验证码不可为空", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "密码不可为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //手机验证发送验证码
    sendcode() {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.form.phone == "") {
        this.$message({
          message: "手机号不能为空",
          center: true,
        });
        return;
      }
      if (!reg.test(this.form.phone)) {
        this.$message({
          message: "请输入正确的手机号",
          center: true,
        });
        return;
      } else {
        console.log(this.form.phone);
        this.$axios
          .post("/match/message", {
            phone: this.form.phone,
          })
          .then((res) => {
            this.code = res.data.data.code;
            this.$message({
              message: "发送成功",
              type: "success",
              center: true,
            });
          });
        this.time = 10;
        this.disabled = true;
        this.timer();
      }
    },
    //60S倒计时
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + "s后重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = "获取验证码";
        this.disabled = false;
      }
    },
    upImg(e) {
      // console.log(e);
      let file = e.target.files[0];
      this.picName = file.name;
      let param = new FormData(); //创建form对象
      param.append("img", file); //通过append向form对象添加数据
      // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      this.$axios
        .post("/org/uploadImg", param, config)
        .then((res) => {
          // console.log(res.data);
          this.form.bizLicense = res.data.data.filePath;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSubmit(formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.userErrorMsg = "请输入正确账户";
          // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
          // this.$router.push("/main");
          if (this.form.sendcode == this.code) {
            console.log(this.form);
            delete this.form.sendcode;
            this.$axios.post("/org/client/logon", this.form).then((res) => {
              this.$message.success("注册成功");
              history.back();
              // this.$alert("这是一段内容", "标题名称", {
              //   confirmButtonText: "确定",
              //   callback: action => {
              //     this.$message({
              //       type: "info",
              //       message: `action: ${action}`
              //     });
              //   }
              // });
            });
          } else {
            this.$message.error("请输入正确验证码");
          }
        } else {
          return false;
        }
      });
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/logon/login";
.login {
  width: 100%;
  /* height: 100vh; */
  height: 100%;
  background: #f0edf1 url(/static/images/a.jpg) no-repeat top center;
  background-size: 100% 50%;
  min-width: 1200px;
  min-height: 900px;
  position: absolute;
  .login-box {
    top: 63%;
    .imgBtn {
      width: 105px;
      float: left;
      line-height: 40px;
      position: relative;
      color: #fff;
      background-color: #409eff;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      input {
        opacity: 0;
        width: 100%;
        height: 40px;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .imgBox {
      width: calc(100% - 105px);
      // float: right;
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
      overflow: hidden;
      > * {
        float: left;
      }
      > span {
        width: calc(100% - 40px);
        max-width: 240px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      > i,
      .delPic {
        // float: right;
        width: 20px;
        height: 20px;
        margin-top: 10px;
        text-align: center;
        line-height: 20px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
.code {
  .el-input {
    width: 55%;
    border-radius: 0px;
    float: left;
    // display: inline-block;
  }
  .el-button {
    width: calc(45% - 5px);
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-left: 0px;
    float: left;
    // display: inline-block;
  }
}
</style>