<template>
  <div>
    <!-- 赛事提交 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="auto" class="MatchForm">
      <el-form-item label="赛事名称" prop="name">
        <el-input class="minWidth" v-model="ruleForm.name" placeholder="请输入赛事名称"></el-input>
      </el-form-item>
      <el-form-item label="赛事封面" prop="logo">
        <div class="changeLogo" v-if="!ruleForm.logo">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <input type="file" class="chooseIpt" @change="upLogo" />
        </div>
        <div v-else class="seeLogo">
          <img :src="ruleForm.logo" alt />
          <span class="avatar-uploader-icon">
            <i class="el-icon-delete" @click="ruleForm.logo=''"></i>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="赛事类型" prop="type">
        <el-select class="minWidth" v-model="ruleForm.type" placeholder="请选择" @change="togT">
          <el-option label="马拉松" value="M"></el-option>
          <el-option label="越野赛" value="Y"></el-option>
          <el-option label="登山徒步" value="TB"></el-option>
          <el-option label="自驾游" value="Z"></el-option>
          <el-option label="活动招募" value="A"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赛事时间" prop="matchDate">
        <el-date-picker
          class="minWidth"
          v-model="ruleForm.matchDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="matchEndDate">
        <el-date-picker
          class="minWidth"
          v-model="ruleForm.matchEndDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="赛事地点" prop="place">
        <el-cascader
          class="minWidth"
          v-model="ruleForm.place"
          :options="AreaList"
          :props="{ checkStrictly: true }"
          filterable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="赛事规模" v-if="ruleForm.type=='A'">
        <el-input v-model="ruleForm.scale" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="打卡点信息" prop="cpInfos" v-if="ruleForm.type!='Z'">
        <table class="tab" cellspacing="0" cellpadding="0">
          <tr>
            <td>打卡点</td>
            <td>名称</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item,index) in ruleForm.cpInfos" :key="index">
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
      </el-form-item>
      <el-form-item label="图文介绍" prop="introduce">
        <RichTxt ref="getContent"></RichTxt>
      </el-form-item>
      <!--  v-if="!$newActive" -->
      <el-form-item label="完赛证书">
        <el-button @click="showAlert=!showAlert">添加</el-button>
      </el-form-item>
      <el-form-item label="是否发布到移动端">
        <el-switch class="swBtn" v-model="ruleForm.state" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item label="是否任意报名" v-if="!$newActive">
        <el-switch class="swBtn" v-model="ruleForm.atWill" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item label="活动规则" v-if="!$newActive">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ruleForm.actRule"></el-input>
      </el-form-item>
    </el-form>
    <div class="alertBox" v-if="showAlert">
      <div class="alertCon">
        <addCavcer @cavcerId="getCavcerId"></addCavcer>
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
// 兄弟组件传值 ==》打卡点
import eventVue from "../../../assets/bus";
// 完赛证书
import addCavcer from "../../match/cavcer";
export default {
  components: {
    RichTxt,
    addCavcer,
  },
  data() {
    return {
      AreaList: [],
      cp: 0, //赛事cp打卡点
      ruleForm: {
        platform: "1",
        name: "", //赛事名称
        logo: "", //赛事logo  //www.baidu.com/img/baidu_jgylogo3.gif
        type: "", //赛事类型
        matchDate: "", //比赛时间
        matchEndDate: "", //比赛结束时间
        place: "", //赛事地点
        startPlace: "", //起点位置
        endPlace: "", //终点位置
        scale: "", //赛事规模
        ponsor: "", //主办单位
        coSponsored: "", //联合主办
        organizer: "", //承办单位
        actRule:'',
        cpInfos: [
          {
            name: "起点",
            cpName: "",
            altitude: "",
          },
          {
            name: "终点",
            cpName: "",
            altitude: "",
          },
        ], //赛事打卡点
        introduce: "", //赛事简介
        state: true,
        atWill: false,
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        logo: [{ required: true, message: "请选择封面", trigger: "blur" }],
        type: [
          {
            required: true,
            message: "请选择赛事类型",
            trigger: "blur",
          },
        ],
        matchDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur",
          },
        ],
        matchEndDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur",
          },
        ],
        place: [{ required: true, message: "请选择赛事地点", trigger: "blur" }],
        cpInfos: [
          {
            type: "array",
            required: true,
            message: "请添加打卡点",
            trigger: "blur",
          },
        ],
        introduce: [
          { required: true, message: "请输入赛事简介", trigger: "blur" },
        ],
      },
      certificateId: 0, // 完赛证书Id
      showAlert: false, //显示弹框
    };
  },
  methods: {
    togT(val) {
      // console.log(value)

      if (val == "Z") {
        this.ruleForm.cpInfos = [];
      } else {
        this.ruleForm.cpInfos = [
          {
            name: "起点",
            cpName: "",
            altitude: "",
          },
          {
            name: "终点",
            cpName: "",
            altitude: "",
          },
        ];
      }
      this.putCPList();
      // if (val == "Z") {
      // }
    },
    // 校验传值
    MatchForm(formName) {
      this.ruleForm.certificateId = this.certificateId;
      this.ruleForm.introduce = this.$refs.getContent.content;
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log("submit")
          if (this.ruleForm.type == "Z") {
            this.ruleForm.cpInfos = [];
          }
          this.$emit("listenMatch", this.ruleForm);
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
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
          this.ruleForm.logo = res.data.data.filePath;
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
      // console.log(this.AreaList);
    },
    // 添加赛事打卡点
    addBigCard() {
      this.cp++;
      this.ruleForm.cpInfos.splice(this.ruleForm.cpInfos.length - 1, 0, {
        name: "CP" + this.cp,
        cpName: "",
        altitude: "",
      });
    },
    // 删除赛事打卡点
    delBigCard(index) {
      var yNum = this.ruleForm.cpInfos[index]["name"].replace(/[^0-9]/gi, "");
      this.ruleForm.cpInfos.splice(index, 1);
      this.cp--;
      for (var a = 1; a < this.ruleForm.cpInfos.length - 1; a++) {
        if (this.ruleForm.cpInfos[a]["name"].replace(/[^0-9]/gi, "") > yNum) {
          var shu =
            parseInt(this.ruleForm.cpInfos[a]["name"].replace(/[^0-9]/gi, "")) -
            1;
          this.ruleForm.cpInfos[a]["name"] = "CP" + shu;
        }
      }
    },
    getCavcerId(val) {
      // console.log(val)
      this.showAlert = false;
      this.certificateId = val.id;
    },
    // 兄弟传值  打卡点给赛项
    putCPList() {
      // console.log(1);
      eventVue.$emit("bigCard", this.ruleForm);
    },
  },
  created() {
    this.getArea();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/style/match/addmatch";
.changeLogo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 148px;
  &:hover {
    border-color: #409eff;
  }
  .chooseIpt {
    position: absolute;
    width: 148px;
    height: 148px;
    opacity: 0;
    top: 0;
    left: 0;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.seeLogo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 148px;
  img {
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -1;
    color: white;
    background-color: rgba($color: #000, $alpha: 0.4);
  }
  &:hover .avatar-uploader-icon {
    z-index: 2;
    opacity: 1;
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
}

.swBtn {
  margin-top: 10px;
}
</style>
