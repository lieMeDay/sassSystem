<template>
    <!-- 报名信息/审核 -->
    <div class="editWrap">
        <!-- <div class="editTit">
            <span :class="{'act':isShow==0}" @click="isShow=0">报名信息</span>
            <span :class="{'act':isShow==1}" @click="isShow=1">报名审核</span>
        </div> -->
        <div>
            <singMsg v-show="isShow==0"></singMsg>
            <!-- <singExa v-show="isShow==1"></singExa> -->
        </div>
    </div>
</template>

<script>
import singMsg from "./seeSignUp";
import singExa from "./signUpExa";
export default {
  components: {
    singMsg,
    singExa
  },
  data() {
    return {
      isShow: 0,
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/match/edit";
</style>

