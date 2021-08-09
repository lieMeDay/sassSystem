<template>
  <!-- 查看赛项 -->
  <div class="groupMsg">
    <div class="titBox">
      <span>赛项配置</span>
    </div>
    <el-collapse accordion>
      <el-collapse-item v-for="(v,i) in matchMsg.matchInfo" :key="i">
        <template slot="title">
          <div class="GroupList" @click="showInd(i)">
            <div class="df">
              <div class="GroupName">
                <b>赛项名称</b>
                <span>{{v.name}}</span>
              </div>
              <div class="GroupDate">
                <b>比赛时间</b>
                <span>{{v.startDate}}</span>
              </div>
              <div class="GroupDis">
                <b>里程</b>
                <span>{{v.wholeCourse}}</span>
              </div>
              <!-- <div class="GroupPer" v-if="!$newActive">
                <b>参赛选手名单</b>
                <span class="blue" @click.stop="goresPer(v.id,1)">点击添加/查看</span>
              </div> -->
              <div class="GroupPer">
                <span class="blue" @click.stop="goresPer(v.id,2)">成绩审核</span>
              </div>
            </div>
            <div class="GroupConArrow"></div>
          </div>
        </template>
        <div class="GroupCon" v-if="matchMsg.matchInfo">
          <div class="left_box" :class="matchMsg.matchInfo[showI].route=='1'?'wz_Box':''">
            <ul>
              <li>
                <div>
                  <b>赛项名称</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].name}}</span>
              </li>
              <li>
                <div>
                  <b>起跑时间</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].startDate}}</span>
              </li>
              <li>
                <div>
                  <b>关门时间</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].endDate}}</span>
              </li>
              <li>
                <div>
                  <b>里程</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].wholeCourse}}</span>
              </li>
              <li>
                <div style="width:120px;">
                  <b>是否有固定轨迹</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].route?matchMsg.matchInfo[showI].route=='0'?'是':'否':'是'}}</span>
              </li>
              <li v-if="!$newActive&&matchMsg.matchInfo[showI].route=='0'">
                <div style="width:120px;">
                  <b>是否为定向赛</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].fixed?matchMsg.matchInfo[showI].fixed=='0'?'否':'是':'否'}}</span>
              </li>
              <li v-if="!$newActive">
                <div>
                  <b>爬升</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].rise}}</span>
              </li>
              <li v-if="$newActive">
                <div>
                  <b>顶峰海拔</b>
                </div>
                <span>{{matchMsg.matchInfo[showI].rise}}米</span>
              </li>
              <li v-if="!$newActive">
                <div>
                  <b>电子号牌</b>
                </div>
                <div class="pBox" ref="wsPB" v-if="wsPic">
                  <img :src="wsPic" alt />
                  <span
                    class="pt"
                    v-for="(v,i) in txtList"
                    :key="i"
                    :style="{left:v.trueX+'px',top:v.trueY+'px',fontSize:v.fontSize+'px',color:v.fontColor}"
                  >{{v.val}}</span>
                </div>
                <div class="pBox">暂无</div>
              </li>
            </ul>
          </div>
          <div class="right_box" v-if="matchMsg.matchInfo[showI].route!='1'">
            <div class="upload-demo">轨迹路线</div>
            <div class="map">
              <mapCon ref="touMap"></mapCon>
            </div>
          </div>
          <div class="bottom_box" v-if="matchMsg.type!='Z'">
            <div>
              <div class="botTit">
                <span>赛项计时点</span>
              </div>
            </div>
            <el-table border :data="matchMsg.matchInfo[showI].info" style="width: 100%">
              <el-table-column prop="name" label="cp点" align="center"></el-table-column>
              <el-table-column prop="cpName" label="名称" align="center"></el-table-column>
              <el-table-column prop="distance" label="距离" align="center"></el-table-column>
              <el-table-column prop="rise" label="上升" align="center"></el-table-column>
              <el-table-column label="经度" align="center" v-if="$newActive">
                <template slot-scope="{row}">
                  <span>{{row.endDate.split(';')[0]}}</span>
                </template>
              </el-table-column>
              <el-table-column label="纬度" align="center" v-if="$newActive">
                <template slot-scope="{row}">
                  <span>{{row.endDate.split(';')[1]}}</span>
                </template>
              </el-table-column>
              <el-table-column label="关门时间" align="center" v-if="!$newActive">
                <template slot-scope="{row}">
                  <span>{{row.endDate.split(';')[0]}}</span>
                </template>
              </el-table-column>
              <el-table-column label="打卡点图片" align="center" width="120">
                <template slot-scope="{row}">
                  <div class="cpPic">
                    <img :src="row.cpImg" alt />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="打卡点简介"
                align="center"
                v-if="!$newActive&&matchMsg.matchInfo[showI].fixed==1"
              >
                <template slot-scope="{row}">
                  <el-button type="primary" @click="seeCJJ(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="alertBox" v-if="showjjT">
      <div class="rtxtCon">
        <i class="el-icon-error closeBtn" @click="showjjT=!showjjT"></i>
        <div class="ql-snow nr">
          <div class="ql-editor" v-html="showjjC"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 地图
import mapCon from "./lineMap";
export default {
  props: ["matchMsg"],
  components: { mapCon },
  data() {
    return {
      showI: 0,
      wsPic: "",
      txtList: [],
      cerVal: {},
      showjjT: false,
    };
  },
  methods: {
    seeCJJ(v) {
      // console.log(v.cpInfo)
      this.showjjC = "";
      this.showjjT = !this.showjjT;
      this.showjjC = v.cpInfo;
    },
    goresPer(v, i) {
      if (i == 1) {
        this.$router.push({
          path: "/MatchList/Per",
          query: {
            matchId: this.matchMsg.id,
            id: v,
          },
        });
      } else if (i == 2) {
        this.$router.push({
          path: "/MatchList/res",
          query: {
            matchId: this.matchMsg.id,
            id: v,
          },
        });
      }
    },
    showInd(i) {
      this.showI = i;
      let fi = this.matchMsg.matchInfo[this.showI].kmlFile;
      if (fi && fi != "" && fi != null) {
        this.$axios.get("/match/getKml?fileName=" + fi).then((res) => {
          this.$refs.touMap[i].cavLine(res.data.data.kml);
        });
      }
      this.cerVal = {};
      this.wsPic = "";
      this.txtList = [];
      if (
        this.matchMsg.matchInfo[this.showI].certificateId &&
        this.matchMsg.matchInfo[this.showI].certificateId != 0
      ) {
        let swsPic = {
          id: this.matchMsg.matchInfo[this.showI].certificateId,
        };
        this.$axios
          .get("/match/certificate/get", { params: swsPic })
          .then((suc) => {
            this.cerVal = suc.data.data;
            this.wsPic = suc.data.data.imgUrl;
            let str = JSON.parse(suc.data.data.items);
            // console.log(str);
            var img = new Image();
            img.src = suc.data.data.imgUrl;
            let height = suc.data.data.height;
            let width = suc.data.data.width;
            img.onload = () => {
              this.onRes(str, width, height);
            };
          });
      }
    },
    onRes(arr, ww, hh) {
      // console.log(this.$refs.wsPB)
      let w = this.$refs.wsPB[this.showI].offsetWidth;
      let h = this.$refs.wsPB[this.showI].offsetHeight;
      // console.log(w, h);
      arr.forEach((v, i) => {
        v.trueX = (v.left / ww) * w;
        v.trueY = (v.top / hh) * h;
        v.fontSize = parseInt(v.fontSize * ((w / ww + h / hh) / 2));
      });
      // console.log(arr);
      this.txtList = arr;
    },
  },
  mounted() {
    let that = this;
    window.onresize = function () {
      if (that.cerVal.items) {
        let str = JSON.parse(that.cerVal.items);
        let ww = that.cerVal.width;
        let hh = that.cerVal.height;
        that.onRes(str, ww, hh);
      }
    };
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
};
</script>

<style lang="scss" scoped>
.groupMsg {
  width: calc(100% - 40px);
  background-color: #fff;
  margin-bottom: 15px;
  padding: 20px;
  .titBox {
    @include titBox();
  }
  >>> .el-collapse-item__arrow.el-icon-arrow-right {
    display: none;
  }
  .GroupList {
    width: calc(100% - 22px);
    border: 1px solid #ccc;
    //   display: flex;
    line-height: 40px;
    overflow: hidden;
    margin: 15px auto;
    border-radius: 10px;
    padding: 0 10px;
    > div {
      float: left;
      > * {
        // float: left;
        color: #333e5f;
      }
      span {
        margin-left: 5px;
        color: #666666;
        &.blue {
          color: #000099e5;
          //   text-decoration: underline;
        }
      }
    }
    .df {
      width: calc(100% - 40px);
      display: flex;
      // display:table;
      justify-content: space-around;
      align-items: center;
      // >div{
      //   display:table-cell;
      // }
    }
    .GroupName {
      width: calc(24% - 10px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .GroupDate {
      width: calc(30% - 10px);
    }
    .GroupDis {
      width: calc(16% - 10px);
    }
    .GroupPer {
      width: calc(30% - 10px);
    }
    .GroupConArrow {
      width: 40px;
      height: 40px;
      background: url("/static/images/match/arrow.png") no-repeat center center;
      background-size: 50%;
    }
  }
  .GroupCon {
    overflow: hidden;
  }
  .left_box,
  .right_box {
    width: calc(50% - 12px);
    float: left;
    border-radius: 3px;
  }

  .left_box {
    border: 1px solid #eeeeee;
    ul {
      width: 100%;
      overflow: hidden;
      margin-top: 20px;

      li {
        width: 100%;
        position: relative;
        margin-bottom: 20px;
        display: flex;
        line-height: 40px;

        div {
          @include nameTit();
        }
      }
    }
  }
  .wz_Box {
    width: calc(100% - 2px);
    ul {
      li {
        float: left;
        width: auto;
      }
    }
  }

  .right_box {
    float: right;
    .upload-demo {
      margin: 5px 0;
      position: relative;
      height: 40px;
      line-height: 40px;
    }
  }
  .bottom_box {
    width: 100%;
    float: left;
    > div {
      margin: 5px auto;
    }
    .cpPic {
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .botTit {
      @include nameTit();
      width: 100px;
    }
  }
}
.pBox {
  overflow: hidden;
  position: relative;
}
.pt {
  position: absolute;
  line-height: initial;
}
img {
  width: 100%;
  height: 100%;
  float: left;
}

.alertBox {
  @include alertBox;
  display: flex;
  justify-content: center;
  align-items: center;
  .rtxtCon {
    width: 900px;
    background-color: #fff;
    .closeBtn {
      color: blue;
      font-size: 30px;
      float: right;
      cursor: pointer;
    }
    .nr {
      width: 100%;
      max-height: 500px;
      overflow: auto;
    }
  }
}
</style>
