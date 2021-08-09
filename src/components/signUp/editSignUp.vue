<template>
  <!-- 添加报名 -->
  <div class="AddUp">
    <div class="Update">
      <div class="UpdateCon">
        <div>
          <span>赛事名称：</span>
          <span>{{matchName}}</span>
        </div>
        <div v-if="!$newActive">
          <span>报名时间：</span>
          <el-date-picker
            type="datetimerange"
            v-model="BMdate"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy/MM/dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
      </div>
    </div>
    <div v-if="signMsg.type!='A'">
      <up-list ref="group" :groupInfo="groupInfo" :BMdate="BMdate" v-on:listenGroup="getGroupRule"></up-list>
      <!-- <up-must></up-must> -->
      <up-no-must ref="noMust" :noMust="signMsg" v-on:message="ListenMessage"></up-no-must>
      <div class="btnBox">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div v-else>
      <actSgin :power="signMsg.power" @getF="getF" ref="AS"></actSgin>
      <div class="btnBox">
        <el-button type="primary" @click="saveAct">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import upList from "../component/signUp/Uplist";
// import upMust from "../component/signUp/UpMust";
import upNoMust from "../component/signUp/editUpNoMust";
import actSgin from "../component/signUp/act_sgin";
var actPower = {};
export default {
  components: {
    upList,
    // upMust,
    upNoMust,
    actSgin,
  },
  data() {
    return {
      signMsg: {},
      matchList: [],
      matchId: "",
      matchName: "",
      BMdate: "",
      bigMsg: {},
      groupInfo: [],
      refundRules: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      ruleMsg: {},
      groupMsg: [],
    };
  },
  methods: {
    // 获取赛事
    getMatch() {
      this.$axios
        .get("/match/signUp/get?id=" + this.$route.query.i)
        .then((res) => {
          this.signMsg = res.data.data;
          if (this.signMsg.ifRefund == "是") {
            this.signMsg.radio = 1;
          } else {
            this.signMsg.radio = 2;
          }
          this.signMsg.refundRules.forEach((v) => {
            v.refundDate = v.refundDate.split([";"]);
          });
          this.matchName = this.signMsg.name;
          this.BMdate = [this.signMsg.startDate, this.signMsg.endDate];
          this.groupInfo = this.signMsg.matchInfo;
          if (!this.$newActive) {
            this.groupInfo.forEach((v, i) => {
              v.priceList.forEach((vv, ii) => {
                vv.rule = JSON.parse(vv.rule);
              });
            });
          }
        });
    },
    // 获取选择赛事信息
    AjaxMsg(value) {
      let obj = { matchId: this.$route.query.id };
      this.matchId = value;
      this.$axios
        .get("/match/getMatchById", { params: obj })
        .then((res) => {
          this.bigMsg = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$router.push({
            path: "/404",
          });
        });
    },
    // 获取子组件赛项信息
    getGroupRule(data) {
      // console.log(data);
      this.groupMsg = data;
      // console.log(this.groupMsg)
    },
    // 获取是否退款及表单
    ListenMessage(data) {
      // console.log(data)
      this.ruleMsg = data;
    },
    // 保存
    save() {
      this.$refs.group.putMsg();
      this.$refs.noMust.putMsg();
      var list = {
        id: this.signMsg.id,
        matchId: this.signMsg.matchId,
        orgId: this.signMsg.orgId,
        name: this.bigMsg.name, //赛事名称
        type: this.bigMsg.type, //赛事类型
        logo: this.bigMsg.logo, //赛事logo
        royalty: 0.12, //佣金比例
        startDate: this.BMdate[0], //报名开始时间
        endDate: this.BMdate[1], //报名结束时间
        beginDate: this.bigMsg.matchDate, //比赛开始时间
        place: this.bigMsg.place, //赛事地点
        power: this.ruleMsg.power, //报名报单
        ifRefund: this.ruleMsg.ifRefund, //是否退款
        refundRules: this.ruleMsg.refundRules, //退款规则
        // introduce: that.$refs.getContent.content //图文介绍
        // shopLinks:this.ruleMsg.shopLinks,
        // shopImg:this.ruleMsg.shopImg,
        // shopName:this.ruleMsg.shopName,
        matchInfo: [],
      };
      list.power.id = this.signMsg.power.id;
      list.power.matchId = this.signMsg.power.matchId;
      let entryArr = [];
      this.groupMsg.forEach((vv) => {
        // 赛项规则
        let obj = {};
        obj.id = vv.id;
        obj.matchId = vv.matchId;
        obj.groupId = vv.groupId;
        obj.name = vv.name;
        obj.startDate = vv.startDate;
        obj.endDate = vv.endDate;
        obj.distance = vv.distance;
        obj.rise = vv.rise;
        obj.peopleNum = Number(vv.peopleNum);
        obj.price = Number(vv.price);
        obj.priceList = vv.priceList;
        list.matchInfo.push(obj);
        // 参赛号规则
        let etObj = {};
        etObj.matchId = vv.matchId;
        etObj.groupId = vv.groupId;
        etObj.prefix = vv.prefix;
        etObj.startNumber = vv.startNumber;
        etObj.numberDigit = vv.numberDigit;
        etObj.id = vv.entryRuleId;
        if (vv.ifSex) {
          etObj.ifSex = 1;
        } else {
          etObj.ifSex = 0;
        }
        entryArr.push(etObj);
      });
      // console.log(list);
      if (this.$newActive) {
        this.activeSave(list);
      } else {
        this.normalSave(list, entryArr);
      }
    },
    // 普通保存
    normalSave(list, entryArr) {
      if (this.BMdate == "") {
        this.$message.warning("请选择报名时间");
      } else {
        let a = list.matchInfo.filter((v) => v.peopleNum == "");
        let b = list.matchInfo.filter((v) => v.price < 0);
        let c = list.matchInfo;
        let flag = true;
        for (var n = 0; n < c.length; n++) {
          let dd = c[n].priceList;
          for (var m = 0; m < dd.length; m++) {
            for (var key in dd[m]) {
              if (!dd[m][key]) {
                flag = false;
                break;
              }
            }
          }
        }
        let d = entryArr.filter((v) => !v.prefix || v.prefix == "");
        let e = entryArr.filter((v) => !v.startNumber || v.startNumber == "");
        let f = entryArr.filter((v) => !v.numberDigit || v.numberDigit == "");
        let rr = [];
        if (list.ifRefund == "是") {
          rr = list.refundRules.filter(
            (v) => v.refundDate == "" || v.refundRatio == ""
          );
        }
        if (a.length > 0) {
          this.$message.warning("请填写招募人数");
        } else if (b.length > 0) {
          this.$message.warning("请输入报名费");
        } else if (!flag) {
          this.$message.warning("请填写优惠策略");
        } else if (d.length > 0 && list.matchInfo.length > 1) {
          this.$message.warning("请添加赛项前缀");
        } else if (e.length > 0) {
          this.$message.warning("请添加开始号码");
        } else if (f.length > 0) {
          this.$message.warning("请添加号码位数");
        } else if (list.ifRefund == "是" && rr.length > 0) {
          this.$message.warning("请填写退款策略");
        } else {
          list.matchInfo.forEach((v) => {
            v.priceList.forEach((d) => {
              d.price = Number(d.price);
              d.rule = JSON.stringify(d.rule);
            });
          });
          if (list.ifRefund == "是") {
            list.refundRules.forEach((v) => {
              v.refundDate = v.refundDate[0] + ";" + v.refundDate[1];
            });
          }
          // console.log(list);
          this.$axios
            .put("/match/signUp/put", list)
            .then((res) => {
              // console.log(entryArr)
              entryArr.forEach((dd, ss) => {
                dd.startNumber = Number(dd.startNumber);
                dd.numberDigit = Number(dd.numberDigit);
                this.$axios
                  .put("/match/entryNumberFactory/put", dd)
                  .then((res) => {
                    if (ss == entryArr.length - 1) {
                      this.$alert("修改成功", "提示", {
                        confirmButtonText: "确定",
                        showClose: false,
                        closeOnClickModal: false,
                        type: "success",
                        callback: (action) => {
                          if (action == "confirm") {
                            this.$router.push("/upList");
                          }
                        },
                      });
                    }
                  });
              });
            })
            .catch((err) => {
              this.$alert("修改失败", "提示", {
                confirmButtonText: "确定",
                showClose: false,
                closeOnClickModal: false,
                type: "error",
              });
            });
        }
      }
    },
    // 活动保存
    activeSave(list) {
      let c = list.matchInfo;
      let flag = true;
      for (var n = 0; n < c.length; n++) {
        let dd = c[n].priceList;
        for (var m = 0; m < dd.length; m++) {
          if (dd[m].name == "") {
            flag = false;
            break;
          }
        }
      }
      if (!flag) {
        this.$message.warning("请填写商品");
      } else {
        this.$axios
          .put("/match/signUp/put", list)
          .then((res) => {
            this.$alert("修改成功", "提示", {
              confirmButtonText: "确定",
              showClose: false,
              closeOnClickModal: false,
              type: "success",
              callback: (action) => {
                if (action == "confirm") {
                  this.$router.push("/upList");
                }
              },
            });
          })
          .catch((err) => {
            this.$alert("修改失败", "提示", {
              confirmButtonText: "确定",
              showClose: false,
              closeOnClickModal: false,
              type: "error",
            });
          });
      }
    },
    // 活动招募 报名表单
    getF(v) {
      actPower = v;
      actPower.id = this.signMsg.power.id;
      actPower.matchId = this.signMsg.power.matchId;
    },
    saveAct() {
      this.$refs.AS.putF(); // 触发多选框传值
      var list = {
        name: this.bigMsg.name, //赛事名称
        type: this.bigMsg.type, //赛事类型
        logo: this.bigMsg.logo, //赛事logo
        royalty: 0.12, //佣金比例
        startDate: this.BMdate[0], //报名开始时间
        endDate: this.BMdate[1], //报名结束时间
        beginDate: this.bigMsg.matchDate, //比赛开始时间
        place: this.bigMsg.place, //赛事地点
        power: actPower, //报名报单
        // ifRefund: this.ruleMsg.ifRefund, //是否退款
        // refundRules: this.ruleMsg.refundRules, //退款规则
        matchInfo: [],
      };
      list.orgId = Number(window.sessionStorage.getItem("orgId"))
      list.matchId = Number(this.signMsg.matchId);
      list.id=this.signMsg.id
      console.log(list);
      this.$axios.post("/match/signUp/putNew", list).then((res) => {
      let rr = res.data.data;
      this.$alert("修改成功", "提示", {
        confirmButtonText: "确定",
        showClose: false,
        closeOnClickModal: false,
        type: "success",
        callback: (action) => {
          if (action == "confirm") {
            this.$router.push("/upList");
          }
        },
      });
      });
    },
  },
  created() {
    this.getMatch();
    this.AjaxMsg();
  },
};
</script>

<style lang="scss" scoped>
.AddUp {
  // width:calc(100% - 40px);
  // padding:20px;
  overflow: hidden;
  .Update {
    width: calc(100% - 40px);
    padding: 20px;
    background-color: #fff;
    margin: 20px auto;
    .UpdateCon {
      width: calc(100% - 40px);
      //   border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0 10px;
      line-height: 40px;
      overflow: hidden;
      > div {
        float: left;
        margin-right: 20px;
        span {
          float: left;
          margin-right: 10px;
        }
      }
    }
  }
  .btnBox {
    background-color: #fff;
    padding-bottom: 20px;
    > * {
      width: 200px;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>