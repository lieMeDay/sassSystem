<template>
  <!-- 赛项修改 -->
  <div class="editGroupWrap">
    <div class="editGroupTitBox">
      <span class="bigtit">赛项名称</span>
      <span
        class="addBtn"
        :class="{ blue: showIndex == -1 }"
        @click="addGroup"
        v-if="!$newActive && matchMsg.type != 'Z'"
        >添加赛项</span
      >
      <ul>
        <li
          v-for="(v, i) in matchMsg.matchInfo"
          :key="i"
          :class="{ act: showIndex == i }"
          @click="chioceGroup(i)"
        >
          <span>{{ v.name }}</span>
        </li>
      </ul>
    </div>
    <div class="left_box" :class="newObj.route == 0 ? '' : 'wz_Box'">
      <ul>
        <li>
          <div>
            <span class="redStare">*</span>
            <span>赛项名称</span>
          </div>
          <el-input
            class="iptWidth"
            v-model="newObj.name"
            placeholder="请输入内容"
            clearable
          ></el-input>
          <span class="HasNull" v-if="newObj.name == ''">不能为空</span>
        </li>
        <li>
          <div>
            <span class="redStare">*</span>
            <span>起跑时间</span>
          </div>
          <el-date-picker
            class="iptWidth"
            v-model="newObj.startDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
          <span class="HasNull" v-if="newObj.startDate == ''">不能为空</span>
        </li>
        <li>
          <div>
            <span class="redStare">*</span>
            <span>关门时间</span>
          </div>
          <el-date-picker
            class="iptWidth"
            v-model="newObj.endDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
          <span class="HasNull" v-if="newObj.endDate == ''">不能为空</span>
        </li>
        <li>
          <div>
            <span class="redStare" v-if="!$newActive && matchMsg.type != 'Z'"
              >*</span
            >
            <span>里程</span>
          </div>
          <el-input
            class="iptWidth"
            v-model="newObj.wholeCourse"
            placeholder="请输入内容"
            clearable
          ></el-input>
          <span
            class="HasNull"
            v-if="
              !$newActive && matchMsg.type != 'Z' && newObj.wholeCourse == ''
            "
            >不能为空</span
          >
        </li>
        <li class="longWid">
          <div>
            <!-- <span class="redStare">*</span> -->
            <span>是否有固定轨迹</span>
          </div>
          <div class="iptWidth">
            <el-radio
              v-model="newObj.route"
              label="0"
              :disabled="matchMsg.type == 'Z'"
              >是</el-radio
            >
            <el-radio v-model="newObj.route" label="1">否</el-radio>
          </div>
          <!-- <span class="HasNull">不能为空</span> -->
        </li>
        <li class="longWid" v-show="newObj.route == '0' && !$newActive">
          <div>
            <!-- <span class="redStare">*</span> -->
            <span>是否为定向赛</span>
          </div>
          <div class="iptWidth">
            <el-radio v-model="newObj.fixed" label="1">是</el-radio>
            <el-radio v-model="newObj.fixed" label="0">否</el-radio>
          </div>
          <!-- <span class="HasNull">不能为空</span> -->
        </li>
        <li v-if="!$newActive">
          <div>
            <!-- <span class="redStare">*</span> -->
            <span>爬升</span>
          </div>
          <el-input
            class="iptWidth"
            v-model="newObj.rise"
            placeholder="请输入内容"
            clearable
          ></el-input>
          <!-- <span class="HasNull">不能为空</span> -->
        </li>
        <li v-if="$newActive">
          <div>
            <span class="redStare">*</span>
            <span>顶峰海拔</span>
          </div>
          <el-input
            class="iptWidth"
            v-model="newObj.rise"
            placeholder="请输入内容(米)"
            clearable
          ></el-input>
          <span class="HasNull" v-if="newObj.rise == ''">不能为空</span>
        </li>
        <li v-if="!$newActive">
          <div>
            <span>电子号牌</span>
          </div>
          <el-button @click="showAlert = !showAlert">添加/修改</el-button>
        </li>
      </ul>
    </div>
    <div class="right_box" v-if="newObj.route == 0">
      <div class="map">
        <mapCon ref="touMap"></mapCon>
      </div>
      <div class="upload-demo">
        <div class="KMlBtn">
          上传轨迹文件
          <input type="file" @change="upKml" ref="kmlIpt" />
        </div>
      </div>
    </div>
    <div class="bottom_box">
      <div v-if="matchMsg.type != 'Z'">
        <div>
          <div class="botTit">
            <span class="redStare">*</span>
            <span>赛项计时点</span>
          </div>
          <el-button @click="addGroupCard">添加</el-button>
        </div>
        <el-table :data="newObj.info" border="" style="width: 100%">
          <el-table-column
            prop="name"
            label="cp点"
            align="center"
          ></el-table-column>
          <el-table-column label="名称" align="center">
            <template slot-scope="{ row }">
              <el-select v-model="row.cpName" placeholder="请选择">
                <el-option
                  v-for="(item, index) in matchMsg.cpInfos"
                  :key="index"
                  :label="item.cpName"
                  :value="item.cpName"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="距起点(KM)" align="center">
            <template slot-scope="{ row }">
              <el-input
                placeholder="请输入内容"
                v-model="row.distance"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="爬升" align="center">
            <template slot-scope="{ row }">
              <el-input
                placeholder="请输入内容"
                v-model="row.rise"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <!-- 正式 关门时间 -->
          <el-table-column
            v-if="!$newActive"
            label="关门时间"
            align="center"
            width="250"
          >
            <template slot-scope="{ row }">
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
            <template slot-scope="{ row }">
              <input
                type="text"
                placeholder="请输入经度"
                v-model="row.longitude"
                class="wipt"
              />
            </template>
          </el-table-column>
          <el-table-column v-if="$newActive" label="纬度" align="center">
            <template slot-scope="{ row }">
              <input
                type="text"
                placeholder="请输入纬度"
                v-model="row.latitude"
                class="wipt"
              />
            </template>
          </el-table-column>
          <!-- 活动完 -->
          <el-table-column label="打卡点图片" align="center" width="120">
            <template slot-scope="{ row, $index }">
              <div class="choseImg" v-if="!row.cpImg">
                添加图片
                <label class="chImgBtn">
                  <input
                    type="file"
                    class="chImgBtn"
                    @change="upcpImg($event, $index)"
                  />
                </label>
              </div>
              <div v-else class="cpPic">
                <img :src="row.cpImg" alt="" />
                <span class="avatar-uploader-icon">
                  <i class="el-icon-delete" @click="row.cpImg = ''"></i>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!$newActive && newObj.route == '0' && newObj.fixed == '1'"
            label="打卡点简介"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <!-- <el-input placeholder="请输入" v-model="row.cpInfo" clearable></el-input> -->
              <el-button
                type="primary"
                v-if="!row.cpInfo"
                @click="addCardJJ($index)"
                >添加</el-button
              >
              <el-button
                type="primary"
                v-else
                @click="addCardJJ($index, row.cpInfo)"
                >修改</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                size="mini"
                v-if="row.name != '起点' && row.name != '终点'"
                type="danger"
                @click="delGroupCard($index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-button type="primary" class="saveBtn" @click="saveGroup"
          >保存</el-button
        >
      </div>
    </div>
    <div class="alertBox" v-show="showAlert">
      <div class="alertCon">
        <editCavcer ref="getCav" @cavcerId="getCavcerId"></editCavcer>
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
// 电子号牌
import editCavcer from "../../match/cavcer";
//富文本
import RichTxt from "../editor/editor.vue";
import { content } from "../editor/editor.vue";
export default {
  components: { mapCon, editCavcer, RichTxt },
  props: ["matchMsg"],
  data() {
    return {
      showIndex: 0,
      newObj: {
        name: "",
        startDate: "",
        endDate: "",
        wholeCourse: "",
        rise: "",
        route: "0",
        fixed: "0",
        kmlFile: "",
        info: [],
      },
      showAlert: false, //显示弹框
      cerVal: {},
      showCardJJ: false,
    };
  },
  watch: {
    showAlert() {
      if (this.showAlert) {
        // console.log(this.$refs.getCav)
        // console.log(this.cerVal)
        this.$refs.getCav.cerVal = this.cerVal;
      }
    },
  },
  methods: {
    // 打开点简介显示
    addCardJJ(ii, v) {
      // console.log(i)
      this.cardJJ = ii;
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
      this.newObj.info[this.cardJJ].cpInfo = vt;
      this.$forceUpdate();
    },
    // 选择赛项
    chioceGroup(i) {
      this.showIndex = i;
      if (this.$newActive) {
        this.matchMsg.matchInfo[i].info.forEach((v) => {
          v.longitude = v.endDate.split(";")[0];
          v.latitude = v.endDate.split(";")[1];
        });
        this.$forceUpdate();
      }
      this.newObj = this.matchMsg.matchInfo[i];
      if (this.newObj.wholeCourse == 0) {
        this.newObj.wholeCourse = "";
      }
      if (this.newObj.rise == 0) {
        this.newObj.rise = "";
      }
      this.newObj.fixed = this.newObj.fixed + "";
      this.$forceUpdate();
      if (this.newObj.certificateId && this.newObj.certificateId != 0) {
        let swsPic = { id: this.newObj.certificateId };
        this.$axios
          .get("/match/certificate/get", { params: swsPic })
          .then((suc) => {
            this.cerVal = suc.data.data;
          });
      }
      this.newObj.route = this.newObj.route ? String(this.newObj.route) : "0";
      let fi = this.newObj.kmlFile;
      if (fi && fi != "" && fi != null) {
        this.$axios.get("/match/getKml?fileName=" + fi).then((res) => {
          this.$refs.touMap.cavLine(res.data.data.kml);
        });
      }
      this.$forceUpdate();
    },
    // 添加赛项打卡点
    addGroupCard() {
      let arr = this.newObj;
      if (arr.info.length >= this.matchMsg.cpInfos.length) {
        this.$message.warning("赛项打卡点数量不能超过赛事打卡点数量");
      } else {
        if (arr.info.length==0||arr.info[0].name != "起点") {
          arr.info.unshift({
            name: "起点",
            cpName: "",
            distance: "",
            endDate: "",
            longitude: "",
            latitude: "",
            rise: "",
            cpImg: "",
            cpInfo: "",
            descend: "",
          });
        } else if (arr.info[arr.info.length - 1].name != "终点") {
          arr.info.push({
            name: "终点",
            cpName: "",
            distance: "",
            endDate: "",
            longitude: "",
            latitude: "",
            rise: "",
            cpImg: "",
            cpInfo: "",
            descend: "",
          });
        } else {
          arr.cp++;
          arr.info.splice(arr.info.length - 1, 0, {
            name: "CP" + arr.cp,
            cpName: "",
            distance: "",
            endDate: "",
            longitude: "",
            latitude: "",
            rise: "",
            cpImg: "",
            cpInfo: "",
            descend: "",
          });
        }
      }
    },
    // 删除赛项打卡点
    delGroupCard(i) {
      console.log(i);
      let arr = this.newObj;
      var yNum = arr.info[i]["name"].replace(/[^0-9]/gi, "");
      arr.info.splice(i, 1);
      arr.cp--;
      arr.info.forEach((vv) => {
        if (vv["name"].replace(/[^0-9]/gi, "") > yNum) {
          let shu = parseInt(vv["name"].replace(/[^0-9]/gi, "")) - 1;
          vv["name"] = "CP" + shu;
        }
      });
    },
    // 上传cpImg
    upcpImg(e, ind) {
      // console.log(e,ind);
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
          this.newObj.info[ind].cpImg = res.data.data.filePath;
          this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 上传KML轨迹
    upKml(e) {
      this.newObj.kmlFile = "";
      // console.log(e, i);
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append("file", file); //通过append向form对象添加数据
      // console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      this.$axios
        .post("/match/uploadKml", param, config)
        .then((res) => {
          console.log(res.data);
          this.newObj.kmlFile = res.data.data.fileName;
          this.$refs.touMap.cavLine(res.data.data.kml);
          this.$refs.kmlIpt.value = "";
        })
        .catch((err) => {
          console.log(err);
          this.$refs.kmlIpt.value = "";
          this.$message.error("上传失败");
        });
    },
    // 添加赛项
    addGroup() {
      this.showIndex = -1;
      this.cerVal = {};
      this.newObj = {
        cp: 0,
        name: "", //赛项名称
        start: "", //起点
        end: "", //终点
        startDate: "", //起跑时间
        endDate: "", //关门时间
        wholeCourse: "", //里程
        rise: "", //爬升
        route: "0", //是否有固定轨迹
        fixed: "0",
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
            endDate: "",
            longitude: "",
            latitude: "",
            rise: "",
            cpImg: "",
            descend: "",
            cpInfo: "",
          },
          {
            name: "终点",
            cpName: "",
            distance: "",
            endDate: "",
            longitude: "",
            latitude: "",
            rise: "",
            cpImg: "",
            descend: "",
            cpInfo: "",
          },
        ], //赛项打卡点
      };
      this.$forceUpdate();
      this.$nextTick(() => {
        this.$refs.touMap.cavLine("");
      });
    },
    saveGroup() {
      // console.log(this.matchMsg.matchInfo[this.showIndex]);
      // console.log(this.newObj)
      let saveMsg = this.newObj;
      delete saveMsg.cp;
      let actpd = false;
      if (this.$newActive) {
        if (saveMsg.rise == "") {
          actpd = true;
        }
        for (var a = 0; a < saveMsg.info.length; a++) {
          if (
            a == saveMsg.info.length &&
            (saveMsg.info[a].longitude == "" || saveMsg.info[a].latitude == "")
          ) {
            actpd = true;
            this.$message.error("请填写终点经纬度");
            break;
          } else {
            saveMsg.info[a].endDate =
              saveMsg.info[a].longitude + ";" + saveMsg.info[a].latitude;
          }
        }
      } else {
        if (this.matchMsg.type != "Z") {
          if (saveMsg.wholeCourse == "") {
            actpd = true;
          }
        }
      }
      if (
        saveMsg.name == "" ||
        saveMsg.startDate == "" ||
        saveMsg.endDate == "" ||
        actpd
      ) {
        this.$notify({
          title: "提示",
          message: "请完善信息",
          type: "warning",
          duration: 3000,
        });
      } else {
        if (saveMsg.route == "1") {
          saveMsg.fixed = "0";
        }
        if ("matchId" in saveMsg) {
          // console.log(saveMsg)
          this.$axios.post("/match/putMatchInfo", saveMsg).then((res) => {
            this.showIndex = 0;
            this.$parent.getMatchMsg();
            // this.$message.success("保存成功");
            this.$alert("保存成功", "提示", {
              confirmButtonText: "确定",
              showClose: false,
              closeOnClickModal: false,
              type: "success",
              // callback: action => {
              //   if (action == "confirm") {
              //     this.$router.push("/MatchList");
              //   }
              // }
            });
          });
        } else {
          saveMsg.matchId = this.matchMsg.id;
          saveMsg.kmlFile = this.kmlFile;
          saveMsg.wholeCourse = Number(saveMsg.wholeCourse);
          saveMsg.rise = Number(saveMsg.rise);
          saveMsg.descend = Number(saveMsg.descend);
          saveMsg.joinNum = Number(saveMsg.joinNum);
          saveMsg.maxAge = Number(saveMsg.maxAge);
          saveMsg.minAge = Number(saveMsg.minAge);
          saveMsg.birthdayNum = Number(saveMsg.birthdayNum);
          saveMsg.signUpNum = Number(saveMsg.signUpNum);
          saveMsg.signUpRatio = Number(saveMsg.signUpRatio);
          saveMsg.joinRatio = Number(saveMsg.joinRatio);
          saveMsg.info.forEach((dd) => {
            dd.distance = Number(dd.distance);
            dd.rise = Number(dd.rise);
            dd.descend = Number(dd.descend);
          });
          this.$axios
            .post("/match/addMatchInfo", saveMsg)
            .then((res) => {
              this.showIndex = 0;
              this.$parent.getMatchMsg();
              // this.$message.success("保存成功");
              this.$confirm("保存成功", "提示", {
                confirmButtonText: "确定",
                showClose: false,
                showCancelButton: false,
                closeOnClickModal: false,
                type: "success",
              })
                .then(() => {})
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "保存失败",
                  });
                });
            })
            .catch((err) => {
              this.$confirm("保存失败", "提示", {
                confirmButtonText: "确定",
                showClose: false,
                showCancelButton: false,
                closeOnClickModal: false,
                type: "error",
              });
            });
        }
      }
    },
    // 电子号牌隐藏
    getCavcerId(val) {
      // console.log(val);
      this.showAlert = false;
      if (val.id) {
        this.newObj.certificateId = val.id;
      }
    },
  },
  mounted() {
    this.chioceGroup(0);
  },
};
</script>


<style lang="scss" scoped>
@import "../../../assets/style/match/editGroup";
.longWid {
  > div {
    width: 120px !important;
  }
}

.alertBox {
  @include alertBox;
  display: flex;
  justify-content: center;
  align-items: center;
  .alertCon {
    @include hs_center;
    width: 800px;
    height: 500px;
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

.wipt {
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
  height: 38px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
