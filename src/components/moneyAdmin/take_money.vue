<template>
  <!-- 提现管理 -->
  <div class="takeM">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="提现时间">
        <el-date-picker
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="提现状态">
        <el-select v-model="state" placeholder="提现状态" @change="tableData=[];show=false">
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="提现通过" :value="2"></el-option>
          <el-option label="提现未通过" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAllTake">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" 
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="toggleRowExpansion" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" @click="getDetail(1,props.row.openId)">收支</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="detail_Arr.slice((bC-1)*bP,bC*bP)" style="width: 100%" v-loading="conLoading">
            <el-table-column prop="name" label="赛事/组别"></el-table-column>
            <el-table-column label="信息">
              <template slot-scope="{row}">
                <span v-html="row.info"></span>
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="{row}">
                <span :style="{color:row.type==1?'green':'red'}">{{row.type==1?'+':'-'}}{{row.money}}</span>
              </template>
              </el-table-column>
            <el-table-column prop="addTime" label="时间"></el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="bC"
            :page-size="bP"
            layout="prev, pager, next, jumper"
            :hide-on-single-page="true"
            :total="detail_Arr.length"
          ></el-pagination>
        </template>
      </el-table-column>
      <el-table-column prop="nikeName" label="昵称" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
      <el-table-column prop="money" label="提现金额" width="100"></el-table-column>
      <el-table-column prop="allMoney" label="余额" width="100"></el-table-column>
      <el-table-column prop="creatTime" label="提交时间"></el-table-column>
      <el-table-column prop="states" label="提现状态"></el-table-column>
      <el-table-column prop="orderNum" label="交易订单号" v-if="state==2&&show"></el-table-column>
      <el-table-column prop="info" label="失败信息" v-if="state==3&&show"></el-table-column>
      <!-- <el-table-column prop="putTime" label="处理时间"></el-table-column> -->
      <el-table-column label="操作" v-if="state==1&&show">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" class="btn btn1" @click="sub(row.id)">确认提现</el-button>
          <el-button type="danger" size="small" class="btn" @click="refuse_s(row)">拒绝提现</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="拒绝理由" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item>
          <el-input v-model="info" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="refuse()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
function add0(m) {
  return m < 10 ? "0" + m : m;
}
function format(shijianchuo) {
  //时间戳是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}
export default {
  data() {
    return {
      dialogFormVisible: false,
      tableData: [],
      state: 1, // 1待审核 2审核通过 3不通过
      info: "",
      edRow: "",
      date: [],
      show: false,
      detail_Arr: [],
      bP: 5,
      bC: 1,
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      expands:[],
      conLoading:false
    };
  },
  methods: {
    getAllTake() {
      let oo = {
        startDate: "",
        endDate: "",
        state: this.state,
      };
      if (this.date.length > 0) {
        oo.startDate = this.date[0];
        oo.endDate = this.date[1];
      }
      this.$axios
        .get("signUp/wallet/getWithdrawList", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          this.show = true;
          if (rr.length > 0) {
            rr.forEach((v) => {
              if (v.state == 1) v.states = "待审核";
              if (v.state == 2) v.states = "提现通过";
              if (v.state == 3) v.states = "提现不通过";
            });
          }
          this.tableData = rr;
        });
    },
    
    // 切换展开 表格
    toggleRowExpansion(row) {
      // console.log(row.id)
      let s = this.expands.findIndex((v) => v == row.id);
      if (s >= 0) {
        this.expands = [];
      } else {
        this.expands = [];
        this.bC=1
        this.getDetail(row.openId);
        this.expands.push(row.id);
      }
    },
    // 查看详情
    getDetail(oId) {
      this.detail_Arr = [];
      this.conLoading=true
      let oo = {openId: oId };
      this.$axios
        .get("/wallet/getPersonWallet", { params: oo })
        .then((res) => {
          let rr = res.data.data.list
          rr.forEach((v) => {
            v.name = v.name ? v.name : "";
            v.addTime = format(v.addTime);
          });
          this.detail_Arr = rr;
      this.conLoading=false
        });
    },
    // 拒绝理由
    refuse() {
      this.dialogFormVisible = false;
      console.log(this.info, this.edRow);
      if (!this.info) {
        this.$message.warning("请输入拒绝理由");
        return false;
      }
      let oo = { info: this.info, id: this.edRow.id, state: 3 };
      this.$axios.post("/signUp/wallet/editWithdraw", oo).then((res) => {
        let rr = res.data.data;
        this.dialogFormVisible = false;
        this.getAllTake();
        this.$message("提交成功");
      });
    },
    // 确认提现
    sub(id) {
      this.$prompt("请输入密码进行验证", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password",
      })
        .then(({ value }) => {
          let oo = {
            orgId: sessionStorage.getItem("orgId"),
            pwd: value,
          };
          this.$axios.post("/org/judgePayPassword", oo).then((res) => {
            let rr = res.data.data;
            if (rr == 1) {
              this.$axios
                .get("/match/signUp/order/withdrawDeposit?id=" + id)
                .then((res) => {
                  let rr = res.data.data;
                  this.$message(rr);
                  this.getAllTake();
                });
            } else {
              this.$message.error(rr);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 拒绝提现
    refuse_s(row) {
      this.info = "";
      this.edRow = row;
      this.dialogFormVisible = true;
    },
  },
  created() {
    this.getAllTake();
  },
};
</script>
<style lang="scss" scoped>
.takeM {
  @include padShow();
  .btn {
    float: left;
    margin: 0;
  }
  .btn1 {
    // margin-bottom: 8px;
    margin-right: 8px;
  }
}
</style>