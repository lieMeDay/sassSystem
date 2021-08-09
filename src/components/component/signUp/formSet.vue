<template>
  <div class="BDFORME">
    <div class="tit">
      <b>报名表单设置：</b>
    </div>
    <div class="checkWrap">
      <div
        class="check_box"
        v-for="(item,index) in list"
        :class="item.value=='clothingColor'||item.value=='clothingSize'?'block':''"
        :key="index"
      >
        <el-checkbox v-model="item.checked" @change="saveFrom">
          {{index+1}}.{{item.label}} 
          <el-checkbox v-if="item.checked" v-model="item.must" @change="saveFrom">是否必填</el-checkbox>
          <el-input
            v-if="item.value=='clothingColor'||item.value=='clothingSize'"
            v-model="item.txt"
            @change="saveFrom"
            placeholder="请输入颜色以英文分号(;)隔开"
          ></el-input>
        </el-checkbox>
      </div>
      <!-- <div>
        <p class="tips">最好全马或半马成绩;预计本次完赛时间为用户选填</p>
      </div>-->
    </div>
    <p class="tips">最好全马或半马成绩;预计本次完赛时间为用户选填</p>
    <!-- <div>
            <el-button type="primary" style="display:block;margin:5px auto;" @click="saveFrom">保存</el-button>
    </div>-->
  </div>
</template>

<script>
export default {
  props: ["power"],
  data() {
    return {
      list: [
        {
          label: "姓名",
          value: "name",
          checked: true,
          must: true,
        },
        {
          label: "英文名",
          value: "englishName",
          checked: false,
          must: false,
        },
        {
          label: "性别",
          value: "gender",
          checked: true,
          must: true,
        },
        {
          label: "手机号",
          value: "phone",
          checked: true,
          must: true,
        },
        {
          label: "证件类型",
          value: "idNumberType",
          checked: false,
          must: false,
        },
        {
          label: "证件号",
          value: "idNumber",
          checked: false,
          must: false,
        },
        {
          label: "血型",
          value: "bloodType",
          checked: false,
          must: false,
        },
        {
          label: "国籍",
          value: "nationality",
          checked: false,
          must: false,
        },
        {
          label: "地区",
          value: "region",
          checked: false,
          must: false,
        },
        {
          label: "出生日期",
          value: "birthday",
          checked: false,
          must: false,
        },
        {
          label: "邮箱",
          value: "email",
          checked: false,
          must: false,
        },
        {
          label: "详细地址",
          value: "address",
          checked: false,
          must: false,
        },
        {
          label: "紧急联系人姓名",
          value: "emergencyContactName",
          checked: false,
          must: false,
        },
        {
          label: "紧急联系人电话",
          value: "emergencyContactPhone",
          checked: false,
          must: false,
        },
        {
          label: "成绩证书",
          value: "scoreReport",
          checked: false,
          must: false,
        },
        {
          label: "健康证明",
          value: "healthReport",
          checked: false,
          must: false,
        },
        {
          label: "是否为会员",
          value: "ifMember",
          checked: false,
          must: false,
        },
        {
          label: "微信号",
          value: "wxNumber",
          checked: false,
          must: false,
        },
        {
          label: "颜色",
          value: "clothingColor",
          checked: false,
          must: false,
          txt: "",
        },
        {
          label: "衣服尺码",
          value: "clothingSize",
          checked: false,
          must: false,
          txt: "",
        },
        // {
        //   label: "最好全马或半马成绩",
        //   value: "healthReport",
        //   checked: true
        // },
        // {
        //   label: "预计本次完赛时间",
        //   value: "healthReport",
        //   checked: true
        // },
        // {
        //   label: "是否参加过往届活动",
        //   value: "healthReport",
        //   checked: true
        // }
      ],
      checkedList: {},
    };
  },
  watch: {
    power(val) {
      for (var k in val) {
        this.list.forEach((v, i) => {
          if (k == v.value) {
            if (val[k] == "false" || !val[k]) {
              v.checked = JSON.parse(val[k]);
            } else {
              if (val[k].indexOf("/") != -1) {
                v.txt = val[k].split("/")[1];
              }
              if (val[k].indexOf("*") != -1) {
                v.checked = true;
                v.must = true;
              } else {
                if (k == "clothingColor"||k=='clothingSize') {
                  v.checked = JSON.parse(val[k].split("/")[0]);
                  v.must = false;
                } else {
                  v.checked = true;
                  v.must = false;
                }
              }
            }
          }
        });
      }
    },
  },
  methods: {
    saveFrom() {
      this.checkedList = {};
      this.list.forEach((item) => {
        if (item.checked) {
          if (item.must) {
            this.checkedList[item.value] = item.checked + "*";
          } else {
            this.checkedList[item.value] = JSON.stringify(item.checked);
          }
        } else {
          this.checkedList[item.value] = JSON.stringify(item.checked);
        }
        if (item.value == "clothingColor"||item.value=='clothingSize') {
          this.checkedList[item.value] += "/" + item.txt;
        }
      });
    },
    putform() {
      // console.log(this.checkedList)
      this.$emit("getFromData", this.checkedList);
    },
  },
  mounted() {
    this.saveFrom();
  },
};
</script>

<style scoped lang="scss">
.BDFORME {
  margin-top: 15px;
  overflow: hidden;
  .checkWrap {
    overflow: hidden;
    .check_box {
      width: 30%;
      font-size: 20px;
      line-height: 40px;
      //   margin-left: 5%;
      padding-left: 3%;
      float: left;
      &.block {
        width: 100%;
      }
    }
  }
  .tips {
    float: left;
    padding-left: 3%;
    font-size: 12px;
    font-size: 12px;
    margin-top: 8px;
    color: #004fbf;
  }
}
</style>
