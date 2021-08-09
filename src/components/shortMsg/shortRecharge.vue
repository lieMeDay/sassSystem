<template>
  <!-- 短信充值 -->
  <div class="payWrap">
    <div class="leftBox">
      <div>
        <h3>短信充值</h3>
        <p class="tips">标准价0.1元/条，50元起充</p>
        <div class="showPrice">
          <span>价格</span>
          <span>￥{{priceList[showI].value}}</span>
        </div>
      </div>
      <div>
        <h3>规格</h3>
        <ul class="priceList">
          <li v-for="(v,i) in priceList" :key="i" :class="{'act':showI==i}" @click="showI=i">
            <span>{{v.txt}}</span>
            <b>
              <i class="el-icon-check actI"></i>
            </b>
          </li>
        </ul>
      </div>
      <div>
        <h3>数量</h3>
        <div class="NumBox">
          <el-input-number v-model="num" :min="1"></el-input-number>
        </div>
        <span class="payBtn" @click="goPay">立即购买</span>
      </div>
    </div>
    <div class="rightBox">
      <img src="/static/images/pic.jpg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      priceList: [
        {
          value: 50,
          txt: "充值50，获得500条"
        },
        {
          value: 500,
          txt: "充值500，获得5000条"
        },
        {
          value: 1000,
          txt: "充值1000，获得1万条"
        },
        {
          value: 2000,
          txt: "充值2000，获得2万条"
        },
        {
          value: 4000,
          txt: "充值4000，获得4万条"
        },
        {
          value: 5000,
          txt: "充值5000，获得5万条"
        }
      ],
      showI: 0,
      num:1
    };
  },
  methods: {
    goPay(){
      this.$router.push('/recharge/pay')
    }
  }
};
</script>

<style lang="scss" scoped>
.payWrap {
    @include padShow();
  > div {
    float: left;
    position: relative;
  }
  .leftBox {
    width: calc(70% - 20px);
    // max-width: 750px;
    h3 {
      font-weight: bold;
      font-size: 18px;
    }
    .tips {
      font-size: 14px;
      line-height: 30px;
    }
    .showPrice {
      width: calc(100% - 30px);
      padding: 0 15px;
      line-height: 50px;
      background: rgba(30, 66, 193, 0.1);
      border-radius: 20px;
      color: #1e42c1;
      margin: 10px 0;
      font-size: 18px;
    }
    // 价格列表
    .priceList {
      width: 100%;
      margin-top: 20px;
      li {
        width: calc(33.333% - 22px);
        margin-bottom: 20px;
        line-height: 40px;
        text-align: center;
        float: left;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0px 0px 20px 0px rgba(108, 0, 255, 0.2);
        border-radius: 15px;
        border: 3px solid transparent;
        b {
          display: none;
        }
        &:nth-child(3n-1) {
          margin: 0 24px;
        }
        &.act {
          color: #1E42C1;
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
    //计数器
    .NumBox{
        margin: 15px 0;
      >>>.el-input-number{
        width: 200px;
        .el-input-number__decrease,
        .el-input-number__increase{
          border: none;
          border-radius: 50%;
          // width: 45px;
          // height: 45px;
          // line-height: 45px;
          font-size: 24px;
          color: #fff;
          background-color: #EEEEEE;
        }
        .el-input__inner{
          width: 100px;
          margin-left: 50px;
          padding: 0;
          // height: 45px;
        }
      }
    }
    .payBtn{
      background-color: #ff6853;
      color: #fff;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      display: inline-block;
    }
  }
  .rightBox {
    width: 30%;
    // min-width: 240px;
    margin-left: 20px;
    // float: right;
    img{
      width: 100%;
    }
  }
}
</style>

