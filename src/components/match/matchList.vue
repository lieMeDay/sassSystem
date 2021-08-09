<template>
  <div class="MatchListWrap">
    <ul class="listBox">
      <li v-for="(v,i) in matchList" :key="i" @click="seeMatch(v.id)">
        <h3>{{v.name}}</h3>
        <i class="el-icon-circle-close delMatch" @click.stop="delMatch(v.id,i)"></i>
        <p class="msgBox">
          <span>赛事类型：{{v.showType}}</span>
          <span>赛事地点：{{v.showPlace}}</span>
          <span>赛事时间：{{v.showDate}}</span>
        </p>
        <div class="sjB">
          <p class="arrowIcon" :class="{'gray':v.states=='b'}">
            <span class="short">{{v.states=='a'?'未开始':v.states=='b'?'已结束':'比赛中'}}</span>
          </p>
        </div>
        <!--  v-if="v.states=='a'" -->

        <span class="editUp" @click.stop="fixUp(v.id)">赛事修改</span>
      </li>
      <li @click="AddMatch">
        <i class="el-icon-plus addSign"></i>
        <span class="addTxt">添加赛事</span>
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
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      // console.log(obj)
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        res.data.data.forEach((vv) => {
          vv.showType = vv.type == "M" ? "马拉松" : vv.type == "Y"?"越野赛": vv.type == "TB"?'登山徒步':vv.type=='Z'?'自驾游':'活动招募';
          vv.showPlace = vv.place.split("-")[0];
          vv.states = this.$nowInDateBetwen(vv.matchDate, vv.matchEndDate);
          vv.showDate = vv.matchDate.substring(0, 10);
          this.matchList.push(vv);
        });
      });
    },
    // 删除赛事
    delMatch(id,i) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.get(`/match/delMatch?id=${id}`).then((res) => {
            this.matchList.splice(i,1)
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 查看赛事
    seeMatch(id) {
      this.$router.push({
        path: "/MatchList/msg",
        query: {
          id: id,
        },
      });
    },
    // 修改赛事
    fixUp(id) {
      this.$router.push({
        path: "/MatchList/editMatch",
        query: {
          id: id,
        },
      });
    },
    // 添加赛事
    AddMatch() {
      this.$router.push("/MatchList/addMatch");
    },
  },
  created() {
    this.getMatch();
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
      // overflow: hidden;
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
      .delMatch {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 24px;
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
      .sjB {
        position: absolute;
        overflow: hidden;
        width: 150px;
        height: 100px;
        bottom: 0;
        right: 0;
        border-radius: 0 0 15px;
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

