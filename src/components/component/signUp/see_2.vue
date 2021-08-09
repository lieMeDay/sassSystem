<template>
  <!-- 查看赛项 -->
  <div class="groupMsg">
    <div class="titBox">
      <span>赛项配置</span>
    </div>
    <el-collapse accordion>
      <el-collapse-item v-for="(v,i) in signMsg.matchInfo" :key="i">
        <template slot="title">
          <div class="GroupList">
            <div class="GroupName">
              <b>赛项名称</b>
              <span>{{v.name}}</span>
            </div>
            <div class="GroupDate" v-if="!$newActive">
              <b>报名时间</b>
              <span>{{signMsg.startDate}}</span>
            </div>
            <div class="GroupDis" v-if="!$newActive">
              <b>报名费</b>
              <span>{{v.price}}</span>
            </div>
            <div class="GroupPer" v-if="!$newActive">
              <b>招募人数</b>
              <span>{{v.peopleNum}}</span>
            </div>
            <div class="GroupConArrow" @click="showI=i"></div>
          </div>
        </template>
        <div class="GroupCon" v-if="signMsg.matchInfo">
          <ul class="liBox" v-if="!$newActive">
            <li>
              <b>赛项名称</b>
              <span>{{signMsg.matchInfo[showI].name}}</span>
            </li>
            <li>
              <b>招募人数</b>
              <span>{{signMsg.matchInfo[showI].peopleNum}}</span>
            </li>
            <!-- <li>
              <b>已报名人数</b>
              <span>666</span>
            </li> -->
            <li>
              <b>报名时间</b>
              <span>{{signMsg.startDate}}</span>
            </li>
            <li>
              <b>报名费</b>
              <span>{{signMsg.matchInfo[showI].price}}</span>
            </li>
          </ul>
          <p>
            <b>价格策略</b>
          </p>
          <el-table :data="signMsg.matchInfo[showI].priceList" border="" style="width: 100%">
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" align="center" v-if="!$newActive"></el-table-column>
            <el-table-column prop="rule" label="报名规则" align="center" v-if="!$newActive"></el-table-column>
            <el-table-column prop="price" label="价格" align="center"></el-table-column>
          </el-table>
          <div v-if="signMsg.matchInfo&&signMsg.matchInfo[showI].entryRule">
            <p>
              <b>参赛号规则</b>
            </p>
            <div class="entryTerm">
              <div class="tname">
                <span>赛项前缀</span>
              </div>
              <div class="etCon">
                <div>{{signMsg.matchInfo[showI].entryRule.prefix}}</div>
                <p class="tips">通常每个赛项都需要有不同的号码前缀。当然如果您的赛事只有一个赛项，您也可以不写前缀</p>
              </div>
            </div>
            <div class="entryTerm">
              <div class="tname">
                <span>性别前缀</span>
              </div>
              <div class="etCon">
                <div class="etIpt">
                  <el-switch
                    class="etswitch"
                    v-model="signMsg.matchInfo[showI].entryRule.ifSex"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </div>
                <p class="tips">打开性别前缀，会在号码前,赛项前缀后(如果有的话)显示M(男)或者F(女)字母用来区别男女选手</p>
              </div>
            </div>
            <div class="entryTerm">
              <div class="tname">
                <span>开始号码</span>
              </div>
              <div class="etCon">
                <div>{{signMsg.matchInfo[showI].entryRule.startNumber}}</div>
              </div>
            </div>
            <div class="entryTerm">
              <div class="tname">
                <span>号码位数</span>
              </div>
              <div class="etCon">
                <div>{{signMsg.matchInfo[showI].entryRule.numberDigit}}</div>
                <span class="tips">如果输入5则表示号码形式为'00001'这种格式</span>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  // props: ["signMsg"],
  props: {
    signMsg: {
      type: Object,
      default: {},
      matchInfo: {
        type: Array,
        default: [{}],
      },
    },
  },
  watch: {
    signMsg(val) {
      this.signMsg = val;
      this.signMsg.matchInfo.forEach((vv) => {
        // 参赛号
        let idobj = {
          matchId: vv.matchId,
          groupId: vv.groupId,
        };
        this.$axios
          .get("/match/entryNumberFactory/get", { params: idobj })
          .then((suc) => {
            let ss = suc.data.data;
            if (ss) {
              if (ss.ifSex == 1) {
                ss.ifSex = true;
              } else {
                ss.ifSex = false;
              }
              vv.entryRule = ss;
              this.$forceUpdate();
            }
          });
      });
    },
  },
  data() {
    return {
      showI: 0,
    };
  },
  methods: {},
  mounted() {},
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
        float: left;
        color: #333e5f;
      }
      > span {
        margin-left: 5px;
        color: #666666;
        &.blue {
          color: #000099e5;
          //   text-decoration: underline;
        }
      }
    }
    .GroupName {
      width: calc(20% - 10px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .GroupDate {
      width: calc(30% - 10px);
    }
    .GroupDis {
      width: calc(20% - 10px);
    }
    .GroupPer {
      width: calc(30% - 10px);
    }
    .GroupConArrow {
      width: 40px;
      height: 40px;
      background: url("/static/images/match/arrow.png") no-repeat center center;
      background-size: 50%;
      float: right;
    }
  }
  .GroupCon {
    overflow: hidden;
    width: calc(100% - 22px);
    border: 1px solid #ccc;
    //   display: flex;
    line-height: 40px;
    overflow: hidden;
    margin: 15px auto;
    border-radius: 10px;
    padding: 10px 10px;
    .liBox {
      width: 100%;
      overflow: hidden;
      li {
        width: calc(33.333% - 22px);
        float: left;
        &:nth-child(3n-1) {
          margin: 0 24px;
        }
      }
    }
    .button {
      display: block;
      margin: 10px auto;
    }
  }
}

.entryTerm {
  overflow: hidden;
  margin-top: 15px;
  > div {
    float: left;
  }
  .tname {
    margin-right: 10px;
    line-height: 40px;
    text-align: right;
  }
  .etCon {
    .etIpt {
      width: 150px;
      .etswitch {
        margin-top: 10px;
      }
    }
    .tips {
      line-height: 1;
      color: #3383ff;
    }
  }
}
</style>
