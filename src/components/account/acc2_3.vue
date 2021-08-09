<template>
    <!-- 提现记录 -->
    <div class="txjl">
        <h3 class="titBox">提现记录</h3>
        <div class="tabBox">
            <el-table :data="tableData" border="" style="width: 100%">
                <el-table-column prop="date" label="开户银行" align="center"></el-table-column>
                <el-table-column prop="name" label="银行卡账号" align="center"></el-table-column>
                <el-table-column prop="address" label="持卡人姓名" align="center"></el-table-column>
                <el-table-column prop="date" label="手机号" align="center"></el-table-column>
                <el-table-column prop="name" label="提现金额" align="center"></el-table-column>
                <el-table-column prop="address" label="提交时间" align="center"></el-table-column>
                <el-table-column prop="name" label="审核状态" align="center"></el-table-column>
                <el-table-column prop="address" label="理由" align="center"></el-table-column>
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
          address: "上海市普陀区"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.txjl {
  .titBox {
    @include titBox();
  }
  .tabBox{
      margin-top: 20px;
  }
}
</style>

