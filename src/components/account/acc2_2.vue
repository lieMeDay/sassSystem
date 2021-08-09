<template>
    <!-- 报名款提现 -->
    <div class="getMoneyWrap">
        <h3 class="titBox">提现</h3>
        <ul class="list">
            <li>
                <span class="l1">银行卡号：</span>
                <span>111111</span>
            </li>
            <li>
                <span class="l1">可提现金额：</span>
                <span class="orig">￥1222</span>元
            </li>
            <li>
                <span class="l1">提现金额：</span>
                <input class="ipt" type="number">元
            </li>
            <li>
                <span class="l1">手续费：</span>
                <span  class="orig">￥1222</span>元
            </li>
        </ul>
        <button class="btn">立即提现</button>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.getMoneyWrap {
  .titBox {
    @include titBox();
  }
  .list {
    width: 100%;
    overflow: hidden;
    li {
      line-height: 40px;
      .l1{
          float: left;
          width: 100px;
          margin-right: 20px;
          text-align: right;
      }
      .orig{
          color: #FF721F;
      }
      
      .ipt {
          width: 150px;
          border: 1px solid #CCCCCC;
        height: 28px;
        padding: 0 8px;
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
  .btn{
      background-color: #FF721F;
      color: #fff;
      padding: 5px 15px;
      cursor: pointer;
  }
}
</style>

