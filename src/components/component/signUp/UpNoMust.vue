<template>
  <!-- 报名非必填项 -->
  <div class="NoMust">
    <!-- <div class="refundWrap">
      <div v-if="!$newActive">
        <b class="b">是否支持退款:</b>
        <el-radio-group v-model="radio">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </div>
      <table class="tab" v-if="radio==1">
        <tr>
          <td>类型</td>
          <td>退款规则</td>
          <td>退款比例</td>
          <td>操作</td>
        </tr>
        <tr v-for="(v,d) in refundRules" :key="d">
          <td>
            <span>按时间</span>
          </td>
          <td>
            <el-date-picker
              class="iptBox"
              v-model="v.refundDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy/MM/dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </td>
          <td>
            <el-input
              class="iptBox"
              v-model="v.refundRatio"
              placeholder="请输入数字"
              @change="pDNum($event,d)"
            ></el-input>
          </td>
          <td>
            <el-button type="text" size="small" @click="delRefund(d)">删除</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="5" @click="addRefund">添加退款策略</td>
        </tr>
      </table>
    </div>-->
    <formSet ref="formC" @getFromData="getFromData"></formSet>
    <!-- <div class="jp">
      <b class="b">报名成功奖品设置：</b>
      <el-form>
        <el-form-item label="奖品名称">
          <el-input v-model="shopName" placeholder="请输入奖品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="奖品链接">
          <el-input v-model="shopLinks" placeholder="请输入奖品链接" clearable></el-input>
        </el-form-item>
      </el-form>
      <b class="b">报名成功奖品图片：</b>
      <div v-if="shopImg" class="logoB">
        <img :src="shopImg" class="avatar" />
        <div class="logoA">
          <i class="el-icon-delete delI" @click="shopImg=''"></i>
        </div>
      </div>
      <el-upload
        v-else
        class="avatar-uploader"
        :action="actionUrl"
        :show-file-list="false"
        :on-success="AvatarSuccess"
        :before-upload="beforeAvatarUpload"
        name="img"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div> -->
  </div>
</template>

<script>
// 表单设置
import formSet from "./formSet";
export default {
  components: { formSet },
  props: ["refundRules"],
  data() {
    return {
      radio: 2,
      bigFrom: {},
      // shopName: "",
      // shopImg: "",
      // shopLinks: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      actionUrl:''
    };
  },
  methods: {
    AvatarSuccess(res, file) {
      console.log(res, file.raw);
      // this.formD.logo = URL.createObjectURL(file.raw);
      this.shopImg = res.data.filePath;
    },
    beforeAvatarUpload(params) {
      const isLt2M = params.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 判断是否是数字
    pDNum(val, index) {
      // console.log(val,isNaN(val),index)
      if (isNaN(val)) {
        this.$confirm("请输入数字", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        }).then(() => {
          this.refundRules[index].refundRatio = "";
        });
      } else {
        // console.log(val>1)
        if (val > 1) {
          this.$confirm("请输入小于1的数字", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            type: "warning",
          }).then(() => {
            this.refundRules[index].refundRatio = "";
          });
        }
      }
    },
    // 删除退款策略
    delRefund(i) {
      this.refundRules.splice(i, 1);
    },
    // 添加退款策略
    addRefund() {
      this.refundRules.push({
        refundDate: "",
        refundRatio: "",
        commissionRatio: 0,
      });
    },
    // 获取多选框传值
    getFromData(data) {
      // console.log(data);
      this.bigFrom = data;
    },
    // // 触发多选框传值
    // bindForm() {
    // },
    putMsg() {
      this.$refs.formC.putform(); // 触发多选框传值
      var noMustMsg = {
        power: this.bigFrom, //报名报单
        ifRefund: "", //是否退款
        refundRules: this.refundRules, //
        // shopLinks: this.shopLinks,
        // shopImg: this.shopImg,
        // shopName: this.shopName,
      };
      if (this.radio == 2) {
        noMustMsg.ifRefund = "否";
        noMustMsg.refundRules = [];
      } else {
        noMustMsg.ifRefund = "是";
        // noMustMsg.refundRules.forEach(v=>{
        //   v.refundDate=v.refundDate[0]+';'+v.refundDate[1]
        // })
      }
      this.$emit("message", noMustMsg);
    },
  },
  created(){
    this.actionUrl=this.$img_url+'/match/uploadImg'
  }
};
</script>

<style lang="scss" scoped>
.NoMust {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: #fff;
  //   margin-bottom: 20px;
  overflow: hidden;
  .refundWrap {
    line-height: 40px;
    .b {
      margin-right: 25px;
      float: left;
    }

    .tab {
      margin-top: 15px;
      width: calc(100% - 6px);
      text-align: center;
      line-height: 40px;
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      tr:nth-child(1) {
        background: #66b1ff;
        color: #fff;
        td:last-child {
          width: 80px;
        }
        td:nth-child(1) {
          width: 150px;
        }
      }
      tr:last-child {
        cursor: pointer;
      }
      td {
        border-left: 1px solid #ebeef5;
        border-top: 1px solid #ebeef5;
        .iptBox {
          margin: 5px auto;
          width: 90%;
          // input::-webkit-outer-spin-button,
          // input::-webkit-inner-spin-button {
          //   -webkit-appearance: none;
          // }
          // input[type="number"] {
          //   -moz-appearance: textfield;
          // }
        }
      }
    }
  }
  .jp {
    overflow: hidden;
    margin-top: 15px;
  }
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    display: block;
  }
  .logoB {
    width: 80px;
    display: block;
    position: relative;
  }
  .logoA {
    width: 80px;
    height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    color: #fff;
    top: 0;
    left: 0;
    display: none;
  }
  .logoB:hover .logoA {
    display: block;
  }
  .delI {
    font-size: 30px;
    color: #fff;
    width: 80px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
