<template>
  <!-- 充值付款 -->
  <div class="reachPay">
    <h3>订单信息</h3>
    <div class="orderWrap">
      <img src="/static/images/pic.jpg" alt="">
      <div class="orderCon">
        <span class="tit">短信充值</span>
        <span>规格：50元 购买500条</span>
      </div>
      <div class="orderPN">
        <span class="pri">￥50元</span>
        <span>X1</span>
      </div>
    </div>
    <p class="tip tipsSM">1件商品 总金额 50元</p>
    <p class="tip tipsBig">应付金额 ￥50元</p>
    <h3>请选择支付方式</h3>
    <ul class="payType">
      <li :class="{'act':showI==0}" @click="showI=0">
        <span>余额支付</span>
        <b>
          <i class="el-icon-check actI"></i>
        </b>
      </li>
      <li :class="{'act':showI==1}" @click="showI=1">
        <p>
          <i class="wxIcon"></i>微信支付
        </p>
        <b>
          <i class="el-icon-check actI"></i>
        </b>
      </li>
    </ul>
    <p class="yeTip" v-if="showI==0">账户余额 ￥500元</p>
    <div class="ewmcode" v-else id="qrcode" ref="qrcode"></div>
    <span class="paybtn" v-if="showI==0">确认支付</span>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  data() {
    return {
      showI: 0,
      timer: ""
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
.reachPay {
  @include padShow();
  h3 {
    font-weight: bold;
    font-size: 20px;
  }
  .orderWrap {
    width: calc(100% - 40px);
    padding: 5px 20px;
    background: rgba(30, 66, 193, 0.1);
    border-radius: 20px;
    height: 80px;
    margin-top: 20px;
    img {
      width: 80px;
      height: 80px;
      float: left;
      margin-right: 15px;
    }
    .orderCon {
      float: left;
      //   line-height: 40px;
      span {
        display: block;
        font-size: 14px;
        color: $font-9;
      }
      span.tit {
        font-size: 18px;
        font-weight: 500;
        line-height: 50px;
        color: #000;
      }
    }
    .orderPN {
      float: right;
      margin-right: 30px;
      line-height: 80px;
      font-size: 22px;
      span.pri {
        color: #1e42c1;
        float: left;
        margin-right: 80px;
      }
    }
  }
  .tip {
    text-align: right;
    &.tipsSM {
      color: $font-9;
      font-size: 14px;
      line-height: 25px;
    }
    &.tipsBig {
      font-size: 20px;
      line-height: 30px;
    }
  }
  .payType {
    width: 100%;
    margin-top: 20px;
    display: inline-block;
    li {
      width: 200px;
      line-height: 40px;
      text-align: center;
      float: left;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0px 0px 20px 0px rgba(108, 0, 255, 0.2);
      border-radius: 15px;
      border: 3px solid transparent;
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
      b {
        display: none;
      }
      &:nth-child(3n-1) {
        margin: 0 24px;
      }
      &.act {
        color: #1e42c1;
        border-color: #1e42c1;
        background: rgba(30, 66, 193, 0.1);
        b {
          display: block;
          width: 0;
          height: 0;
          border-width: 30px 35px 0px 0;
          border-style: solid;
          border-color: transparent #1e42c1;
          position: absolute;
          bottom: 0;
          right: 0;
          .actI {
            color: #fff;
            position: absolute;
            top: -16px;
            left: 17px;
            font-size: 18px;
          }
        }
      }
    }
  }
  .yeTip,
  .ewmcode {
    font-size: 14px;
    color: $font-9;
    margin-top: 5px;
  }
  .paybtn {
    color: #fff;
    background-color: #1e42c1;
    padding: 10px 20px;
    display: inline-block;
    border-radius: 10px;
    margin-top: 10px;
    cursor: pointer;
  }
}
</style>

