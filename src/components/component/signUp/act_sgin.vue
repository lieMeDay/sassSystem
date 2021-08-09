<template>
  <div class="BDFORME">
    <div class="tit">
      <b>报名表单设置：</b>
    </div>
    <div class="checkWrap">
      <div
        class="check_box"
        v-for="(item,index) in list"
        :class="item.type=='T'?'block':''"
        :key="index"
      >
        <el-checkbox v-model="item.checked" @change="saveFrom">
          {{index+1}}.{{item.label}}
          <el-checkbox v-if="item.checked" v-model="item.must" @change="saveFrom">是否必填</el-checkbox>
          <el-input
            v-if="item.type=='T'"
            v-model="item.txtC"
            placeholder="请输入城市以英文;分开"
            @change="saveFrom"
          ></el-input>
        </el-checkbox>
      </div>
    </div>
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
          showType: "a",
          checked: true,
          must: true,
        },
        {
          label: "手机号",
          value: "phone",
          showType: "a",
          checked: true,
          must: true,
        },
        {
          label: "所在地区",
          value: "city",
          showType: "b",
          checked: true,
          must: true,
        },
        {
          label: "驾照类型",
          value: "licenseType",
          showType: "b",
          checked: false,
          must: false,
        },
        {
          label: "驾龄",
          value: "drivingYears",
          showType: "a",
          checked: false,
          must: false,
        },
        {
          label: "车辆品牌",
          value: "brand",
          showType: "a",
          checked: false,
          must: false,
        },
        {
          label: "到店城市",
          value: "toCity",
          showType: "b",
          checked: false,
          must: false,
          type: "T",
          txtC: "",
        },
      ],
      checkedList: {},
    };
  },
  methods: {
    saveFrom() {
      this.checkedList = {};
      this.list.forEach((v) => {
        let oo = {
          c: v.checked ? "t" : "f",
          m: v.must ? "t" : "f",
          sT: v.showType, // a 输入框 / b 下拉选 / c 单选
          tc: v.txtC, //默认 选内容
        };
        this.checkedList[v.value] = JSON.stringify(oo);
      });
      //   console.log(this.checkedList);
    },
    putF() {
      this.$emit("getF", this.checkedList);
    },
  },
  mounted() {
    for (var k in this.power) {
      let v = JSON.parse(this.power[k]);
      let ii = this.list.findIndex((s) => {
        return s.value == k;
      });
      if (ii>=0) {
        this.list[ii].checked = v.c == "t" ? true : false;
        this.list[ii].must = v.m == "t" ? true : false;
        this.list[ii].showType = v.sT;
        this.list[ii].txtC = v.tc;
      }
    }
    this.saveFrom();
  },
};
</script>

<style scoped lang="scss">
.BDFORME {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: #fff;
  margin-top: 15px;
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
