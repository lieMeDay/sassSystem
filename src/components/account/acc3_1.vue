<template>
    <!-- 个人信息 -->
    <div class="mineWrap">
        <h3 class="titBox">资料信息</h3>
        <ul class="ulli">
            <li>
                <span class="l1">企业名称：</span>
                <span class="l2">嗷嗷</span>
            </li>
            <li>
                <span class="l1">企业邮箱：</span>
                <span class="l2">嗷嗷</span>
            </li>
            <li>
                <span class="l1">联系人：</span>
                <span class="l2">嗷嗷</span>
            </li>
            <li>
                <span class="l1">证件号：</span>
                <span class="l2">嗷嗷</span>
            </li>
            <li>
                <span class="l1">手机号：</span>
                <span class="l2">嗷嗷</span>
            </li>
            <li>
                <span class="l1">联系地址：</span>
                <span class="l2">嗷嗷</span>
            </li>
            <li>
                <span class="l1">联系地址：</span>
                <span class="l2">嗷嗷</span>
            </li>
            <li>
                <span class="l1">营业执照：</span>
                <img src="//www.baidu.com/img/baidu_jgylogo3.gif" alt="">
            </li>
        </ul>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.mineWrap {
  .titBox {
    @include titBox();
  }
  .ulli {
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
    li {
      line-height: 40px;
      .l1 {
        width: 100px;
        float: left;
        text-align: right;
      }
    }
  }
}
</style>

