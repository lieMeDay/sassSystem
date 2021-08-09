<template>
  <!-- 赛事公告 -->
  <div class="noticeWrap">
    <div class="noticeBox">
      <div class="d">
        <span class="s">选择赛事</span>
        <div class="l">
          <el-select class="cm" v-model="matchId" placeholder="请选择" @change="toggle" filterable>
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="a">
        <span class="s">
          标题
          <span class="red">*</span>
        </span>
        <div class="l">
          <el-input v-model="noticeTitle" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="b">
        <span class="s">封面</span>
        <div class="l">
          <div v-if="!noticeCover" class="changeLogo">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <input type="file" class="chooseIpt" @change="upLogo" />
          </div>
          <div v-else class="seeLogo">
            <img :src="noticeCover" alt />
            <span class="avatar-uploader-icon">
              <i class="el-icon-delete" @click="noticeCover=''"></i>
            </span>
          </div>
          <p class="gtips">标题图片为jpg或png格式,建议大小200*200</p>
        </div>
      </div>
      <div class="c">
        <div>
          内容
          <span class="red">*</span>
        </div>
        <RichTxt ref="getContent"></RichTxt>
      </div>
    </div>
    <div class="btnBox">
      <el-button v-if="!editId" class="saveBtn" type="primary" @click="saveNotice">发布</el-button>
      <el-button v-else class="saveBtn" type="primary" @click="putNotic">保存修改</el-button>
    </div>
    <div class="looKWrap">
      <div class="lookBox" v-for="(v,i) in noticeList" :key="i">
        <img class="im" v-if="v.noticeCover" :src="v.noticeCover" alt />
        <div class="st">
          <p>{{v.noticeTitle}}</p>
          <p>{{v.showDate}}</p>
        </div>
        <div class="rt">
          <el-button type="primary" @click="editNotice(i)">修改</el-button>
          <el-button type="danger" @click="delNotice(i)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//富文本
import RichTxt from "../editor/editor.vue";
import { content } from "../editor/editor.vue";
export default {
  components: { RichTxt },
  data() {
    return {
      options: [],
      matchId: "",
      divTop: "",
      noticeTitle: "", //标题
      noticeCover: "", //图片
      noticeContent: "", // 内容
      noticeList: [],
      editId: "",
    };
  },
  methods: {
    // 获取赛事
    getMatch() {
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        this.options = res.data.data;
        this.matchId = this.options[0].id;
        this.getNotice();
      });
    },
    toggle(v) {
      this.matchId = v;
      this.noticeTitle = ""; //标题
      this.noticeCover = ""; //图片
      this.noticeContent = ""; // 内容
      this.noticeList = [];
      this.editId = "";
      this.getNotice();
    },
    // 上传logo
    upLogo(e) {
      let file = e.target.files[0];
      if (file) {
        let param = new FormData(); //创建form对象
        param.append("img", file); //通过append向form对象添加数据
        // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers: { "Content-Type": "multipart/form-data" },
        }; //添加请求头
        this.$axios
          .post("/match/uploadImg", param, config)
          .then((res) => {
            // console.log(res.data);
            this.noticeCover = res.data.data.filePath;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    saveNotice() {
      this.noticeContent = this.$refs.getContent.content;
      let obj = {
        noticeTitle: this.noticeTitle, //标题
        noticeContent: this.noticeContent, // 内容
        matchId: this.matchId,
      };
      for (var k in obj) {
        if (!obj[k]) {
          this.$message.warning("请填写完善公告");
          return false;
        }
      }
      obj.noticeCover = this.noticeCover; //图片
      this.$axios.post("/match/notice/add", obj).then((res) => {
        this.noticeTitle = ""; //标题
        this.noticeCover = ""; //图片
        this.noticeContent = ""; // 内容
        this.$refs.getContent.content = "";
        this.$message.success("保存成功");
        this.getNotice();
      });
    },
    getNotice() {
      // /match/notice/getByMatchId
      let obj = { matchId: this.matchId };
      this.$axios
        .get("/match/notice/getByMatchId", { params: obj })
        .then((res) => {
          res.data.data.forEach((v) => {
            v.showDate = this.timechange(v.creatTime);
          });
          this.noticeList = res.data.data.reverse();
          // /match/notice/getById
          // res.data.data.forEach(v=>{
          //     console.log(v.id)
          // this.$axios.get(`/match/notice/getById?id=${v.id}`)
          // })
        });
    },
    putNotic() {
      this.noticeContent = this.$refs.getContent.content;
      let obj = {
        id: this.editId,
        noticeTitle: this.noticeTitle, //标题
        noticeContent: this.noticeContent, // 内容
        matchId: this.matchId,
      };
      for (var k in obj) {
        if (!obj[k]) {
          this.$message.warning("请填写完善公告");
          return false;
        }
      }

      obj.noticeCover = this.noticeCover;
      this.$axios.put("/match/notice/put", obj).then((res) => {
        this.$message.success("修改成功");
        this.getNotice();
        this.editId = "";
        this.noticeTitle = ""; //标题
        this.noticeCover = ""; //图片
        this.noticeContent = ""; // 内容
        this.$refs.getContent.content = "";
      });
    },
    editNotice(i) {
      this.divTop.scrollTop = 0;
      let cv = this.noticeList[i];
      this.editId = cv.id;
      this.noticeTitle = cv.noticeTitle;
      this.noticeCover = cv.noticeCover;
      this.$refs.getContent.content = cv.noticeContent;
      this.noticeContent = cv.noticeContent;
    },
    delNotice(i) {
      // console.log(i)
      this.$confirm("此操作将删除该公告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .get(`/match/notice/del?id=${this.noticeList[i].id}`)
            .then((res) => {
              this.noticeList.splice(i, 1);
              this.$message.success("删除成功");
              this.editId = "";
              this.noticeTitle = ""; //标题
              this.noticeCover = ""; //图片
              this.noticeContent = ""; // 内容
              this.$refs.getContent.content = "";
            })
            .catch((err) => {
              this.$message.success("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    timechange(time) {
      let date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      return year + "." + month + "." + day + " " + hour + ":" + minute;
    },
  },
  mounted() {
    this.getMatch();
    this.divTop = document.getElementsByClassName("content-box")[0];
    this.divTop.scrollTop = 0;
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/style/match/notice";
.cm {
  width: 380px;
}
.red {
  color: red;
}
</style>

