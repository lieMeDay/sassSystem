<template>
    <!-- 短信充值详情 -->
    <div class="recharge">
        <div class="detailBox">
            <div class="only">
                <span class="red">0条</span>
                <span class="tips">剩余短信条数</span>
            </div>
            <div class="cz gcz" @click="go_cz">
                <i></i>
                <span>短信充值</span>
            </div>
            <div class="cz scz" @click="go_jl">
                <i></i>
                <span>充值记录</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    go_cz() {
      this.$router.push("/recharge/shortRecharge");
    },
    go_jl() {
      this.$router.push("/recharge/detail");
    }
  }
};
</script>

<style lang="scss" scoped>
.recharge {
  @include padShow();
  .detailBox {
    width: 100%;
    overflow: hidden;
    > div {
      //   width: calc(33.333% - 1px);
      float: left;
      height: 80px;
      //   text-align: center;
      font-size: 20px;
      color: #fff;
      //   &:nth-child(1),
      //   &:nth-child(2) {
      //     // border-right: 1px solid #ccc;
      //   }
      &.only {
        width: 200px;
        padding: 0 20px;
        // font-size: 25px;
        background: linear-gradient(
          90deg,
          rgba(14, 144, 254, 1),
          rgba(16, 184, 248, 1)
        );
        // > * {
        //   float: left;
        // }
        .red {
          //   color: red;
          font-size: 28px;
          //   margin-left: 20px;
          display: block;
          line-height: 50px;
        }
        .tips{
            font-size: 14px;
        }
      }
      //   i{
      //       width: 100%;
      //       height: 100px;
      //       float: left;
      //   }
      &.gcz {
        width: 260px;
        padding: 0 20px;
        line-height: 80px;
        margin-left: 20px;
        background: linear-gradient(
          90deg,
          rgba(251, 83, 83, 1),
          rgba(255, 139, 108, 1)
        );
        box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.2);
        //   color: red;
        cursor: pointer;
        //   i{
        //       background: url('/static/images/d.png') no-repeat center center;
        //       background-size: 20%;
        //   }
      }
      &.scz {
        width: 260px;
        padding: 0 20px;
        line-height: 80px;
        margin-left: 20px;
        background: linear-gradient(
          90deg,
          rgba(32, 207, 147, 1),
          rgba(55, 233, 193, 1)
        );
        box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        //   i{
        //       background: url('/static/images/dd.png') no-repeat center center;
        //       background-size: 20%;
        //   }
      }
    }
  }
}
</style>

