<template>
    <!-- 轮播列表 -->
    <div class="bannerWrap">
        <div class="box">
            <el-button type="primary" class="addBtn" @click="$router.push('/banner/AE')">添加</el-button>
        </div>
        <div class="tab">
            <el-table :data="tableData" border="" style="width: 100%">
                <el-table-column label="图片" align="center">
                    <template slot-scope="{row}">
                        <img :src="row.imgUrl" alt="" class="img">
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" @click="see(row)">查看</el-button>
                        <el-button type="primary" size="mini" @click="edit(row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="del(row,$index)">删除</el-button>
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
      tableData: [],
    };
  },
  methods: {
    getList() {
      let obj = {
        orgId: window.sessionStorage.getItem("orgId"),
        type: 0,
      };
      this.$axios
        .get("/slideshow/getSlideshowList", { params: obj })
        .then((res) => {
          let rr = res.data.data;
          this.tableData = rr;
        });
    },
    see(row){
      this.$router.push({
        path: "/banner/see",
        query: {
          id: row.id,
        },
      });
    },
    edit(row) {
      this.$router.push({
        path: "/banner/AE",
        query: {
          id: row.id,
        },
      });
    },
    del(row, i) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .get(`/slideshow/deleteSlideshow?id=${row.id}`)
            .then((res) => {
              this.tableData.splice(i, 1);
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
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.bannerWrap {
  @include padShow();
}
.box {
  overflow: hidden;
}
.addBtn {
  float: right;
}
.tab {
  width: 100%;
  margin-top: 15px;
  overflow: hidden;
}
.img {
  width: 100px;
  height: 51px;
}
</style>

