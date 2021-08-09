<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <div class="content">
      <v-tags></v-tags>
      <div class="content-wrap">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view :key="this.$route.path"></router-view>
          </keep-alive>
        </transition>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "./bus";
export default {
  data() {
    return {
      tagsList: [],
      collapse: false
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }
};
</script>
<style scoped>
/* .wrapper{
  min-width: 1200px;
} */
.content-box {
  /* min-width: 1000px; */
  position: absolute;
  left: 200px;
  right: 0;
  top: 70px;
  bottom: 0;
  /* overflow-y: scroll; */
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
  background: #f0f0f0;
  /* min-width: 1100px; */
  overflow-y: auto;
  scroll-behavior: smooth;
}
.content-box::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.content-box::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.content-box::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.content {
  width: auto;
  min-width: 1000px;
}

.content-box.content-collapse {
  left: 65px;
}
.content-wrap{
  padding: 10px 20px;
}
</style>

