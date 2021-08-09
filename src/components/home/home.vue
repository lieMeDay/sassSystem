<template>
    <!-- 首页看板 -->
    <div class="homePage">
        <div class="homeBox">
            <ul>
                <li class="l1">
                    <p class="p1">
                        <b>10</b>
                    </p>
                    <p class="p2">今日报名人数</p>
                </li>
                <li class="l2">
                    <p class="p1">
                        <b>10</b>
                    </p>
                    <p class="p2">今日报名人数</p>
                </li>
                <li class="l3">
                    <p class="p1">
                        <b>10</b>
                    </p>
                    <p class="p2">今日报名人数</p>
                </li>
                <li class="l4">
                    <p class="p1">
                        <b>10</b>
                    </p>
                    <p class="p2">今日报名人数</p>
                </li>
                <li class="l5">
                    <p class="p1">
                        <b>10</b>
                    </p>
                    <p class="p2">今日报名人数</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.homePage {
  @include padShow();
  .homeBox {
    // width: calc(100% - 2px);
    width: 100%;
    overflow: hidden;
    ul {
      overflow: hidden;
      li {
        width: calc(20% - 36px);
        padding: 10px;
        float: left;
        border-radius: 12px;
        color: #fff;
        &:not(:nth-child(1)) {
          margin-left: 20px;
        }
        &.l1 {
          background: linear-gradient(90deg, #0e90fe, #10b8f8);
        }
        &.l2 {
          background: linear-gradient(90deg, #FB5353, #FF8B6C);
        }
        &.l3 {
          background: linear-gradient(90deg, #20CF93, #37E9C1);
        }
        &.l4 {
          background: linear-gradient(90deg, #FFBE3D, #FFD43D);
        }
        &.l5 {
          background: linear-gradient(90deg, #FB5353, #FF8B6C);
        }
        .p1 {
          font-size: 18px;
        }
      }
    }
  }
}
</style>

