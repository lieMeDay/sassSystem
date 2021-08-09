<template>
  <!-- 查看报名详情 -->
  <div class="seeSignUP">
    <matchMsg :matchMsg="matchMsg"></matchMsg>
    <GroupMsg :signMsg="signMsg"></GroupMsg>
  </div>
</template>

<script>
import matchMsg from "../../components/component/match/see_1";
import GroupMsg from "../../components/component/signUp/see_2";
export default {
  components: {
    matchMsg,
    GroupMsg,
  },
  data() {
    return {
      matchMsg: {},
      signMsg: {},
    };
  },
  methods: {
    getMatchMsg() {
      // console.log(this.$route.query.id)
      let obj = { matchId: this.$route.query.id };
      this.$axios.get("/match/getMatchById", { params: obj }).then((res) => {
        this.matchMsg = res.data.data;
        this.$axios
          .get("/match/signUp/get?id=" + this.$route.query.i)
          .then((res) => {
            let rr = res.data.data;
            if(!this.$newActive){
            rr.matchInfo.forEach((vv, ii) => {
              vv.priceList.forEach((v, i) => {
                v.rule = JSON.parse(v.rule);
                if (typeof v.rule == "object") {
                  v.rule = v.rule[0] + "-" + v.rule[1];
                }
              });
            });
            }
            this.signMsg = rr;
          });
      });
    },
  },
  created() {
    this.getMatchMsg();
  },
};
</script>

<style lang="scss" scoped>
</style>

