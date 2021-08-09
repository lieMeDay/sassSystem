<template>
    <!-- 报名审核 -->
    <div class="UpExa">
        <!-- 选择条件 -->
        <div class="toggleWrap">
            <div class="taggBox">
                <div class="tBox tb1">
                    <b>赛项名称</b>
                    <span class="act">全程</span>
                </div>
                <div class="tBox tb1">
                    <b>审核状态</b>
                    <span
                        v-for="(vs,is) in states"
                        :key="is"
                        :class="{act:is==showStates}"
                        @click="showStates=is"
                    >{{vs.txt}}</span>
                </div>
                <div class="tBox">
                    <b>报名时间</b>
                    <el-date-picker
                        class="dIpt"
                        v-model="dateAll"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </div>
            </div>
        </div>
        <!-- 人员表格 -->
        <div class="tabWrap">
            <el-table
                ref="table"
                border=""
                header-row-class-name="tableHead"
                :data="tableData.slice((currentPagerm-1)*pagesize,currentPagerm*pagesize)"
                style="width: 100%"
            >
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="姓名">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="英文名">
                                <span>{{ props.row.englishName }}</span>
                            </el-form-item>
                            <el-form-item label="性别">
                                <span>{{ props.row.gender }}</span>
                            </el-form-item>
                            <el-form-item label="证件类型">
                                <span>{{ props.row.idNumberType }}</span>
                            </el-form-item>
                            <el-form-item label="证件号码">
                                <span>{{ props.row.idNumber }}</span>
                            </el-form-item>
                            <!-- <el-form-item label="出生日期">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>-->
                            <el-form-item label="手机号码">
                                <span>{{ props.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="联系邮箱">
                                <span>{{ props.row.email }}</span>
                            </el-form-item>
                            <el-form-item label="血型">
                                <span>{{ props.row.bloodType }}</span>
                            </el-form-item>
                            <el-form-item label="国籍">
                                <span>{{ props.row.nationality }}</span>
                            </el-form-item>
                            <el-form-item label="地区">
                                <span>{{ props.row.region }}</span>
                            </el-form-item>
                            <el-form-item label="详细地址">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>
                            <!-- <el-form-item label="所在俱乐部">
                                    <span>{{ props.row.category }}</span>
                            </el-form-item>-->
                            <el-form-item label="紧急联系人">
                                <span>{{ props.row.emergencyContactName }}</span>
                            </el-form-item>
                            <el-form-item label="紧急联系人电话">
                                <span>{{ props.row.emergencyContactPhone }}</span>
                            </el-form-item>
                            <el-form-item label="衣服尺码">
                                <span>{{ props.row.clothingSize }}</span>
                            </el-form-item>
                            <el-form-item></el-form-item>
                            <el-form-item label="报名优惠">
                                <span>{{ props.row.YHname }}</span>
                            </el-form-item>
                            <el-form-item label="报名金额">
                                <span>{{ props.row.price }}</span>
                            </el-form-item>
                            <el-form-item label="成绩证书">
                                <img
                                    style="width:100px;height:100px;margin-right:5px;"
                                    v-for="(item,index) in props.row.WSimg"
                                    :key="index"
                                    :src="item"
                                    alt=""
                                >
                            </el-form-item>
                            <el-form-item label="健康证明">
                                <!-- <span>{{ props.row.desc }}</span> -->
                                <img
                                    style="width:100px;height:100px;margin-right:5px;"
                                    v-for="(item,index) in props.row.JKimg"
                                    :key="index"
                                    :src="item"
                                    alt=""
                                >
                            </el-form-item>
                            <el-form-item v-if="state=='2'" label="理由">
                                <span>{{ props.row.stateContent }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="赛事名称" prop="matchName"></el-table-column>
                <el-table-column label="参赛组别" prop="groupName"></el-table-column>
                <el-table-column label="姓名" prop="name" width="120"></el-table-column>
                <el-table-column label="手机号" prop="phone" width="150"></el-table-column>
                <el-table-column label="证件号" prop="idNumber"></el-table-column>
                <el-table-column label="报名时间" prop="signUpDate"></el-table-column>
                <el-table-column label="状态" prop="state" width="120"></el-table-column>
                <el-table-column label="操作" align="center" v-if="tabState=='0'?true:false">
                    <template slot-scope="scope">
                        <el-button @click="seeDetail(scope.row)">查看</el-button>
                        <el-button type="primary">审核</el-button>
                        <!-- <el-button type="text" @click="Examine(scope.row,scope.$index)" size="small">审核</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div style="overflow: hidden;margin-top: 20px;">
                <div
                    style="float: left;margin-left: 50%;transform: translateX(-50%);"
                    v-if="tableData.length>10?true:false"
                >
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPagerm"
                        :page-size="10"
                        layout="prev, pager, next, jumper"
                        :total="tableData.length"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <!-- 弹窗审核 -->
        <div class="alertBox" v-show="showAlert">
            <div class="centerWrap">
                <div class="centerTit">
                    <span>审核提示</span>
                    <i class="el-icon-close" @click="showAlert=!showAlert"></i>
                </div>
                <div class="centerBox">
                    <div>
                        <span>报名选手：</span>
                        <span>{{SHName}}</span>
                    </div>
                    <div>
                        <span>审核结果：</span>
                        <el-select
                            v-model="choiseJG"
                            clearable
                            placeholder="请选择"
                            @change="changeLY"
                        >
                            <el-option
                                v-for="item in shhEnd"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div style="margin: 20px 0;"></div>
                    <el-input
                        type="textarea"
                        v-show="showLY"
                        v-model="textLY"
                        :autosize="{ minRows: 3, maxRows: 4}"
                        placeholder="不通过理由"
                    ></el-input>
                </div>
                <div class="centerBtn">
                    <el-button @click="showAlert=!showAlert">取消</el-button>
                    <el-button type="primary">确认</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 时间快捷选项
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
      states: [
        {
          val: 1,
          txt: "待审核"
        },
        {
          val: 2,
          txt: "已通过"
        },
        {
          val: 3,
          txt: "未通过"
        }
      ],
      showStates: 0,
      dateAll: "",
      tabState: "0",
      tableData: [],
      currentPagerm: 1,
      pagesize: 10,
      showAlert:false,
      shhEnd: [
        {
          value: "1",
          label: "通过"
        },
        {
          value: "2",
          label: "不通过"
        }
      ],
      SHName: "",
      choiseJG: "",
      showLY: false,
      examineId: "", //审核id
      examIndex: "", //审核index
      textLY: ""
    };
  },
  methods: {
    seeDetail(row) {
      let $table = this.$refs.table;
      this.tableData.map(item => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      // console.log(this.pagesize);
    },
    handleCurrentChange(val) {
      this.currentPagerm = val;
      // console.log(this.currentPagerm);
    },
    changeLY() {
      if (this.choiseJG == "1") {
        this.showLY = false;
      } else if (this.choiseJG == "2") {
        this.showLY = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.UpExa {
  overflow: hidden;
  //   选择条件
  .toggleWrap {
    @include padShow();
    .taggBox {
      width: calc(100% - 22px);
      padding: 10px;
      border: 1px solid #eeeeee;
      .tBox {
        overflow: hidden;
        line-height: 30px;
        &.tb1 {
          margin-bottom: 10px;
        }
        b {
          color: #3383ff;
          float: left;
        }
        span {
          float: left;
          margin-left: 15px;
          cursor: pointer;
          padding: 0 10px;
          color: #919191;
          &.act {
            color: #fff;
            background-color: #3383ff;
            border-radius: 20px;
          }
        }
        .dIpt {
          margin-left: 15px;
        }
      }
    }
  }
  //   人员表格
  .tabWrap {
    margin: 20px auto;
    @include padShow();
    >>> .el-table__expand-column {
      border-right: none;
      .cell {
        display: none;
      }
    }
  }
  //   审核弹框
  .alertBox {
    @include alertBox();
    .centerWrap {
      min-width: 450px;
      line-height: 40px;
      @include hs_center();
      background-color: #fff;
      .centerTit {
        background-color: rgb(242, 242, 242);
        color: #000;
        width: 100%;
        > span {
          display: inline-block;
          margin: 5px 20px;
          font-weight: 500;
        }
        > i {
          float: right;
          font-size: 25px;
          line-height: 40px;
          margin: 5px;
          cursor: pointer;
        }
      }
      .centerBox {
        padding: 8px 15px;
        border-bottom: 1px solid #ccc;
      }
      .centerBtn {
        margin: 8px;
        float: right;
      }
    }
  }
}
</style>

