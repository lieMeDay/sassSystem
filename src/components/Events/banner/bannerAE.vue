<template>
  <!-- 轮播添加修改 -->
  <div class="BW">
    <div class="b">
      <span class="t">图片</span>
      <div class="box">
        <div class="changeLogo" v-if="!imgUrl">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <input type="file" class="chooseIpt" @change="upImg">
        </div>
        <div v-else class="seeLogo">
          <img :src="imgUrl" alt="">
          <span class="avatar-uploader-icon">
            <i class="el-icon-delete" @click="imgUrl=''"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="b">
      <span class="t">显示时间</span>
      <div class="box">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
    </div>
    <div class="b">
      <span class="t">文本内容</span>
      <div class="box infoB">
        <RichTxt ref="getContent"></RichTxt>
      </div>
    </div>
    <div class="b">
      <el-button type="primary" class="sb" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
//富文本
import RichTxt from "../../component/editor/editor";
export default {
  components: {
    RichTxt,
  },
  data() {
    return {
      id:'',
      imgUrl: "",
      date: "",
    };
  },
  methods: {
    upImg(e) {
      this.imgUrl = "";
      if (e) {
        let file = e.target.files[0];
        let param = new FormData(); //创建form对象
        param.append("img", file); //通过append向form对象添加数据
        // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers: { "Content-Type": "multipart/form-data" },
        }; //添加请求头
        this.$axios
          .post("/match/uploadImg", param, config)
          .then((res) => {
            this.imgUrl = res.data.data.filePath;
            this.$forceUpdate();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    save() {
      if (this.imgUrl == "") {
        this.$message.warning("请上传图片");
      } else if (this.date == "" || this.date.length <= 0) {
        this.$message.warning("请选择日期");
      } else {
        let obj = {
          orgId: window.sessionStorage.getItem("orgId"),
          imgUrl: this.imgUrl,
          infos: this.$refs.getContent.content,
          addTime: new Date().getTime(),
          startTime: this.date[0],
          endTime: this.date[1],
        };
        if (this.$route.query.id) {
          //修改保存
          obj.id=this.id
          this.bsave(obj)
        } else {
          // 直接保存
          this.asave(obj);
        }
      }
    },
    asave(obj) {
      this.$axios.post("/slideshow/addSlideshow", obj).then((res) => {
        this.$alert("保存成功", "提示", {
          confirmButtonText: "确定",
          showClose: false,
          closeOnClickModal: false,
          type: "success",
          callback: (action) => {
            if (action == "confirm") {
              this.$router.push("/banner");
            }
          },
        });
      });
    },
    bsave(obj) {
      this.$axios.put("/slideshow/putSlideshow", obj).then((res) => {
        this.$alert("修改成功", "提示", {
          confirmButtonText: "确定",
          showClose: false,
          closeOnClickModal: false,
          type: "success",
          callback: (action) => {
            if (action == "confirm") {
              this.$router.push("/banner");
            }
          },
        });
      });
    },
  },
  mounted () {
    this.id=this.$route.query.id
    if(this.id){
      this.$axios.get("/slideshow/getSlideshowById?id="+this.id).then(res=>{
        let rr=res.data.data
        this.imgUrl=rr.imgUrl
        this.date=[rr.startTime,rr.endTime]
        this.$refs.getContent.content=rr.infos
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.BW {
  @include padShow();
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
