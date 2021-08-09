<template>
  <div class="ldRecord">
    <el-input
      class="iptS"
      v-model="seachV"
      placeholder="请输入用户名，参赛号或手机号"
      clearable
    ></el-input>
    <el-select v-model="seachVN" placeholder="请选择" clearable>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button type="primary" @click="search">搜索</el-button>
    <el-button type="primary" @click="portD">导出</el-button>
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      border=""
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="用户"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="nikeName"
        label="昵称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="entryNumber"
        label="参赛号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="lotteryName"
        label="活动名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="prizeName"
        label="奖品"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="showAtime"
        label="抽奖时间"
        align="center"
      ></el-table-column>
    </el-table>
    <div class="page">
      <div class="pb">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="pagesize"
          layout="prev, pager, next, jumper"
          :total="tableData.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import table2excel from "js-table2excel";
var allData = [];
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      seachV: "",
      options: [],
      seachVN: "",
    };
  },
  methods: {
    portD() {
      let that = this;
      let column = [
        {
          title: "昵称",
          key: "nikeName",
          type: "text",
        },
        {
          title: "用户名",
          key: "name",
          type: "text",
        },
        {
          title: "参赛号",
          key: "entryNumber",
          type: "text",
        },
        {
          title: "手机号",
          key: "phone",
          type: "text",
        },
        {
          title: "奖品名称",
          key: "prizeName",
          type: "text",
        },
        {
          title: "抽奖时间",
          key: "showAtime",
          type: "text",
        },
      ];
      let dao = allData.filter((v) => {
        if (v.prizeName != "谢谢参与") return v;
      });
      let filename = allData[0].lotteryName;
      if (filename.indexOf(".") != Number(-1)) {
        filename = filename + ".xls";
      }
      table2excel(column, dao, filename);
    },
    getRecord() {
      let oo = { id: this.$route.query.id };
      this.$axios
        .get("/prize/getRecordByLottoryId", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          let p = [];
          rr.forEach((v) => {
            v.showAtime = this.$timestamp(v.addTime);
            if (v.prizeName != "谢谢参与") {
              let a = p.find((h) => {
                return h.value == v.prizeName;
              });
              if (!a) p.push({ value: v.prizeName });
            }
          });
          console.log(p);
          this.options = p;
          this.tableData = rr;
          allData = rr;
        });
    },
    search() {
      if (this.seachV) {
        this.tableData = allData.filter((v) => {
          // entryNumber phone
          if (
            v.nikeName.indexOf(this.seachV) >= 0 ||
            v.entryNumber.indexOf(this.seachV) >= 0 ||
            v.phone.indexOf(this.seachV) >= 0
          ) {
            return v;
          }
        });
        if (this.seachVN) {
          this.tableData = this.tableData.filter((v) => {
            // entryNumber phone
            if (v.prizeName == this.seachVN) {
              return v;
            }
          });
        }
      } else {
        if (this.seachVN) {
          this.tableData = allData.filter((v) => {
            // entryNumber phone
            if (v.prizeName == this.seachVN) {
              return v;
            }
          });
        }
      }
      if(!this.seachV&&!this.seachVN){
        this.tableData=allData
      }
    },
  },
  mounted() {
    this.getRecord();
  },
};
</script>

<style lang="scss" scoped>
.ldRecord {
  @include padShow();
}
.iptS {
  width: 300px;
}
// 分页
.page {
  margin-top: 15px;
  overflow: hidden;
  width: 100%;
  .pb {
    display: table;
    margin: 0 auto;
    overflow: hidden;
  }
}
</style>

