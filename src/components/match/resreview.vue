<template>
  <!-- 报名审核 -->
  <div class="UpExa">
    <!-- {{continuityGood}} -->
    <!-- 选择条件 -->
    <div class="toggleWrap">
      <div class="taggBox">
        <div class="tBox tb1">
          <b>赛项名称</b>
          <span
            v-for="(v, i) in matchMsg.matchInfo"
            :key="i"
            :class="{ act: v.id == groupId }"
            @click="toggle(v.id)"
            >{{ v.name }}</span
          >
        </div>
        <div class="tBox tb1">
          <b>审核状态</b>
          <span
            v-for="(v, i) in statesList"
            :key="i"
            :class="{ act: i == sind }"
            @click="getsd(i)"
            >{{ v.val }}</span
          >
        </div>
        <!-- <div class="impBtn">
          <div class="impPer">
            <span>导出成绩</span>
          </div>
        </div>-->
      </div>
    </div>
    <!-- 表格 -->
    <div
      class="tabWrap"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="iptBox">
        <el-input
          class="seaIpt"
          v-model="seachVal"
          placeholder="请输入姓名或参赛号查询"
          @change="subsea"
        ></el-input>
        <el-button type="primary" @click="subsea">搜索</el-button>
        <el-button
          type="primary"
          class="portBtn"
          @click="portTable"
          v-if="!$newActive"
          >成绩导出</el-button
        >
      </div>
      <!-- header-row-class-name="tableHead" -->
      <el-table
        ref="table"
        border
        :data="
          tableData.slice(
            (currentPagerm - 1) * pagesize,
            currentPagerm * pagesize
          )
        "
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="zydescription"
        @sort-change="sortChange"
        class="HexpandB"
      >
        <el-table-column type="expand" v-if="!$newActive">
          <template slot-scope="props">
            <el-form label-position="left">
              <el-form-item label="打卡详情" v-if="matchMsg.continuity != 1">
                <el-table :data="props.row.CardMsg" border style="width: 100%">
                  <el-table-column
                    prop="cpName"
                    align="center"
                    label="cp名称"
                  ></el-table-column>
                  <el-table-column
                    prop="distance"
                    align="center"
                    label="距离"
                  ></el-table-column>
                  <el-table-column
                    prop="showUseTime"
                    align="center"
                    label="用时"
                  ></el-table-column>
                  <el-table-column align="center" label="打卡图片">
                    <template slot-scope="{ row }">
                      <img class="cimg" :src="row.cpImg" alt />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="完赛证明" v-if="matchMsg.continuity != 1">
                <!-- <div class="df">
                  <span class="f">openId：</span>
                  <span>{{props.row.openId}}</span>
                </div>-->
                <div v-if="props.row.endFile" style="float: left; width: 100%">
                  <div class="df">
                    <span class="f">距离：</span>
                    <span>{{ props.row.endFile.suppDistence }}</span>
                  </div>
                  <div class="df">
                    <span class="f">用时：</span>
                    <span>{{ props.row.endFile.showsuppUseTime }}</span>
                  </div>
                  <div class="df">
                    <span class="f">配速：</span>
                    <span>{{ props.row.endFile.suppPace }}</span>
                  </div>
                  <div class="df">
                    <span class="f">上升：</span>
                    <span>{{ props.row.endFile.suppUpDis }}</span>
                  </div>
                  <div class="df">
                    <span class="f">截图：</span>
                    <img
                      class="jtimg"
                      v-for="(v, i) in props.row.endFile.imgList"
                      :key="i"
                      :src="v"
                        v-showImgArr="{ list: props.row.endFile.imgList, ind: i }"
                    />
                  </div>
                </div>
                <span v-else>暂无</span>
              </el-form-item>
              <!-- 上传列表 -->
              <el-form-item label v-show="matchMsg.continuity == 1">
                <el-table
                  :data="continuityDetailS.slice((cur - 1) * page, cur * page)"
                  class="tcB"
                >
                  <el-table-column
                    prop="matchKey"
                    label="上传时间"
                    align="center"
                    width="260"
                  >
                    <template slot-scope="{ row }">
                      <el-date-picker
                        v-if="row.edit"
                        v-model="row.matchKey"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy/MM/dd HH:mm"
                        format="yyyy/MM/dd HH:mm"
                      ></el-date-picker>
                      <span v-else>{{ row.matchKey }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="距离" align="center" width="100">
                    <template slot-scope="{ row }">
                      <el-input
                        v-if="row.edit"
                        v-model="row.suppDistence"
                        size="mini"
                        @input="$forceUpdate()"
                      ></el-input>
                      <span v-else>{{ row.suppDistence }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="用时" align="center" width="150">
                    <template slot-scope="{ row }">
                      <el-time-picker
                        style="width: 120px"
                        v-if="row.edit"
                        value-format="HH:mm:ss"
                        v-model="row.showsuppUseTime"
                        :picker-options="{
                          selectableRange: '00:00:00 - 23:59:59',
                        }"
                        placeholder="任意时间点"
                      ></el-time-picker>
                      <span v-else>{{ row.showsuppUseTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="上升" align="center" width="60">
                    <template slot-scope="{ row }">
                      <span>{{ row.suppUpDis }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="配速" align="center" width="80">
                    <template slot-scope="{ row }">
                      <span>{{ row.suppPace }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否有效" align="center" width="100">
                    <template slot="header">
                      <span
                        :class="['cGD', continuityGood ? 'continuityGood' : '']"
                        @click="toggleContinue(1)"
                        >有效</span
                      >
                      /
                      <span
                        :class="[
                          'cGD',
                          !continuityGood ? 'continuityGood' : '',
                        ]"
                        @click="toggleContinue(0)"
                        >无效</span
                      >
                    </template>
                    <template slot-scope="{ row }">
                      <el-select
                        v-if="row.edit"
                        size="mini"
                        v-model="row.ss"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in ssss"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                      <span v-else>{{ row.ss }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="截图" align="center" width="120">
                    <template slot-scope="{ row }">
                      <img
                        class="jtimg"
                        :src="row.imgList[0]"
                        v-showImgArr="{ list: row.imgList, ind: 0 }"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="{ row }">
                      <el-button
                        type="text"
                        v-if="!row.edit"
                        @click="
                          row.edit = true;
                          $forceUpdate();
                        "
                        >编辑</el-button
                      >
                      <el-button
                        type="text"
                        v-else
                        @click="saveEdit(row, props.row)"
                        >保存</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  :current-page.sync="cur"
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="continuityDetailS.length"
                ></el-pagination>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="参赛号"
          prop="entryNumber"
          align="center"
          v-if="!$newActive"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="memberName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="公里数"
          align="center"
          prop="showDistance"
          sortable="custom"
          v-if="!$newActive"
        >
          <template slot-scope="{ row }">
            <el-input
              v-if="row.canEdit && row.inEdit"
              v-model="row.showDistance"
              size="mini"
              @input="$forceUpdate()"
            ></el-input>
            <span v-else>{{ row.showDistance }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用时"
          align="center"
          prop="endUsetime"
          sortable="custom"
          v-if="!$newActive"
        >
          <template slot-scope="{ row }">
            <el-input
              v-if="row.canEdit && row.inEdit"
              v-model="row.endUsetime"
              size="mini"
              @input="$forceUpdate()"
            ></el-input>
            <span v-else>{{ row.endUsetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="打卡时间" align="center" v-if="$newActive">
          <template slot-scope="{ row }">
            <el-input
              v-if="row.canEdit && row.inEdit"
              v-model="row.endUsetime"
              size="mini"
              @input="$forceUpdate()"
            ></el-input>
            <span v-else>{{ row.endUsetime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="打卡次数"
          sortable="custom"
          prop="goodCount"
          align="center"
          v-show="!$newActive && matchMsg.continuity == 1"
        ></el-table-column>
        <el-table-column
          label="爬升"
          align="center"
          v-if="!$newActive && matchMsg.continuity != 1"
        >
          <template slot-scope="{ row }">
            <el-input
              v-if="row.canEdit && row.inEdit"
              v-model="row.altitude"
              size="mini"
              @input="$forceUpdate()"
            ></el-input>
            <span v-else>{{ row.altitude }}</span>
          </template>
        </el-table-column>
        <el-table-column label="海拔" align="center" v-if="$newActive">
          <template slot-scope="{ row }">
            <el-input
              v-if="row.canEdit && row.inEdit"
              v-model="row.altitude"
              size="mini"
              @input="$forceUpdate()"
            ></el-input>
            <span v-else>{{ row.altitude }}</span>
          </template>
        </el-table-column>
        <el-table-column label="打卡图片" align="center" v-if="$newActive">
          <template slot-scope="{ row }">
            <img
              :src="row.cpImg"
              alt
              class="activeImg"
                        v-showImgArr="{ list: [row.cpImg], ind: 0 }"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          prop="state"
          align="center"
          v-if="!showBad"
        ></el-table-column>
        <el-table-column
          label="无效条数"
          prop="badCount"
          align="center"
          sortable="custom"
          v-if="showBad"
        ></el-table-column>
        <!-- v-if="!$newActive||($newActive&&sind==0)" -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="btnjh">
              <!-- <el-button
                size="medium"
                @click="toogleExpand(scope.row)"
                v-if="!$newActive"
              >信息查看</el-button>-->
              <el-button
                type="primary"
                size="medium"
                @click="Examine(scope.row)"
                >完赛审核</el-button
              >
              <!-- <el-button
                type="danger"
                size="medium"
                v-if="sind==0&&$newActive"
                @click="delCJ(scope.row,scope.$index)"
              >删除</el-button>-->
              <el-button
                type="danger"
                size="medium"
                v-if="scope.row.canEdit && !scope.row.inEdit"
                @click="
                  scope.row.inEdit = true;
                  $forceUpdate();
                "
                >信息修改</el-button
              >
              <el-button
                type="success"
                v-if="scope.row.canEdit && scope.row.inEdit"
                @click="subEdit(scope.row)"
                >保存信息</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPagerm"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="tableData.length"
      ></el-pagination>
    </div>
    <!-- 审核弹框 -->
    <div class="alertBox" v-if="showAlert">
      <div class="centerWrap">
        <div class="aTit">
          <span>审核提示</span>
          <i class="el-icon-close" @click="showAlert = !showAlert"></i>
        </div>
        <div class="aCon">
          <div>
            <span>选手姓名：</span>
            <span>{{ alertdata.memberName }}</span>
          </div>
          <div>
            <span>审核结果：</span>
            <el-select v-model="shValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <el-input
            class="tl"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="textarea"
            v-if="shValue == 2"
          ></el-input>
        </div>
        <div class="aBtn">
          <el-button @click="showAlert = !showAlert">取消</el-button>
          <el-button type="primary" @click="subState" v-if="!$newActive"
            >确认</el-button
          >
          <el-button type="primary" @click="activeSub" v-if="$newActive"
            >确认</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 时分秒转毫秒
function changeD(time) {
  var hour = time.split(":")[0];
  var min = time.split(":")[1];
  var sec = time.split(":")[2];
  var s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s * 1000;
}
// 转配速
var forPace = (sp) => {
  // console.log(sp)
  if (sp == 0) {
    return "--'--\"";
  } else {
    // let aa = 60 / ((sp.toFixed(2) * 3.6).toFixed(2))
    let aa = sp.toFixed(2);
    let b = parseInt(aa);
    let c = parseInt((aa - parseInt(aa)) * 60);
    // console.log(aa,b,c)
    if (b < 10) {
      b = "0" + b;
    }
    if (c < 10) {
      c = "0" + c;
    }
    return b + "'" + c + '"';
  }
};
var continuityDetail = [];
import table2excel from "js-table2excel";
export default {
  data() {
    return {
      statesList: [],
      options: [
        {
          value: "1",
          label: "通过",
        },
        {
          value: "2",
          label: "不通过",
        },
      ],
      sind: 0,
      matchId: "",
      groupId: "",
      distance: 0,
      matchMsg: {},
      tableData: [], //展示数据
      allData: [], //所有数据
      currentPagerm: 1,
      pagesize: 10,
      shValue: "", //选择的审核状态
      textarea: "", //未通过理由
      showAlert: false,
      alertdata: {},
      seachVal: "", //搜索输入框
      loading: false,
      seeImg: false,
      showImg: [], //显示的img列表 这个人
      imgInd: 0,
      imgLoding: false,
      getRowKeys(row) {
        return row.id;
      },
      expands: [],
      cur: 1,
      page: 5,
      ssss: [
        {
          // value: "t",
          label: "有效",
        },
        {
          // value: "f",
          label: "无效",
        },
      ],
      continuityGood: true,
      continuityDetailS: [],
      showBad: false,
    };
  },
  methods: {
    // 排序
    sortChange(k) {
      // console.log(k);
      if (k.order == "descending") {
        // 降序
        if (k.prop == "badCount") {
          this.tableData.sort(function (a, b) {
            return b.badCount - a.badCount;
          });
        } else if (k.prop == "showDistance") {
          this.tableData.sort(function (a, b) {
            return b.showDistance - a.showDistance;
          });
        } else if (k.prop == "endUsetime") {
          this.tableData.sort(function (a, b) {
            return changeD(b.endUsetime) - changeD(a.endUsetime);
          });
        } else if (k.prop == "goodCount") {
          this.tableData.sort(function (a, b) {
            return b.goodCount - a.goodCount;
          });
        }
      } else {
        // 升序
        if (k.prop == "badCount") {
          this.tableData.sort(function (a, b) {
            return a.badCount - b.badCount;
          });
        } else if ((k.prop = "showDistance")) {
          this.tableData.sort(function (a, b) {
            return a.showDistance - b.showDistance;
          });
        } else if (k.prop == "endUsetime") {
          this.tableData.sort(function (a, b) {
            return changeD(a.endUsetime) - changeD(b.endUsetime);
          });
        } else if (k.prop == "goodCount") {
          this.tableData.sort(function (a, b) {
            return a.goodCount - b.goodCount;
          });
        }
      }
    },
    // 展开行 查看详情 777 连续上传证明的
    zydescription(dd, expandedRows) {
      // console.log(dd);
      var that = this;
      this.cur = 1;
      if (expandedRows.length) {
        that.expands = [];
        if (dd) {
          that.expands.push(dd.id);
          let o = {
            matchId: dd.matchId,
            groupId: dd.groupId,
            entryNumber: dd.entryNumber,
          };
          this.getG(o, dd);
        }
      } else {
        that.expands = [];
      }
    },
    // 保存修改
    saveEdit(row, bRow) {
      // console.log(row, bRow);
      let o = JSON.parse(JSON.stringify(row));
      o.suppUseTime = changeD(o.showsuppUseTime);
      o.suppPace = forPace(o.suppUseTime / 60000 / o.suppDistence);
      // o.state = o.ss;
      // console.log(o.state, o.ss);
      if (o.ss == "有效") o.state = "t";
      if (o.ss == "无效") o.state = "f";
      row.suppPace = o.suppPace;
      this.$axios.post("/match/putPersonMatchData", o).then((res) => {
        row.edit = false;
        if (o.ss == "t" || o.ss == "有效") {
          row.ss = "有效";
          row.state = "t";
        } else {
          row.ss = "无效";
          row.state = "f";
        }
        let nd = continuityDetail.findIndex((d) => d.id == row.id);
        if (nd) continuityDetail[nd] = o;
        // if(o.ss='有效')this.toggleContinue(1);
        // else this.toggleContinue(0)
        this.$forceUpdate();
        let oo = {
          matchId: o.matchId,
          groupId: o.groupId,
          entry: bRow.entryNumber,
        };
        this.$axios
          .get("/match/getPersonMatchData", { params: oo })
          .then((res) => {
            let rr = res.data.data;
            bRow.showDistance = rr.distance;
            bRow.endUsetime = this.formatSeconds(rr.useTime / 1000);
            this.$forceUpdate();
          });
      });
    },
    // 导出
    portTable() {
      let that = this;
      that.loading = true;
      let column = [
        {
          title: "姓名",
          key: "memberName",
          type: "text",
        },
        {
          title: "参赛号",
          key: "entryNumber",
          type: "text",
        },
        {
          title: "性别",
          key: "sax",
          type: "text",
        },
        {
          title: "手机号",
          key: "phone",
          type: "text",
        },
        {
          title: "总用时",
          key: "endTime",
          type: "text",
        },
        {
          title: "总距离",
          key: "distance",
          type: "text",
        },
        {
          title: "平均配速",
          key: "meanPace",
          type: "text",
        },
        {
          title: "总排名",
          key: "endRank",
          type: "text",
        },
        {
          title: "性别排名",
          key: "sexRank",
          type: "text",
        },
      ];
      let cardInfo = [4, 0];
      // console.log(that.matchMsg)
      let groupInfo = that.matchMsg.matchInfo.filter(
        (v) => v.id == that.groupId
      );
      groupInfo[0].info.forEach((v) => {
        cardInfo.push({
          title: v.name,
          key: v.name,
          type: "text",
        });
      });
      Array.prototype.splice.apply(column, cardInfo);
      let obj = {
        matchId: that.matchId,
        groupId: that.groupId,
      };
      that.$axios
        .get("/run/person/match/exportPersonData", { params: obj })
        .then((res) => {
          // console.log(res)
          let rr = res.data.data;
          for (var a = 0; a < rr.length; a++) {
            let cc = rr[a];
            cc.memberName = cc.personToMatch.memberName;
            cc.entryNumber = cc.personToMatch.entryNumber;
            cc.sax = cc.personToMatch.sax;
            cc.phone = cc.personToMatch.phone;
            if (!cc.sexRank) {
              cc.sexRank = "";
            }
            if (!cc.endTime) {
              cc.endTime = "";
            }
            if (!cc.meanPace) {
              cc.meanPace = "";
            }
            if (!cc.endRank) {
              cc.endRank = "";
            }
            if (!cc.distance) {
              cc.distance = "";
            }
            if (Array.isArray(cc.dataList)) {
              groupInfo[0].info.forEach((ss) => {
                let dd = cc.dataList.filter((vv) => vv.cpName == ss.name);
                if (dd.length > 0) {
                  if (dd[0].cpTime) {
                    cc[dd[0].cpName] = that.timeConvert(dd[0].cpTime);
                  } else {
                    cc[dd[0].cpName] = "";
                  }
                } else {
                  cc[ss.name] = "";
                }
              });
            } else {
              groupInfo[0].info.forEach((ss) => {
                cc[ss.name] = "";
              });
            }
          }
          that.loading = false;
          let filename = that.matchMsg.name + "-" + groupInfo[0].name;
          if (filename.indexOf(".") != Number(-1)) {
            filename = filename + ".xls";
          }
          table2excel(column, rr, filename);
        });
    },
    // 保存修改
    subEdit(val) {
      // console.log(val);
      // console.log(val.showDistance, val.endUsetime, val.altitude);
      // console.log(val.endFile);
      if (
        val.showDistance == "" ||
        val.endUsetime == "" ||
        val.altitude == ""
      ) {
        this.$message.error("修改信息不可为空");
      } else {
        let reg = /^(20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/;
        if (!reg.test(val.endUsetime)) {
          this.$message.error("用时格式不正确");
        } else {
          val.inEdit = false;
          let sfm = val.endUsetime.split(":");
          let suppUseTime =
            (Number(sfm[0] * 3600) + Number(sfm[1] * 60) + Number(sfm[2])) *
            1000;
          let sj = (
            (Number(sfm[0] * 3600) + Number(sfm[1] * 60) + Number(sfm[2])) /
            60
          ).toFixed(2);
          let suppPace = this.forPace(sj / Number(val.showDistance));
          let obj = {
            // matchId  groupId  openId  suppImg   suppTime  matchKey  suppDistence   suppUseTime  suppPace
            matchId: val.endFile.matchId,
            groupId: val.endFile.groupId,
            openId: val.endFile.openId,
            matchKey: val.endFile.matchKey,
            suppImg: val.endFile.suppImg,
            suppContent: val.endFile.suppContent,
            suppTime: new Date().getTime(),
            id: val.endFile.id,
            suppDistence: Number(val.showDistance),
            suppUseTime: suppUseTime,
            suppUpDis: Number(val.altitude),
            suppPace: suppPace,
          };
          this.$axios
            .post("/run/person/match/putPersonMatchDataSupp", obj)
            .then((res) => {
              val.endFile.suppDistence = val.showDistance;
              val.endFile.suppPace = suppPace;
              val.endFile.suppUseTime = suppUseTime;
              val.endFile.showsuppUseTime = val.endUsetime;
              val.endFile.suppUpDis = val.altitude;
              this.$forceUpdate();
            });
        }
      }
    },
    forPace(sp) {
      if (sp == 0) {
        return "--'--\"";
      } else {
        // let aa = 60 / ((sp.toFixed(2) * 3.6).toFixed(2))
        let aa = sp.toFixed(2);
        let b = parseInt(aa);
        let c = parseInt((aa - parseInt(aa)) * 60);
        // console.log(aa,b,c)
        if (b < 10) {
          b = "0" + b;
        }
        if (c < 10) {
          c = "0" + c;
        }
        return b + "'" + c + '"';
      }
    },
    // 搜索查询
    subsea() {
      // console.log(this.seachVal)
      if (this.seachVal != "") {
        let resArr = this.allData.filter((v) => {
          if (this.$newActive) {
            if (v.memberName.indexOf(this.seachVal) != -1) return v;
          } else {
            if (
              v.memberName.indexOf(this.seachVal) != -1 ||
              v.entryNumber.indexOf(this.seachVal) != -1
            )
              return v;
          }
        });
        let i = this.sind;
        if (i == 0) {
          if (this.$newActive) {
            this.tableData = resArr.filter((vv) => {
              if (vv.state == "待审核") return vv;
            });
          } else {
            this.tableData = resArr;
          }
        } else if (i == 1) {
          this.tableData = resArr.filter((vv) => {
            if (this.$newActive) {
              if (vv.state == "已通过") return vv;
            } else {
              if (vv.ifFinish == 1) return vv;
            }
          });
        } else if (i == 2) {
          this.tableData = resArr.filter((vv) => {
            if (this.$newActive) {
              if (vv.state == "未通过") return vv;
            } else {
              if (vv.ifFinish == 2) return vv;
            }
          });
        } else if (i == 3) {
          this.tableData = resArr.filter((vv) => {
            if (this.$newActive) {
              if (vv.state == "未通过") return vv;
            } else {
              if (vv.ifFinish == 3) return vv;
            }
          });
        }
      } else {
        this.getsd(this.sind);
      }
    },
    //   获取赛事
    getMatchMsg() {
      this.matchId = Number(this.$route.query.matchId);
      this.groupId = Number(this.$route.query.id);
      let obj = { matchId: this.matchId };
      this.$axios.get("/match/getMatchById", { params: obj }).then((res) => {
        let rr = res.data.data;
        this.matchMsg = res.data.data;
        this.distance = this.matchMsg.matchInfo.filter(
          (v) => v.id == this.groupId
        )[0].wholeCourse;
        if (rr.continuity == 1) {
          this.statesList.push({ val: "无效记录", ind: 4 });
          this.getGarde();
        } else {
          this.getPerson();
        }
      });
    },
    //   切换赛项
    toggle(i) {
      this.groupId = i;
      this.distance = this.matchMsg.matchInfo.filter(
        (v) => v.id == this.groupId
      )[0].wholeCourse;
      this.sind = 0;
      this.currentPagerm = 1;
      if (this.matchMsg.continuity == 1) {
        this.getGarde();
      } else {
        this.getPerson();
      }
    },
    // 排序
    arrSort(a, b) {
      return a.cpUseTime - b.cpUseTime;
    },
    // 获取连续跑上传成绩
    getGarde() {
      let oo = {
        matchId: this.matchId,
        groupId: this.groupId,
      };
      this.$axios
        .get("/match/getPersonMatchList", { params: oo })
        .then((res) => {
          let arr = res.data.data;
          var obj = {};
          arr = arr.reduce(function (item, next) {
            obj[next.entryNumber]
              ? ""
              : (obj[next.entryNumber] = true && item.push(next));
            return item;
          }, []);
          for (let a = 0; a < arr.length; a++) {
            // arr[a].entryNumber = arr[a].entry_number;
            // arr[a].memberName = arr[a].member_name;
            arr[a].showDistance = Number(arr[a].distance);
            arr[a].endUsetime = this.formatSeconds(arr[a].useTime / 1000);
            arr[a].altitude = "暂无";
            arr[a].state =
              arr[a].ifFinish == 0
                ? "待审核"
                : arr[a].ifFinish == 1
                ? "已通过"
                : "未通过";
            arr[a].upload = [];
          }
          // console.log(arr)
          this.tableData = arr;
          this.allData = arr;
          // this.allShen(this.tableData,0,this.tableData[0])
        });
    },
    getG(o, dd) {
      this.$axios
        .get("/match/getPersonDateMatchs", { params: o })
        .then((res) => {
          let rr = res.data.data;
          for (let a = 0; a < rr.length; a++) {
            if (rr[a].state == "t") rr[a].ss = "有效";
            else if (rr[a].state == "s") rr[a].ss = "时间或配速不对";
            else if (rr[a].state == "c") rr[a].ss = "重复数据";
            else if (rr[a].state == "d") rr[a].ss = "今日数据，未做统计";
            else rr[a].ss = "无效";
            rr[a].showsuppUseTime = this.formatSeconds(
              rr[a].suppUseTime / 1000
            );
            rr[a].imgList = rr[a].suppImg.split("@");
            rr[a].edit = false;
          }
          // dd.upload = rr;
          continuityDetail = rr;
          // this.continuityGood = true;
          if (this.showBad) this.continuityGood = false;
          if (this.continuityGood) {
            this.continuityDetailS = continuityDetail.filter((v) => {
              return v.state == "t";
            });
          } else {
            this.continuityDetailS = continuityDetail.filter((v) => {
              return v.state != "t";
            });
          }
        });
    },
    // 获取选手
    getPerson() {
      this.loading = true;
      // /ran/person/match/getPersonToMatchs
      let obj = {
        matchId: this.matchId,
        groupId: this.groupId,
      };
      let sl = false;
      if (this.$newActive) {
        let oo = { matchId: this.matchId, state: 0 };
        this.$axios
          .get("/run/person/shifeng/getByState", { params: oo })
          .then((res) => {
            let rr = res.data.data;
            for (let a = 0; a < rr.length; a++) {
              rr[a].state =
                rr[a].state == 0
                  ? "待审核"
                  : rr[a].state == 1
                  ? "已通过"
                  : "未通过";
              rr[a].endUsetime = this.timeConvert(rr[a].cpTime);
            }
            this.tableData = rr;
            this.allData = rr;
            this.loading = false;
          });
      } else {
        this.$axios
          .get("/ran/person/match/getPersonToMatchs", { params: obj })
          .then((res) => {
            let rr = res.data.data;
            if (rr.length > 0) {
              let dx = {};
              rr = rr.reduce(function (item, next) {
                dx[next.openId]
                  ? ""
                  : (dx[next.openId] = true && item.push(next));
                return item;
              }, []);
              // console.log(rr)
              rr.forEach((v, Num) => {
                v.state =
                  v.ifFinish == 0
                    ? "待审核"
                    : v.ifFinish == 1
                    ? "已通过"
                    : "未通过";
                let str = {
                  matchId: this.matchId,
                  groupId: this.groupId,
                  openId: v.openId,
                };
                new Promise((resolve, reject) => {
                  this.$axios
                    .get("/run/person/match/getMatchData", { params: str })
                    .then((suc) => {
                      let ss = suc.data.data;
                      if (ss.length > 0) {
                        ss = ss.sort(this.arrSort);
                        ss.forEach((s) => {
                          s.showUseTime = this.formatSeconds(
                            parseInt(s.cpUseTime / 1000)
                          );
                        });
                        v.CardMsg = ss;
                        v.endUsetime = ss[ss.length - 1].showUseTime;
                      } else {
                        v.endUsetime = "暂无";
                        v.showDistance = "暂无";
                      }
                      this.$forceUpdate();
                      resolve();
                    });
                }).then(() => {
                  new Promise((resolve, reject) => {
                    // 获取openKey
                    this.$axios
                      .get("/run/person/match/getPersonMatchKey", {
                        params: str,
                      })
                      .then((res) => {
                        let openKey = res.data.data.matchKey;
                        let oo = {
                          openId: v.openId,
                          openKey: openKey,
                        };
                        let ii = { openKey: oo.openId + "%@%" + oo.openKey };
                        // 获取距离
                        this.$axios
                          .get("/run/person/match/getPersonMatchData", {
                            params: ii,
                          })
                          .then((res) => {
                            let record = res.data.data;
                            if (record) {
                              if (record.length > 0) {
                                let lastRec = record[record.length - 1];
                                v.showDistance = lastRec.distance;
                              } else {
                                v.showDistance = "暂无";
                              }
                            } else {
                              v.showDistance = "暂无";
                            }
                            // 获取海拔
                            this.$axios
                              .get("/run/person/getAltitudes", { params: oo })
                              .then((res) => {
                                v.altitude = res.data.data;
                                this.$forceUpdate();
                                resolve();
                              });
                          });
                      })
                      .catch((err) => {
                        // console.log(err);
                        v.altitude = "暂无";
                        resolve();
                      });
                  }).then(() => {
                    this.$axios
                      .get("/run/person/match/getPersonMatchDataSupp", {
                        params: str,
                      })
                      .then((record) => {
                        let dd = record.data.data[0];
                        if (dd) {
                          dd.showsuppUseTime = this.formatSeconds(
                            dd.suppUseTime / 1000
                          );
                          dd.imgList = dd.suppImg.split("@");
                          v.endFile = dd;
                          v.endUsetime = dd.showsuppUseTime;
                          v.altitude = dd.suppUpDis;
                          v.showDistance = dd.suppDistence;
                          if (dd.suppUpDis == 0) {
                            v.altitude = "暂无";
                          }
                          v.canEdit = true;
                          v.inEdit = false;
                        }
                        if (Num == rr.length - 1) {
                          this.loading = false;
                        }
                        this.$forceUpdate();
                      })
                      .catch((err) => {
                        if (Num == rr.length - 1) {
                          this.loading = false;
                        }
                      });
                  });
                });
              });

              this.tableData = rr;
              this.allData = rr;
            } else {
              this.loading = false;
            }
          });
      }
      this.$forceUpdate();
    },
    // 切换状态
    getsd(i) {
      this.sind = i;
      this.seachVal = "";
      this.currentPagerm = 1;
      if (this.$newActive) {
        if (i == 0) {
          let oo = { matchId: this.matchId, state: 0 };
          this.$axios
            .get("/run/person/shifeng/getByState", { params: oo })
            .then((res) => {
              let rr = res.data.data;
              for (let a = 0; a < rr.length; a++) {
                rr[a].state =
                  rr[a].state == 0
                    ? "待审核"
                    : rr[a].state == 1
                    ? "已通过"
                    : "未通过";
                rr[a].endUsetime = this.timeConvert(rr[a].cpTime);
              }
              this.tableData = rr;
              this.allData = rr;
              this.loading = false;
            });
        } else if (i == 1) {
          let oo = { matchId: this.matchId, state: 1 };
          this.$axios
            .get("/run/person/shifeng/getByState", { params: oo })
            .then((res) => {
              let rr = res.data.data;
              for (let a = 0; a < rr.length; a++) {
                rr[a].state =
                  rr[a].state == 0
                    ? "待审核"
                    : rr[a].state == 1
                    ? "已通过"
                    : "未通过";
                rr[a].endUsetime = this.timeConvert(rr[a].cpTime);
              }
              this.tableData = rr;
              this.allData = rr;
              this.loading = false;
            });
        } else if (i == 2) {
          let oo = { matchId: this.matchId, state: 2 };
          this.$axios
            .get("/run/person/shifeng/getByState", { params: oo })
            .then((res) => {
              let rr = res.data.data;
              for (let a = 0; a < rr.length; a++) {
                rr[a].state =
                  rr[a].state == 0
                    ? "待审核"
                    : rr[a].state == 1
                    ? "已通过"
                    : "未通过";
                rr[a].endUsetime = this.timeConvert(rr[a].cpTime);
              }
              this.tableData = rr;
              this.allData = rr;
              this.loading = false;
            });
        }
      } else {
        this.showBad = false;
        if (i == 0) {
          this.tableData = this.allData;
        } else if (i == 1) {
          this.tableData = this.allData.filter((vv) => vv.ifFinish == 0);
        } else if (i == 2) {
          this.tableData = this.allData.filter((vv) => vv.ifFinish == 1);
        } else if (i == 3) {
          this.tableData = this.allData.filter((vv) => vv.ifFinish == 2);
        } else if (i == 4) {
          this.tableData = this.allData.filter((vv) => vv.badCount > 0);
          this.showBad = true;
        }
      }
    },
    // // 删除十峰打卡成绩
    // delCJ(v,i){
    // },
    //   展开行 看信息
    toogleExpand(row) {
      let $table = this.$refs.table;
      //   this.tableData.map(item => {
      //     if (row.id != item.id) {
      //       $table.toggleRowExpansion(item, false);
      //     }
      //   });
      $table.toggleRowExpansion(row);
    },
    // 审核
    Examine(row) {
      this.alertdata = row;
      this.showAlert = !this.showAlert;
    },
    // 提交审核
    subState() {
      // console.log(this.shValue)
      if (this.shValue == "") {
        this.$message.warning("请选择审核状态");
      } else if (this.matchMsg.continuity == 1) {
        this.subLong();
      } else if (this.shValue == 1) {
        let obj = {
          matchId: this.alertdata.matchId,
          groupId: this.alertdata.groupId,
          openId: this.alertdata.openId,
          ifFinish: 1,
          notFinishDesc: "",
        };
        this.alertdata.ifFinish = 2;
        this.alertdata.notFinishDesc = obj.notFinishDesc;
        this.$axios
          .put("/run/person/match/putIfFinish", JSON.stringify(obj), {
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            let newObj = {
              matchId: this.alertdata.matchId,
              groupId: this.alertdata.groupId,
              openId: this.alertdata.openId,
            };
            newObj.memberName = this.alertdata.memberName;
            newObj.sex = this.alertdata.sax;
            newObj.finishSize = this.distance;
            let card = this.alertdata.CardMsg;
            if (this.alertdata.endFile) {
              newObj.finishTime = this.alertdata.endFile.suppUseTime;
            } else {
              //判断打卡点数量 和赛项打卡点数量是否相等
              newObj.finishTime = card[card.length - 1].cpUseTime;
            }
            let idoo = {
              matchId: this.alertdata.matchId,
              groupId: this.alertdata.groupId,
              openId: this.alertdata.openId,
            };
            this.$axios
              .get("/run/person/match/getFinishData", { params: idoo })
              .then((gfd) => {
                if (gfd.data.data == null) {
                  // // 添加
                  this.$axios
                    .post("/run/person/match/addFinishData", newObj)
                    .then((res) => {
                      this.textarea = "";
                      this.shValue = "";
                      this.showAlert = !this.showAlert;
                      this.alertdata.state = "已通过";
                      this.tableData = this.tableData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.allData = this.allData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.getsd(this.sind);
                      this.$message.success("提交成功");
                      this.$forceUpdate();
                    });
                } else {
                  newObj.id = gfd.data.data.id;
                  // // 修改
                  this.$axios
                    .put(
                      "/run/person/match/putFinishData",
                      JSON.stringify(newObj),
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    )
                    .then((res) => {
                      this.textarea = "";
                      this.shValue = "";
                      this.showAlert = !this.showAlert;
                      this.alertdata.state = "已通过";
                      this.tableData = this.tableData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.allData = this.allData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.getsd(this.sind);
                      this.$message.success("提交成功");
                      this.$forceUpdate();
                    });
                }
              });
          });
      } else if (this.shValue == 2) {
        if (this.textarea == "") {
          this.$message.warning("请填写理由");
        } else {
          let obj = {
            // matchId groupId  openId  ifFinish
            matchId: this.alertdata.matchId,
            groupId: this.alertdata.groupId,
            openId: this.alertdata.openId,
            ifFinish: 2,
            notFinishDesc: this.textarea,
          };
          this.alertdata.ifFinish = 2;
          this.alertdata.notFinishDesc = obj.notFinishDesc;
          this.$axios
            .put("/run/person/match/putIfFinish", JSON.stringify(obj), {
              headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
              let idoo = {
                matchId: this.alertdata.matchId,
                groupId: this.alertdata.groupId,
                openId: this.alertdata.openId,
              };
              this.$axios
                .get("/run/person/match/getFinishData", { params: idoo })
                .then((gfd) => {
                  if (gfd.data.data != null) {
                    this.$axios
                      .get(
                        "/run/person/match/delFinishData?id=" + gfd.data.data.id
                      )
                      .then((res) => {
                        this.textarea = "";
                        this.shValue = "";
                        this.alertdata.state = "未通过";
                        this.showAlert = !this.showAlert;
                        this.tableData = this.tableData.map((v) =>
                          v.id == this.alertdata.id ? this.alertdata : v
                        );
                        this.allData = this.allData.map((v) =>
                          v.id == this.alertdata.id ? this.alertdata : v
                        );
                        this.getsd(this.sind);
                        this.$message.success("提交成功");
                        this.$forceUpdate();
                      });
                  } else {
                    this.textarea = "";
                    this.shValue = "";
                    this.showAlert = !this.showAlert;
                    this.alertdata.state = "未通过";
                    this.tableData = this.tableData.map((v) =>
                      v.id == this.alertdata.id ? this.alertdata : v
                    );
                    this.allData = this.allData.map((v) =>
                      v.id == this.alertdata.id ? this.alertdata : v
                    );
                    this.getsd(this.sind);
                    this.$message.success("提交成功");
                    this.$forceUpdate();
                  }
                });
            });
        }
      }
    },
    // 活动提交审核
    activeSub() {
      if (this.shValue == "") {
        this.$message.warning("请选择审核状态");
      } else if (this.shValue == 1) {
        this.alertdata.state = 1;
        this.alertdata.notFinishDesc = "";
        this.$axios
          .post("/run/person/shifeng/putToActivity", this.alertdata)
          .then((res) => {
            let obj = {
              // matchId   groupId  openId  sex
              matchId: this.alertdata.matchId,
              groupId: this.alertdata.groupId,
              openId: this.alertdata.openId,
              sex: this.alertdata.sex,
              memberName: this.alertdata.memberName,
            };
            this.$axios
              .post("/run/person/shifeng/finishData/add", obj)
              .then((res) => {
                this.alertdata.state = "已通过";
                this.showAlert = !this.showAlert;
                this.tableData = this.tableData.map((v) =>
                  v.id == this.alertdata.id ? this.alertdata : v
                );
                this.allData = this.allData.map((v) =>
                  v.id == this.alertdata.id ? this.alertdata : v
                );
                this.shValue = "";
                this.getsd(this.sind);
              });
          });
      } else if (this.shValue == 2) {
        let initial = this.alertdata.state;
        this.alertdata.state = 2;
        this.alertdata.notFinishDesc = this.textarea;
        this.$axios
          .post("/run/person/shifeng/putToActivity", this.alertdata)
          .then((res) => {
            if (initial == "已通过") {
              let obj = {
                // matchId   groupId  openId  sex
                matchId: this.alertdata.matchId,
                groupId: this.alertdata.groupId,
                openId: this.alertdata.openId,
                sex: this.alertdata.sex,
                memberName: this.alertdata.memberName,
              };
              this.$axios
                .post("/run/person/shifeng/finishData/del", obj)
                .then((res) => {
                  this.alertdata.state = "未通过";
                  this.showAlert = !this.showAlert;
                  this.tableData = this.tableData.map((v) =>
                    v.id == this.alertdata.id ? this.alertdata : v
                  );
                  this.allData = this.allData.map((v) =>
                    v.id == this.alertdata.id ? this.alertdata : v
                  );
                  this.shValue = "";
                  this.getsd(this.sind);
                });
            } else {
              this.alertdata.state = "未通过";
              this.showAlert = !this.showAlert;
              this.tableData = this.tableData.map((v) =>
                v.id == this.alertdata.id ? this.alertdata : v
              );
              this.allData = this.allData.map((v) =>
                v.id == this.alertdata.id ? this.alertdata : v
              );
              this.shValue = "";
              this.getsd(this.sind);
            }
          });
      }
    },
    subLong() {
      let obj = {
        matchId: this.alertdata.matchId,
        groupId: this.alertdata.groupId,
        // entryNumber: this.alertdata.entryNumber,
        // status: this.shValue,
        openId: this.alertdata.openId,
        ifFinish: 1,
        notFinishDesc: "",
      };
      if (this.shValue == 1) {
        this.$axios
          .put("/run/person/match/putIfFinish", JSON.stringify(obj), {
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            let newObj = {
              matchId: this.alertdata.matchId,
              groupId: this.alertdata.groupId,
              openId: this.alertdata.openId,
            };
            newObj.memberName = this.alertdata.memberName;
            newObj.sex = this.alertdata.sax;
            newObj.finishSize = this.alertdata.distance;
            newObj.finishTime = this.alertdata.useTime;
            let idoo = {
              matchId: this.alertdata.matchId,
              groupId: this.alertdata.groupId,
              openId: this.alertdata.openId,
            };
            this.$axios
              .get("/run/person/match/getFinishData", { params: idoo })
              .then((gfd) => {
                if (gfd.data.data == null) {
                  // // 添加
                  this.$axios
                    .post("/run/person/match/addFinishData", newObj)
                    .then((res) => {
                      this.textarea = "";
                      this.shValue = "";
                      this.showAlert = !this.showAlert;
                      this.alertdata.state = "已通过";
                      this.tableData = this.tableData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.allData = this.allData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.getsd(this.sind);
                      this.$message.success("提交成功");
                      this.$forceUpdate();
                    });
                } else {
                  newObj.id = gfd.data.data.id;
                  // // 修改
                  this.$axios
                    .put(
                      "/run/person/match/putFinishData",
                      JSON.stringify(newObj),
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    )
                    .then((res) => {
                      this.textarea = "";
                      this.shValue = "";
                      this.showAlert = !this.showAlert;
                      this.alertdata.state = "已通过";
                      this.tableData = this.tableData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.allData = this.allData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.getsd(this.sind);
                      this.$message.success("提交成功");
                      this.$forceUpdate();
                    });
                }
              });
          });
      } else {
        if (this.textarea == "") {
          this.$message.warning("请填写理由");
        } else {
          obj.ifFinish = this.shValue;
          obj.notFinishDesc = this.textarea;
          // /run/person/match/putIfFinish
          // /match/updatePersonMatchDataStatus
          // this.$axios
          //   .get("/run/person/match/putIfFinish", { params: obj })
          this.$axios
            .put("/run/person/match/putIfFinish", JSON.stringify(obj), {
              headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
              let idoo = {
                matchId: this.alertdata.matchId,
                groupId: this.alertdata.groupId,
                openId: this.alertdata.openId,
              };
              this.$axios
                .get("/run/person/match/getFinishData", { params: idoo })
                .then((gfd) => {
                  if (gfd.data.data != null) {
                    this.$axios
                      .get(
                        "/run/person/match/delFinishData?id=" + gfd.data.data.id
                      )
                      .then((res) => {
                        this.textarea = "";
                        this.shValue = "";
                        this.alertdata.state = "未通过";
                        this.showAlert = !this.showAlert;
                        this.tableData = this.tableData.map((v) =>
                          v.id == this.alertdata.id ? this.alertdata : v
                        );
                        this.allData = this.allData.map((v) =>
                          v.id == this.alertdata.id ? this.alertdata : v
                        );
                        this.getsd(this.sind);
                        this.$message.success("提交成功");
                        this.$forceUpdate();
                      });
                  } else {
                    this.textarea = "";
                    this.shValue = "";
                    this.showAlert = !this.showAlert;
                    this.alertdata.state = "未通过";
                    this.tableData = this.tableData.map((v) =>
                      v.id == this.alertdata.id ? this.alertdata : v
                    );
                    this.allData = this.allData.map((v) =>
                      v.id == this.alertdata.id ? this.alertdata : v
                    );
                    this.getsd(this.sind);
                    this.$message.success("提交成功");
                    this.$forceUpdate();
                  }
                });
            });
        }
      }
    },
    // 秒转时分秒
    formatSeconds(time) {
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
    },
    //将时间戳转换成正常时间格式
    timeConvert(timestamp) {
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
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },

    toggleContinue(i) {
      if (i == 1 && this.continuityGood) {
        return false;
      } else if (i == 0 && !this.continuityGood) {
        return false;
      }
      this.continuityGood = !this.continuityGood;
      this.$forceUpdate();
      if (this.continuityGood) {
        this.continuityDetailS = continuityDetail.filter((v) => {
          return v.state == "t";
        });
      } else {
        this.continuityDetailS = continuityDetail.filter((v) => {
          return v.state != "t";
        });
      }
      this.$forceUpdate();
    },

    // 所有通过审核
    /*allShen(arrlist,aa,rowt){
      console.log(aa)
      this.alertdata=rowt
      let obj = {
        matchId: this.alertdata.matchId,
        groupId: this.alertdata.groupId,
        // entryNumber: this.alertdata.entryNumber,
        // status: this.shValue,
        openId: this.alertdata.openId,
        ifFinish: 1,
        notFinishDesc: "",
      };
        this.$axios
          .put("/run/person/match/putIfFinish", JSON.stringify(obj), {
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            let newObj = {
              matchId: this.alertdata.matchId,
              groupId: this.alertdata.groupId,
              openId: this.alertdata.openId,
            };
            newObj.memberName = this.alertdata.memberName;
            newObj.sex = this.alertdata.sax;
            newObj.finishSize = this.alertdata.distance;
            newObj.finishTime = this.alertdata.useTime;
            let idoo = {
              matchId: this.alertdata.matchId,
              groupId: this.alertdata.groupId,
              openId: this.alertdata.openId,
            };
            this.$axios
              .get("/run/person/match/getFinishData", { params: idoo })
              .then((gfd) => {
                if (gfd.data.data == null) {
                  // // 添加
                  this.$axios
                    .post("/run/person/match/addFinishData", newObj)
                    .then((res) => {
                      this.textarea = "";
                      this.shValue = "";
                      this.showAlert = !this.showAlert;
                      this.alertdata.state = "已通过";
                      this.tableData = this.tableData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.allData = this.allData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      // this.getsd(this.sind);
                      this.$message.success("提交成功");
                      if(++aa<arrlist.length){
                        this.allShen(arrlist,aa,arrlist[aa])
                      }
                      this.$forceUpdate();
                    });
                } else {
                  newObj.id = gfd.data.data.id;
                  // // 修改
                  this.$axios
                    .put(
                      "/run/person/match/putFinishData",
                      JSON.stringify(newObj),
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    )
                    .then((res) => {
                      this.textarea = "";
                      this.shValue = "";
                      this.showAlert = !this.showAlert;
                      this.alertdata.state = "已通过";
                      this.tableData = this.tableData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      this.allData = this.allData.map((v) =>
                        v.id == this.alertdata.id ? this.alertdata : v
                      );
                      // this.getsd(this.sind);
                      this.$message.success("提交成功");
                      this.$forceUpdate();
                      if(++aa<arrlist.length){
                        this.allShen(arrlist,aa,arrlist[aa])
                      }
                    });
                }
              });
          });
    }
    */
  },
  mounted() {
    if (this.$newActive) {
      this.statesList = [
        { val: "待审核", ind: 1 },
        { val: "已通过", ind: 2 },
        { val: "未通过", ind: 3 },
      ];
    } else {
      this.statesList = [
        { val: "全部", ind: 0 },
        { val: "待审核", ind: 1 },
        { val: "已通过", ind: 2 },
        { val: "未通过", ind: 3 },
      ];
    }
    this.getMatchMsg();
  },
};
</script>


<style lang="scss" scoped>
.UpExa {
  overflow: hidden;
  //   选择条件
  .toggleWrap {
    @include padShow();
    .taggBox {
      width: calc(100% - 22px);
      padding: 10px;
      border: 1px solid #eeeeee;
      .tBox {
        overflow: hidden;
        line-height: 30px;
        &.tb1 {
          margin-bottom: 10px;
        }
        b {
          color: #3383ff;
          float: left;
        }
        span {
          float: left;
          margin-left: 15px;
          cursor: pointer;
          padding: 0 10px;
          color: #919191;
          &.act {
            color: #fff;
            background-color: #3383ff;
            border-radius: 20px;
          }
        }
        .dIpt {
          margin-left: 15px;
        }
      }
    }
    .impBtn {
      overflow: hidden;
      .impPer {
        float: left;
        padding: 5px 15px;
        background-color: #3383ff;
        color: #fff;
        cursor: pointer;
        border-radius: 8px;
        position: relative;
      }
    }
  }

  .tabWrap {
    margin: 20px auto;
    @include padShow();
  }
  .pageCss {
    overflow: hidden;
    margin-top: 20px;
    .v {
      float: left;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
.alertBox {
  @include alertBox();
  .centerWrap {
    width: 400px;
    background-color: #fff;
    @include hs_center();
    line-height: 40px;
  }
  .aTit {
    padding: 5px 20px;
    background-color: #f2f2f2;
    color: #000;
    > i {
      float: right;
      font-size: 25px;
      line-height: 40px;
      margin: 5px;
      cursor: pointer;
    }
  }
  .aCon {
    padding: 8px 20px;
    border-bottom: 1px solid #ccc;
    .tl {
      margin-top: 10px;
    }
  }
  .aBtn {
    margin: 8px;
    float: right;
  }
}
.cimg {
  width: 80px;
  height: 80px;
}
.df {
  overflow: hidden;
}
.f {
  float: left;
}
.jtimg {
  width: 80px;
  height: 80px;
  float: left;
  margin-left: 10px;
  margin-bottom: 10px;
}
.iptBox {
  overflow: hidden;
  margin-bottom: 20px;
}
.seaIpt {
  width: 250px;
  margin-right: 20px;
}
.conImgWrap {
  width: 740px;
  @include hs_center();
  .arrowCon {
    display: none;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 50px;
    color: #3383ff;
    cursor: pointer;
  }
  &:hover .arrowCon {
    display: block;
  }
}
.cib {
  width: 600px;
  max-height: 600px;
  background-color: #fff;
  overflow: auto;
  @include hs_center();
}
.arrow {
  width: 70px;
  height: 50px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.leftArrow {
  left: 0;
}
.rightArrow {
  right: 0;
}
.conImgWrap img {
  width: 100%;
  // height: 100%;
}
.btnjh {
  >>> .el-button + .el-button {
    margin-left: 0;
  }
}
.portBtn {
  float: right;
}
.activeImg {
  width: 100%;
  max-height: 70px;
  cursor: pointer;
}
.HexpandB {
  width: 100%;
  >>> .el-table__expanded-cell[class*="cell"] {
    padding: 20px;
  }
}
.tcB {
  width: 100%;
  // text-align: center;
}

.cGD {
  cursor: pointer;
}
.continuityGood {
  color: #20a0ff;
}
</style>

