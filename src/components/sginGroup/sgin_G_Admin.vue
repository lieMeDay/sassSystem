<template>
  <!-- 团报管理 明细 -->
  <div class="sgin_G_admin">
    <el-select class="cMB" v-model="mId" placeholder="请选择" @change="get_Team">
      <el-option v-for="item in m_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-button style="float:right;" type="primary" @click="setGDV=true">团报设置</el-button>
    <el-table :data="tableData" style="width: 100%" v-loading="loading" ref="table">
      <el-table-column prop="nikeName" label="昵称"></el-table-column>
      <el-table-column prop="creatTime" label="开团时间"></el-table-column>
      <el-table-column prop="endTime" label="截止时间"></el-table-column>
      <el-table-column prop="s_state" label="拼团状态">
        <!-- <template slot-scope="{row}">
          <span style="margin-right: 6px">{{ row.s_state }}</span>
          <i class="el-icon-edit"></i>
        </template>-->
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="toogleExpand(row)">拼团人员</el-button>
          <el-button type="text" @click="editMsg(row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <el-table :data="props.row.personList" stripe style="width: 100%">
            <el-table-column prop="nikeName" label="昵称"></el-table-column>
            <el-table-column prop="creatTime" label="拼团时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="text" @click="delP(row)">删除拼团</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改 拼团状态 结束时间 -->
    <el-dialog title="拼团信息" :visible.sync="dialogVisible">
      <el-form :mode="editGroup">
        <el-form-item label="发起者昵称" label-width="80">
          <span>{{editGroup.nikeName}}</span>
        </el-form-item>
        <el-form-item label="开团时间" label-width="80">
          <span>{{editGroup.creatTime}}</span>
        </el-form-item>
        <el-form-item label="截止时间" label-width="80">
          <el-date-picker
            v-model="editGroup.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择截止时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="拼团状态" label-width="80">
          <el-select v-model="editGroup.state" placeholder="请选择拼团状态">
            <el-option label="拼团中" :value="0"></el-option>
            <el-option label="拼团成功" :value="1"></el-option>
            <el-option label="拼团失败" :value="2"></el-option>
          </el-select>
          <p class="tips">注：若状态改为失败，会退还用户支付金额（即退款）</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false;editGroup={}">取 消</el-button>
        <el-button type="primary" @click="edit_save()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="团报设置" class="setGDB" :visible.sync="setGDV">
      <setGroup />
    </el-dialog>
  </div>
</template>

<script>
import setGroup from "./set_group";
export default {
  components: { setGroup },
  data() {
    return {
      m_arr: [],
      mId: "",
      tableData: [],
      loading: false,
      dialogVisible: false,
      editGroup: {}, //修改的拼团信息
      setGDV: false,
    };
  },
  methods: {
    init() {
      let orgId = window.sessionStorage.getItem("orgId");
      this.$axios.get("/sign/team/getGroupMatch?orgId=" + orgId).then((res) => {
        let rr = res.data.data;
        this.m_arr = rr;
        if (rr.length > 0) {
          this.mId = rr[0].id;
          this.get_Team();
        }
      });
    },
    get_Team() {
      this.loading = true;
      this.$axios
        .get("/sign/team/getGroupTeamList?matchId=" + this.mId)
        .then((res) => {
          let rr = res.data.data;
          rr.forEach((v) => {
            v.s_state =
              v.state == 1 ? "拼团成功" : v.state == 2 ? "拼团失败" : "拼团中";
            v.personList = v.personList.filter((vv) => {
              return vv.type != 1;
            });
            v.personList.forEach((vv) => {
              vv.state = v.state;
            });
          });
          this.tableData = rr;
          this.loading = false;
        });
    },
    toogleExpand(row) {
      let $table = this.$refs.table;
      this.tableData.map((item) => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
    // 编辑修改 拼团结束时间 状态 ==》拼团失败不可在更改
    editMsg(row) {
      // console.log(row)
      if (row.state == 2) {
        this.$message.warning("拼团失败不可更改信息");
        return false;
      }
      this.editGroup = row;
      this.dialogVisible = true;
    },
    edit_save() {
      if (!this.editGroup.endTime) {
        this.$message.warning("请选择截止时间");
        return false;
      }
      let oo = {
        id: this.editGroup.id,
        state: this.editGroup.state,
        endTime: this.editGroup.endTime,
      };
      this.$axios.post("/sign/team/editGroupTeamState", oo).then((res) => {
        this.get_Team();
        this.dialogVisible = false;
      });
    },
    delP(row) {
      //   console.log(row);
      if (row.state == 2) {
        this.$message.warning("拼团失败，已退款，不支持再删除");
        return false;
      }
      //
      this.$confirm(
        "此操作将删除该用户拼团信息并退还其支付金额, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$axios
            .get("/sign/team/delGroupTeamPerson?id=" + row.id)
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.get_Team();
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
  created() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.sgin_G_admin {
  @include padShow();
}
.cMB {
  width: 300px;
}
.tips {
  margin-left: 68px;
  font-size: 13px;
}
.setGDB >>> .el-dialog {
  width: 80%;
  margin: 40px auto;
}
</style>