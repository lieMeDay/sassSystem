<template>
  <!-- 活动人员 只针对于活动 -->
  <div class="memberWrap">
    <div class="memberBox">
      <div class="toggleWrap">
        <div class="tTit">赛事选择</div>
        <!-- <ul class="tCon">
          <li
            v-for="(v,i) in matchList"
            :key="i"
            :class="seeI==i?'act':''"
            @click="toggle(v,i)"
          >{{v.name}}</li>
        </ul>-->
        <el-select v-model="value" placeholder="请选择" @change="toggle">
          <el-option v-for="item in matchList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="tabBox" v-loading="loading">
        <div class="iptBox">
          <el-input
            placeholder="请输入姓名或手机号"
            class="ipt"
            v-model="input"
            clearable
            @change="search()"
          ></el-input>
          <el-button type="primary" class="sbtn" @click="search()">搜索</el-button>
        </div>
        <div class="all">
          <!-- <span>总人数:{{allData.length}}人</span> -->
          <el-button type="primary" @click="port">导出</el-button>
        </div>
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border>
          <el-table-column prop="nikeName" label="昵称" align="center"></el-table-column>
          <el-table-column prop="memberName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
          <el-table-column label="排行" align="center">
            <template slot-scope="{$index}">{{$index+1}}</template>
          </el-table-column>
          <el-table-column prop="joinNum" label="次数" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" @click="seeMy(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pageWrap">
          <div class="pageBox">
            <el-pagination
              :current-page.sync="currentPage"
              :page-size="pagesize"
              layout="prev, pager, next, jumper"
              :total="tableData.length"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="alertWrap" v-if="showMe" @click.self="showMe=!showMe;meMsg={}">
    <div class="alertBox">-->
    <el-dialog class="dvsW" title="登顶详情" :visible.sync="showMe">
      <div class="aBtit">选手信息</div>
      <ul class="ulMy">
        <li>
          <span class="at">姓名</span>
          <span class="ac">{{meMsg.name}}</span>
        </li>
        <li>
          <span class="at">性别</span>
          <span class="ac">{{meMsg.gender}}</span>
        </li>
        <li>
          <span class="at">手机号</span>
          <span class="ac">{{meMsg.phone}}</span>
        </li>
        <li>
          <span class="at">证件类型</span>
          <span class="ac">{{meMsg.idNumberType}}</span>
        </li>
        <li>
          <span class="at">证件号</span>
          <span class="ac">{{meMsg.idNumber}}</span>
        </li>
        <li>
          <span class="at">地区</span>
          <span class="ac">{{meMsg.showRegion}}</span>
        </li>
        <li>
          <span class="at">详细地址</span>
          <span class="ac">{{meMsg.address}}</span>
        </li>
      </ul>
      <div class="aBtit">登顶打卡记录</div>
      <el-table border :data="meMsg.record.slice((APage-1)*Asize,APage*Asize)">
        <el-table-column prop="name" label="赛事" align="center"></el-table-column>
        <el-table-column prop="startTime" label="起点时间" align="center"></el-table-column>
        <el-table-column prop="endTime" label="峰顶时间" align="center"></el-table-column>
        <el-table-column prop="useTime" label="用时" align="center"></el-table-column>
      </el-table>
      <div class="pageWrap">
        <div class="pageBox">
          <el-pagination
            :current-page.sync="APage"
            :page-size="Asize"
            layout="prev, pager, next, jumper"
            :total="meMsg.record.length"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- </div>
    </div>-->
  </div>
</template>

<script>
//将时间戳转换成正常时间格式
const timeConvert = (timestamp) => {
  var date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return y + "/" + m + "/" + d + " " + h + ":" + minute + ":" + second;
};
// 秒转时分秒
const formatSeconds = (time) => {
  let min = Math.floor(time % 3600);
  let hh =
    Math.floor(time / 3600) > 9
      ? Math.floor(time / 3600)
      : "0" + Math.floor(time / 3600);
  let mm =
    Math.floor(min / 60) > 9
      ? Math.floor(min / 60)
      : "0" + Math.floor(min / 60);
  let ss = time % 60 > 9 ? time % 60 : "0" + (time % 60);
  let val = hh + ":" + mm + ":" + ss;
  return val;
};
import table2excel from "js-table2excel";
var matchId = 0;
export default {
  data() {
    return {
      matchList: [{ name: "全部", id: 0 }],
      seeI: 1,
      allData: [],
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      input: "",
      showMe: false,
      meMsg: { record: [] },
      loading: false,
      APage: 1,
      Asize: 5,
      value: 0,
    };
  },
  methods: {
    //   搜索
    search() {
      if (this.input != "") {
        let resArr = this.allData.filter(
          (v) =>
            v.name.indexOf(this.input) != -1 ||
            v.phone.indexOf(this.input) != -1
        );
        this.tableData = resArr;
      } else {
        this.tableData = this.allData;
      }
    },
    //  获取赛事
    getMatch() {
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        this.matchList = this.matchList.concat(res.data.data);
        this.toggle();
      });
    },
    // 切换赛事
    toggle() {
      let v = "";
      let i = 0;
      for (let a = 0; a < this.matchList.length; a++) {
        if (this.matchList[a].id == this.value) {
          v = this.matchList[a];
          i = a;
          break;
        }
      }
      this.seeI = i;
      if (v.id == 0) {
        this.loading = true;
        matchId = 0;
        this.getAllUR();
      } else {
        this.loading = true;
        this.tableData = [];
        matchId = v.id;
        this.getAllUR(v.id);
      }
    },
    // 获取 排行 用户列表
    getAllUR() {
      this.$axios
        .get("/run/shifeng/getRankList?matchId=" + matchId)
        .then((res) => {
          let rr = res.data.data;
          this.loading = false;
          this.tableData = rr ? rr : [];
          this.allData = JSON.parse(JSON.stringify(this.tableData));
        });
    },
    // 查看个人
    seeMy(v) {
      console.log(v);
      let that = this;
      this.loading = true;
      let obj = { openId: v.openId };
      this.meMsg = { record: [] };
      let pp = new Promise(function (reslove, reject) {
        that.$axios
          .get("/run/shifeng/getMemberSignUpByOpenId", { params: obj })
          .then((res) => {
            let rr = res.data.data;
            reslove(rr);
          });
      });
      Promise.all([pp]).then((res) => {
        let mm = res[0];
        console.log(res[0]);
        this.$axios
          .get("/run/person/shifeng/getByOpenId", { params: obj })
          .then((res) => {
            this.loading = false;
            this.showMe = true;
            let jj = res.data.data;
            jj = jj.filter((v) => v.state == 1);
            if (matchId != 0) {
              jj = jj.filter((v) => v.matchId == matchId);
            }
            jj = jj.filter((v) => {
              return v.cpName == "终点";
            });
            jj.forEach((v) => {
              v.endTime = v.cpTime > 0 ? timeConvert(v.cpTime) : "暂无";
              let useTime = 0;
              if (v.cpTime != 0 && v.startTime != 0) {
                useTime = Math.ceil((v.cpTime - v.startTime) / 1000);
              }
              v.startTime = v.startTime > 0 ? timeConvert(v.startTime) : "暂无";
              v.useTime = useTime > 0 ? formatSeconds(useTime) : "暂无";
            });
            mm.record = jj;
            this.meMsg = mm;
          });
      });
    },
    // 导出
    port() {
      let column = [
        {
          title: "姓名",
          key: "name",
          type: "text",
        },
        {
          title: "手机号",
          key: "phone",
          type: "text",
        },
        {
          title: "性别",
          key: "gender",
          type: "text",
        },
        {
          title: "证件类型",
          key: "idNumberType",
          type: "text",
        },
        {
          title: "证件号",
          key: "idNumber",
          type: "text",
        },
        {
          title: "地区",
          key: "showRegion",
          type: "text",
        },
        {
          title: "详细地址",
          key: "address",
          type: "text",
        },
        {
          title: "次数",
          key: "joinNum",
          type: "text",
        },
      ];
      let filename = this.matchList[this.seeI].name;
      if (filename.indexOf(".") != Number(-1)) {
        filename = filename + ".xls";
      }
      table2excel(column, this.allData, filename);
    },
  },
  mounted() {
    this.getMatch();
  },
};
</script>

<style scoped>
.memberWrap {
  background: #fff;
  border-radius: 10px;
}
.memberBox {
  position: relative;
  padding: 20px;
}
.toggleWrap {
  width: 100%;
  overflow: hidden;
  margin-bottom: 15px;
}
.tTit {
  float: left;
  font-weight: bold;
  /* color: #20a0ff; */
  width: 70px;
  text-align: center;
  line-height: 40px;
  margin-right: 10px;
}
.tCon {
  width: calc(100% - 70px);
  float: left;
}
.tCon li {
  float: left;
  margin-left: 15px;
  cursor: pointer;
}
.tCon li.act {
  color: #20a0ff;
}
.iptBox {
  float: left;
  margin-bottom: 10px;
}

.ipt {
  width: 200px;
  margin-right: 10px;
}

.all {
  float: right;
  margin-bottom: 10px;
}

.all > span {
  float: left;
  line-height: 40px;
  margin-right: 8px;
}

.pageWrap {
  width: 100%;
  margin-top: 10px;
  height: 32px;
  position: relative;
}

.pageBox {
  float: left;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.ulMy {
  overflow: hidden;
}
.aBtit {
  width: 100%;
  border-bottom: 1px solid #409eff;
  margin-bottom: 10px;
  line-height: 35px;
}
</style>

<style lang="scss" scoped>
// .alertWrap {
//   @include alertBox();
// }
// .alertBox {
//   width: 80%;
//   background-color: #fff;
//   padding: 20px;
//   min-width: 500px;
//   @include hs_center();
// }
.dvsW {
  >>> .el-dialog {
    width: 80%;
    margin: 30px auto;
  }
  >>> .el-dialog__body {
    padding-top: 10px;
  }
  li {
    float: left;
    width: 33.333%;
    margin-bottom: 10px;
    .at {
      width: 68px;
      float: left;
      text-align: right;
      color: #20a0ff;
    }
    .ac {
      float: left;
      margin-left: 10px;
    }
  }
}
</style>
