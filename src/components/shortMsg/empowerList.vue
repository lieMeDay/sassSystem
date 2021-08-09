<template>
  <!-- 短信授权列表 -->
  <div class="tempList">
    <div>
      <el-button type="primary" class="addShort" @click="showDark=!showDark">新建短信签名</el-button>
    </div>
    <table class="tab">
      <tr>
        <td>短信签名</td>
        <td>申请时间</td>
        <td>审核状态</td>
        <td>未通过理由</td>
        <td>操作</td>
      </tr>
      <tr v-if="list.length<=0">
        <td colspan="5">暂无签名</td>
      </tr>
      <tr v-else v-for="(v,i) in list" :key="i">
        <td>{{v.signName}}</td>
        <td>{{v.creatDate}}</td>
        <td>{{v.state==0?'待审核':v.state==1?'审核通过':'审核未通过'}}</td>
        <td>{{v.state==2?v.untriedDes:'/'}}</td>
        <td>
          <el-button icon="el-icon-delete" @click="delSign(v.id,i)">删除</el-button>
        </td>
      </tr>
    </table>
    <div class="grayDark" v-if="showDark">
      <shortEmpower @showbox="toshow"></shortEmpower>
    </div>
  </div>
</template>

<script>
import shortEmpower from "./shortEmpower";
export default {
  components: { shortEmpower },
  data() {
    return {
      showDark: false,
      list: []
    };
  },
  methods: {
    toshow(state) {
      this.showDark = state.state;
      if (state.hasSave) {
        this.getList();
      }
    },
    getList() {
      let orgId = window.sessionStorage.getItem('orgId');
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
    delSign(id,i) {
      this.$axios.get('/game/msg/sign/del?id='+id).then(res=>{
        this.$message.success('删除成功');
        this.list.splice(i,1)
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  created() {
    this.getList();
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

    tr:nth-child(1) {
      background-color: #4e98d9 !important;
      color: #fff;
      line-height: 40px;
      > td {
        & {
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
    tr td {
      padding: 10px 0;
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

