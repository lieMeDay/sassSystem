<template>
  <!-- 团报信息 -->
  <!-- 直接报名 拼团报名 -->
  <div class="set_group">
    <el-select class="cMB" v-model="mId" placeholder="请选择赛事" @change="getGroupWork()">
      <el-option v-for="item in M_arr" :key="item.matchId" :label="item.name" :value="item.matchId"></el-option>
    </el-select>
    <el-collapse accordion class="collapse">
      <el-collapse-item v-for="(v,i) in g_arr" :key="i">
        <template slot="title">
          <el-form :inline="true" class="formTit">
            <el-form-item label="赛项名称：">
              <span>{{v.name}}</span>
            </el-form-item>
            <el-form-item label="报名价格：">
              <span>{{v.price}}</span>
            </el-form-item>
            <el-form-item label="拼团价格：">
              <span>{{v.formCon.priceMember?v.formCon.priceMember:'暂无'}}</span>
            </el-form-item>
          </el-form>
        </template>
        <el-form label-width="100px">
          <el-form-item label="拼团人数">
            <el-input
              type="age"
              v-model.number="v.formCon.personNum"
              autocomplete="off"
              placeholder="请输入拼团人数（范围2到20人）"
              @input="$forceUpdate()"
            ></el-input>
          </el-form-item>
          <el-form-item label="拼团有效期">
            <el-select
              v-model="v.formCon.dd"
              placeholder="天"
              @change="$forceUpdate()"
              class="validity"
              clearable
            >
              <el-option v-for="item in ddArr" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select
              v-model="v.formCon.hh"
              placeholder="时"
              @change="$forceUpdate()"
              class="validity"
              clearable
            >
              <el-option v-for="item in hhArr" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select
              v-model="v.formCon.mm"
              placeholder="分"
              @change="$forceUpdate()"
              class="validity"
              clearable
            >
              <el-option v-for="item in mmArr" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select
              v-model="v.formCon.ss"
              placeholder="秒"
              @change="$forceUpdate()"
              class="validity"
              clearable
            >
              <el-option v-for="item in ssArr" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="团长奖励">
            <el-input
              v-model="v.formCon.priceLeader"
              autocomplete="off"
              @input="$forceUpdate()"
              placeholder="请输入团长开团奖励金额（拼团失败后会扣除）"
            ></el-input>
          </el-form-item>
          <el-form-item label="拼团价">
            <el-input
              v-model="v.formCon.priceMember"
              autocomplete="off"
              placeholder="请输入拼团价（拼团失败原路返回）"
              @input="$forceUpdate()"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否包含邀请奖励金规则">
            <el-switch
              v-model="v.formCon.ifInvite"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="$forceUpdate()"
            ></el-switch>
          </el-form-item>
          <el-form-item label="拼团规则">
            <el-input
              v-model="v.formCon.info"
              type="textarea"
              @input="$forceUpdate()"
              placeholder="请输入拼团规则"
              :autosize="{ minRows: 5, maxRows: 10}"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(v)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
var formCon = {
  matchId: "",
  groupId: "",
  personNum: "", // 拼团人数
  duration: "", // 有效期 秒
  priceMember: "", // 拼团价
  priceLeader: "", // 团长奖励
  info: "", // 拼团规则
  ifInvite: "0", // 是否享受邀请奖励
  dd: "", // 天
  hh: "", //小时
  mm: "15", // 分
  ss: "", // 秒
};
export default {
  data() {
    return {
      M_arr: [],
      g_arr: [],
      mId: "",
      ddArr: [],
      hhArr: [],
      mmArr: [],
      ssArr: [],
    };
  },
  methods: {
    onSubmit(val) {
      console.log(val);
      if (val.formCon.personNum < 2) {
        this.$message.warning("拼团人数不得小于2人");
        return false;
      }
      if (val.formCon.personNum > 20) {
        this.$message.warning("拼团人数不得大于20人");
        return false;
      }
      let duration = "";
      let vd = val.formCon.dd * 86400;
      let vh = val.formCon.hh * 3600;
      let vm = val.formCon.mm * 60;
      let vs = val.formCon.ss;
      duration = vd + vh + vm + vs;
      if (duration < 900) {
        this.$message.warning("拼团时间不得小于15分钟");
        return false;
      }
      if (!val.formCon.priceMember) {
        this.$message.warning("请输入拼团价格");
        return false;
      }
      let oo = val.formCon;
      oo.matchId = this.mId;
      oo.groupId = val.groupId;
      oo.duration = duration;
      console.log(oo);
      // 添加 修改
      this.$axios.post("/sigUp/team/putMatchGroupTeam", oo).then((res) => {
        let rr = res.data.data;
        val.formCon.id = rr;
        this.$forceUpdate();
        this.$message.success("操作成功");
      });
    },
    //   查询可团报赛事
    get_can_match() {
      let orgId = window.sessionStorage.getItem("orgId");
      this.$axios
        .get("/match/getMatchInfoByorgId?orgId=" + orgId)
        .then((res) => {
          let rr = res.data.data;
          if (rr.length > 0) {
            this.M_arr = rr;
            this.mId = rr[0].matchId;
            rr[0].list.forEach((v) => {
              v.formCon = JSON.parse(JSON.stringify(formCon));
            });
            this.g_arr = rr[0].list;
            this.getGroupWork();
          }
        });
    },
    // 根据matchId 查询该活动下的拼团活动
    getGroupWork() {
      this.$axios
        .get("/signUp/team/getMatchGroupTeamByMatchId?matchId=" + this.mId)
        .then((res) => {
          let rr = res.data.data;
          if (rr) {
            let ss = [];
            rr.forEach((v) => {
              if (v.id) {
                ss.push({
                  groupId: v.groupId,
                  name: v.name,
                  price: v.price,
                  formCon: {
                    personNum: v.personNum, // 拼团人数
                    duration: v.duration, // 有效期 秒
                    priceMember: v.priceMember, // 拼团价
                    priceLeader: v.priceLeader, // 团长奖励
                    info: v.info, // 拼团规则
                    ifInvite: v.ifInvite, // 是否享受邀请奖励
                    dd: parseInt(v.duration / 86400), // 天
                    hh: parseInt((v.duration % 86400) / 3600), //小时
                    mm: parseInt(((v.duration % 86400) % 3600) / 60), // 分
                    ss: parseInt(((v.duration % 86400) % 3600) % 60), // 秒
                  },
                });
              } else {
                ss.push({
                  groupId: v.groupId,
                  name: v.name,
                  price: v.price,
                  formCon: JSON.parse(JSON.stringify(formCon)),
                });
              }
            });
            //   console.log(ss)
            this.g_arr = ss;
          }
        });
    },
  },
  created() {
    for (var a = 1; a <= 15; a++) {
      this.ddArr.push(a);
    }
    for (var a = 1; a <= 23; a++) {
      this.hhArr.push(a);
    }
    for (var a = 15; a <= 59; a++) {
      this.mmArr.push(a);
    }
    for (var a = 1; a <= 59; a++) {
      this.ssArr.push(a);
    }
    this.get_can_match();
  },
};
</script>
<style lang="scss" scoped>
.set_group {
  @include padShow();
  width: 100%;
  padding: 0;
  .collapse {
    margin-top: 16px;
  }
  .formTit {
    width: 100%;
    line-height: 40px;
    >>> .el-form-item {
      margin-bottom: 0;
    }
  }
  .validity {
    width: 80px;
  }
}
.cMB{
  width: 300px;
}
</style>