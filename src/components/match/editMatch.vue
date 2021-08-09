<template>
  <!-- 赛事修改 -->
  <div class="editWrap">
    <div class="editTit">
      <!-- getMatchMsg() -->
      <span :class="{'act':isShow==0}" @click="isShow=0;isCom='edit1'">赛事信息</span>
      <span :class="{'act':isShow==1}" @click="isShow=1;isCom='edit2'">赛项信息</span>
      <!-- <span :class="{'act':isShow==2}" @click="isShow=2;isCom='notice'">赛事公告</span> -->
    </div>
    <div>
      <!-- 组件显示的位置，利用is属性的特性，实现动态切换组件 -->
      <edit1 ref="match" v-if="isShow==0" :matchMsg="matchMsg" :cerVal="cerVal"></edit1>
      <edit2 v-if="isShow==1" :matchMsg="matchMsg"></edit2>
      <!-- <notice v-if="isShow==2"></notice> -->
       <!-- :matchId="matchMsg.id" -->
    </div>
  </div>
</template>

<script>
import edit1 from "../component/match/edit_1";
import edit2 from "../component/match/edit_2";
// import notice from "../component/match/notice"
export default {
  components: {
    edit1,
    edit2,
    // notice
  },
  data() {
    return {
      isShow: 0,
      isCom: "edit1",
      matchMsg: {},
      cerVal: {}
    };
  },
  methods: {
    getMatchMsg() {
      // console.log(this.$route.query.id)
      let obj = { matchId: this.$route.query.id };
      this.$axios.get("/match/getMatchById", { params: obj }).then(res => {
        // console.log(res.data.data)
        res.data.data.newPlace = res.data.data.place.split("-");
        let s = [];
        res.data.data.cpInfos.forEach(vv => {
          let yNum = vv["name"].replace(/[^0-9]/gi, "");
          if (yNum != "") {
            s.push(parseInt(yNum));
          }
        });
        // console.log(s);
        res.data.data.cp = s.length;
        res.data.data.matchInfo.forEach(arr => {
          let s = [];
          arr.info.forEach(vv => {
            let yNum = vv["name"].replace(/[^0-9]/gi, "");
            if (yNum != "") {
              s.push(parseInt(yNum));
            }
          });
          arr.cp = s.length;
        });
        // res.data.data.cp=
        this.matchMsg = res.data.data;
        if(this.matchMsg.state==0){
          this.matchMsg.state=true
        }else{
          this.matchMsg.state=false
        }
        if(this.matchMsg.atWill==1){
          this.matchMsg.atWill=true
        }else{
          this.matchMsg.atWill=false
        }
        if (this.matchMsg.certificateId) {
          let swsPic = { id: this.matchMsg.certificateId };
          this.$axios
            .get("/match/certificate/get", { params: swsPic })
            .then(suc => {
              this.cerVal = suc.data.data;
            });
        }
        if (this.isShow == 0) {
          this.$refs.match.$refs.getContent.content = res.data.data.introduce;
        }
      });
    }
  },
  mounted() {
    this.getMatchMsg();
    // let divTop = document.getElementsByClassName("content-box")[0];
    // console.log(divTop.scrollTop);
    // divTop.scrollTop = 0;
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/match/edit";
</style>

