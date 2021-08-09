<template>
  <div class="conWrap" v-loading="loading">
    <div class="conBox">
      <addMatch ref="MatchTemp" v-on:listenMatch="getMatchMsg"></addMatch>
      <addGroup ref="GroupTemp" v-on:listenGroup="getGroupMsg" @forBigCard="forBigCard"></addGroup>
      <el-button class="subBtn" type="primary" @click="submitForm()">提交审核</el-button>
    </div>
  </div>
</template>

<script>
import addMatch from "../component/match/add_1";
import addGroup from "../component/match/add_2";
export default {
  components: {
    addMatch,
    addGroup,
  },
  data() {
    return {
      matchMsg: "",
      groupMsg: "",
      loading: false,
    };
  },
  methods: {
    // 组件传值 获取赛事信息
    getMatchMsg(data) {
      // console.log("赛事", data);
      this.matchMsg = data;
    },
    // 组件传值 获取赛项信息
    getGroupMsg(data) {
      // console.log("赛项", data);
      this.groupMsg = data;
    },
    // 为了调用赛事组件中的兄弟传值事件
    forBigCard() {
      this.$refs.MatchTemp.putCPList();
    },
    submitForm() {
      // console.log(window.sessionStorage.getItem('orgId'));
      this.$refs.MatchTemp.MatchForm("ruleForm");
      this.$refs.GroupTemp.groupFrom();
      let that=this
      setTimeout(() => {
        that.save()
      }, 200);
    },
    save(){
      if (this.matchMsg == "" || this.groupMsg == "") {
        console.log(
          this.matchMsg,
          this.groupMsg,
          this.matchMsg == "",
          this.groupMsg == ""
        );
        this.$notify({
          title: "提示",
          message: "请完善信息",
          type: "warning",
          duration: 3000,
        });
      } else {
        this.loading = true;
        console.log(this.matchMsg, this.groupMsg);
        this.matchMsg.orgId = window.sessionStorage.getItem("orgId");
        let place = "";
        this.matchMsg.place.forEach((vv) => {
          place += vv + "-";
        });
        if (this.matchMsg.state) {
          this.matchMsg.state = 0;
        } else {
          this.matchMsg.state = 1;
        }
        if (this.matchMsg.atWill) {
          this.matchMsg.atWill = 1;
        } else {
          this.matchMsg.atWill = 0;
        }
        this.groupMsg.forEach((vv) => {
          vv.wholeCourse = Number(vv.wholeCourse);
          vv.rise = Number(vv.rise);
          vv.descend = Number(vv.descend);
          vv.joinNum = Number(vv.joinNum);
          vv.maxAge = Number(vv.maxAge);
          vv.minAge = Number(vv.minAge);
          vv.birthdayNum = Number(vv.birthdayNum);
          vv.signUpNum = Number(vv.signUpNum);
          vv.signUpRatio = Number(vv.signUpRatio);
          vv.joinRatio = Number(vv.joinRatio);
          vv.info.forEach((dd) => {
            dd.distance = Number(dd.distance);
            if (this.$newActive) {
              dd.endDate = dd.longitude + ";" + dd.latitude;
            }
            dd.rise = Number(dd.rise);
            dd.descend = Number(dd.descend);
          });
        });
        this.matchMsg.place = place.substr(0, place.length - 1);
        this.matchMsg.matchInfo = this.groupMsg;
        this.matchMsg.scale = Number(this.matchMsg.scale);
        this.$axios
          .post("/match/addMatch", this.matchMsg)
          .then((res) => {
            this.loading = false;
            // console.log(res);
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              showClose: false,
              closeOnClickModal: false,
              type: "success",
              callback: (action) => {
                if (action == "confirm") {
                  this.$router.push("/MatchList");
                }
              },
            });
          })
          .catch((err) => {
            console.log(err);
            this.$alert("提交失败", "提示", {
              confirmButtonText: "确定",
            });
          });
      }
    }
  },
  mounted() {
    let divTop = document.getElementsByClassName("content-box")[0];
    divTop.scrollTop = 0;
  },
};
</script>


<style lang="scss" scoped>
.conBox {
  @include conBox();
  .subBtn {
    // margin-left: 100px;
    margin: 0 auto;
    margin-top: 15px;
  }
}
</style>