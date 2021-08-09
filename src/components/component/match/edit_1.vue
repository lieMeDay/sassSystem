<template>
  <!-- 赛事修改 -->
  <div class="editMatchWrap">
    <div class="editMatchBox">
      <div class="titBox">
        <span>赛事基本信息</span>
      </div>
      <div class="detailBox">
        <div class="leftBox">
          <ul>
            <li>
              <div>
                <span class="redStare">*</span>
                <span>赛事名称</span>
              </div>
              <el-input class="iptWidth" v-model="matchMsg.name" placeholder="请输入内容" clearable></el-input>
              <span class="HasNull" v-if="matchMsg.name==''">不能为空</span>
            </li>
            <li>
              <div>
                <span class="redStare">*</span>
                <span>赛事类型</span>
              </div>
              <el-select class="iptWidth" v-model="matchMsg.type" placeholder="请选择">
                <el-option label="马拉松" value="M"></el-option>
                <el-option label="越野赛" value="Y"></el-option>
                <el-option label="登山徒步" value="TB"></el-option>
                <el-option label="自驾游" value="Z"></el-option>
                <el-option label="活动招募" value="A"></el-option>
              </el-select>
              <span class="HasNull" v-if="matchMsg.type==''">不能为空</span>
            </li>
            <li>
              <div>
                <span class="redStare">*</span>
                <span>开始时间</span>
              </div>
              <el-date-picker
                class="iptWidth"
                v-model="matchMsg.matchDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              ></el-date-picker>
              <span class="HasNull" v-if="matchMsg.matchDate==''">不能为空</span>
            </li>
            <li>
              <div>
                <span class="redStare">*</span>
                <span>结束时间</span>
              </div>
              <el-date-picker
                class="iptWidth"
                v-model="matchMsg.matchEndDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              ></el-date-picker>
              <span class="HasNull" v-if="matchMsg.matchEndDate==''">不能为空</span>
            </li>
            <li>
              <div>
                <span class="redStare">*</span>
                <span>赛事地点</span>
              </div>
              <el-cascader
                class="iptWidth"
                v-model="matchMsg.newPlace"
                :options="AreaList"
                :props="{ checkStrictly: true }"
                filterable
              ></el-cascader>
              <span class="HasNull" v-if="matchMsg.newPlace==''">不能为空</span>
            </li>
            <li v-if="matchMsg.type=='A'">
              <div>
                <span>赛事规模</span>
              </div>
              <el-input v-model="matchMsg.scale" placeholder="请输入"></el-input>
            </li>
            <!-- v-if="!$newActive" -->
            <li>
              <div>
                <span>完赛证明</span>
              </div>
              <el-button @click="showAlert=!showAlert">添加/修改</el-button>
            </li>
            <li>
              <div>
                <span>发布到移动端</span>
              </div>
              <el-switch class="swBtn" v-model="matchMsg.state" active-color="#13ce66"></el-switch>
            </li>
            <li>
              <div>
                <span>是否任意报名</span>
              </div>
              <el-switch class="swBtn" v-model="matchMsg.atWill" active-color="#13ce66"></el-switch>
            </li>
            <li>
              <div>
                <span>活动规则</span>
              </div>
              <el-input
                type="textarea"
                class="iptWidth"
                :autosize="{ minRows: 4, maxRows: 10}"
                placeholder="请输入内容"
                v-model="matchMsg.actRule"
              ></el-input>
            </li>
          </ul>
        </div>
        <div class="rightBox">
          <div>
            <div class="rightTit">
              <span class="redStare">*</span>
              <span>赛事封面</span>
            </div>
            <div class="picNR">
              <div class="changeLogo" v-if="matchMsg.logo==''">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <input type="file" class="chooseIpt" @change="upLogo" />
              </div>
              <div v-else class="seeLogo">
                <img :src="matchMsg.logo" alt />
                <span class="avatar-uploader-icon">
                  <i class="el-icon-delete" @click="matchMsg.logo=''"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="editMatchBox">
      <div v-if="matchMsg.type!='Z'">
        <div class="titBox">
          <span>打卡点信息</span>
        </div>
        <table class="tab" cellspacing="0" cellpadding="0">
          <tr>
            <td>打卡点</td>
            <td>名称</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item,index) in matchMsg.cpInfos" :key="index">
            <td>{{item.name}}</td>
            <td>
              <el-input class="tdipt" v-model="item.cpName" placeholder="请输入打卡点名称"></el-input>
            </td>
            <td>
              <el-button
                size="mini"
                v-if="item.name=='起点'||item.name=='终点'?false:true"
                type="danger"
                @click="delBigCard(index)"
              >删除</el-button>
            </td>
          </tr>
          <tr class="addBigPoint">
            <td colspan="3" @click="addBigCard">添加打卡点</td>
          </tr>
        </table>
      </div>
      <div class="titBox">
        <span>图文介绍</span>
      </div>
      <RichTxt class="rich" ref="getContent"></RichTxt>
      <div>
        <el-button type="primary" class="saveBtn" @click="save">保存修改</el-button>
      </div>
    </div>
    <div class="alertBox" v-show="showAlert">
      <div class="alertCon">
        <editCavcer ref="getCav" @cavcerId="getCavcerId"></editCavcer>
      </div>
    </div>
  </div>
</template>

<script>
// 地区
import areaList from "../../../../static/area.json";
//富文本
import RichTxt from "../editor/editor.vue";
import { content } from "../editor/editor.vue";
// 完赛证书
import editCavcer from "../../match/cavcer";
export default {
  components: {
    RichTxt,
    editCavcer,
  },
  props: ["matchMsg", "cerVal"],
  data() {
    return {
      AreaList: [],
      showAlert: false,
    };
  },
  watch: {
    showAlert() {
      if (this.showAlert) {
        // console.log(this.$refs.getCav)
        this.$refs.getCav.cerVal = this.cerVal;
      }
    },
    matchMsg() {
      this.$nextTick(() => {
        let divTop = document.getElementsByClassName("content-box")[0];
        divTop.scrollTop = 0;
      });
    },
  },
  methods: {
    // 上传logo
    upLogo(e) {
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
          this.matchMsg.logo = res.data.data.filePath;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取省市县  选择地区
    getArea() {
      // 获取JSON省市地区
      let area = areaList.data;
      // console.log(area);
      area.forEach((d) => {
        let objA = {};
        objA.value = d.city_name;
        objA.label = d.city_name;
        if (d.cityArr) {
          objA.children = [];
          d.cityArr.forEach((v) => {
            let objB = {};
            objB.value = v.city_name;
            objB.label = v.city_name;
            if (v.areaArr && v.areaArr.length > 0) {
              objB.children = [];
              v.areaArr.forEach((r) => {
                let objC = {};
                objC.value = r.city_name;
                objC.label = r.city_name;
                objB.children.push(objC);
              });
            }
            objA.children.push(objB);
          });
        }
        this.AreaList.push(objA);
      });
      this.AreaList.unshift({
        label: "任意地点",
        value: "任意地点",
        children: [],
      });
      //   console.log(this.AreaList);
    },
    // 添加赛事打卡点
    addBigCard() {
      this.matchMsg.cp++;
      this.matchMsg.cpInfos.splice(this.matchMsg.cpInfos.length - 1, 0, {
        name: "CP" + this.matchMsg.cp,
        cpName: "",
        altitude: "",
        matchId: this.matchMsg.id,
      });
    },
    // 删除赛事打卡点
    delBigCard(index) {
      var yNum = this.matchMsg.cpInfos[index]["name"].replace(/[^0-9]/gi, "");
      this.matchMsg.cpInfos.splice(index, 1);
      this.matchMsg.cp--;
      this.matchMsg.cpInfos.forEach((vv) => {
        if (vv["name"].replace(/[^0-9]/gi, "") > yNum) {
          let shu = parseInt(vv["name"].replace(/[^0-9]/gi, "")) - 1;
          vv["name"] = "CP" + shu;
        }
      });
    },
    // 保存赛事修改
    save() {
      // console.log(this.matchMsg)
      let saveMsg = this.matchMsg;
      let place = "";
      // saveMsg.newPlace.forEach((vv) => {
      //   place += vv + "-";
      // });
      place = saveMsg.newPlace.join("-");
      // .substr(0, place.length - 1);
      saveMsg.place = place;
      saveMsg.introduce = this.$refs.getContent.content;
      saveMsg.state = saveMsg.state ? 0 : 1;
      saveMsg.atWill = saveMsg.atWill ? 1 : 0;
      // delete saveMsg.newPlace;
      delete saveMsg.cp;
      delete saveMsg.matchInfo;
      // console.log(saveMsg);
      if (
        saveMsg.name == "" ||
        saveMsg.type == "" ||
        saveMsg.matchDate == "" ||
        saveMsg.matchEndDate == "" ||
        saveMsg.place == "" ||
        saveMsg.logo == "" ||
        saveMsg.introduce == ""
      ) {
        this.$notify({
          title: "提示",
          message: "请完善信息",
          type: "warning",
          duration: 3000,
        });
      } else {
        this.$axios
          .post("/match/putMatch", saveMsg)
          .then((res) => {
            this.$parent.getMatchMsg();

            this.$alert("修改成功", "提示", {
              confirmButtonText: "确定",
              showClose: false,
              closeOnClickModal: false,
              type: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            this.$alert("修改失败", "提示", {
              confirmButtonText: "确定",
              showClose: false,
              closeOnClickModal: false,
              type: "error",
            });
          });
      }
    },
    // 获取完赛证书隐藏
    getCavcerId(val) {
      // console.log(val);
      this.showAlert = false;
      if (val.id) {
        this.matchMsg.certificateId = val.id;
      }
    },
  },
  mounted() {},
  created() {
    this.getArea();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/style/match/editMatch";
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
}

.swBtn {
  margin-top: 10px;
}
</style>
