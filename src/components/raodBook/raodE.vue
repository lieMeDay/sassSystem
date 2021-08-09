<template>
  <div class="raodBox">
    <div class="tit" v-if="!sIpt">
      <div class="HeadImg">
        <img :src="msg.headImgUrl" alt />
      </div>
      <div>
        <p class="t">{{msg.nikeName}}</p>
        <p class="t">{{msg.matchKey}}</p>
      </div>
      <!-- <div class="addBtn">
        <el-button type="primary" @click="add">添加</el-button>
      </div>-->
    </div>
    <div class="tit" v-else>
      <div class="addHImg" v-if="!msg.headImgUrl">
        <input type="file" @change="upLogo" />
        <i class="el-icon-plus iconn"></i>
      </div>
      <div class="HeadImg" v-else>
        <img :src="msg.headImgUrl" alt />
      </div>
      <div>
        <el-input v-model="msg.nikeName" placeholder="请输入昵称"></el-input>
        <el-date-picker
          v-model="msg.matchKey"
          format="yyyy/MM/dd HH:mm"
          value-format="yyyy/MM/dd HH:mm"
          type="datetime"
          placeholder="选择发布时间"
        ></el-date-picker>
      </div>
    </div>
    <ul class="con">
      <li class="li" v-for="(v,i) in msg.personMatchDataList" :key="i">
        <!-- v-show="v.add" v-if="v.add" -->

        <div v-show="v.add">
          <p class="pp">
            <el-input v-model="v.cpName" placeholder="景点名称"></el-input>
          </p>
          <p class="pp">
            <el-input v-model="v.siteInfo" placeholder="景点描述"></el-input>
          </p>
          <p class="pp">
            <el-date-picker
              v-model="v.showD"
              format="yyyy/MM/dd HH:mm"
              value-format="yyyy/MM/dd HH:mm"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </p>
          <div class="pp">
            <div id="mapContainer" ref="allmap"></div>
            <!-- <el-input v-model="v.siteName" id="suggestId" placeholder="景点位置" @input="ii"></el-input> -->
            <el-input v-model="v.siteName" :id="'suggestId'+i" placeholder="景点位置"></el-input>
            <div
              id="searchResultPanel"
              style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
            ></div>
          </div>
          <div class="ib">
            <div v-for="(m,n) in v.imgList" :key="n" class="imgB">
              <img :src="m" class="cpImg" />
              <div class="yy" @click="delImg(i,n)">
                <i class="el-icon-delete"></i>
              </div>
            </div>
            <div class="addImg">
              <i class="el-icon-plus adIcon"></i>
              <input type="file" name id @change="upImg($event,i)" class="ptF" />
            </div>
          </div>
        </div>
        <!-- v-else v-show="!v.add" -->
        <div v-show="!v.add">
          <p>
            {{v.cpName}}
            <el-button size="mini" @click="edit(i)">修改</el-button>
            <el-button type="danger" @click="delPoint(i)" size="mini">删除</el-button>
          </p>
          <p>{{v.siteInfo}}</p>
          <p class="s">{{v.showD}}</p>
          <p class="s">{{v.siteName}}</p>
          <div>
            <img v-for="(m,n) in v.imgList" :key="n" :src="m" class="cpImg pi" />
          </div>
        </div>
      </li>
    </ul>
    <div class="lb">
      <el-button type="primary" @click="add">添加</el-button>
      <el-button type="primary" @click="sub">保存</el-button>
    </div>
  </div>
</template>

<script>
const forDate = (date) => {
  // console.log(date)
  date = new Date(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  month = month > 9 ? month : "0" + month;
  day = day > 9 ? day : "0" + day;
  hour = hour > 9 ? hour : "0" + hour;
  minute = minute > 9 ? minute : "0" + minute;
  return year + "/" + month + "/" + day + " " + hour + ":" + minute;
};
function G(id) {
  return document.getElementById(id);
}
function bd09togcj02(bd_lon, bd_lat) {
  var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
}
var openId = "";
export default {
  data() {
    return {
      sIpt: false,
      msg: {},
      map: "",
    };
  },
  methods: {
    // 上传图片
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
          this.msg.headImgUrl = res.data.data.filePath;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    ii(e) {
      console.log(e);
    },
    init() {
      let oo = { id: this.$route.query.id };
      this.$axios
        .get("/run/person/match/getMatchDataInfoById", { params: oo })
        .then((res) => {
          let rr = res.data.data;
          rr.personMatchDataList.forEach((v) => {
            v.showD = forDate(v.cpTime);
            v.imgList = v.cpImg.split(";");
          });
          this.msg = rr;
        });
    },
    edit(i) {
      this.msg.personMatchDataList[i].add = true;
      this.initMap(i);
      this.$forceUpdate();
    },
    delPoint(i) {
      this.msg.personMatchDataList.splice(i, 1);
    },
    initMap(i) {
      // 百度地图API功能
      this.map = new BMap.Map(this.$refs.allmap[i]); // 创建Map实例
      // console.log(this.map);
      this.map.centerAndZoom("北京", 12);
      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId" + i,
        location: this.map,
      });

      ac.addEventListener("onhighlight", function (e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      let that = this;
      ac.addEventListener("onconfirm", function (e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        that.setPlace(myValue, i);
      });
    },
    setPlace(myValue, i) {
      console.log(myValue, i);
      let that = this;
      that.map.clearOverlays(); //清除地图上所有覆盖物
      function myFun() {
        var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        that.map.centerAndZoom(pp, 18);
        that.map.addOverlay(new BMap.Marker(pp)); //添加标注
        let a = bd09togcj02(pp.lng, pp.lat);
        // console.log(a)
        that.msg.personMatchDataList[i].longitude = a[0];
        that.msg.personMatchDataList[i].latitude = a[1];
      }
      var local = new BMap.LocalSearch(that.map, {
        //智能搜索
        onSearchComplete: myFun,
      });
      that.msg.personMatchDataList[i].siteName = myValue;
      local.search(myValue);
    },
    add() {
      let oo = {
        cpImg: "",
        cpName: "",
        cpTime: "",
        cpUseTime: "",
        distance: 0,
        entryNumber: null,
        groupId: this.msg.groupId,
        latitude: "",
        longitude: "",
        matchId: this.msg.matchId,
        matchKey: this.msg.matchKey,
        openId: this.msg.openId,
        siteInfo: "",
        siteName: "",
        add: true,
        imgList: [],
      };
      this.msg.personMatchDataList.push(oo);
      this.$forceUpdate();
      let that = this;
      setTimeout(() => {
        that.initMap(that.msg.personMatchDataList.length - 1);
      }, 100);
    },
    // 上传logo
    upImg(e, i) {
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append("img", file); //通过append向form对象添加数据
      // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      //   https://paoner.lvtutech.com/game/run/uploadImg /match/uploadImg
      this.$axios
        .post("/match/uploadImgs", param, config)
        .then((res) => {
          console.log(res.data);
          this.msg.personMatchDataList[i].imgList.push(
            "https://paoner.lvtutech.com/game/run/query_pic?name=" +
              res.data.data.filePath
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delImg(i, n) {
      this.msg.personMatchDataList[i].imgList.splice(n, 1);
    },
    sub() {
      let list = this.msg.personMatchDataList;
      for (let a = 0; a < list.length; a++) {
        if (list[a].add) {
          list[a].cpImg = list[a].imgList.join(";");
          list[a].cpTime = new Date(list[a].showD).getTime();
          list[a].matchKey = this.msg.matchKey;
        }
      }
      if (this.$route.query.id) {
        this.$axios
          .post("/run/person/match/editPersonMatchDataList", list)
          .then((res) => {
            this.$message.success("修改成功");
            this.msg.personMatchDataList.forEach((v) => (v.add = false));
            this.$forceUpdate();
          });
      } else {
        let mm = this.msg;
        if (!mm.matchKey) {
          this.$message.warning("选择发布时间");
          return false;
        }
        mm.personMatchDataList = list;
        console.log(mm);
        this.$axios.post("/run/person/match/addMatchDatas", mm).then((res) => {
          this.$message.success("添加成功");
          this.msg.personMatchDataList.forEach((v) => (v.add = false));
          this.sIpt = false;
          history.back();
          this.$forceUpdate();
        });
      }
    },
  },
  mounted() {
    if (this.$route.query.id) {
      this.init();
    } else {
      this.$axios.get("/run/person/match/getopenId").then((res) => {
        let rr = res.data.data;
        this.sIpt = true;
        this.msg = {
          createDate: new Date().getTime(),
          matchKey: "",
          groupId: "",
          matchId: this.$route.query.mId,
          nikeName: "",
          openId: rr,
          headImgUrl: "",
          personMatchDataList: [],
        };
        this.add();
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.raodBox {
  @include padShow();
  .tit {
    width: 100%;
    overflow: hidden;
    > div {
      float: left;
    }
    .HeadImg {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      img {
        width: 100%;
      }
    }
    .t {
      line-height: 25px;
    }
    .addBtn {
      float: right;
    }
  }
  .li {
    margin-top: 20px;
  }
  .s {
    font-size: 14px;
    color: #999;
  }
  .cpImg {
    width: 300px;
    height: 150px;
  }
  #mapContainer {
    width: 200px;
    height: 200px;
  }
  .imgB {
    float: left;
    position: relative;
    cursor: pointer;
    margin-right: 20px;
    width: 300px;
    height: 150px;
    margin-bottom: 10px;
    .yy {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      background-color: rgba($color: #000000, $alpha: 0.4);
      color: #fff;
      text-align: center;
      line-height: 150px;
      font-size: 30px;
      display: none;
    }
    &:hover .yy {
      display: block;
    }
  }
  .addImg {
    width: 298px;
    height: 148px;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    text-align: center;
    line-height: 148px;
    font-size: 30px;
    float: left;
    position: relative;
    margin-bottom: 10px;
    .ptF {
      width: 298px;
      height: 148px;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .pi {
    margin-right: 20px;
  }
  .ib {
    overflow: hidden;
  }
  .lb {
    margin-top: 10px;
  }
  .pp {
    margin-bottom: 10px;
  }
}
.addHImg {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  position: relative;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  text-align: center;
  line-height: 100px;
  input {
    width: 100px;
    height: 100px;
    opacity: 0;
    position: absolute;
  }
  .iconn {
    font-size: 30px;
  }
}
</style>

