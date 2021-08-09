<template>
  <!-- 报名审核 -->
  <div class="UpExa">
    <!-- 选择条件 -->
    <!-- <div class="toggleWrap">
      <div class="taggBox">
        <div class="tBox tb1">
          <b>赛项名称</b>
          <span
            v-for="(v,i) in matchMsg.matchInfo"
            :key="i"
            :class="{'act':v.id==groupId}"
            @click="toggle(v.id)"
          >{{v.name}}</span>
        </div>
        <div class="impBtn" v-if="matchMsg.type!='A'">
          <div class="impPer" @click="showAlertTips=!showAlertTips">
            <span>导入选手名单</span>
          </div>
          <div class="impPer" @click="portExe">
            <span>导出选手名单</span>
          </div>
        </div>
      </div>
    </div>-->
    <!-- 选择赛事 赛项 等条件 -->
    <el-form :inline="true" class="toggleWrap">
      <el-form-item label="赛事">
        <el-select style="width:300px" filterable v-model="matchId" placeholder="请选择" @change="getMatchMsg()">
          <el-option v-for="item in mArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赛项">
        <el-select v-model="groupId" placeholder="请选择" @change="toggle()">
          <el-option v-for="item in gArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="portExe">导出选手名单</el-button>
      </el-form-item>
    </el-form>
    <!-- 人员表格 -->
    <div class="tabWrap" v-if="matchMsg.type!='A'">
      <el-input class="seaIpt" v-model="seachVal" placeholder="请输入姓名或参赛号或手机号查询"></el-input>
      <el-button type="primary" @click="subsea">搜索</el-button>
      <!-- <el-button type="primary" @click="addPer">添加</el-button> -->
      <el-table
        ref="table"
        border
        header-row-class-name="tableHead"
        :data="tableData.slice((currentPagerm-1)*pagesize,currentPagerm*pagesize)"
        class="tp"
        v-loading="vloading"
      >
        <el-table-column label="报名时间" prop="addTime" width="100"></el-table-column>
        <el-table-column label="昵称" prop="nikeName" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.name" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="参赛号" prop="entryNumber" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.entryNumber" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.entryNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.gender" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.gender}}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信号" prop="wxNumber" align="center">
          <template slot-scope="{row}">
            <!-- <el-input v-if="row.es" v-model="row.gender" size="mini" @change="editCon(row)"></el-input> -->
            <span>{{row.wxNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="证件类型" prop="idType" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.idType" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.idType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="证件号" prop="idNumber" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.idNumber" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.idNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.phone" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="组别" prop="group" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.group" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.group}}</span>
          </template>
        </el-table-column>
        <el-table-column label="团队" prop="team" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.team" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.team}}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" prop="age" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.age" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.age}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="region" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.region" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.region}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="衣服颜色" prop="clothingColor" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.clothingColor" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.clothingColor}}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="星座" prop="zodiac" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.zodiac" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.zodiac}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否为会员" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.ifMember" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.ifMember}}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员手机号" align="center">
          <template slot-scope="{row}">
            <el-input v-if="row.es" v-model="row.memberPhone" size="mini" @change="editCon(row)"></el-input>
            <span v-else>{{row.memberPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row,$index}" class="dis">
            <el-button v-if="!row.ss" @click="editIndex(row)">编辑</el-button>
            <el-button v-if="!row.ss" type="danger" @click="delPer(row,$index)">删除</el-button>
            <el-button v-if="row.ss" @click="adsaPer(row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageCss">
        <div class="v" v-if="tableData.length>10?true:false">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPagerm"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="tableData.length"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="tabWrap" v-if="matchMsg.type=='A'">
      <el-table
        :data="actSData.slice((currentPagerm-1)*pagesize,currentPagerm*pagesize)"
        style="width: 100%"
      >
        <el-table-column label="报名时间" width="100">
          <template slot-scope="{row}">
            <span>{{row.creatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="{row}">
            <span>{{row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="{row}">
            <span>{{row.phone}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="所在城市" prop="city">
          <template slot-scope="{row}">
            <span>{{row.city}}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="驾照类型" prop="licenseType">
          <template slot-scope="{row}">
            <span>{{row.licenseType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="驾龄" prop="drivingYears">
          <template slot-scope="{row}">
            <span>{{row.drivingYears}}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆品牌" prop="brand">
          <template slot-scope="{row}">
            <span>{{row.brand}}</span>
          </template>
        </el-table-column>
        <el-table-column label="到店城市" prop="toCity">
          <template slot-scope="{row}">
            <span>{{row.toCity}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageCss">
        <div class="v" v-if="actSData.length>10?true:false">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPagerm"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="actSData.length"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 导入的人员表格 -->
    <div class="alertBox" v-show="showAlert" v-loading="loading">
      <div class="centerWrap">
        <el-table
          ref="table"
          border
          header-row-class-name="tableHead"
          :data="outputs.slice((alertCur-1)*alertpage,alertCur*alertpage)"
          style="width: 100%;max-height: 500px;overflow: auto;"
        >
          <el-table-column label="姓名" prop="name" align="center"></el-table-column>
          <el-table-column label="参赛号" prop="entryNumber" align="center"></el-table-column>
          <el-table-column label="性别" prop="gender" align="center"></el-table-column>
          <el-table-column label="证件类型" prop="idType" align="center"></el-table-column>
          <el-table-column label="证件号" prop="idNumber" align="center"></el-table-column>
          <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
          <el-table-column label="组别" prop="group" align="center"></el-table-column>
          <el-table-column label="团队" prop="team" align="center"></el-table-column>
          <el-table-column label="年龄" prop="age" align="center"></el-table-column>
          <el-table-column label="地区" prop="region" align="center"></el-table-column>
          <el-table-column label="星座" prop="zodiac" align="center"></el-table-column>
        </el-table>
        <div class="pageCss">
          <div class="v" v-if="outputs.length>10?true:false">
            <el-pagination
              @size-change="alertSizeChange"
              @current-change="alertCurrentChange"
              :current-page.sync="alertCur"
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="outputs.length"
            ></el-pagination>
          </div>
        </div>
        <el-button type="primary" class="btnSC" @click="putTab">
          上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <!-- 导入提示 -->
    <div class="alertBox" v-show="showAlertTips">
      <div class="centerWrap tipBox">
        <div class="pt">
          <span>选手名单导入说明：</span>
          <i class="el-icon-close cl" @click="showAlertTips=!showAlertTips"></i>
        </div>
        <div class="pb">
          <p>1、选手姓名、性别、参赛号、手机号为必填项；</p>
          <p>2、所填写内容均为文本格式，否则数字过长会带来因科学计数法引起的末几位数字缺失；</p>
          <p>3、每个组别选手名单应分别以不同的文件导入，不能存于一个Excel中的不同sheet中。</p>
          <p>
            <a href="../../../static/file/选手名单导入模板.xlsx" download="选手名单导入模板.xlsx">模板下载</a>
          </p>
        </div>
        <el-upload
          class="upload-demo"
          :auto-upload="false"
          drag
          ref="upload"
          multiple
          action
          accept=".xls, .xlsx"
          :on-change="handleChange"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import table2excel from "js-table2excel";
export default {
  data() {
    return {
      actSData: [],
      matchId: "",
      groupId: "",
      matchMsg: {},
      tableData: [],
      allData: [],
      currentPagerm: 1,
      pagesize: 10,
      outputs: [],
      putPuts: [],
      alertCur: 1,
      alertpage: 10,
      showAlert: false,
      loading: false,
      showAlertTips: false,
      Adding: false,
      seachVal: "",
      mArr: [],
      gArr: [],
      vloading:false
    };
  },
  methods: {
    // 搜索
    subsea() {
      this.currentPagerm = 1;
      if (this.seachVal != "") {
        let resArr = this.allData.filter(
          (v) =>
            v.name.indexOf(this.seachVal) != -1 ||
            v.entryNumber.indexOf(this.seachVal) != -1 ||
            v.phone.indexOf(this.seachVal) != -1
        );
        this.tableData = JSON.parse(JSON.stringify(resArr));
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.allData));
      }
    },
    //   切换赛项
    toggle(i) {
      // this.groupId = i;
      this.tableData = [];
      this.allData = [];
      this.getTab();
    },
    //   获取赛事
    getMatchMsg() {
      // this.matchId = this.$route.query.matchId;
      // this.groupId = this.$route.query.id;
      let obj = { matchId: this.matchId };
      this.$axios.get("/match/getMatchById", { params: obj }).then((res) => {
        let rr = res.data.data;
        this.matchMsg = rr
        // this.matchId = this.$route.query.matchId;
        // this.groupId = this.$route.query.id;
        this.gArr=rr.matchInfo
        this.groupId=rr.matchInfo[0].id
        if (rr.type == "A") this.getATab();
        else this.getTab();
      });
    },
    // 获取活动招募数据
    getATab() {
      // this.actSData = [];
      this.$axios
        .get("/activity/getActivityApply?matchId=" + this.matchId)
        .then((res) => {
          let rr = res.data.data;
          rr.forEach((v) => {
            v.drivingYears = !v.drivingYears ? "暂无" : v.drivingYears;
            v.brand = v.brand ? v.brand : "暂无";
            v.toCity = v.toCity ? v.toCity : "暂无";
            v.licenseType = v.licenseType ? v.licenseType : "暂无";
            v.city = v.city ? v.city : "暂无";
          });
          // console.log(rr);
          this.actSData = rr;
          this.$forceUpdate();
          // console.log(this.actSData);
        });
    },
    // 获取表格数据
    getTab() {
      let obj = {
        matchId: this.matchId,
        groupId: this.groupId,
      };
          this.vloading=true
      this.$axios
        .get("/match/getMemberByMatchId", { params: obj })
        .then((res) => {
          this.tableData = res.data.data ? res.data.data : [];
          this.tableData.forEach((vv) => {
            for (let k in vv) {
              if (vv[k] == "" || !vv[k]) {
                vv[k] = "暂无";
              }
            }
            vv.es = false;
          });
          this.allData = JSON.parse(JSON.stringify(this.tableData));
          this.vloading=false
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      // console.log(this.pagesize);
    },
    handleCurrentChange(val) {
      this.currentPagerm = val;
      // console.log(this.currentPagerm);
    },
    // 弹窗页数切换
    alertSizeChange(val) {
      this.alertpage = val;
    },
    alertCurrentChange(val) {
      this.alertCur = val;
    },
    handleChange(file, fileList) {
      this.updateName(file.raw);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    //导入选手名单
    updateName(e) {
      let that = this;
      const files = e;

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          }); // 读取数据
          const wsname = workbook.SheetNames[0]; // 取第一张表
          // console.log(wsname);
          let conTab = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容
          // console.log(conTab);
          let dx = {};
          conTab = conTab.reduce(function (item, next) {
            dx[next["手机号"]]
              ? ""
              : (dx[next["手机号"]] = true && item.push(next));
            return item;
          }, []);
          this.outputs = [];
          conTab.forEach((vv) => {
            let obj = {
              //   姓名	参赛号	性别	证件类型	证件号	手机号	组别	团队	年龄	地区	星座
              entryNumber: vv["参赛号"] ? vv["参赛号"] : "",
              name: vv["姓名"] ? vv["姓名"] : "",
              gender: vv["性别"] ? vv["性别"] : "",
              idType: vv["证件类型"] ? vv["证件类型"] : "",
              idNumber: vv["证件号"] ? vv["证件号"] : "",
              phone: vv["手机号"] ? vv["手机号"] : "",
              group: vv["组别"] ? vv["组别"] : "",
              team: vv["团队"] ? vv["团队"] : "",
              age: vv["年龄"] ? vv["年龄"] : "",
              region: vv["地区"] ? vv["地区"] : "",
              zodiac: vv["星座"] ? vv["星座"] : "",
              groupId: this.groupId,
              matchId: this.matchId,
            };
            this.outputs.push(obj);

            let newObj = {
              //   姓名	参赛号	性别	证件类型	证件号	手机号	组别	团队	年龄	地区	星座
              entryNumber: vv["参赛号"] ? vv["参赛号"] : "",
              name: vv["姓名"] ? vv["姓名"] : "",
              gender: vv["性别"] ? vv["性别"] : "",
              idType: vv["证件类型"] ? vv["证件类型"] : "",
              idNumber: vv["证件号"] ? vv["证件号"] : "",
              phone: vv["手机号"] ? vv["手机号"] : "",
              group: vv["组别"] ? vv["组别"] : "",
              team: vv["团队"] ? vv["团队"] : "",
              age: vv["年龄"] ? vv["年龄"] : 0,
              region: vv["地区"] ? vv["地区"] : "",
              zodiac: vv["星座"] ? vv["星座"] : "",
              groupId: this.groupId,
              matchId: this.matchId,
            };
            this.putPuts.push(newObj);
          });
          // console.log(this.outputs);
          if (this.outputs.length > 0) {
            this.showAlert = true;
            this.showAlertTips = false;
          } else {
            this.$message.warning("请不要上传空文件哟");
          }
          // this.$refs.upload.value = "";
          this.$refs.upload.clearFiles();
        } catch (e) {
          // console.log(e);
          return false;
        }
      };
      // fileReader.readAsBinaryString(files[0]);
      fileReader.readAsBinaryString(files);
    },
    // 上传选手名单
    putTab() {
      this.loading = true;
      for (var a = 0; a < this.putPuts.length; a++) {
        for (var b = 0; b < this.allData.length; b++) {
          // ||this.putPuts[a].phone==this.putPuts[b].phone
          if (this.putPuts[a].entryNumber == this.allData[b].entryNumber) {
            this.putPuts.splice(a, 1);
          }
        }
      }
      this.$axios.post("/match/addMembers", this.putPuts).then((res) => {
        this.showAlert = false;
        this.$message.success("上传成功");
        this.loading = false;
        this.getTab();
      });
    },
    // 修改线上数据
    editIndex(v) {
      v.es = true;
      this.$forceUpdate();
    },
    // 修改内容上传
    editCon(v) {
      // console.log(v);
      for (var k in v) {
        if (v[k] == "暂无") {
          if (k == "age") {
            v[k] = 0;
          } else {
            v[k] = "";
          }
        }
      }
      if (!v.ss) {
        // /match/putMember
        v.es = false;
        this.$forceUpdate();
        let pp = v;
        delete pp.es;
        // console.log(pp)
        this.$axios.put("/match/putMember", pp).then((res) => {
          for (var k in pp) {
            if (!pp[k]) {
              if (k == "age") {
                pp[k] = "暂无";
              } else {
                pp[k] = "暂无";
              }
            }
          }
          this.allData.forEach((cc) => {
            if (cc.id == pp.id) {
              cc = pp;
            }
          });
        });
      }
    },
    // 删除线上人
    delPer(v, i) {
      let o = { id: v.id };
      let val = this.tableData[10 * (this.currentPagerm - 1) + i];
      this.$axios.get("/match/delMemberById", { params: o }).then((res) => {
        let obj = {
          matchId: val.matchId,
          groupId: val.groupId,
          entryNumber: val.entryNumber,
        };
        this.$axios
          .get("/run/person/match/delPersonToMatch", { params: obj })
          .then((res) => {
            this.tableData.splice(10 * (this.currentPagerm - 1) + i, 1);
            this.allData = this.allData.filter((cc) => cc.id != v.id);
          });
      });
    },
    // 添加线上数据
    addPer() {
      if (!this.Adding) {
        this.Adding = true;
        let obj = {
          //   姓名	参赛号	性别	证件类型	证件号	手机号	组别	团队	年龄	地区	星座
          entryNumber: "",
          name: "",
          gender: "",
          idType: "",
          idNumber: "",
          phone: "",
          group: "",
          team: "",
          age: "",
          region: "",
          zodiac: "",
          groupId: this.groupId,
          matchId: this.matchId,
          ss: true,
          es: true,
        };
        this.tableData.push(obj);
        let pN = Math.ceil(this.tableData.length / 10);
        this.currentPagerm = pN;
        this.$forceUpdate();
        // console.log(pN);
      }
    },
    // 保存添加
    adsaPer(val) {
      let ap = val;
      let he = this.allData.filter((v) => v.entryNumber == ap.entryNumber);
      if (ap.name == "" || ap.entryNumber == "" || ap.phone == "") {
        this.$message.warning("请填写信息");
      } else if (he.length > 0) {
        this.$message.warning("该参赛号已添加");
      } else {
        val.es = false;
        delete val.ss;
        delete ap.es;
        this.$axios.post("/match/addMember", ap).then((res) => {
          ap.id = res.data.data;
          for (var k in ap) {
            if (ap[k] == "" || !ap[k]) {
              ap[k] = "暂无";
            }
          }
          this.Adding = false;
          this.allData.push(ap);
        });
      }
    },
    portExe() {
      let that = this;
      that.loading = true;
      let column = [
        {
          title: "姓名",
          key: "name",
          type: "text",
        },
        {
          title: "参赛号",
          key: "entryNumber",
          type: "text",
        },
        {
          title: "昵称",
          key: "nikeName",
          type: "text",
        },
        {
          title: "微信号",
          key: "wxNumber",
          type: "text",
        },
        {
          title: "性别",
          key: "gender",
          type: "text",
        },
        {
          title: "手机号",
          key: "phone",
          type: "text",
        },
        {
          title: "证件类型",
          key: "idType",
          type: "text",
        },
        {
          title: "证件号",
          key: "idNumber",
          type: "text",
        },
        {
          title: "地区",
          key: "region",
          type: "text",
        },
        // {
        //   title: "详细地址",
        //   key: "idNumber",
        //   type: "text",
        // },
        // {
        //   title: "衣服尺码",
        //   key: "",
        //   type: "text",
        // },
        // {
        //   title: "衣服颜色",
        //   key: "idNumber",
        //   type: "text",
        // },
      ];
      let filename = that.matchMsg.name;
      if (filename.indexOf(".") != Number(-1)) {
        filename = filename + ".xls";
      }
      table2excel(column, that.tableData, filename);
    },
    // 获取所有赛事
    getAllMatch() {
      let oid = window.sessionStorage.getItem("orgId");
      this.$axios.get("/match/getMatchByOrgId?orgId=" + oid).then((res) => {
        let rr = res.data.data;
        console.log(rr);
        this.mArr = rr;
        this.matchId = rr[0].id;
        this.getMatchMsg();
      });
    },
  },
  mounted() {
    this.getAllMatch();
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
        .opcat {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          left: 0;
          top: 0;
          cursor: pointer;
        }
      }
    }
  }
  //   人员表格
  .tabWrap {
    margin: 20px auto;
    @include padShow();
    >>> .el-table__expand-column {
      border-right: none;
      .cell {
        display: none;
      }
    }
    >>> .el-table .cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      button {
        display: block;
        margin: 0;
      }
    }
  }
  // 弹框
  .alertBox {
    @include alertBox();
    .centerWrap {
      padding: 15px;
      background-color: #fff;
      @include hs_center();
    }
  }
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
.btnSC {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
}
.tipBox {
  min-width: 400px;
  .pt {
    font-weight: 600;
    font-size: 18px;
    .cl {
      float: right;
      cursor: pointer;
    }
  }
  .pb {
    font-size: 14px;
    margin: 10px auto;
  }
}
.tp {
  width: 100%;
  margin-top: 20px;
}
.seaIpt {
  width: 200px;
}
</style>

