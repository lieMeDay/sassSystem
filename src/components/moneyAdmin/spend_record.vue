
<template>
  <!-- 用户资金记录 -->
  <div class="spend_record">
    <el-form :inline="true">
      <el-form-item label>
        <el-select v-model="mId" placeholder="请选择赛事" @change="getGroup()">
          <el-option v-for="item in m_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-select v-model="gId" placeholder="请选择赛项">
          <el-option v-for="item in g_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="entryNumber" placeholder="请输入昵称/参赛号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="batch_more">批量操作</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button @click="handleCheckAllChange(!checked)">当页全选</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="batch_more">批量操作</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData.slice((aC-1)*aP,aC*aP)"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="toggleRowExpansion"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form :inline="true">
            <el-form-item>
              <el-button :type="type==1?'primary':''" @click="getDetail(1,props.row.openId)">收入</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button :type="type==2?'primary':''" @click="getDetail(2,props.row.openId)">支出</el-button>
            </el-form-item> -->
            <el-form-item>
              <el-button :type="type==3?'primary':''" @click="getDetail(3,props.row.openId)">优惠券</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="detail_Arr.slice((bC-1)*bP,bC*bP)" style="width: 100%" v-loading="conLoading">
            <el-table-column prop="name" label="赛事/组别" v-if="type!=2"></el-table-column>
            <el-table-column label="信息">
              <template slot-scope="{row}">
                <span v-html="row.info"></span>
              </template>
            </el-table-column>
            <el-table-column label="金额" v-if="type!=3">
              <template slot-scope="{row}">
                <span :style="{color:row.type==1?'green':'red'}">{{row.money}}</span>
              </template>
              </el-table-column>
            <el-table-column prop="money" label="数量" v-else></el-table-column>
            <el-table-column prop="addTime" label="时间"></el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="bC"
            :page-size="bP"
            layout="prev, pager, next, jumper"
            :hide-on-single-page="true"
            :total="detail_Arr.length"
          ></el-pagination>
        </template>
      </el-table-column>
      <el-table-column prop="nikeName" label="昵称"></el-table-column>
      <el-table-column prop="name" label="参赛名称" v-if="showMore"></el-table-column>
      <el-table-column prop="entryNumber" label="参赛号" v-if="showMore"></el-table-column>
      <el-table-column prop="money" sortable="custom" label="余额(元)"></el-table-column>
      <el-table-column prop="tickets" label="优惠券(张)"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button @click="showAdd(row)">添加记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="aC"
      :page-size="aP"
      layout="prev, pager, next, jumper"
      :hide-on-single-page="true"
      :total="tableData.length"
    ></el-pagination>
    <el-dialog title="添加记录" :visible.sync="dialogFormVisible">
      <el-form :model="Wallet" ref="walletForm" :rules="rules">
        <el-form-item>
          <el-button
            :type="Wallet.type==1?'primary':''"
            @click="Wallet.type=1;change_rule();clear(1)"
          >收入</el-button>
          <el-button
            :type="Wallet.type==2?'primary':''"
            @click="Wallet.type=2;change_rule();clear(2)"
            v-if="ed_openId.length==1"
          >支出</el-button>
          <el-button
            :type="Wallet.type==3?'primary':''"
            @click="Wallet.type=3;change_rule(3);clear(3)"
          >优惠券</el-button>
        </el-form-item>
        <el-form-item label="金额" label-width="100px" v-if="Wallet.type!=3" prop="money">
          <el-input v-model="Wallet.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="信息" label-width="100px" v-if="Wallet.type!=3" prop="info">
          <el-input v-model="Wallet.info" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择赛事" label-width="100px" v-if="Wallet.type!=3" prop="matchId">
          <el-select v-model="Wallet.matchId" placeholder="请选择">
            <el-option v-for="item in m_arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券图片" label-width="100px" v-if="Wallet.type==3" prop="imgUrl">
          <div v-if="Wallet.imgUrl" class="logoB">
            <img :src="Wallet.imgUrl" class="avatar" />
            <div class="logoA">
              <i class="el-icon-delete delI" @click="Wallet.imgUrl=''"></i>
            </div>
          </div>
          <el-upload
            v-else
            class="avatar-uploader"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="AvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="img"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="优惠券名称" label-width="100px" v-if="Wallet.type==3" prop="name">
          <el-input v-model="Wallet.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="优惠券信息" label-width="100px" v-if="Wallet.type==3" prop="infoS">
          <el-input v-model="Wallet.infoS" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="优惠券链接" label-width="100px" v-if="Wallet.type==3" prop="links">
          <el-input v-model="Wallet.links" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear();dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sub('walletForm');">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
function add0(m) {
  return m < 10 ? "0" + m : m;
}
function format(shijianchuo) {
  //时间戳是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}
var rule1 = {
  money: [
    { required: true, message: "请输入金额", trigger: "blur" },
    // { type: "number", message: "金额必须为数字值" },
  ],
  info: [{ required: true, message: "请输入信息", trigger: "blur" }],
};
var rule2 = {
  imgUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  infoS: [{ required: true, message: "请输入信息", trigger: "blur" }],
  links: [{ required: true, message: "请输入优惠券链接", trigger: "blur" }],
};
export default {
  data() {
    return {
      showMore: false,
      entryNumber: "",
      checked: false,
      isIndeterminate: false,
      mId: "",
      gId: "",
      g_arr: "",
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      tableData: [],
      // 要展开的行，数值的元素是row的key值
      expands: [],
      type: "",
      detail_Arr: [],
      dialogFormVisible: false,
      Wallet: {
        matchId: "",
        openId: "",
        money: "",
        type: 1,
        info: "",
        name: "",
        imgUrl: "",
        infoS: "",
        links: "",
      },
      actionUrl: "",
      rules: rule1,
      ed_openId: [],
      m_arr: "", // 赛事
      multipleSelection: [],
      aP: 10,
      aC: 1,
      bP: 5,
      bC: 1,
      conLoading:false
    };
  },
  methods: {
    sortChange(k) {
      // console.log(k)
      if (k.order == "descending") {
        this.tableData.sort(function (a, b) {
          return b.money - a.money;
        });
      } else {
        this.tableData.sort(function (a, b) {
          return a.money - b.money;
        });
      }
    },
    // 图片上传成功
    AvatarSuccess(res, file) {
      console.log(res, file.raw);
      // this.formD.logo = URL.createObjectURL(file.raw);
      this.Wallet.imgUrl = res.data.filePath;
    },
    // 图片上传前
    beforeAvatarUpload(params) {
      const isLt2M = params.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 获取所有
    getAll() {
      this.$axios.get("/wallet/getPersonWalletList").then((res) => {
        let rr = res.data.data;
        this.tableData = rr;
      });
    },
    // 切换展开 表格
    toggleRowExpansion(row) {
      // console.log(row.id)
      let s = this.expands.findIndex((v) => v == row.id);
      if (s >= 0) {
        this.expands = [];
      } else {
        this.expands = [];
        this.type = 1;
        this.bC=1
        this.getDetail(1, row.openId);
        this.expands.push(row.id);
      }
    },
    // 查看详情
    getDetail(i, oId) {
      // if (this.type == i) return false;
      // else{}
      this.detail_Arr = [];
      this.type = i;
      let oo = { type: i, openId: oId };
      this.conLoading=true
      if(i==1){
      this.detail_Arr = [];
      let oo = {openId: oId };
      this.$axios
        .get("/wallet/getPersonWallet", { params: oo })
        .then((res) => {
          let rr = res.data.data.list
          rr.forEach((v) => {
            v.money = v.type == 1 ? "+" + v.money : "-" + v.money;
            v.name = v.name ? v.name : "";
            v.addTime = format(v.addTime);
          });
          this.detail_Arr = rr;
      this.conLoading=false
        });
      }else{
      this.$axios
        .get("wallet/getPersonWalletInfos", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          rr.forEach((v) => {
            if (i == 3) {
              v.info = v.name;
              v.name = v.matchName;
              v.money = 1;
            } else v.money = v.type == 1 ? "+" + v.money : "-" + v.money;
            v.name = v.name ? v.name : "暂无";
            v.addTime = format(v.addTime);
          });
          this.detail_Arr = rr;
      this.conLoading=false
        });
      }
    },
    // 打开 添加记录
    showAdd(row) {
      this.expands = [];
      this.dialogFormVisible = true;
      this.ed_openId = [row.openId];
    },
    change_rule(i) {
      this.rules = {};
      if (i == 3) this.rules = rule2;
      else this.rules = rule1;
      this.$forceUpdate();
    },
    // 取消上传
    clear(i) {
      this.Wallet = {
        matchId: "",
        openId: "",
        money: "",
        info: "",
        name: "",
        imgUrl: "",
        infoS: "",
        type: 1,
        links: "",
      };
      if (i) this.Wallet.type = i;
      this.$refs["walletForm"].resetFields();
    },
    sub(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.Wallet.openIds = this.ed_openId;
          // 优惠券
          if (this.Wallet.type == 3) this.Wallet.info = this.Wallet.infoS;
          // 支出
          if (this.Wallet.type == 2) this.Wallet.openId = this.ed_openId[0];
          if (this.Wallet.type != 3) {
            if (isNaN(this.Wallet.money)) {
              this.$message("金额需为数字");
              return false;
            }
          }
          // console.log(this.Wallet);
          this.openSurePass();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    openSurePass() {
      this.$prompt("请输入密码进行验证", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password",
      })
        .then(({ value }) => {
          let oo = {
            orgId: sessionStorage.getItem("orgId"),
            pwd: value,
          };
          this.$axios.post("/org/judgePayPassword", oo).then((res) => {
            let rr = res.data.data;
            if (rr == 1) {
              if (!this.Wallet.matchId) this.Wallet.matchId = 0;
              this.$axios
                .post("/wallet/putPersonWallet", this.Wallet)
                .then((res) => {
                  let rr = res.data.data;
                  if (rr) {
                    this.$message.error(rr);
                  } else {
                    this.$message.success("记录添加成功");
                    this.dialogFormVisible = false;
                    if (this.mId && this.gId) this.search();
                    else this.getAll();
                    this.clear();
                  }
                });
            } else {
              this.$message.error(rr);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    batch_more() {
      console.log(this.multipleSelection);
      this.ed_openId = this.multipleSelection.map((v) => v.openId);
      // console.log(this.ed_openId)
      if (this.ed_openId.length <= 0) this.$message.warning("请先选择用户");
      else this.dialogFormVisible = true;
    },
    // 获取赛事
    getMatch() {
      let orgId = window.sessionStorage.getItem("orgId");
      // console.log(orgId)
      this.$axios.get("/match/getMatchByOrgId?orgId=" + orgId).then((res) => {
        let rr = res.data.data;
        this.m_arr = rr;
      });
    },
    // 获取赛项
    getGroup() {
      this.gId = "";
      this.g_arr = [];
      this.$axios.get("/match/getMatchById?matchId=" + this.mId).then((res) => {
        let rr = res.data.data.matchInfo;
        this.g_arr = rr;
      });
    },
    // 查询
    search() {
      // console.log(this.mId,this.gId)
      let oo = {
        matchId: Number(this.mId),
        groupId: Number(this.gId),
        entryNumber: this.entryNumber,
      };

      this.$axios
        .get("/wallet/getPersonWalletByMatchId", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          rr.forEach((v) => {
            v.money = v.money ? v.money : 0;
            v.tickets = v.tickets ? v.tickets : 0;
          });
          this.showMore = true;
          this.tableData = rr;
        });
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCheckAllChange(val) {
      this.checked = val;
      if (this.tableData.length > this.aP) {
        if (val) {
          this.toggleSelection();
          this.toggleSelection(
            this.tableData.slice((this.aC - 1) * this.aP, this.aC * this.aP)
          );
        } else {
          this.toggleSelection();
        }
      } else {
        if (val) {
          this.toggleSelection();
          this.toggleSelection(this.tableData);
        } else {
          this.toggleSelection();
        }
      }
      // console.log(this.multipleSelection);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  created() {
    this.getAll();
    this.getMatch();
    this.actionUrl = this.$img_url + "/match/uploadImg";
  },
};
</script>
  <style lang="scss" scoped>
/* @import url(); 引入公共css类 */
.spend_record {
  @include padShow();
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    display: block;
  }
  .logoB {
    width: 80px;
    display: block;
    position: relative;
  }
  .logoA {
    width: 80px;
    height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    color: #fff;
    top: 0;
    left: 0;
    display: none;
  }
  .logoB:hover .logoA {
    display: block;
  }
  .delI {
    font-size: 30px;
    color: #fff;
    width: 80px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>