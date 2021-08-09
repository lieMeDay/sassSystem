<template>
  <div>
    <matchMsg :matchMsg="matchMsg"></matchMsg>
    <group-msg :matchMsg="matchMsg"></group-msg>
    <div class="int">
      <div class="J" :class="{'l':!matchMsg.certificateId}">
        <div class="titBox">
          <span>赛事介绍</span>
        </div>
        <div class="ql-snow nr">
          <div class="ql-editor" v-html="matchMsg.introduce"></div>
        </div>
      </div>
       <!-- v-if="!$newActive" -->
      <div class="P" v-show="matchMsg.certificateId">
        <div class="titBox">
          <span>完赛证明模板</span>
        </div>
        <div class="pBox" ref="wsPB">
          <img :src="wsPic" alt />
          <span
            class="pt"
            v-for="(v,i) in txtList"
            :key="i"
            :style="{left:v.trueX+'px',top:v.trueY+'px',fontSize:v.fontSize+'px',color:v.fontColor}"
          >{{v.val}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import matchMsg from "../../components/component/match/see_1";
import groupMsg from "../../components/component/match/see_2";
export default {
  components: {
    matchMsg,
    groupMsg
  },
  data() {
    return {
      matchMsg: {},
      wsPic: "",
      txtList: [],
      cerVal: {}
    };
  },
  methods: {
    getMatchMsg() {
      // console.log(this.$route.query.id)
      let obj = { matchId: this.$route.query.id };
      this.$axios.get("/match/getMatchById", { params: obj }).then(res => {
        this.matchMsg = res.data.data;
        this.matchMsg.state=this.matchMsg.state==0?true:false
        this.matchMsg.atWill=this.matchMsg.atWill==1?true:false
        if (this.matchMsg.certificateId) {
          let swsPic = { id: this.matchMsg.certificateId };
          this.$axios
            .get("/match/certificate/get", { params: swsPic })
            .then(suc => {
              this.cerVal = suc.data.data;
              this.wsPic = suc.data.data.imgUrl;
              let str = JSON.parse(suc.data.data.items);
              // console.log(str);
              var img = new Image();
              img.src = suc.data.data.imgUrl;
              let height = suc.data.data.height;
              let width = suc.data.data.width;
              img.onload = () => {
                this.onRes(str, width, height);
              };
            });
        }
      });
    },
    onRes(arr, ww, hh) {
      let w = this.$refs.wsPB.offsetWidth;
      let h = this.$refs.wsPB.offsetHeight;
      // console.log(w, h);
      arr.forEach((v, i) => {
        v.trueX = (v.left / ww) * w;
        v.trueY = (v.top / hh) * h;
        v.fontSize = parseInt(v.fontSize * ((w / ww + h / hh)/2));
      });
      this.txtList = arr;
    }
  },
  mounted() {
    let that = this;
    window.onresize = function() {
      if (that.cerVal.items) {
        let str = JSON.parse(that.cerVal.items);
        let ww = that.cerVal.width;
        let hh = that.cerVal.height;
        that.onRes(str, ww, hh);
      }
    };
  },
  created() {
    this.getMatchMsg();
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="scss" scoped>
.int {
  width: calc(100% - 40px);
  background-color: #fff;
  margin-bottom: 15px;
  padding: 20px;
  overflow: hidden;
  .J,.P {
    width: calc(50% - 10px);
    float: left;
  }
  .nr{
    max-height: 600px;
    overflow: auto;
    
        // 滚动条样式
        &::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
       
        &::-webkit-scrollbar-thumb {
            @include scrollCss-thumb()
        }

        &::-webkit-scrollbar-track {
            @include scrollCss-track()
        }
  }
  .P {
    float: right;
    .pBox {
      overflow: hidden;
      position: relative;
    }
    .pt {
      position: absolute;
      line-height: initial;
    }
    img {
      width: 100%;
      height: 100%;
      float: left;
    }
  }
  .titBox {
    @include titBox();
  }
}
.int .l{
  width: 100%;
}
</style>
