<template>
  <div class="raodBox">
    <div>
      <el-select
        v-model="vId"
        placeholder="请选择"
        no-data-text="暂无路书赛事"
        @change="getRaod()"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        @click="gg"
      >添加路书</el-button>
    </div>
    <div class="tabBox">
      <el-table
        :data="tableData"
        border=""
        style="width: 100%"
      >
        <el-table-column
          prop="matchKey"
          label="日期"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="nikeName"
          label="昵称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="地点"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="editRow(scope.row)"
              type="text"
              size="small"
            >修改</el-button>
            <el-button
              @click="delRow(scope.row.id,scope.$index)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      vId: "",
      tableData: [],
    };
  },
  methods: {
    init() {
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        let rr = res.data.data;
        this.options = rr.filter((v) => v.type == "Z");
        if (this.options.length > 0) this.vId = this.options[0].id;
        this.getRaod();
      });
    },
    getRaod() {
      let oo = { matchId: this.vId, groupId: "" };
      this.$axios
        .get("/run/person/match/getMatchDataList", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          //   console.log(rr);
          for (let a = 0; a < rr.length; a++) {
            let vv = rr[a].personMatchDataList;
            rr[a].address = vv
              .map(function(obj, index) {
                return obj.cpName;
              })
              .join("-");
          }
          this.tableData = rr;
        });
    },
    editRow(v) {
      this.$router.push({
        path: "/raod/eRoad",
        query: {
          id: v.id,
        },
      });
    },
    gg() {
      this.$router.push({
        path: "/raod/eRoad",
        query: {
          mId: this.vId,
        },
      });
    },
    delRow(v,i) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .get("/run/person/match/delMatchDatas", { params: { id: v } })
            .then((res) => {
              let ii = (this.currentPagerm - 1) * 5 + i;
              this.tableData.splice(ii, 1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.raodBox {
  @include padShow();
  .tabBox {
    width: 100%;
    margin-top: 20px;
  }
}
</style>


