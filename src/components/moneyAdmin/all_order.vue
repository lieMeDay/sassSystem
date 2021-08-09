<template>
  <!-- 所有订单管理 -->
  <div class="all_order">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="昵称/姓名">
        <el-input v-model="searchForm.name" placeholder="请输入昵称/姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="赛事">
        <el-select v-model="searchForm.matchId" placeholder="请选择赛事" @change="getGroup()" clearable>
          <el-option v-for="item in m_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赛项">
        <el-select v-model="searchForm.groupId" placeholder="请选择" clearable>
          <el-option v-for="item in g_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态">
        <el-select v-model="searchForm.state" placeholder="请选择支付状态">
          <el-option label="已支付" value="1"></el-option>
          <el-option label="未支付" value="0"></el-option>
          <el-option label="已退款" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAll()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="port()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData.slice((curr-1)*size,curr*size)" style="width: 100%">
      <!-- <el-table-column type="index" width="50"></el-table-column> -->
      <el-table-column prop="index" label="序号"></el-table-column>
      <el-table-column prop="nikeName" label="昵称"></el-table-column>
      <el-table-column prop="matchName" label="赛事名称"></el-table-column>
      <el-table-column prop="groupName" label="赛项名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="payState" label="支付状态"></el-table-column>
      <el-table-column prop="orderNum" label="订单号"></el-table-column>
      <el-table-column prop="orderDate" label="支付时间"></el-table-column>
      <el-table-column label="操作" v-if="searchForm.state==1">
        <template slot-scope="{row}">
          <el-button type="text" @click="refund_s(row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="tableData.length"
      :current-page.sync="curr"
      :page-size="size"
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
    <el-dialog title="退款申请" :visible.sync="dialogVisible">
      <el-form>
        <el-form-item label="确认退款金额" label-width="110px" prop="money">
          <el-input v-model="money" autocomplete="off" clearable></el-input>
        </el-form-item>
        <p class="tip">
          <span class="red">*</span> 暂只支持全额退款
        </p>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_Refund">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import table2excel from "js-table2excel";
function getExcel(tab) {
  var option = {};
  option.fileName = "订单列表";
  option.datas = [
    {
      sheetData: tab,
      sheetHeader: ["序号", "姓名", "手机号", "提交时间"], //前端指定的表头
    },
  ];
  var toExcel = new ExportJsonExcel(option);
  toExcel.saveExcel();
}
export default {
  data() {
    return {
      tableData: [],
      curr: 1,
      size: 10,
      m_arr: [],
      g_arr: [],
      searchForm: {
        state: "1",
        matchId: "",
        groupId: "",
        name: "",
      },
      dialogVisible: false,
      money: "",
      refund_row: "",
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
      });
    },
    // 获取赛项
    getGroup() {
      this.searchForm.groupId = "";
      this.g_arr = [];
      this.$axios
        .get("/match/getMatchById?matchId=" + this.searchForm.matchId)
        .then((res) => {
          let rr = res.data.data.matchInfo;
          this.g_arr = rr;
        });
    },
    // 查询
    getAll() {
      let oo = JSON.parse(JSON.stringify(this.searchForm));
      oo.matchId = oo.matchId ? oo.matchId : 0;
      oo.groupId = oo.groupId ? oo.groupId : 0;
      this.$axios
        .get("/signUp/signUpOrder/getList", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          rr.forEach((v, i) => {
            v.index = i + 1;
            if (v.payState == "0") v.payState = "未支付";
            else if (v.payState == "1") v.payState = "已支付";
          });
          this.tableData = rr;
        });
    },
    // 导出
    port() {
      let that = this;
      let column = [
        {
          title: "序号",
          key: "index",
          type: "text",
        },
        {
          title: "昵称",
          key: "nikeName",
          type: "text",
        },
        {
          title: "赛事名称",
          key: "matchName",
          type: "text",
        },
        {
          title: "赛项名称",
          key: "groupName",
          type: "text",
        },
        {
          title: "价格",
          key: "price",
          type: "text",
        },
        {
          title: "支付状态",
          key: "payState",
          type: "text",
        },
        {
          title: "订单号",
          key: "orderNum",
          type: "text",
        },
        {
          title: "支付时间",
          key: "orderDate",
          type: "text",
        },
      ];
      table2excel(column, that.tableData, "订单列表");
    },
    refund_s(row) {
      this.dialogVisible = true;
      this.money = "";
      this.refund_row = row;
    },
    // 确认退款
    sure_Refund() {
      if (!this.money) {
        this.$message.warning("请确认退款金额");
        return false;
      }
      if (isNaN(this.money)) {
        this.$message.warning("退款金额需为数字");
        return false;
      }
      let oo = { id: this.refund_row.id, money: Number(this.money) };
      this.$axios.post("/match/signUp/order/out", oo).then((res) => {
        let rr = res.data.data;
        this.$message(rr);
        this.getAll();
        this.dialogVisible = false;
      });
    },
  },
  created() {
    this.getMatch();
    this.getAll();
  },
};
</script>
<style lang="scss" scoped>
.all_order {
  @include padShow();
}
.tip {
  margin-left: 100px;
  margin-bottom: 10px;
  .red {
    color: red;
  }
}
</style>