<template>
  <!-- 查看赛事 -->
  <div class="matchMsg">
    <div class="titBox">
      <span>赛事基本信息</span>
    </div>
    <div class="detailBox">
      <div class="leftBox">
        <ul>
          <li>
            <div>
              <span>赛事名称</span>
            </div>
            <span class="blueCon">{{matchMsg.name}}</span>
          </li>
          <li>
            <div>
              <span>赛事类型</span>
            </div>
            <span class="blueCon">{{matchMsg.type=='M'?'马拉松':matchMsg.type=='Y'?'越野赛':matchMsg.type=='TB'?'登山徒步':matchMsg.type=='Z'?'自驾游':'活动招募'}}</span>
          </li>
          <li>
            <div>
              <span>赛事开始</span>
            </div>
            <span class="blueCon">{{matchMsg.matchDate}}</span>
          </li>
          <li>
            <div>
              <span>赛事结束</span>
            </div>
            <span class="blueCon">{{matchMsg.matchEndDate}}</span>
          </li>
          <li>
            <div>
              <span>赛事地点</span>
            </div>
            <span class="blueCon">{{matchMsg.place}}</span>
          </li>
          <li v-if="matchMsg.type=='A'">
            <div>
              <span>赛事规模</span>
            </div>
            <span class="blueCon">{{matchMsg.scale}}</span>
          </li>
          <li v-show="!$newActive">
            <div>
              <span>移动端显示</span>
            </div>
            <el-switch class="swBtn" v-model="matchMsg.state" active-color="#13ce66" :disabled="true"></el-switch>
          </li>
          <li  v-show="!$newActive">
            <div>
              <span>任意报名</span>
            </div>
            <el-switch class="swBtn" v-model="matchMsg.atWill" active-color="#13ce66" :disabled="true"></el-switch>
          </li>
        </ul>
      </div>
      <div class="rightBox">
        <div>
          <div class="rightTit">
            <span>赛事封面</span>
          </div>
          <div class="picNR">
            <img :src="matchMsg.logo" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["matchMsg"],
};
</script>

<style lang="scss" scoped>
.matchMsg {
  width: calc(100% - 40px);
  background-color: #fff;
  margin: 15px auto;
  padding: 20px;
  overflow: hidden;
  .titBox {
    @include titBox();
  }

  .leftBox,
  .rightBox {
    width: calc(50% - 10px);
    float: left;
    overflow: hidden;
  }
  .leftBox {
    ul {
      width: 100%;
      overflow: hidden;
      margin-top: 20px;

      li {
        width: 100%;
        position: relative;
        // margin-bottom: 20px;
        display: flex;
        line-height: 40px;

        div {
          @include nameTit();
        }
        .blueCon {
          color: #3383ff;
          float: left;
          width: calc(100% - 100px);
          @include ellipsis();
        }
      }
    }
  }

  .rightBox {
    float: right;

    > div {
      margin-top: 20px;
      line-height: 40px;

      > .rightTit {
        // @include nameTit();
        line-height: 40px;
      }

      .picNR {
        // @include detailconBox();
        max-width: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .botBox {
    float: left;
    border: 1px solid #ccc;
    width: calc(100% - 42px);
    padding: 20px;
    border-radius: 10px;
    max-height: 200px;
    overflow: auto;
  }
}
.swBtn{
  margin-top: 10px;
}
</style>
