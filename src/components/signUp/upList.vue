<template>
  <div class="MatchListWrap">
    <ul class="listBox">
      <li v-for="(v,i) in matchList" :key="i" @click="seeSign(v.matchId,v.id)">
        <h3>{{v.name}}</h3>
        <p class="msgBox">
          <span>赛事类型：{{v.showType}}</span>
          <span>赛事地点：{{v.showPlace}}</span>
          <span>赛事时间：{{v.showDate}}</span>
        </p>
        <p class="arrowIcon" :class="{'gray':v.states=='b'}">
          <span class="short" v-if="$newActive">进行中</span>
          <span class="short" v-else>{{v.states=='a'?'未开始':v.states=='b'?'已结束':'报名中'}}</span>
        </p>
        <span class="editUp" @click.stop="fixUp(v.matchId,v.id)">报名修改</span>
      </li>
      <li @click="AddSignUp">
        <i class="el-icon-plus addSign"></i>
        <span class="addTxt">添加报名</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matchList: [],
    };
  },
  methods: {
    // 获取赛事
    getMatch() {
      // console.log(window.sessionStorage.getItem('orgId'))
      let orgId = window.sessionStorage.getItem("orgId");
      // console.log(orgId)
      this.$axios
        .get("/match/signUp/getByOrgId?orgId=" + orgId)
        .then((res) => {
          res.data.data.forEach((vv) => {
          vv.showType = vv.type == "M" ? "马拉松" : vv.type == "Y"?"越野赛":'登山徒步';
            vv.showPlace = vv.place.split("-")[0];
            vv.showDate = vv.beginDate.substring(0, 10);
            if (this.$newActive) {
              vv.states = "";
            } else {
              vv.states = this.$nowInDateBetwen(vv.startDate, vv.endDate);
            }
            // console.log(vv)
            this.matchList.push(vv);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 发布报名
    AddSignUp() {
      this.$router.push({
        path: "/upList/AddSignUp",
        query: {
          // id: this.matchList[i].matchCon[n].id
        },
      });
    },
    // 查看报名
    seeSign(id, i) {
      // id==>全部赛事id i==>报名赛事id
      this.$router.push({
        path: "/upList/signUpAll",
        query: {
          id: id,
          i: i,
        },
      });
    },
    // 修改报名
    fixUp(id, i) {
      // id==>全部赛事id i==>报名赛事id
      this.$router.push({
        path: "/upList/editSignUp",
        query: {
          id: id,
          i: i,
        },
      });
    },
  },
  created() {
    this.getMatch();
    // this.$axios.get('')
  },
};
</script>

<style lang="scss" scoped>
.MatchListWrap {
  @include padShow();
  .listBox {
    width: 100%;
    li {
      width: calc(33.333% - 22px);
      height: 200px;
      margin-bottom: 20px;
      float: left;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0px 0px 20px 0px rgba(108, 0, 255, 0.2);
      border-radius: 15px;
      border: 3px solid transparent;
      transition: all 0.3s ease;
      &:hover {
        transform: translateY(-8px);
      }
      &:nth-child(3n-1) {
        margin: 0 24px;
      }
      h3 {
        width: 90%;
        margin: 10px auto;
        font-weight: bold;
        font-size: 18px;
        margin-top: 20px;
      }
      p.msgBox {
        margin: 0px auto;
        width: 90%;
        margin-top: 25px;
        span {
          display: block;
          line-height: 30px;
        }
      }
      span.editUp {
        position: absolute;
        right: 30px;
        top: 80px;
        border: 1px solid #eee;
        border-radius: 5px;
        line-height: 30px;
        padding: 0 5px;
      }
      .arrowIcon {
        width: 0;
        height: 0;
        border-width: 100px 150px 0px 0;
        border-style: solid;
        border-color: transparent #1e42c1;
        position: absolute;
        bottom: 0;
        right: 0;
        &.gray {
          border-color: transparent gray;
        }
        span {
          position: absolute;
          color: #fff;
          transform: rotate(60deg);
          font-size: 18px;
          &.short {
            top: -70px;
            left: 90px;
          }
          &.long {
            top: -85px;
            left: 90px;
          }
        }
      }
      .addSign {
        display: block;
        font-size: 110px;
        width: 100%;
        height: 150px;
        line-height: 150px;
        text-align: center;
      }
      .addTxt {
        display: block;
        text-align: center;
      }
    }
  }
}
</style>

