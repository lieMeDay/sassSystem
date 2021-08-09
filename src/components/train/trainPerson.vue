<template>
  <div class="trainPerson">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="nikeName" label="姓名"></el-table-column>
      <el-table-column prop="distance" label="周跑量"></el-table-column>
      <el-table-column prop="num" label="周次数"></el-table-column>
      <el-table-column prop="useTime" label="周用时（h:小时）"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="addCust(row.id)">添加计划</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {tableData:[]};
  },
  methods: {
    init() {
      this.$axios
        .get("/runAbility/getPersonRunAbilityPlanList")
        .then((res) => {
          let rr = res.data.data;
          this.tableData=rr
        });
    },
    addCust(id){
      this.$router.push({
        path: "/trainPerson/trainPlan",
        query: {
          id: id
        },
      });
    }
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
/* @import url(); 引入公共css类 */
.trainPerson {
  @include padShow();
}
</style>