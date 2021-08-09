<template>
  <!-- 新建短信授权 -->
  <div class="shortTemp">
    <div class="tempBox">
      <div class="temptitBox">
        <span>新增签名</span>
        <i class="el-icon-close close" @click="hiddenMe"></i>
      </div>
      <ul>
        <li>
          <span>签名名称：</span>
          <el-input class="width" v-model="obj.signName" placeholder="请输入内容"></el-input>
        </li>
        <li>
          <span>授权证书：</span>
          <div class="width">
            <div class="borderBtn" v-if="obj.delegated==''">
              <i class="el-icon-plus addIcon"></i>
              <input type="file" @change="upImg($event,1)" accept="image/*">
            </div>
            <div class="borderBtn" v-else>
              <img :src="obj.delegated" alt="">
            </div>
          </div>
        </li>
        <li>
          <span>证明文件：</span>
          <div class="width">
            <div class="borderBtn" v-if="obj.prove==''">
              <i class="el-icon-plus addIcon"></i>
              <input type="file" @change="upImg($event,2)" accept="image/*">
            </div>
            <div class="borderBtn" v-else>
              <img :src="obj.prove" alt="">
            </div>
          </div>
        </li>
        <li>
          <span></span>
          <el-button type="primary" @click="saveSign">保存</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        signName: "",
        delegated: "",
        prove: ""
      }
    };
  },
  methods: {
    hiddenMe() {
      let emp = { state: false, hasSave: false };
      this.$emit("showbox", emp);
    },
    // 上传图片
    upImg(e, i) {
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append("img", file); //通过append向form对象添加数据
      // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //添加请求头
      this.$axios
        .post("/match/uploadImg", param, config)
        .then(res => {
          if (i == 1) {
            this.obj.delegated = res.data.data.filePath;
          } else {
            this.obj.prove = res.data.data.filePath;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveSign() {
      let orgId = window.sessionStorage.getItem('orgId')
      if (
        this.obj.signName == "" ||
        this.obj.delegated == "" ||
        this.obj.prove == ""
      ) {
        this.$message.warning("请填写完整信息");
      } else {
        this.obj.orgId = orgId;
        console.log(this.obj);
        this.$axios
          .post("/game/msg/sign/add", this.obj)
          .then(res => {
            let emp = { state: false, hasSave: true };
            this.$emit("showbox", emp);
          })
          .catch(err => {
            console.log(err);
            this.$message.warning("保存失败");
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shortTemp {
  background-color: #fff;
  width: 400px;
  padding: 20px;
  overflow: hidden;
  @include hs_center();
  border-radius: 6px;
  .tempBox {
    // width: 85%;
    margin: 0 auto;
    overflow: hidden;
    .temptitBox {
      overflow: hidden;
      margin-bottom: 20px;
      span {
        float: left;
        font-weight: bold;
        font-size: 18px;
      }
      .close {
        font-size: 20px;
        width: 24px;
        height: 24px;
        float: right;
        cursor: pointer;
        color: gray;
        &:hover {
          color: #3383ff;
        }
      }
    }
    ul li {
      line-height: 40px;
      margin-bottom: 15px;
      overflow: hidden;
      // &:last-child{

      // }
      span {
        float: left;
        width: 100px;
        height: 40px;
        text-align: center;
      }
      .width {
        width: calc(100% - 100px);
        float: left;
        .borderBtn {
          width: 100px;
          height: 100px;
          border: 1px dashed #ccc;
          position: relative;
          border-radius: 6px;
          .addIcon {
            font-size: 28px;
            color: #8c939d;
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
          }
          input {
            width: 100px;
            height: 100px;
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

