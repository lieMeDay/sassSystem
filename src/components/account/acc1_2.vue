<template>
    <!-- 充值 -->
    <div class="payWrap">
        <h3 class="accTit">选择充值金额</h3>
        <ul class="listCon">
            <li
                v-for="(v,i) in monList"
                :key="i"
                :class="{'act':actI==i}"
                @click="actI=i,Num==''?'':Num=''"
            >
                <span>{{v.txt}}</span>
            </li>
            <li :class="{'act':actI==monList.length}">
                <input
                    class="ipt"
                    v-model="Num"
                    type="number"
                    @focus="actI=monList.length"
                    placeholder="请输入金额"
                >
            </li>
        </ul>
        <h3 class="accTit">充值</h3>
        <ul class="payType">
            <li class="act">
                <p>
                    <i class="wxIcon"></i>微信支付
                </p>
            </li>
        </ul>
        <div id="qrcode" ref="qrcode"></div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      monList: [
        {
          val: 500,
          txt: "￥500元"
        },
        {
          val: 2000,
          txt: "￥2000元"
        },
        {
          val: 4000,
          txt: "￥4000元"
        }
      ],
      actI: 0,
      Num: "",
      payNum: ""
    };
  },
  methods: {
    qrcode(vv) {
      this.$nextTick(() => {
        let qrcode = new QRCode("qrcode", {
          width: 200, // 二维码宽度，单位像素
          height: 200, // 二维码高度，单位像素
          text: vv, // 生成二维码的链接
          colorDark: "#000",
          colorLight: "#fff"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.payWrap {
  width: 100%;
  .accTit {
    line-height: 40px;
  }
  .listCon {
    width: 100%;
    padding: 20px 0;
    overflow: hidden;
    li {
      float: left;
      line-height: 40px;
      overflow: hidden;
      width: 100px;
      text-align: center;
      cursor: pointer;
      margin-left: 20px;
      box-shadow: 0px 0px 20px 0px rgba(108, 0, 255, 0.2);
      border-radius: 15px;
      border: 3px solid transparent;
      &.act {
        color: #1e42c1;
        border-color: #1e42c1;
        background: #1e42c11a;
      }
      //   >>> .el-input__inner {
      //     border: none;
      //     background-color: transparent;
      //     &input::-webkit-outer-spin-button,
      //     &input::-webkit-inner-spin-button,
      //     &input::-webkit-outer-spin-button:hover,
      //     &input::-webkit-inner-spin-button:hover {
      //       -webkit-appearance: none;
      //     }

      //     &input[type="number"],
      //     &input[type="number"]:hover {
      //       -moz-appearance: textfield;
      //     }
      //   }
      .ipt {
        width: 100%;
        height: 40px;
        text-align: center;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
  .payType {
    width: 100%;
    padding: 20px 0;
    overflow: hidden;
    li {
      float: left;
      line-height: 40px;
      overflow: hidden;
      width: 150px;
      text-align: center;
      cursor: pointer;
      margin-left: 20px;
      box-shadow: 0px 0px 20px 0px rgba(108, 0, 255, 0.2);
      border-radius: 15px;
      border: 3px solid #1e42c1;
      color: #1e42c1;
      background: #1e42c11a;
      p {
        width: 100px;
        margin: 0 auto;
        i.wxIcon {
          float: left;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 6px;
          background: url("/static/images/wxPay.png") no-repeat center center;
          background-size: contain;
        }
      }
    }
  }
}
</style>

