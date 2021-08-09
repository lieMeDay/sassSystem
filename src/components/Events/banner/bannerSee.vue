<template>
  <!-- 轮播添加修改 -->
  <div class="BW">
    <div class="b">
      <span class="t">图片:</span>
      <div class="box">
          <img :src="msg.imgUrl" alt="" class="bannerPic">
      </div>
    </div>
    <div class="b">
      <span class="t">显示时间:</span>
      <div class="box bx" v-if="msg.date">
          {{msg.date[0]}}至{{msg.date[1]}}
      </div>
    </div>
    <div class="b">
      <span class="t">文本内容:</span>
      <div class="box infoB">
          <div v-html="msg.infos"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        msg:{}
    };
  },
  methods: {
  },
  mounted () {
    this.id=this.$route.query.id
    if(this.id){
      this.$axios.get("/slideshow/getSlideshowById?id="+this.id).then(res=>{
        let rr=res.data.data
        this.msg.imgUrl=rr.imgUrl
        this.msg.date=[rr.startTime,rr.endTime]
        this.msg.infos=rr.infos
        this.$forceUpdate()
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.BW {
  @include padShow();
}
.bannerPic{
  max-width: 320px;
  max-height: 162px;
  width: 100%;
}
.b {
  width: 100%;
  overflow: hidden;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  .t {
    float: left;
    width: 80px;
    text-align: center;
    line-height: 40px;
  }
  .infoB {
    width: 100%;
    float: left;
  }
}
.bx{
    line-height: 40px;
}
.changeLogo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 101px;
  &:hover {
    border-color: #409eff;
  }
  .chooseIpt {
    position: absolute;
    width: 200px;
    height: 101px;
    opacity: 0;
    top: 0;
    left: 0;
  }
}
.avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 200px;
  height: 101px;
  line-height: 101px;
  text-align: center;
}
.seeLogo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 101px;
  img {
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -1;
    color: white;
    background-color: rgba($color: #000, $alpha: 0.4);
  }
  &:hover .avatar-uploader-icon {
    z-index: 2;
    opacity: 1;
  }
}
.sb {
  display: block;
  margin: 0 auto;
}
</style>
