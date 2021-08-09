<template>
    <!-- 充值记录 -->
    <div class="Detail">
        <el-table :data="tableData" border="" style="width: 100%">
            <el-table-column prop="date" label="订单号" align="center"></el-table-column>
            <el-table-column prop="name" label="商品规格" align="center"></el-table-column>
            <el-table-column prop="address" label="购买数量" align="center"></el-table-column>
            <el-table-column prop="date" label="支付金额" align="center"></el-table-column>
            <el-table-column prop="name" label="支付方式" align="center"></el-table-column>
            <el-table-column prop="address" label="下单时间" align="center"></el-table-column>
            <!-- <el-table-column prop="address" label="地址" align="center"></el-table-column> -->
        </el-table>
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
  }
};
</script>

<style lang="scss" scoped>
.Detail {
  @include padShow();
}
</style>

