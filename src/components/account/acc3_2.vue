<template>
    <!-- 银行卡管理 -->
    <div class="cardAD">
        <h3 class="titBox">银行卡管理</h3>
        <ul class="cardList">
            <li>
                <p class="tit">
                    <i class="iLogo"></i>
                    <b>招商银行</b>
                    <span class="stateC">设为默认卡</span>
                    <span class="delC">删除</span>
                </p>
                <p class="CardNum">
                    <span>6223</span>
                    <span>****</span>
                    <span>****</span>
                    <span>6666</span>
                </p>
                <p class="txt">
                    开户行：
                    <span>招商银行</span>
                </p>
            </li>
            <li>
                <p class="tit">
                    <i class="iLogo"></i>
                    <b>招商银行</b>
                    <span class="stateC">设为默认卡</span>
                    <span class="delC">删除</span>
                </p>
                <p class="CardNum">
                    <span>6223</span>
                    <span>****</span>
                    <span>****</span>
                    <span>6666</span>
                </p>
                <p class="txt">
                    开户行：
                    <span>招商银行</span>
                </p>
            </li>
            <li class="addLi">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.cardAD {
  .titBox {
    @include titBox();
  }
  .cardList {
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
    color: #fff;
    li {
      cursor: default;
      float: left;
      width: 235px;
      height: 95px;
      padding: 15px;
      border-radius: 10px;
      background: linear-gradient(
        90deg,
        rgba(70, 182, 254, 1) 0%,
        rgba(34, 86, 253, 1) 100%
      );
      box-shadow: 0px 15px 22px 6px rgba(43, 110, 253, 0.1);
      border: 1px solid #2256fd;
      @media screen and (max-width: 1350px) {
        &:nth-child(2n) {
          margin: 0 35px;
          margin-bottom: 10px;
        }
      }
      @media screen and (min-width: 1350px) {
        &:nth-child(3n-1) {
          margin: 0 35px;
          margin-bottom: 10px;
        }
      }
      margin-bottom: 10px;
      &.addLi {
        background: #fff;
        border: 1px solid #2256fd;
          text-align: center;
          cursor: pointer;
        i {
          font-size: 80px;
          line-height: 95px;
          color: #2256FD;
        }
      }
      .tit {
        line-height: 30px;
        overflow: hidden;
        > * {
          float: left;
          margin-left: 5px;
        }
        .iLogo {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: pink;
          margin-left: 0;
        }
        b {
          font-weight: normal;
        }
        span {
          float: right;
          font-size: 14px;
          opacity: 0.8;
          cursor: pointer;
        }
      }
      .CardNum {
        line-height: 40px;
        font-size: 18px;
        display: flex;
        span {
          flex: 1;
        }
      }
      .txt {
        font-size: 14px;
      }
    }
  }
}
</style>

