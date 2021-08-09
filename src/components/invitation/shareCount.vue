<template>
  <!-- 分享邀请统计 -->
  <div class="scW">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label>
        <el-select v-model="mId" placeholder="选择赛事" clearable filterable>
          <el-option v-for="item in matchArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <!-- <el-input v-model="user" placeholder="请输入"></el-input> -->
        <el-select v-model="user" placeholder="请选择邀请者" clearable filterable>
          <el-option
            v-for="(item,i) in allData"
            :key="i"
            :label="item.name+'——'+item.nikeName"
            :value="item.name+'——'+item.nikeName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getbig(1)">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="setGDV=true">邀请设置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="classTable" :data="tableData" style="width: 100%" @expand-change="rowExpand">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            v-loading="props.row.loading"
            :data="props.row.smData"
            border
            style="width: 100%"
          >
            <el-table-column label="序号" width="80">
              <template slot-scope="{$index}">{{$index+1}}</template>
            </el-table-column>
            <el-table-column label="被邀请者昵称" prop="nikeName"></el-table-column>
            <el-table-column label="被邀请者姓名" prop="name"></el-table-column>
            <!-- <el-table-column label="被邀请者参赛号" prop="entryNumber"></el-table-column> -->
            <el-table-column label="参加赛项" prop="groupName"></el-table-column>
            <el-table-column label="贡献金额" prop="money"></el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="报名时间" prop="creatDate"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="赛事名称" prop="matchName"></el-table-column>
      <el-table-column label="邀请者昵称" prop="nikeName"></el-table-column>
      <el-table-column label="邀请者姓名" prop="name"></el-table-column>
      <!-- <el-table-column label="邀请者参赛号" prop="entryNumber"></el-table-column> -->
      <el-table-column label="参加赛项" prop="groupName"></el-table-column>
      <el-table-column label="邀请人数" prop="cou"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="获得金额" prop="money"></el-table-column>
    </el-table>
    <el-dialog title="邀请设置" class="setGDB" :visible.sync="setGDV">
      <setIRule />
    </el-dialog>
  </div>
</template>

<script>
import setIRule from "./invitation_rule";
export default {
  components: { setIRule },
  data() {
    return {
      mId: "",
      user: "",
      matchArr: [],
      tableData: [],
      allData: [],
      setGDV: false,
    };
  },
  methods: {
    getMatch() {
      // console.log(window.sessionStorage.getItem('orgId'))
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      // console.log(obj)
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        let rr = res.data.data;
        this.matchArr = rr;
      });
    },
    // 获取邀请人列表
    getbig(i) {
      let id = this.mId ? this.mId : 0;
      this.$axios.get("/signUp/member/getInvites?matchId=" + id).then((res) => {
        let rr = res.data.data;
        rr.forEach((v) => {
          v.smData = [];
          v.loading = false;
          v.money = v.money ? v.money : 0;
          v.phone = v.phone ? v.phone : "暂无";
        });
        this.allData = rr;
        this.tableData = rr;
        if (i && this.user) this.serchP();
      });
    },
    // 查询人
    serchP() {
      this.tableData = this.allData.filter((v) => {
        return v.name + "——" + v.nikeName == this.user;
      });
    },
    // 展开父表格数据 并查询该数据下的子数据
    rowExpand(dd, expandedRows) {
      // console.log(dd);
      var that = this;
      if (expandedRows.length) {
        that.expands = [];
        if (dd) {
          that.expands.push(dd.id);
          let o = {
            matchId: dd.matchId,
            groupId: dd.groupId,
            entryNumber: dd.entryNumber,
          };
          let oo = { matchId: dd.matchId, openId: dd.openId };
          this.getchild(oo, dd);
        }
      } else {
        that.expands = [];
      }
    },
    // 查询该数据下的子数据
    getchild(oo, dd) {
      dd.loading = true;
      this.$forceUpdate();
      this.$axios
        .get("/signUp/member/getByInvites", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          if (rr.length > 0) {
            rr.forEach((v) => {
              v.money = v.money ? v.money : 0;
              v.phone = v.phone ? v.phone : "暂无";
            });
          }
          dd.smData = rr;
          dd.loading = false;
          this.$forceUpdate();
        });
    },
  },
  created() {
    this.getMatch();
    this.getbig();
  },
};
</script>
<style scoped lang="scss">
.scW {
  @include padShow();
}
.setGDB >>> .el-dialog {
  width: 80%;
  margin: 40px auto;
}
</style>