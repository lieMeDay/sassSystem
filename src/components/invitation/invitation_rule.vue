<template>
  <!-- 邀请规则设置 -->
  <div class="inv_rule">
    <el-form :inline="true">
      <el-form-item label="赛事选择">
        <el-select v-model="matchId" class="cmB" placeholder="请选择" @change="getGroup()">
          <el-option v-for="item in mArr" :key="item.id" :label="item.name" :value="item.matchId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赛项选择">
        <el-select v-model="groupId" placeholder="请选择" @change="getRule()">
          <el-option v-for="item in gArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <table class="tab">
      <tr>
        <td class="r_item">邀请最小人数</td>
        <td class="r_item">邀请最大人数</td>
        <td class="r_item">邀请礼金</td>
        <td class="r_item">操作</td>
      </tr>
      <tr v-for="(v,i) in list" :key="i">
        <td class="r_item">
          <el-input v-model.number="v.numMin" placeholder="请输入"></el-input>
        </td>
        <td class="r_item">
          <el-input v-model.number="v.numMax" placeholder="请输入"></el-input>
        </td>
        <td class="r_item">
          <el-input v-model="v.money" placeholder="请输入"></el-input>
        </td>
        <td class="r_item">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="list.splice(i,1);"
            v-show="i!=0"
          ></el-button>
        </td>
      </tr>
      <tr>
        <td class="r_all r_item" colspan="4" @click="addRule">添加规则</td>
      </tr>
    </table>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          numMin: "",
          numMax: "",
          money: "",
          id: 0,
        },
      ],
      matchId: "",
      groupId: "",
      mArr: [],
      gArr: [],
    };
  },
  methods: {
    get_sgin_up() {
      // console.log(window.sessionStorage.getItem('orgId'))
      let orgId = window.sessionStorage.getItem("orgId");
      // console.log(orgId)
      this.$axios.get("/match/signUp/getByOrgId?orgId=" + orgId).then((res) => {
        let rr = res.data.data;
        this.mArr = rr;
        if (rr.length > 0) {
          this.matchId = rr[0].matchId;
          this.getGroup();
        }
      });
    },
    getGroup() {
      this.$axios
        .get("/match/getMatchById?matchId=" + this.matchId)
        .then((res) => {
          let rr = res.data.data.matchInfo;
          this.gArr = rr;
          if (rr.length > 0) {
            this.groupId = rr[0].id;
            this.getRule();
          }
        });
    },
    addRule() {
      this.list.push({
        numMin: "",
        numMax: "",
        money: "",
        id: 0,
      });
    },
    getRule() {
      let oo = { matchId: this.matchId, groupId: this.groupId };
      this.$axios
        .get("/signUp/member/getInviteRule", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          if (rr.length == 0)
            rr = [{
              numMin: "",
              numMax: "",
              money: "",
              id: 0,
            }]
          this.list = rr;
        });
    },
    save() {
      let i = this.list.findIndex((v) => {
        if (!v.numMin || !v.numMax || !v.money) {
          return v;
        }
      });
      if (i >= 0) {
        this.$message.error("请填写完整");
        return false;
      }
      let oo = {
        matchId: this.matchId,
        groupId: this.groupId,
        list: this.list,
      };
      this.$axios.post("signUp/member/putInviteRule", oo).then((res) => {
          this.getRule()
      });
    },
  },
  created() {
    this.get_sgin_up();
  },
};
</script>
<style lang="scss" scoped>
.inv_rule {
  @include padShow();
  width: 100%;
  padding: 0;
}
.cmB{
  width: 350px;
}
.tab {
  width: 100%;
  overflow: hidden;
  line-height: 40px;
  text-align: center;
  border-top: 1px solid #f3f3f3;
  margin-bottom: 16px;
  tr {
    border-bottom: 1px solid #f3f3f3;
    border-left: 1px solid #f3f3f3;
    .r_item {
      border-right: 1px solid #f3f3f3;
      padding: 5px;
    }
    .r_all {
      cursor: pointer;
    }
  }
}
</style>