<template>
    <!-- 留言管理 -->
    <div class="messageW">
        <ul class="ul">
            <li>
                <el-select v-model="value" placeholder="请选择" @change="value=value;getMsg()">
                    <el-option
                        v-for="item in matchList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </li>
            <li :class="{'act':status==-1}" @click="status='';getMsg()">全部留言</li>
            <li :class="{'act':status==1}" @click="status=1;getMsg()">置顶留言</li>
            <li :class="{'act':status==2}" @click="status=2;getMsg()">精选留言</li>
            <li :class="{'act':status==3}" @click="status=3;getMsg()">垃圾留言</li>
        </ul>
        <div class="CBox">
            <div class="list">
                <div class="item" v-for="(v,i) in msg" :key="i">
                    <div class="headImg">
                        <img :src="v.headImgUrl" alt="">
                    </div>
                    <div class="ic">
                        <div class="userC" :class="{'bor':v.commentList.length>0}">
                            <div class="in">{{v.nikeName}}</div>
                            <div class="icc">{{v.content}}</div>
                            <div class="id">{{v.showTime}}</div>
                        </div>
                        <div class="adC" v-for="(vv,ii) in v.commentList" :key="ii">
                            <div class="in">官方组织者</div>
                            <div class="icc">{{vv.content}}</div>
                            <div class="id">{{vv.showTime}}</div>
                        </div>
                    </div>
                    <div class="ibtn">
                        <div class="mr" v-if="v.status==0||v.status==3" @click="editStatus(v.id,2)">
                            <img src="/static/images/jxa.png" title="添加到精选">
                        </div>
                        <div class="mr" v-if="v.status==1||v.status==2" @click="editStatus(v.id,0)">
                            <img src="/static/images/jxb.png" title="移出精选">
                        </div>
                        <div class="mr" v-if="v.status!=1" @click="editStatus(v.id,1)">
                            <img src="/static/images/zda.png" title="设为置顶">
                        </div>
                        <div class="mr" v-if="v.status==1" @click="editStatus(v.id,2)">
                            <img src="/static/images/zdb.png" title="取消置顶">
                        </div>
                        <div class="mr" @click="showT(i)">
                            <img src="/static/images/hf.png" title="回复">
                        </div>
                        <div class="mr" @click="editStatus(v.id,3)">
                            <img src="/static/images/lj.png" title="设为垃圾留言">
                        </div>
                    </div>
                    <div class="hf" v-if="v.show">
                        <el-input
                            class="ipt"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="txt"
                        ></el-input>
                        <el-button size="small" @click="v.show=false;txt=''">取消</el-button>
                        <el-button size="small" type="primary" @click="sHf(v.id,i,v.status)">确认</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      matchList: [],
      value: "",
      msg: [],
      txt: "",
      status: '-1',
    };
  },
  methods: {
    // 获取赛事
    getMatch() {
      // console.log(window.sessionStorage.getItem('orgId'))
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      // console.log(obj)
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        let rr = res.data.data;
        if (rr.length > 0) {
          this.matchList = rr;
          this.value = rr[0].id;
          this.getMsg();
        }
      });
    },
    // 获取该赛事留言
    getMsg() {
      let oo = {
        matchId: this.value,
        openId: "",
        status: this.status
      };
      this.$axios.get("/run/getCommentList", { params: oo }).then((res) => {
        let rr = res.data.data;
        //   console.log($timestamp())
        for (let a = 0; a < rr.length; a++) {
          rr[a].show = false;
          rr[a].showTime = this.$timestamp(rr[a].creatTime);
          for (let b = 0; b < rr[a].commentList.length; b++) {
            rr[a].commentList[b].showTime = this.$timestamp(
              rr[a].commentList[b].creatTime
            );
          }
        }
        this.msg = rr;
      });
    },
    // 显示回复框
    showT(i) {
      for (let a = 0; a < this.msg.length; a++) {
        if (a == i) {
          this.msg[a].show = true;
        } else {
          this.msg[a].show = false;
        }
      }
    },
    editStatus(id, s) {
      let o = { id: id, status: s };
      this.$axios
        .get("/run/updateCommentStatus", { params: o })
        .then((res) => {
          this.getMsg();
        });
    },
    // 保存回复
    sHf(id, i, s) {
      let oo = {
        // content   creatTime    matchId   pid   orgId
        content: this.txt,
        creatTime: new Date().getTime(),
        matchId: this.value,
        pid: id,
        orgId: window.sessionStorage.getItem("orgId"),
      };
      if (this.txt != "") {
        this.$axios.post("/run/addComment", oo).then((res) => {
          this.txt = "";
          this.pId = "";
          this.msg[i].show = false;
          if (s != 1 || s != 2) {
            this.editStatus(id, 2);
          } else {
            this.getMsg();
          }
        });
      } else {
        this.$message.error("请填写回复");
      }
    },
  },
  mounted() {
    this.getMatch();
  },
};
</script>

<style lang="scss" scoped>
.messageW {
  @include padShow();
  .ul {
    width: 100%;
    overflow: hidden;
    li {
      float: left;
      margin-right: 20px;
      line-height: 40px;
      cursor: pointer;
      &.act {
        color: #409eff;
      }
    }
  }
  .CBox {
    width: 100%;
    overflow: hidden;
    .list {
      width: 100%;
      overflow: hidden;
    }
  }
  .item {
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
    > div {
      float: left;
      &.ibtn {
        float: right;
      }
    }
  }
  .headImg {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .ic {
    width: calc(100% - 210px);
    .userC {
      padding: 8px 0;
      width: 100%;
      overflow: hidden;
      &.bor {
        border-bottom: 1px solid #ccc;
      }
    }
    .adC {
      padding-top: 8px;
      // border-bottom: 1px solid #ccc;
      width: 95%;
      margin: 0 auto;
      overflow: hidden;
    }
    .in,
    .id {
      color: #888888;
      font-size: 14px;
    }
  }
  .ibtn {
    width: 150px;
    .mr {
      cursor: pointer;
      width: 30px;
      height: 30px;
      float: left;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .hf {
    width: 100%;
    .ipt {
      width: 100%;
      margin: 10px 0;
    }
  }
}
</style>
