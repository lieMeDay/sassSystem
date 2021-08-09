<template>
  <!-- 报名列表 -->
  <div class="upList">
    <div v-for="(item,index) in groupInfo" :key="index">
      <div class="listWrap">
        <div class="L1">
          <b>赛项名称</b>
          <span>{{item.name}}</span>
        </div>
        <div class="L2" v-if="!$newActive">
          <b>报名时间</b>
          <span v-if="!BMdate">暂无</span>
          <span v-else>{{BMdate[0]}}</span>
        </div>
        <div class="L4" v-if="!$newActive">
          <b>招募人数</b>
          <span v-if="!item.peopleNum">暂无</span>
          <span v-else>{{item.peopleNum}}人</span>
        </div>
        <div class="L3" v-if="!$newActive">
          <b>报名费</b>
          <span v-if="!item.price">暂无</span>
          <span v-else>{{item.price}}元/人</span>
        </div>
        <!-- <div class="arrow"></div> -->
      </div>
      <!-- 报名必填项 -->
      <div class="mustUp">
        <div class="titUp" v-if="!$newActive">
          <b>赛项报名设置</b>
        </div>
        <div class="mustCon" v-if="!$newActive">
          <div>
            <b>赛项名称</b>
            <span>{{item.name}}</span>
          </div>
          <div>
            <b>招募人数</b>
            <el-input
              class="width"
              placeholder="单位(人)"
              v-model="item.peopleNum"
              clearable
              @input="$forceUpdate()"
              @change="pDNum($event,index,0)"
            ></el-input>
            <!-- <input type="text" v-model="item.peopleNum"> -->
          </div>
          <div>
            <b>报名费</b>
            <el-input
              class="width"
              placeholder="单位(元/人)"
              v-model="item.price"
              clearable
              @input="$forceUpdate()"
              @change="pDNum($event,index,1)"
            ></el-input>
          </div>
        </div>
        <div class="titSm">
          <b v-if="!$newActive">优惠策略</b>
          <b v-if="$newActive">商品列表</b>
        </div>
        <table class="tab">
          <tr>
            <td>名称</td>
            <td v-if="!$newActive">类型</td>
            <td v-if="!$newActive">报名规则</td>
            <td>价格</td>
            <td>操作</td>
          </tr>
          <tr v-for="(v,d) in item.priceList" :key="d">
            <td>
              <el-input class="iptBox" v-model="v.name" placeholder="请输入内容" @input="$forceUpdate()"></el-input>
            </td>
            <td v-if="!$newActive">
              <el-select
                class="iptBox"
                v-model="v.type"
                placeholder="请选择"
                @input="$forceUpdate()"
                @change="v.rule=''"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
            <td v-if="!$newActive">
              <el-select
                v-if="v.type=='比赛次数'"
                class="iptBox"
                v-model="v.rule"
                placeholder="请选择"
                @input="$forceUpdate()"
              >
                <el-option
                  v-for="item in optionsRule"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-date-picker
                v-else
                class="iptBox"
                v-model="v.rule"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                value-format="yyyy/MM/dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                @input="$forceUpdate()"
              ></el-date-picker>
            </td>
            <td>
              <el-input
                class="iptBox"
                v-model="v.price"
                placeholder="请输入内容"
                @input="$forceUpdate()"
                @change="pDNum($event,index,3,d)"
              ></el-input>
            </td>
            <td>
              <el-button type="text" size="small" @click="delRule(index,d)">删除</el-button>
            </td>
          </tr>
          <tr>
            <td colspan="5" v-if="!$newActive" @click="addRule(index)">添加报名策略</td>
            <td colspan="5" v-if="$newActive" @click="addRule(index)">添加商品</td>
          </tr>
        </table>
        <p class="tips" v-if="!$newActive">名称可为:早鸟价,老鸟价等,且该平台收取1.2%的佣金</p>
        <!-- <p class="tips"></p> -->
        <!-- 参赛号设置 -->
        <div class="setEntry" v-if="!$newActive">
          <div class="titUp">
            <b>参赛号规则设置</b>
          </div>
          <div class="entryTerm">
            <div class="tname">
              <span>赛项前缀</span>
            </div>
            <div class="etCon">
              <el-input
                class="etIpt"
                v-model="item.prefix"
                placeholder="请输入内容"
                @input="$forceUpdate()"
                :disabled="item.nohasEdit"
              ></el-input>
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
                  v-model="item.ifSex"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="$forceUpdate()"
                  :disabled="item.nohasEdit"
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
              <el-input
                class="etIpt"
                v-model="item.startNumber"
                placeholder="请输入内容"
                :disabled="item.nohasEdit"
                @input="$forceUpdate()"
                @change="pDNum($event,index,4)"
              ></el-input>
            </div>
          </div>
          <div class="entryTerm">
            <div class="tname">
              <span>号码位数</span>
            </div>
            <div class="etCon">
              <el-input
                class="etIpt"
                v-model="item.numberDigit"
                :disabled="item.nohasEdit"
                @input="$forceUpdate()"
                placeholder="请输入内容"
              ></el-input>
              <span class="tips">如果输入5则表示号码形式为'00001'这种格式</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["groupInfo", "BMdate"],
  data() {
    return {
      input: "",
      value: "",
      value2: "",
      options: [
        {
          value: "报名时间",
          label: "报名时间",
        },
        {
          value: "比赛次数",
          label: "比赛次数",
        },
      ],
      optionsRule: [
        {
          value: "比赛次数>=1",
          label: "比赛次数>=1",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  watch: {
    groupInfo(val) {
      // console.log(val);
      this.groupInfo = val;
      this.groupInfo.forEach((vv) => {
        if (vv.matchId && vv.groupId) {
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
                vv.prefix = ss.prefix;
                vv.startNumber = ss.startNumber;
                vv.numberDigit = ss.numberDigit;
                vv.ifSex = ss.ifSex;
                // let sj = this.$nowInDateBetwen(this.BMdate[0], this.BMdate[1]);
                // if (sj != "a") {
                //   vv.nohasEdit = true;
                // }
                vv.nohasEdit = true;
                vv.entryRuleId = ss.id;
                this.$forceUpdate();
              }
            });
        }
      });
    },
  },
  methods: {
    pDNum(val, index, i, d) {
      // d ==> priceList
      if (isNaN(val)) {
        this.$confirm("请输入数字", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        }).then(() => {
          if (i === 0) {
            this.groupInfo[index].peopleNum = "";
          } else if (i == 1) {
            this.groupInfo[index].price = "";
          } else if (i === 3) {
            this.groupInfo[index].priceList[d].price = "";
          } else if (i == 4) {
            this.groupInfo[index].start_number = "";
          } else if (i == 5) {
            this.groupInfo[index].number_digit = "";
          }
          this.$forceUpdate();
        });
      }
    },
    // 向父组件发送
    putMsg() {
      // console.log(this.groupInfo);
      this.$emit("listenGroup", this.groupInfo);
    },
    // 删除规则
    delRule(i, d) {
      if (this.groupInfo[i].priceList[d].id) {
        this.$axios
          .get(
            "/match/signUp/info/price/del?id=" +
              this.groupInfo[i].priceList[d].id
          )
          .then((res) => {
            this.groupInfo[i].priceList.splice(d, 1);
          });
      } else {
        this.groupInfo[i].priceList.splice(d, 1);
      }
      this.$forceUpdate();
    },
    // 添加规则
    addRule(i) {
      console.log(this.groupInfo[i].peopleNum);
      this.groupInfo[i].priceList.push({
        name: "",
        type: "",
        rule: "",
        price: "",
      });
      this.$forceUpdate();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.upList {
  > div {
    width: calc(100% - 40px);
    padding: 20px;
    background-color: #fff;
    margin-bottom: 20px;
  }
  .listWrap {
    width: calc(100% - 22px);
    padding: 0px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    line-height: 40px;
    overflow: hidden;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    > div {
      float: left;
    }
    .L1 {
      width: calc(25% - 10px);
      width: 25%;
    }
    .L2 {
      width: calc(30% - 10px);
      width: 30%;
    }
    .L3 {
      width: calc(22% - 10px);
      width: 22%;
    }
    .L4 {
      width: calc(23% - 10px);
      width: 23%;
    }
    .arrow {
      width: 40px;
      height: 40px;
      background: url("/static/images/match/arrow.png") no-repeat center center;
      background-size: 50%;
    }
  }
}
.mustUp {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: #fff;
  .mustCon {
    width: calc(100% - 20px);
    padding: 0px 10px;
    line-height: 40px;
    overflow: hidden;
    margin: 20px 0;
    > div {
      width: 33.333%;
      float: left;
      > b {
        width: 100px;
        text-align: center;
        float: left;
      }
      .width {
        width: calc(100% - 140px);
        margin-left: 20px;
      }
    }
  }
  .titSm {
    width: 100px;
    text-align: center;
    margin-left: 10px;
  }
  .tab {
    margin-top: 15px;
    width: 100%;
    text-align: center;
    line-height: 40px;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    tr:nth-child(1) {
      background: #66b1ff;
      color: #fff;
      td:last-child {
        width: 80px;
      }
      td:nth-child(1),
      td:nth-child(2) {
        width: 150px;
      }
    }
    tr:last-child {
      cursor: pointer;
    }
    td {
      border-left: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      .iptBox {
        margin: 5px auto;
        width: 90%;
      }
    }
  }
  .tips {
    font-size: 12px;
    margin-top: 8px;
    color: #004fbf;
  }
}
.setEntry {
  margin-top: 20px;
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
    }
  }
}
</style>
