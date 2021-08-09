<template>
  <el-form class="setPWrap" ref="passForm" :model="passForm" label-width="100px">
    <el-form-item label="旧密码" required>
      <el-input v-model="passForm.oldPwd" show-password placeholder="请输入旧密码"></el-input>
    </el-form-item>
    <el-form-item label="新密码" required>
      <el-input v-model="passForm.newpwd" show-password placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" required>
      <el-input v-model="passForm.surepwd" show-password placeholder="请确认新密码"></el-input>
    </el-form-item>
    <el-form-item>
      <span>注 * : 密码长度不得小于6位</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="savePass">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      passForm: {
        orgId: "",
        oldPwd: "",
        newpwd: "",
        surepwd: "",
      },
    };
  },
  methods: {
    savePass() {
      if (!this.passForm.oldPwd) {
        this.$message.error("请输入旧密码");
        return false;
      }
      if (!this.passForm.newpwd) {
        this.$message.error("请输入新密码");
        return false;
      }
      if (this.passForm.newpwd == this.passForm.oldPwd) {
        this.$message.error("新密码与旧密码相同，请重新设置");
        return false;
      }
      if (this.passForm.newpwd.length < 6) {
        this.$message.error("新密码长度不得小于6位");
        return false;
      }
      if (!this.passForm.surepwd) {
        this.$message.error("请输入确认密码");
        return false;
      }
      if (this.passForm.newpwd != this.passForm.surepwd) {
        this.$message.error("新密码与确认密码不一致");
        return false;
      }
      this.$axios.post("/org/setPayPassword", this.passForm).then((res) => {
        let rr = res.data.data;
        if (rr == 1) {
          this.$message.success("修改成功");
          this.passForm.oldPwd = "";
          this.passForm.newpwd = "";
          this.passForm.surepwd = "";
          this.$forceUpdate();
        } else {
          this.$message(rr);
        }
      });
    },
  },
  mounted() {
    this.passForm.orgId = sessionStorage.getItem("orgId");
  },
};
</script>
<style lang="scss" scoped>
.setPWrap {
  @include padShow();
}
</style>