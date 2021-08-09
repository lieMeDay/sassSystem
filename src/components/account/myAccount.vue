<template>
    <!-- 我的账户 -->
    <div class="myAccWrap">
        <div class="myAcc">
            <p class="p1">
                <i class="el-icon-s-finance"></i>
                <span>账户余额</span>
            </p>
            <p class="p2">5000元</p>
        </div>
        <span class="goBtn" @click="showInd">去充值</span>
        <div class="tabBox">
            <h3 class="accTit">交易记录</h3>
            <el-table :data="tableData" border="" style="width: 100%" class="tab">
                <el-table-column prop="date" label="日期" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {
    showInd() {
      this.$emit("act", "0,1");
    }
  }
};
</script>

<style lang="scss" scoped>
.myAccWrap {
  width: 100%;
  .accTit {
    line-height: 40px;
  }
  .myAcc {
    float: left;
    background-color: #756bff;
    padding: 20px;
    width: 180px;
    height: 70px;
    border-radius: 10px;
    color: #fff;
    .p1 {
      font-size: 14px;
      line-height: 30px;
      i {
        //   float: left;
        margin-right: 5px;
        font-size: 16px;
      }
    }
    .p2 {
      font-size: 20px;
    }
  }
  .goBtn {
    float: left;
    cursor: pointer;
    margin-left: 30px;
    line-height: 30px;
    padding: 10px 20px;
    color: #fff;
    border-radius: 5px;
    background-color: #2A82DB;
    margin-top: 25px;
  }
  //   .myAcc {
  //     border: 1px solid #ccc;
  //     height: 100px;
  //     line-height: 100px;
  //     > * {
  //       float: left;
  //     }
  //     .moneytxt {
  //       margin-left: 30px;
  //       font-size: 22px;
  //       > span {
  //         color: red;
  //       }
  //     }
  //     .goBtn {
  //         cursor: pointer;
  //       margin-left: 30px;
  //       line-height: 30px;
  //       padding: 10px 20px;
  //       color: #fff;
  //       border-radius: 5px;
  //       background-color: #333366;
  //       margin-top: 25px;
  //     }
  //   }
  .tabBox {
    width: 100%;
    float: left;
  }
  .tab {
    th,
    td {
      padding: 10px 0;
    }
  }
}
</style>

