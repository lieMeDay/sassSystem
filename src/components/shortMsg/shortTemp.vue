<template>
  <!-- 短信模板内容 -->
  <div class="shortTemp">
    <div class="tempBox">
      <div class="temptitBox">
        <span>新增模板</span>
        <i class="el-icon-close close" @click="hiddenMy"></i>
      </div>
      <ul>
        <li>
          <span>短信签名：</span>
          <el-select class="width" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in signList"
              :key="item.id"
              :label="item.signName+`  (${item.state==0?'待审核':item.state==1?'审核通过':'审核未通过'})`"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <span>短信类型：</span>
          <el-select class="width" v-model="value" placeholder="请选择" @change="toggTemp">
            <el-option
              v-for="item in shortType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <span>选择赛事：</span>
          <el-select class="width" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in signMatchList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <!-- 类型为自定义时显示 -->
          <span>发送对象：</span>
          <el-input class="width" placeholder="请输入内容" v-model="input" :disabled="true"></el-input>
        </li>
        <li>
          <span>发送时间：</span>
          <el-input class="width" placeholder="请输入内容" v-model="input" :disabled="true"></el-input>
        </li>
        <li>
          <span>短信内容：</span>
          <el-input
            class="width"
            type="textarea"
            rows="4"
            placeholder="请输入内容"
            v-model="textarea"
            resize="none"
            disabled
          ></el-input>
        </li>
        <li>
          <span></span>
          <el-button type="primary">保存</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["signList", "signMatchList"],
  data() {
    return {
      shortType: [
        {
          value: "选项1",
          label: "报名审核通过时"
        },
        {
          value: "选项2",
          label: "报名审核未通过时"
        },
        {
          value: "选项3",
          label: "退款审核通过时"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      value: "",
      input: "",
      textarea: "",
      tempTxt: [
        "【赛伴儿】尊敬的选手#name#你好，你报名的#matchgroup# 审核已通过，请及时关注公众号[赛伴儿]发布的最新赛事消息",
        "尊敬的选手#name#你好，你报名的#matchgroup# 资格审核条件未通过，关注[赛伴儿]查看报名信息--未通过原因。",
        "【赛伴儿】亲爱的选手#name#您好！您申请的赛事#ID#报名退款#cash#，已成功退回您的付款渠道，请注意查收。"
      ]
    };
  },
  methods: {
    hiddenMy() {
      let emp = { state: false, hasSave: false };
      this.$emit("showWrap", emp);
    },
    toggTemp(e) {
      console.log(e);
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
      }
    }
  }
}
</style>

