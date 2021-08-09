<template>
    <!-- 短信发送记录 -->
    <div class="shortSend">
        <div class="searchWrap">
            <div class="d1">
                <span>手机号：</span>
                <el-input class="ipt" type="tel" placeholder="请输入内容"></el-input>
            </div>
            <div class="d2">
                <span>状态：</span>
                <el-select class="ipt" v-model="value" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="d3">
                <span>发送日期：</span>
                <el-date-picker
                    class="ipt"
                    v-model="value2"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                ></el-date-picker>
            </div>
            <div class="d4">
                <el-button class="sBtn" type="primary">查询</el-button>
            </div>
        </div>
        <el-table :data="tableData" border="" style="width: 100%">
            <el-table-column prop="date" label="接收手机" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <el-table-column prop="address" label="发送内容" align="center"></el-table-column>
            <el-table-column prop="date" label="发送日期" align="center"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value2: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.shortSend {
  @include padShow();
  .searchWrap {
    width: 100%;
    overflow: hidden;
    margin: 10px 0;
    > div {
      float: left;
      > span {
        width: 100px;
        text-align: center;
        float: left;
        line-height: 40px;
      }
      &.d1 {
        width: calc(30% - 30px);
      }
      &.d2 {
        width: calc(30% - 30px);
      }
      &.d3 {
        width: calc(40% - 30px);
      }
      &.d4{
          width: 90px;
          .sBtn{
              display: block;
              margin: 0 auto
          }
      }
      .ipt{
          width: calc(100% - 100px);
      }
    }
  }
}
</style>

