<template>
  <!-- 每月返现设置 -->
  <div class="Cashback">
    <el-form :inline="true">
      <el-form-item label>
        <el-select v-model="mId" placeholder="请选择赛事" @change="getGroup()">
          <el-option v-for="item in m_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-select v-model="gId" placeholder="请选择赛项">
          <el-option v-for="item in g_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
      </el-form-item>
    </el-form>

    <el-dialog class="alertDialog" title="返现设置" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
      <el-form label-width="80px">
        <el-form-item label="赛事">
          <el-select v-model="m_S_Id" placeholder="请选择赛事" @change="get_s_Group()">
            <el-option v-for="item in m_s_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赛项">
          <el-select v-model="g_S_Id" placeholder="请选择赛项">
            <el-option v-for="item in g_s_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返现日期">
          <el-input class="fIpt" v-model="pForm.dateDay" placeholder="请输入内容">
            <template slot="append">号</template>
          </el-input>
          <p>注：指定每月统计返现执行日期，如 1 代表每月1号执行返现统计，当月符合条件的返还到用户的电子钱包</p>
        </el-form-item>
        <el-form-item label="最短距离">
          <el-input class="fIpt" v-model="pForm.distence" placeholder="请输入内容">
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="打卡次数">
          <el-input class="fIpt" v-model="pForm.times" placeholder="请输入内容">
            <template slot="append">次</template>
          </el-input>
        </el-form-item>
        <el-form-item label="用时">
          <el-input class="fIpt" v-model="pForm.useTime" placeholder="请输入内容">
            <template slot="append">h</template>
          </el-input>
        </el-form-item>
        <el-form-item label="返现金额">
          <el-input class="fIpt" v-model="pForm.money" placeholder="请输入内容">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否执行">
          <el-switch
            v-model="pForm.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancle">取 消</el-button>
          <el-button type="primary" @click="putCash">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      m_arr: [],
      g_arr: [],
      mId: "",
      gId: "",
      dialogFormVisible: false,
      m_S_Id: "",
      g_S_Id: "",
      m_s_arr: [],
      g_s_arr: [],
      pForm: {
        useTime: 0,
        distence: 0,
        money: 0,
        dateDay: 1,
        times: 0,
        state: 1,
      },
    };
  },
  methods: {
    // 获取赛事
    getMatch() {
      let orgId = window.sessionStorage.getItem("orgId");
      // console.log(orgId)
      this.$axios.get("/match/getMatchByOrgId?orgId=" + orgId).then((res) => {
        let rr = res.data.data;
        this.m_arr = rr;
        this.m_s_arr = rr;
      });
    },
    // 获取赛项
    getGroup(s, t) {
      this.gId = "";
      this.g_arr = [];
      if (!s) s = this.mId;
      this.$axios.get("/match/getMatchById?matchId=" + s).then((res) => {
        let rr = res.data.data.matchInfo;
        if (t) {
          this.g_s_arr = rr;
        } else {
          this.g_arr = rr;
        }
      });
    },
    get_s_Group() {
      this.getGroup(this.m_S_Id, 1);
    },
    // 查询
    search() {
      //   let oo = { matchId: this.mId, groupId: this.gId };
      //   this.$axios
      //     .get("/wallet/getPersonWalletByMatchId", { params: oo })
      //     .then((res) => {
      //       let rr = res.data.data;
      //       rr.forEach((v) => {
      //         v.money = v.money ? v.money : 0;
      //         v.tickets = v.tickets ? v.tickets : 0;
      //       });
      //       this.tableData = rr;
      //     });
    },
    cancle(){
      this.pForm={
        useTime: 0,
        distence: 0,
        money: 0,
        dateDay: 1,
        times: 0,
        state: 1,
      }
      this.m_S_Id=''
      this.g_S_Id=''
      this.dialogFormVisible = false
    },
    putCash() {
      if(!this.m_S_Id&&!this.g_S_Id){
        this.$message.warning('请选择赛事，赛项')
        return false
      }
      this.pForm.matchId=this.m_S_Id
      this.pForm.groupId=this.g_S_Id
      this.$axios.post('/sign/withdraw/putMatchWithdraw',this.pForm).then(res=>{
        let rr=res.data
        this.$message.success('发布成功')
        this.dialogFormVisible=false
      })
    },
  },
  created() {
    this.getMatch();
  },
};
</script>
<style lang="scss" scoped>
.Cashback {
  @include padShow();
}
.alertDialog >>> .el-dialog {
  width: 70%;
  margin-top: 50px !important;
}
.fIpt {
  width: 300px;
}
</style>