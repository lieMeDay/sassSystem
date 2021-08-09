<template>
  <div class="luckW">
    <el-select
      class="cB"
      v-model="mId"
      placeholder="请选择赛事"
      clearable
      filterable
      @change="getluckList()"
    >
      <el-option v-for="item in mArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-button type="primary" @click="AddEvents()">添加</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="lotteryName" label="活动名称"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="seeLdRecord(row.id)">抽奖记录</el-button>
          <el-button type="text" @click="goPer(row.id)">抽奖人员名单</el-button>
          <el-button type="text" @click="editA(row.id,row.matchId)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//时间戳转换方法    date:时间戳数字
function formatDate(date) {
  var date = new Date(date);
  var YY = date.getFullYear() + "-";
  var MM =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hh =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var mm =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return YY + MM + DD + " " + hh + mm + ss;
}
export default {
  data() {
    return { mArr: [], mId: "", tableData: [] };
  },
  methods: {
    getMatch() {
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      // console.log(obj)
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        let rr = res.data.data;
        this.mArr = rr;
        this.getluckList();
      });
    },
    // 获取抽奖
    getluckList() {
      let oo = { matchId: this.mId };
      if (!this.mId) oo.matchId = 0;
      this.$axios
        .get("/activity/getLotteryByMatchId", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          rr.forEach((v) => {
            v.startTime = formatDate(v.startTime);
            v.endTime = formatDate(v.endTime);
          });
          this.tableData = rr;
        });
    },
    // 添加活动
    AddEvents() {
      this.$router.push("/luckyDraw/add");
    },
    editA(v,vv){
      this.$router.push({
        path: "/luckyDraw/add",
        query: {
          aId: v,
          mId:vv
        },
      });
    },
    // 查看抽奖记录
    seeLdRecord(v) {
      this.$router.push({
        path: "/luckyDraw/ldRecord",
        query: {
          id: v,
        },
      });
    },
    // 查看抽奖人员
    goPer(v) {
      this.$router.push({
        path: "/luckyDraw/ldper",
        query: {
          id: v,
        },
      });
    },
  },
  created() {
    this.getMatch();
  },
};
</script>
<style lang="scss" scoped>
.luckW {
  @include padShow();
}
.cB {
  width: 300px;
}
</style>