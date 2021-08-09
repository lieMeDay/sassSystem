<template>
    <!-- 账户管理 -->
    <div class="accountWrap">
        <div class="accountList">
            <div v-for="(v,i) in accountList" :key="i">
                <h3>{{v.tit}}</h3>
                <p
                    v-for="(d,n) in v.con"
                    :key="n"
                    :class="{'act':act==i+','+n}"
                    @click="act=i+','+n"
                >{{d}}</p>
            </div>
        </div>
        <div class="accountCon">
            <acc_1 v-if="act=='0,0'" @act="toshow"></acc_1>
            <acc1_2 v-if="act=='0,1'"></acc1_2>
            <acc2_1 v-if="act=='1,0'" @act="toshow"></acc2_1>
            <acc2_2 v-if="act=='1,1'"></acc2_2>
            <acc2_3 v-if="act=='1,2'"></acc2_3>
            <acc3_1 v-if="act=='2,0'"></acc3_1>
            <acc3_2 v-if="act=='2,1'"></acc3_2>
        </div>
    </div>
</template>

<script>
import acc_1 from "./myAccount";
import acc1_2 from "./acc1_2";
import acc2_1 from "./acc2_1";
import acc2_2 from "./acc2_2";
import acc2_3 from "./acc2_3";
import acc3_1 from "./acc3_1";
import acc3_2 from "./acc3_2";
export default {
  components: {
    acc_1,
    acc1_2,
    acc2_1,
    acc2_2,
    acc2_3,
    acc3_1,
    acc3_2
  },
  data() {
    return {
      accountList: [
        {
          tit: "我的账户",
          con: ["我的账户", "账户充值"]
        },
        {
          tit: "报名款管理",
          con: ["我的报名款", "提现", "提现记录"]
        },
        {
          tit: "账户信息",
          con: ["个人信息", "银行卡管理", "安全管理"]
        }
      ],
      act: "0,0"
    };
  },
  methods: {
    toshow(val) {
      this.act = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.accountWrap {
  @include padShow();
  .accountList {
    width: 180px;
    line-height: 40px;
    text-align: center;
    margin-right: 20px;
    float: left;
    h3 {
      font-weight: 600;
      font-size: 16px;
      background-color: #cccccc;
    }
    p {
      cursor: pointer;
      font-size: 14px;
      background-color: #e4e4e4;
      &.act {
        color: #003399;
      }
    }
  }
  .accountCon {
    width: calc(100% - 200px);
    overflow: hidden;
  }
}
</style>

