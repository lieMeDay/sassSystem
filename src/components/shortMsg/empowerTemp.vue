<template>
    <!-- 短信签名/模板 -->
    <div class="editWrap">
        <div class="editTit">
            <span :class="{'act':isShow==0}" @click="isShow=0">短信签名</span>
            <span :class="{'act':isShow==1}" @click="isShow=1">短信模板</span>
        </div>
        <div>
            <empower v-show="isShow==0"></empower>
            <temp v-show="isShow==1"></temp>
        </div>
    </div>
</template>

<script>
import empower from "./empowerList";
import temp from "./tempList";
export default {
  components: {
    empower,
    temp
  },
  data() {
    return {
      isShow: 0,
      matchMsg: {}
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/match/edit";
</style>

