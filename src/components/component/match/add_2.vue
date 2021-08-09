<template>
  <div class="groupSet">
    <div class="groupTit">
      <span class="redStare">*</span>
      <span>赛项设置</span>
    </div>
    <div class="groupWrap">
      <div class="groupBox" v-for="(d,i) in groupList" :key="i">
        <ul class="groupLeft">
          <li>
            <div>
              <span class="redStare">*</span>
              <span>赛项名称</span>
            </div>
            <el-input class="leftWidth" placeholder="请输入内容" v-model="d.name" clearable></el-input>
            <span class="hasNull" v-show="nullWarning[i].name">不能为空</span>
          </li>
          <li>
            <div>
              <span class="redStare">*</span>
              <span>起跑时间</span>
            </div>
            <el-date-picker
              class="leftWidth"
              v-model="d.startDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            ></el-date-picker>
            <span class="hasNull" v-show="nullWarning[i].startDate">不能为空</span>
          </li>
          <li>
            <div>
              <span class="redStare">*</span>
              <span>关门时间</span>
            </div>
            <el-date-picker
              class="leftWidth"
              v-model="d.endDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            ></el-date-picker>
            <span class="hasNull" v-show="nullWarning[i].endDate">不能为空</span>
          </li>
          <li>
            <div>
              <span class="redStare" v-if="!$newActive&&Match.type!='Z'">*</span>
              <span>里程</span>
            </div>
            <el-input class="leftWidth" placeholder="请输入内容" v-model="d.wholeCourse" clearable></el-input>
            <span class="hasNull" v-show="nullWarning[i].wholeCourse">不能为空</span>
          </li>
          <li class="txtLeft">
            <div>
              <!-- <span class="redStare">*</span> -->
              <span>是否有固定轨迹</span>
            </div>
            <div class="leftWidth">
              <el-radio v-model="d.route" label="0">是</el-radio>
              <el-radio v-model="d.route" label="1">否</el-radio>
            </div>
          </li>
          <li class="txtLeft" v-if="d.route=='0'&&!$newActive">
            <div>
              <!-- <span class="redStare">*</span> -->
              <span>是否为定向赛</span>
            </div>
            <div class="leftWidth">
              <el-radio v-model="d.fixed" label="1">是</el-radio>
              <el-radio v-model="d.fixed" label="0">否</el-radio>
            </div>
          </li>
          <li>
            <div>
              <span v-if="$newActive" class="redStare">*</span>
              <span v-if="$newActive">顶峰海拔</span>
              <span v-else>爬升</span>
            </div>
            <el-input class="leftWidth" placeholder="请输入内容(米)" v-model="d.rise" clearable></el-input>
            <span class="hasNull" v-show="nullWarning[i].rise">不能为空</span>
          </li>
          <li v-if="!$newActive">
            <div>
              <span>电子号牌</span>
            </div>
            <el-button @click="showAlert=!showAlert;nowIndex=i">添加</el-button>
          </li>
        </ul>
        <div class="groupRight" v-if="d.route=='0'">
          <div class="map">
            <mapCon ref="touMap"></mapCon>
          </div>
          <div class="upload-demo">
            <div class="KMlBtn">
              上传轨迹文件
              <label :for="i">
                <input type="file" :id="i" @change="upKml($event,i)" ref="kmlIpt">
              </label>
            </div>
          </div>
        </div>
        <div class="groupBottom" v-if="Match.type!='Z'">
          <div class="botTit">
            <div>
              <span class="redStare">*</span>
              <span class="tittxt">赛项计时点</span>
            </div>
            <el-button @click="addGroupCard(i)" v-if="d.route=='0'">添加</el-button>
          </div>
          <el-table :data="d.info" border="" style="width: 100%">
            <el-table-column prop="name" label="cp点" align="center">
              <!-- <template slot-scope="{row,$index}">
                <span v-if="row.name=='起点'||row.name=='终点'">{{row.name}}</span>
                <el-input v-else placeholder="请输入选择" v-model="row.name" clearable></el-input>
              </template>-->
            </el-table-column>
            <el-table-column label="名称" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.cpName" placeholder="请选择" @visible-change="touchPutCard">
                  <el-option v-for="item in cpNameList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="距起点(KM)" align="center">
              <template slot-scope="{row}">
                <el-input placeholder="请输入内容" v-model="row.distance" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column label="爬升" align="center">
              <template slot-scope="{row}">
                <el-input placeholder="请输入内容" v-model="row.rise" clearable></el-input>
              </template>
            </el-table-column>
            <!-- 正式 关门时间 -->
            <el-table-column v-if="!$newActive" label="关门时间" align="center" width="250">
              <template slot-scope="{row}">
                <el-date-picker
                  v-model="row.endDate"
                  type="datetime"
                  alue-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </template>
            </el-table-column>
            <!-- 活动 经纬度 longitude latitude-->
            <el-table-column v-if="$newActive" label="经度" align="center">
              <template slot-scope="{row}">
                <el-input placeholder="请输入经度" v-model="row.longitude" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="$newActive" label="纬度" align="center">
              <template slot-scope="{row}">
                <el-input placeholder="请输入纬度" v-model="row.latitude" clearable></el-input>
              </template>
            </el-table-column>
            <!-- 活动完 -->
            <el-table-column label="打卡点图片" align="center" width="120">
              <template slot-scope="{row,$index}">
                <div class="choseImg" v-if="row.cpImg==''">
                  添加图片
                  <label class="chImgBtn">
                    <input type="file" class="chImgBtn" @change="upcpImg($event,i,$index)">
                  </label>
                </div>
                <div v-else class="cpPic">
                  <img :src="row.cpImg" alt="">
                  <span class="avatar-uploader-icon">
                    <i class="el-icon-delete" @click="row.cpImg=''"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!$newActive&&d.route=='0'&&d.fixed=='1'"
              label="打卡点简介"
              align="center"
            >
              <template slot-scope="{row,$index}">
                <!-- <el-input placeholder="请输入" v-model="row.cpInfo" clearable></el-input> -->
                <el-button type="primary" v-if="!row.cpInfo" @click="addCardJJ(i,$index)">添加</el-button>
                <el-button type="primary" v-else @click="addCardJJ(i,$index,row.cpInfo)">修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row,$index}">
                <!-- @click="handleDelete(scope.$index, scope.row)" -->
                <el-button
                  size="mini"
                  v-if="row.name!='起点'&&row.name!='终点'"
                  type="danger"
                  @click="delGroupCard(i,$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="delBox" v-if="i!=0">
          <el-button size="mini" type="danger" @click="delGroup(i)">删除本赛项</el-button>
        </div>
      </div>
      <el-button icon="el-icon-plus" @click="addGroup" v-if="!$newActive&&Match.type!='Z'">增加赛项</el-button>
    </div>
    <div class="alertBox" v-if="showAlert">
      <div class="alertCon">
        <addCavcer @cavcerId="getCavcerId"></addCavcer>
      </div>
    </div>
    <div class="alertBox" v-show="showCardJJ">
      <div class="rtxtCon">
        <RichTxt ref="getContent"></RichTxt>
        <el-button type="primary" @click="saveCJJ">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 地图
import mapCon from "./lineMap";
// 获取兄弟组件传值 ==》打卡点
import eventVue from "../../../assets/bus";
// 电子号牌
import addCavcer from "../../match/cavcer";
//富文本
import RichTxt from "../editor/editor.vue";
import { content } from "../editor/editor.vue";
export default {
  components: { mapCon, addCavcer, RichTxt },
  data() {
    return {
      Match: {},
      groupList: [
        {
          name: "", //赛项名称
          start: "", //起点
          end: "", //终点
          startDate: "", //起跑时间
          endDate: "", //关门时间
          wholeCourse: "", //里程
          rise: "", //爬升
          route: "0", //是否有固定轨迹
          fixed: "0", //是否为定向赛
          descend: "", //下降
          joinNum: "", //参赛人数
          maxAge: "", //最大年龄
          minAge: "", //最小年龄
          birthdayNum: "", //当天生日人数
          signUpNum: "", //报名人数
          joinRatio: "", //参赛系数
          signUpRatio: "", //报名系数
          kmlFile: "", //轨迹文件
          KMLName: "",
          certificateId: 0, // 完赛证书Id
          info: [
            {
              name: "起点",
              cpName: "",
              distance: "",
              longitude: "",
              latitude: "",
              endDate: "",
              rise: "",
              cpImg: "",
              descend: "",
              cpInfo: "",
            },
            {
              name: "终点",
              cpName: "",
              distance: "",
              longitude: "",
              latitude: "",
              endDate: "",
              rise: "",
              cpImg: "",
              descend: "",
              cpInfo: "",
            },
          ], //赛项打卡点
        },
      ],
      nullWarning: [
        {
          cp: 0, //赛项打卡点数量
          name: false, //赛项名称
          startDate: false, //起跑时间
          endDate: false, //关门时间
          wholeCourse: false, //里程
          rose: false, //顶峰海拔 活动中必填
        },
      ],
      BigCard: [], //组件传来的赛事打卡点
      cpNameList: [], //赛项打卡点名称
      showAlert: false, //显示弹框
      nowIndex: "", //当前赛项index
      showCardJJ: false,
    };
  },
  methods: {
    // 打开点简介显示
    addCardJJ(i, ii, v) {
      // console.log(i)
      this.cardJJ = [i, ii];
      this.showCardJJ = true;
      if (v) {
        this.$refs.getContent.content = v;
      } else {
        this.$refs.getContent.content = "";
      }
    },
    // 打开点简介确定
    saveCJJ() {
      this.showCardJJ = false;
      // console.log(this.cardJJ)
      // console.log(this.$refs.getContent.content)
      let vt = this.$refs.getContent.content;
      this.groupList[this.cardJJ[0]].info[this.cardJJ[1]].cpInfo = vt;
      this.$forceUpdate();
    },
    // 添加赛项
    addGroup() {
      let empt = {
        name: "", //赛项名称
        start: "", //起点
        end: "", //终点
        startDate: "", //起跑时间
        endDate: "", //关门时间
        wholeCourse: "", //里程
        route: "0", //是否有固定轨迹
        fixed: "0", //是否为定向赛
        rise: "", //爬升
        descend: "", //下降
        joinNum: "", //参赛人数
        maxAge: "", //最大年龄
        minAge: "", //最小年龄
        birthdayNum: "", //当天生日人数
        signUpNum: "", //报名人数
        joinRatio: "", //参赛系数
        signUpRatio: "", //报名系数
        kmlFile: "", //轨迹文件
        KMLName: "",
        certificateId: 0, // 电子号牌Id
        info: [
          {
            name: "起点",
            cpName: "",
            distance: "",
            longitude: "",
            latitude: "",
            endDate: "",
            rise: "",
            cpImg: "",
            descend: "",
          },
          {
            name: "终点",
            cpName: "",
            distance: "",
            longitude: "",
            latitude: "",
            endDate: "",
            rise: "",
            cpImg: "",
            descend: "",
          },
        ], //赛项打卡点
      };
      this.groupList.push(empt);
      this.nullWarning.push({
        cp: 0, //赛项打卡点数量
        name: false, //赛项名称
        startDate: false, //起跑时间
        endDate: false, //关门时间
        wholeCourse: false, //里程
      });
    },
    // 删除赛项
    delGroup(i) {
      this.groupList.splice(i, 1);
      this.nullWarning.splice(i, 1);
    },
    // 上传cp点图片
    upcpImg(e, i, ind) {
      // console.log(e, i, ind);
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append("img", file); //通过append向form对象添加数据
      // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      this.$axios
        .post("/match/uploadImg", param, config)
        .then((res) => {
          console.log(res.data);
          this.groupList[i].info[ind].cpImg = res.data.data.filePath;
          this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 上传KML轨迹
    upKml(e, i) {
      // console.log(e, i);
      let file = e.target.files[0];
      this.groupList[i].KMLName = file.name;
      let param = new FormData(); //创建form对象
      param.append("file", file); //通过append向form对象添加数据
      // console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      this.$axios
        .post("/match/uploadKml", param, config)
        .then((res) => {
          // console.log(res.data);
          this.groupList[i].kmlFile = res.data.data.fileName;
          this.$refs.touMap[i].cavLine(res.data.data.kml);
          this.$refs.kmlIpt[i].value = "";
        })
        .catch((err) => {
          console.log(err);
          this.$refs.kmlIpt[i].value = "";
          this.$refs.touMap[i].cavLine("");
          this.$message.error("上传失败");
        });
    },
    // 删除KML轨迹
    delKML(i) {
      this.$confirm(`确定移除 ${this.groupList[i].KMLName}？`)
        .then(() => {
          console.log(11);
          this.groupList[i].KMLName = "";
          this.groupList[i].kmlFile = "";
          this.$refs.touMap[i].cavLine("");
        })
        .catch(() => {
          console.log(22);
        });
    },
    // 添加赛项打卡点
    addGroupCard(i) {
      // i==>第几个赛项
      this.touchPutCard();
      // console.log(this.BigCard)
      if (this.groupList[i].info.length < this.BigCard.length) {
        this.nullWarning[i].cp++;
        this.groupList[i].info.splice(this.groupList[i].info.length - 1, 0, {
          name: "CP" + this.nullWarning[i].cp,
          cpName: "",
          distance: "",
          longitude: "",
          latitude: "",
          endDate: "",
          rise: "",
          cpImg: "",
          descend: "",
          cpInfo: "",
        });
      } else {
        this.$message.warning("赛项打卡点数量不能超过赛事打卡点数量");
      }
    },
    // 删除赛项打卡点
    delGroupCard(ind, i) {
      // ind ==> 第几个赛项  i==>该赛项下的第几个打卡点
      // console.log(ind,i)
      var yNum = this.groupList[ind].info[i]["name"].replace(/[^0-9]/gi, "");
      this.groupList[ind].info.splice(i, 1);
      this.nullWarning[ind].cp--;
      this.groupList[ind].info.forEach((vv) => {
        if (vv["name"].replace(/[^0-9]/gi, "") > yNum) {
          let shu = parseInt(vv["name"].replace(/[^0-9]/gi, "")) - 1;
          vv["name"] = "CP" + shu;
        }
      });
    },
    // 去触发赛事传值
    touchPutCard() {
      this.$emit("forBigCard");
    },
    // 获取赛事打卡点 兄弟传值
    getBigCard() {
      eventVue.$on("bigCard", (message) => {
        //这里最好用箭头函数，不然this指向有问题
        console.log(message);
        this.Match = message;
        this.BigCard = message.cpInfos;
        this.cpNameList = [];
        this.BigCard.forEach((v) => {
          this.cpNameList.push(v.cpName);
        });
        this.cpNameList = [...new Set(this.cpNameList)];
      });
    },
    // 获取传值 电子号牌id
    getCavcerId(val) {
      // console.log(val);
      this.showAlert = false;
      this.groupList[this.nowIndex].certificateId = val.id;
    },
    // 判断发送获取赛项给父组件
    groupFrom() {
      this.groupList.forEach((v, i) => {
        if (v.name == "") {
          this.nullWarning[i].name = true;
        } else {
          this.nullWarning[i].name = false;
        }
        if (v.startDate == "") {
          this.nullWarning[i].startDate = true;
        } else {
          this.nullWarning[i].startDate = false;
        }
        if (v.endDate == "") {
          this.nullWarning[i].endDate = true;
        } else {
          this.nullWarning[i].endDate = false;
        }
        if (!this.$newActive && this.Match.type != "Z" && v.wholeCourse == "") {
          this.nullWarning[i].wholeCourse = true;
        } else {
          this.nullWarning[i].wholeCourse = false;
        }
        if (this.$newActive && v.rise == "") {
          this.nullWarning[i].rise = true;
        } else {
          this.nullWarning[i].rise = false;
        }
        if (v.route == "1") {
          v.fixed = "0";
        }
      });
      let arr = this.nullWarning.filter(
        (vv) =>
          vv.name === true ||
          vv.startDate === true ||
          vv.endDate === true ||
          vv.wholeCourse === true ||
          vv.rise === true
      );
      // 活动 打卡点经纬度必填
      if (this.$newActive) {
        let hasEmpty = false;
        p: for (var a = 0; a < this.groupList.length; a++) {
          let v = this.groupList[a].info[this.groupList[a].info.length - 1];
          if (v.longitude == "" || v.latitude == "") {
            hasEmpty = true;
            break p;
          }
        }
        if (hasEmpty) {
          this.$message.error("请填写终点打卡点经纬度");
        }

        if (arr.length <= 0 && !hasEmpty) {
          this.$emit("listenGroup", this.groupList);
        }
      } else {
        if (this.Match.type == "Z") {
          for (let a = 0; a < this.groupList.length; a++) {
            this.groupList[a].info = [];
          }
        }
        if (arr.length <= 0) {
          this.$emit("listenGroup", this.groupList);
        }
      }
    },
  },
  created() {
    this.getBigCard();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/style/match/addGroup";
.groupSet .groupWrap {
  width: 100%;
}
li.txtLeft {
  > div {
    text-align: left !important;
    width: 150px !important;
  }
  .leftWidth {
    width: calc(100% - 162px) !important;
  }
}

.alertBox {
  @include alertBox;
  display: flex;
  justify-content: center;
  align-items: center;
  .alertCon {
    width: 800px;
    height: 500px;
    position: relative;
  }
  .rtxtCon {
    background-color: #fff;
    #txt_fuwb {
      height: auto;
      >>> .quill-editor {
        height: auto !important;
      }
    }
  }
}
</style>

