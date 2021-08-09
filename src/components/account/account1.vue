<template>
    <!-- 账户管理 -->
    <div>
        <el-button type="primary" @click="getCode">获取二维码</el-button>
        <div id="qrcode" ref="qrcode"></div>
        <!-- <div class="EWcodeBox" v-if="showCode">
            <div class="codeBox">
                <i class="el-icon-circle-close closeCode" @click="showCode=''"></i>
                <img class="imgCode" src="" alt="">
            </div>
        </div>-->
    </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  data() {
    return {
      showCode: "",
      timer:''
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
    },
    getCode() {
      this.$axios
        .post("/zhifu", {
          ip: "192.168.1.1",
          totalFee: 1
        })
        .then(res => {
            this.qrcode(res.data.code_url);
            let obj={
                appid:res.data.appid,
                mch_id:res.data.mch_id,
                out_trade_no:res.data.orderNum,
                nonce_str:res.data.nonce_str,
                sign:res.data.sign
            }
            // // 定时查询是否支付成功
            // this.timer = setInterval(() => {
            //   this.queryIsPay(obj);
            // }, 3000);
        });
    },
    // 微信支付查询是否支付成功
    queryIsPay(obj) {
        // console.log(11)
        // this.$axios.get('https://api.mch.weixin.qq.com/pay/orderquery',{params:obj}).then(res=>{
        //     console.log(res)
        //     // if(res.data.code==)
        // }).catch(err=>{
        //    this.closeWXpay() 
        // })
    },
    // 关闭弹窗清除轮询
    closeWXpay() {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  mounted() {
    console.log(returnCitySN["cip"]);
  }
};
</script>

<style lang="scss" scoped>
.EWcodeBox {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  .codeBox {
    width: 300px;
    height: 420px;
    background-color: #fff;
    @include hs_center();
    .closeCode {
      width: 20px;
      height: 20px;
      font-size: 20px;
      cursor: pointer;
      float: right;
    }
    .imgCode {
      width: 300px;
      height: 400px;
    }
  }
}
</style>

