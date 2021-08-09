<template>
  <!-- 短信模板列表 -->
  <div class="tempList">
    <div>
      <el-button type="primary" class="addShort" @click="showWrap=!showWrap">新建短信模板</el-button>
    </div>
    <table class="tab">
      <tr>
        <td>发送对象</td>
        <td>短信签名</td>
        <td>短信内容</td>
        <td>发送时间</td>
        <td>状态</td>
        <td>操作</td>
      </tr>
      <tr>
        <td>报名审核通过用户</td>
        <td>郑开马拉松组委会</td>
        <td>【郑开马拉松组委会】恭喜您，xx先生/女士您申请报名《郑开马拉松》半程组审核已通过</td>
        <td>2020-02-01 10:10:10</td>
        <td>审核通过</td>
        <td>
          <el-button icon="el-icon-search">编辑</el-button>
          <el-button icon="el-icon-search">删除</el-button>
        </td>
      </tr>
      <tr>
        <td>报名审核通过用户</td>
        <td>郑开马拉松组委会</td>
        <td>【郑开马拉松组委会】恭喜您，xx先生/女士您申请报名《郑开马拉松》半程组审核已通过</td>
        <td>2020-02-01 10:10:10</td>
        <td>审核通过</td>
        <td>
          <el-button icon="el-icon-search">编辑</el-button>
          <el-button icon="el-icon-search">删除</el-button>
        </td>
      </tr>
      <tr>
        <td colspan="6">暂无签名</td>
      </tr>
    </table>
    <div class="grayDark" v-if="showWrap">
      <shortTemp @showWrap="toShow" :signList='list' :signMatchList="signMatchList"></shortTemp>
    </div>
  </div>
</template>

<script>
import shortTemp from "./shortTemp";
export default {
  components: { shortTemp },
  data() {
    return {
      showWrap: false,
      list:[],
      signMatchList:[]
    };
  },
  methods: {
    toShow(states) {
      this.showWrap = states.state;
      if (states.hasSave) {
        this.getList();
      }
    },
    // 获取签名
    getList() {
      let orgId = window.sessionStorage.getItem('orgId')
      this.$axios
        .get("/game/msg/sign/get?orgId=" + orgId)
        .then(res => {
          this.$nextTick(() => {
            this.list = res.data.data;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取报名赛事
    getsignMatch(){
      let orgId = window.sessionStorage.getItem('orgId')
      this.$axios.get('/match/signUp/getByOrgId?orgId='+orgId).then(res=>{
        this.signMatchList=res.data.data
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  created() {
    this.getList();
    this.getsignMatch()
  }
};
</script>

<style lang="scss" scoped>
.tempList {
    @include padShow();
  > * {
    overflow: hidden;
  }
  .addShort {
    // display: block;
    float: right;
  }
  .tab {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    line-height: 40px;

    tr:nth-child(1) {
      background-color: #4e98d9 !important;
      color: #fff;
      > td {
        &:nth-child(3) {
          padding: 0;
        }
        background-color: #4e98d9 !important;
      }
    }
    tr:nth-child(2n) {
      background-color: #9dc7f94d;

      font-size: 14px;
    }
    tr:nth-child(2n-1) {
      background-color: #7eabfc4d;
      font-size: 14px;
    }
    tr td:nth-child(2n) {
      background-color: #7eabfc4d;
    }
    tr td:nth-child(3) {
      max-width: 260px;
      padding: 10px 0;
      line-height: initial;
    }
  }
  .grayDark {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    top: 0;
    left: 0;
  }
}
</style>

