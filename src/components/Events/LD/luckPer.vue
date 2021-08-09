<template>
  <div class="alertPer">
    <el-input
      class="iptS"
      v-model="seachV"
      placeholder="请输入用户名，参赛号或手机号"
      clearable
    ></el-input>
    <el-button type="primary" class="ll" @click="search">搜索</el-button>
    <div class="dr">
      导入
      <label for="ifb" class="iptF">
        <input type="file" class="iptF" ref="upF" id="ifb" @change="upFile" />
      </label>
    </div>
    <el-button type="primary" @click="addOne">添加</el-button>
    <el-button type="danger" @click="clearAll">清空所有</el-button>
    <!-- 默认不导入，所有人可抽奖，否则只有名单人员可抽奖 -->
    <p class="tips"></p>
    <el-table
      :data="tableData.slice((currP - 1) * 10, currP * 10)"
      border
      style="width: 100%"
    >
      <el-table-column label="姓名">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.edit"
            v-model="row.name"
            placeholder="请输入内容"
          ></el-input>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参赛号">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.edit"
            v-model="row.entryNumber"
            placeholder="请输入参赛号"
          ></el-input>
          <span v-else>{{ row.entryNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.edit"
            v-model="row.sex"
            placeholder="请输入性别"
          ></el-input>
          <span v-else>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.edit"
            v-model="row.phone"
            placeholder="请输入手机号"
          ></el-input>
          <span v-else>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.edit"
            @click="save(row, $index)"
            type="primary"
            round
            >保存</el-button
          >
          <el-button @click="del(row, $index)" type="danger" round
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currP"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="tableData.length"
    >
    </el-pagination>
  </div>
</template>
<script>
import { Loading } from "element-ui";
var allData = [];
export default {
  data() {
    return {
      currP: 1,
      tableData: [],
      seachV: "",
    };
  },
  methods: {
    upFile(e) {
      this.NameList = e.target.files[0];
      // console.log(e.target.files[0]);
      let that = this;
      const files = e.target.files;
      if (files.length < 1) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message.warin("上传文件格式不正确，请上传xls");
        return false;
      }
      var param = new FormData();
      param.append("files", this.NameList); // 通过append向form对象添加数据
      param.append("lotteryId", this.$route.query.id);
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$axios
        .post("/upload/lotteryInfo", param, {
          "Content-Type": "multipart/form-data",
        })
        .then((res) => {
          //   console.log(res);
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            this.$message.success("上传成功");
            this.$refs.upF.value = null;
            this.getMber()
            loadingInstance.close();
          });
        })
        .catch((err) => {
          //   console.log(err);
          loadingInstance.close();
          this.$message.error("上传失败");
        });
    },
    getMber() {
      this.$axios
        .get("activity/getLotteryInfo", {
          params: { id: this.$route.query.id },
        })
        .then((res) => {
          let rr = res.data.data;
          this.tableData = rr;
          allData=rr
        });
    },
    addOne() {
      this.tableData.push({
        entryNumber: "",
        lotteryId: this.$route.query.id,
        name: "",
        phone: "",
        sex: "",
        edit: true,
      });
      this.currP = Math.ceil(this.tableData.length / 10);
      console.log(this.currP);
    },
    save(row) {
      this.$axios.post("/activity/addLotteryInfo", row).then((res) => {
        row.edit = false;
      });
    },
    del(row, i) {
      let oo = { id: row.id, lotteryId: row.lotteryId };
      this.$axios
        .get("/activity/delLotteryInfo", { params: oo })
        .then((res) => {
          i = (this.currP - 1) * 10 + i;
          this.tableData.splice(i, 1);
        });
    },
    clearAll() {
      let oo = { id: '', lotteryId: this.$route.query.id };
      this.$axios
        .get("/activity/delLotteryInfo", { params: oo })
        .then((res) => {
          this.tableData = [];
          this.currP = 1;
        });
    },
    search() {
      if(this.seachV){
      this.tableData = allData.filter((v) => {
        // entryNumber phone
        if (
          v.name.indexOf(this.seachV) >= 0 ||
          v.entryNumber.indexOf(this.seachV) >= 0 ||
          v.phone.indexOf(this.seachV) >= 0
        ) {
          return v;
        }
      });
      }else{
        this.tableData=allData
      }
    },
  },
  mounted() {
    this.getMber();
  },
};
</script>
<style lang="scss" scoped>
.alertPer {
  @include padShow();
  .dr {
    width: 100px;
    line-height: 40px;
    text-align: center;
    overflow: hidden;
    position: relative;
    background-color: #409eff;
    color: #fff;
    border-radius: 4px;
    float: left;
    margin-right: 15px;
    .iptF {
      width: 100px;
      height: 40px;
      position: absolute;
      opacity: 0;
      top: 0;
      left: 0;
    }
  }
  .tips {
    width: 100%;
    margin: 10px 0;
  }
}

.iptS {
  width: 300px;
  float: left;
  margin-right: 10px;
}
.ll{
  float: left;
  margin-right: 10px;
}
</style>