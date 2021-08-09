<template>
  <!-- 用户反馈 -->
  <div class="feedbackPage">
    <div class="toggleBox">
      <span class="t">解决状态</span>
      <el-select v-model="state" placeholder="请选择" @change="togSearch">
        <el-option
          v-for="item in toggleState"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="Tab">
      <el-table
        ref="table"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border=""
        style="width: 100%"
      >
        <el-table-column prop="nikeName" label="昵称" align="center" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="180"></el-table-column>
        <el-table-column prop="showDate" label="反馈时间" align="center" width="180"></el-table-column>
        <el-table-column label="解决状态" align="center">
          <template slot-scope="{row}">
            <el-select v-model="row.showState" placeholder="请选择" @change="editState($event,row)">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="解决说明" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.info" placeholder="请输入内容" @change="saveTip($event,row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row,$index}">
            <el-button size="mini" @click="toogleExpand(row)">查看</el-button>
            <el-button type="danger" size="mini" @click="del(row,$index)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="1">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="反馈图片">
                <div class="fbImg" v-if="props.row.imgList.length>0">
                  <img
                    v-for="(v,i) in props.row.imgList"
                    :key="i"
                    :src="v"
                    @click="seeBig(props.row.imgList,i)"
                  >
                </div>
                <span v-else>暂无</span>
              </el-form-item>
              <el-form-item label="反馈描述">
                <p>{{ props.row.content?props.row.content:'暂无' }}</p>
              </el-form-item>
              <el-form-item label="解决说明">
                <el-input
                  v-model="props.row.info"
                  placeholder="请输入内容"
                  @change="saveTip($event,row)"
                  class="ipt"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <div class="AlertWrap" v-if="showAlert" @click.self="showAlert=!showAlert">
      <div class="AlertBox">
        <div class="btn pre" @click="PreNext(1)">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="img">
          <img :src="seeList[seeI]" alt="">
        </div>
        <div class="btn next">
          <i class="el-icon-arrow-right" @click="PreNext(2)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggleState: [
        {
          value: "a",
          label: "全部",
        },
        {
          value: "b",
          label: "已解决",
        },
        {
          value: "c",
          label: "未解决",
        },
      ],
      tableData: [],
      options: [
        {
          value: "0",
          label: "未解决",
        },
        {
          value: "1",
          label: "已解决",
        },
      ],
      state: "a",
      currentPage: 1,
      pagesize: 5,
      showAlert: false,
    };
  },
  methods: {
    toogleExpand(row) {
      let $table = this.$refs.table;
      this.tableData.map((item) => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
    getTab() {
      let oo = { type: "" };
      if (this.$newActive) {
        oo = { type: "shifeng" };
      } else {
        oo = { type: "aiyunpao" };
      }
      // oo = { type: "aiyunpao" };
      this.$axios.get("/run/getFeedbackByType", { params: oo }).then((res) => {
        let rr = res.data.data;
        for (let a = 0; a < rr.length; a++) {
          rr[a].showDate = this.$timestamp(rr[a].time);
          if (rr[a].state == 0) {
            rr[a].showState = "未解决";
          } else if (rr[a].state == 1) {
            rr[a].showState = "已解决";
          }
          if (rr[a].quesImg) {
            rr[a].imgList = rr[a].quesImg.split(";");
          } else {
            rr[a].imgList = [];
          }
        }
        this.tableData = rr;
        this.allDate = JSON.parse(JSON.stringify(this.tableData));
      });
    },
    // 修改状态
    editState(v, row) {
      let oo = {
        state: v,
        id: row.id,
        info: row.info,
      };
      this.$axios.get("/run/putFeedbackState", { params: oo }).then((res) => {
        // console.log(this.allDate);
        for (let a = 0; a < this.allDate.length; a++) {
          if (this.allDate[a].id == row.id) {
            this.allDate[a].state = v;
            if (v == 0) {
              this.allDate[a].showState = "未解决";
            } else if (v == 1) {
              this.allDate[a].showState = "已解决";
            }
          }
        }
      });
    },
    // 查询状态
    togSearch(v) {
      if (v == "a") {
        this.tableData = this.allDate;
      } else if (v == "b") {
        this.tableData = this.allDate.filter((v) => v.state == 1);
      } else if (v == "c") {
        this.tableData = this.allDate.filter((v) => v.state == 0);
      }
    },
    // 查看大图
    seeBig(list, i) {
      this.showAlert = !this.showAlert;
      this.seeList = list;
      this.seeI = i;
    },
    // 前后切换
    PreNext(i) {
      if (i == 1) {
        if (this.seeI == 0) {
          this.seeI = this.seeList.length - 1;
        } else {
          this.seeI--;
        }
      } else if (i == 2) {
        if (this.seeI == this.seeList.length - 1) {
          this.seeI = 0;
        } else {
          this.seeI++;
        }
      }
    },
    // 说明保存
    saveTip(v, row) {
      console.log(v, row);
      let oo = {
        state: row.state,
        id: row.id,
        info: v,
      };
      this.$axios.get("/run/putFeedbackState", { params: oo }).then((res) => {
        // console.log(this.allDate);
        for (let a = 0; a < this.allDate.length; a++) {
          if (this.allDate[a].id == row.id) {
            this.allDate[a].state = v;
            if (v == 0) {
              this.allDate[a].showState = "未解决";
            } else if (v == 1) {
              this.allDate[a].showState = "已解决";
            }
          }
        }
      });
    },
    // 删除
    del(v, i) {
      // console.log(v, i);
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.get(`/run/deleteFeedback?id=${v.id}`).then((res) => {
            let o = (this.currentPage - 1) * 5 + i;
            this.tableData.splice(o, 1);
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
    this.getTab();
  },
};
</script>

<style lang="scss" scoped>
.feedbackPage {
  @include padShow();
}
.toggleBox {
  width: 100%;
  margin-bottom: 15px;
  .t {
    font-weight: bold;
  }
}
// 展开表内容样式
.Tab >>> .el-table_1_column_5,
.Tab >>> .el-table__expand-column {
  border-right: none;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.fbImg {
  width: 100%;
  img {
    width: 100px;
    height: 180px;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
  }
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
// 弹框
.AlertWrap {
  @include alertBox();
  .AlertBox {
    width: 400px;
    height: 568px;
    background-color: #fff;
    @include hs_center();
    line-height: 40px;
    overflow: auto;
    > * {
      float: left;
    }
    .btn {
      width: 30px;
      height: 30px;
      font-size: 30px;
      @include s_middle();
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      &.pre {
        left: 0;
      }
      &.next {
        left: 370px;
      }
    }
    .img {
      margin-left: 40px;
      img {
        float: left;
        width: 320px;
        height: 568px;
      }
    }
  }
}

.ipt {
  width: 600px;
}
</style>

