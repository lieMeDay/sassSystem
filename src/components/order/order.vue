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
        <el-select v-model="valId" placeholder="请选择" @change="toggle">
          <el-option
            v-for="item in matchList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="tabBox" v-loading="loading">
        <div class="iptBox">
          <el-input
            placeholder="请输入姓名或手机号"
            class="ipt"
            v-model="input"
            clearable
          ></el-input>
          <el-date-picker
            v-model="date"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            class="ii1"
          ></el-date-picker>
          <el-select v-model="seaState" placeholder="请选择" class="ii2">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" class="sbtn" @click="search"
            >搜索</el-button
          >
        </div>
        <div class="all">
          <!-- <span>总人数:{{allData.length}}人</span> -->
          <el-button type="primary" @click="port">导出</el-button>
        </div>
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          border=""
          style="width: 100%"
        >
          <el-table-column
            prop="memberName"
            label="姓名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="groupName"
            label="赛项"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="产品"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="payNum"
            label="数量"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="addres"
            width="200"
            label="地址"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderDate"
            label="日期"
            align="center"
          ></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="{ row }">
              <el-select
                v-model="row.shipState"
                placeholder="请选择"
                @change="changeState(row)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="物流公司" align="center">
            <template slot-scope="{ row }">
              <el-input
                placeholder="请输入物流公司"
                v-if="row.shipState == 1 && row.savestate"
                v-model="row.logisticsCom"
                clearable
              ></el-input>
              <span v-else>{{
                row.logisticsCom ? row.logisticsCom : "暂无"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="物流单号" align="center">
            <template slot-scope="{ row }">
              <el-input
                placeholder="请输入物流单号"
                v-if="row.shipState == 1 && row.savestate"
                v-model="row.orderNumber"
                clearable
              ></el-input>
              <span v-else>{{
                row.orderNumber ? row.orderNumber : "暂无"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="showHandle">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.savestate"
                @click="saveInfo(row)"
                >保存</el-button
              >
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
        <p>总金额：{{ money }}元；总订单量：{{ tableData.length }}件</p>
      </div>
    </div>
  </div>
</template>

<script>
/*解决两个数相加精度丢失问题*/
const floatAdd = (a, b) => {
  var c, d, e;
  if (undefined == a || null == a || "" == a || isNaN(a)) {
    a = 0;
  }
  if (undefined == b || null == b || "" == b || isNaN(b)) {
    b = 0;
  }
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return (floatMul(a, e) + floatMul(b, e)) / e;
};
/*解决两个数相乘精度丢失问题*/
const floatMul = (a, b) => {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return (
    (Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c)
  );
};
import table2excel from "js-table2excel";
export default {
  data() {
    return {
      matchList: [],
      seeI: 0,
      allData: [],
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      input: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      date: [],
      loading: false,
      options: [
        {
          value: "0",
          label: "未发货",
        },
        {
          value: "1",
          label: "已发货",
        },
        {
          value: "2",
          label: "其它",
        },
      ],
      seaState: "",
      valId: "",
      money: 0,
      orderNumber: 0,
      showHandle: false, //显示操作
    };
  },
  methods: {
    // 获取赛事
    getMatch() {
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        this.matchList = this.matchList.concat(res.data.data);
        this.valId = this.matchList[0].id;
        this.toggle();
      });
    },
    // 切换赛事
    toggle() {
      let v = "";
      let i = 0;
      for (let a = 0; a < this.matchList.length; a++) {
        if (this.matchList[a].id == this.valId) {
          v = this.matchList[a];
          i = a;
          break;
        }
      }
      this.seeI = i;
      this.input = "";
      this.date = "";
      this.seaState = "";
      this.tableData = [];
      this.allData = [];
      let obj = { matchId: v.id, beginDate: "", endDate: "" };
      this.loading = true;
      this.$axios
        .get("/match/signUp/order/getCount", { params: obj })
        .then((res) => {
          let rr = res.data.data;
          let am=0
          rr.forEach((v) => {
            if (v.shipState == "2") {
              v.shipState = "其它";
            } else if (v.shipState == "1") {
              v.shipState = "已发货";
            } else {
              v.shipState = "未发货";
            }
            v.payNum = 1;
            am = floatAdd(am, Number(v.price));
            if (v.region) {
              let r = v.region.split(";");
              if (!r[0]) v.region = "";
              else v.region = r[0] + "/" + r[1] + "/" + r[2];
            } else v.region = "";
            if(!v.address) v.address=''
            if(!v.region&&!v.address) v.region='暂无'
            v.addres = v.region + v.address;
          });
          this.money=am
          this.tableData = rr;
          this.allData = JSON.parse(JSON.stringify(rr));
          this.loading = false;
        });
    },
    // 搜索
    search() {
      if (this.input == "" && !this.date && this.seaState == "") {
        this.tableData = this.allData;
      } else {
        let resArr = JSON.parse(JSON.stringify(this.allData));
        if (this.input != "") {
          resArr = this.allData.filter(
            (v) =>
              v.memberName.indexOf(this.input) != -1 ||
              v.phone.indexOf(this.input) != -1
          );
        }
        if (this.date) {
          let q = new Date(this.date[0]).getTime();
          let h = new Date(this.date[1]).getTime();

          resArr = resArr.filter(
            (v) =>
              new Date(v.orderDate).getTime() >= q &&
              new Date(v.orderDate).getTime() <= h
          );
        }
        if (this.seaState == "0") {
          resArr = resArr.filter((v) => v.shipState == "未发货");
        }
        if (this.seaState == "1") {
          resArr = resArr.filter((v) => v.shipState == "已发货");
        }
        if (this.seaState == "2") {
          resArr = resArr.filter((v) => v.shipState == "其它");
        }

        this.tableData = resArr;
      }
    },
    // 导出
    port() {
      let column = [
        {
          title: "姓名",
          key: "memberName",
          type: "text",
        },
        {
          title: "手机号",
          key: "phone",
          type: "text",
        },
        {
          title: "赛项",
          key: "groupName",
          type: "text",
        },
        {
          title: "产品",
          key: "name",
          type: "text",
        },
        {
          title: "价格",
          key: "price",
          type: "text",
        },
        {
          title: "数量",
          key: "payNum",
          type: "text",
        },
        {
          title: "日期",
          key: "orderDate",
          type: "text",
        },
      ];
      let filename = this.matchList[this.seeI].name;
      if (filename.indexOf(".") != Number(-1)) {
        filename = filename + ".xls";
      }
      table2excel(column, this.allData, filename);
    },
    // 改变状态
    changeState(row) {
      console.log(row);
      if (row.shipState == 1) {
        row.savestate = true;
        this.showHandle = true;
      } else {
        // 直接存
        let obj = {
          id: row.id,
          state: row.shipState,
          logisticsCom: "",
          orderNumber: "",
        };
        row.logisticsCom = "";
        row.orderNumber = "";
        let uu = `id=${obj.id}&state=${obj.state}&logisticsCom=${obj.logisticsCom}&orderNumber=${obj.orderNumber}`;
        this.$axios
          .put("/match/signUp/order/putShipState?" + uu)
          .then((res) => {
            for (let a = 0; a < this.allData.length; a++) {
              if (this.allData[a].id == row.id) {
                if (row.shipState == "2") {
                  this.allData[a].shipState = "其它";
                } else if (row.shipState == "1") {
                  this.allData[a].shipState = "已发货";
                } else {
                  this.allData[a].shipState = "未发货";
                  this.allData[a].logisticsCom = "";
                  this.allData[a].orderNumber = "";
                }
                break;
              }
            }
          });
      }
    },
    saveInfo(row) {
      row.savestate = false;
      let hh = this.tableData.filter((v) => v.savestate);
      if (hh.length > 0) {
        this.showHandle = true;
      } else {
        this.showHandle = false;
      }
      let obj = {
        id: row.id,
        state: row.shipState,
        logisticsCom: row.logisticsCom,
        orderNumber: row.orderNumber,
      };
      let uu = `id=${obj.id}&state=${obj.state}&logisticsCom=${obj.logisticsCom}&orderNumber=${obj.orderNumber}`;
      this.$axios.put("/match/signUp/order/putShipState?" + uu).then((res) => {
        for (let a = 0; a < this.allData.length; a++) {
          if (this.allData[a].id == row.id) {
            if (row.shipState == "2") {
              this.allData[a].shipState = "其它";
            } else if (row.shipState == "1") {
              this.allData[a].shipState = "已发货";
            } else {
              this.allData[a].shipState = "未发货";
            }
            break;
          }
        }
      });
      this.$forceUpdate();
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
  width: 180px;
  /* margin-right: 10px; */
}
.ii1 {
  width: 380px;
}
.ii2 {
  width: 180px;
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
</style>
