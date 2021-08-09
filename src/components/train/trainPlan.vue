<template>
  <div class="trainPerson">
    <el-button type="primary" @click="addPlan()">添加训练计划</el-button>
    <el-button type="primary" @click="setProVis=true">自定义训练项目</el-button>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column label="周期" width="50">
        <template slot-scope="{$index}">
          <span>W {{$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="intensityOld" label="旧强度值" width="80"></el-table-column>
      <el-table-column label="新强度值" width="100">
        <template slot-scope="{row}">
          <el-input type="text" v-if="row.edit" v-model="row.intensityNew" style="width: 50px;"></el-input>
          <span v-else>{{row.intensityNew}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="vdot" label="VDOT" width="80"></el-table-column>
      <el-table-column label="训练日期">
        <template slot-scope="{row}">
          <el-date-picker
            v-model="row.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-if="row.edit"
          ></el-date-picker>
          <span v-else>{{row.startDate+'至'+row.endDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="!row.edit"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="row.edit=true;$forceUpdate()"
          ></el-button>
          <el-button
            v-if="row.edit"
            type="success"
            icon="el-icon-check"
            circle
            @click="savePlan(row)"
          ></el-button>
          <el-button type="warning" v-if="!row.edit" icon="el-icon-plus" circle @click="aeCon(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="delPlan($index,row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="训练内容"
      width="90%"
      :visible.sync="setConShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form :inline="true">
        <el-form-item label="强度值：" class="fItem">{{intensityNew}}</el-form-item>
        <el-form-item label="剩余强度值：" class="fItem">{{has_strong}}</el-form-item>
        <el-form-item label="vdot：" class="fItem">{{vdot}}</el-form-item>
      </el-form>
      <el-table :data="cur_arr" stripe style="width: 100%;" height="455">
        <el-table-column property="week_s" label="日期" width="100"></el-table-column>
        <el-table-column label="训练方式">
          <template slot-scope="{row}">
            <el-select
              v-model="row.info"
              filterable
              clearable
              default-first-option
              placeholder="请选择训练方式"
              @change="ctrain(row)"
            >
              <el-option v-for="(item,i) in project" :key="i" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column property="coefficient" label="强度系数" width="120">
          <template slot-scope="{row}">
            <el-select
              v-model="row.coefficient"
              filterable
              clearable
              allow-create
              default-first-option
              @change="getStrong(row)"
            >
              <el-option :label="0" :value="0"></el-option>
              <el-option :label="0.2" :value="0.2"></el-option>
              <el-option :label="0.3" :value="0.3"></el-option>
              <el-option :label="0.4" :value="0.4"></el-option>
              <el-option :label="0.5" :value="0.5"></el-option>
              <el-option :label="0.6" :value="0.6"></el-option>
              <el-option :label="0.8" :value="0.8"></el-option>
              <el-option :label="1" :value="1"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column property="pace" label="配速" width="130"></el-table-column>
        <el-table-column label="用时(分)">
          <template slot-scope="{row}">
            <el-input type="age" v-model="row.useTime" placeholder="请输入用时(分)" @input="ipt(row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="intensity" label="训练强度"></el-table-column>
      </el-table>
      <el-button type="primary" @click="saveCon()">保存</el-button>
    </el-dialog>

    <!-- 自定义项目 项目设置 -->
    <el-dialog
      title="自定义项目"
      width="90%"
      :visible.sync="setProVis"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-table :data="project" stripe style="width: 100%;" height="345">
        <el-table-column prop="name" label="项目名称" width="200" fixed>
          <template slot-scope="{row}">
            <el-input v-if="row.edit&&!row.noEdit" v-model="row.name" placeholder="请输入内容"></el-input>
            <span v-else>{{row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="intensity" label="强度系数" width="130">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.intensity" placeholder="请输入"></el-input>
            <span v-else>{{row.intensity}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="info" label="内容">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.info" placeholder="请输入"></el-input>
            <span v-else>{{row.info}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,index}">
            <el-button
              v-if="!row.edit"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="row.edit=true"
            ></el-button>
            <el-button
              v-if="row.edit"
              type="success"
              icon="el-icon-check"
              circle
              @click="savePro(row)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="delPro(index,row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addPro()">添加</el-button>
    </el-dialog>
  </div>
</template>

<script>
var initV = {
  planId: "",
  date: "",
  startDate: "",
  endDate: "",
  intensityOld: "",
  intensityNew: "",
  edit: false,
};
var aeValId = "";
var itPace = "";
var init_C_A = [
  {
    week: 1,
    week_s: "周一",
    info: "",
    coefficient: "",
    pace: "",
    useTime: "",
    intensity: 0,
  },
  {
    week: 2,
    week_s: "周二",
    info: "",
    coefficient: "",
    pace: "",
    useTime: "",
    intensity: 0,
  },
  {
    week: 3,
    week_s: "周三",
    info: "",
    coefficient: "",
    pace: "",
    useTime: "",
    intensity: 0,
  },
  {
    week: 4,
    week_s: "周四",
    info: "",
    coefficient: "",
    pace: "",
    useTime: "",
    intensity: 0,
  },
  {
    week: 5,
    week_s: "周五",
    info: "",
    coefficient: "",
    pace: "",
    useTime: "",
    intensity: 0,
  },
  {
    week: 6,
    week_s: "周六",
    info: "",
    coefficient: "",
    pace: "",
    useTime: "",
    intensity: 0,
  },
  {
    week: 7,
    week_s: "周日",
    info: "",
    coefficient: "",
    pace: "",
    useTime: "",
    intensity: 0,
  },
];
var initCon = "";
export default {
  data() {
    return {
      tableData: [],
      setConShow: false,
      intensityNew: "",
      has_strong: 0,
      cur_arr: JSON.parse(JSON.stringify(init_C_A)),
      vdot: "",
      project: [],
      setProVis:false
    };
  },
  methods: {
    getPlan() {
      this.$axios
        .get(
          "/runAbility/getPersonRunAbilityPlanDateListById?id=" +
            this.$route.query.id
        )
        .then((res) => {
          let rr = res.data.data;
          initCon = rr;
          if (rr.list.length == 0) {
            initV.edit = true;
            let oo = initV;
            oo.intensityOld = rr.useTime * 60 * 0.4;
            oo.vdot = rr.vdot;
            this.tableData.push(oo);
          } else {
            rr.list.forEach((v) => {
              v.vdot = rr.vdot;
              v.date = [v.startDate, v.endDate];
              v.edit = false;
            });
            this.tableData = rr.list;
          }

          this.vdot = rr.vdot;
          this.$axios
            .get("/runAbility/getRunAbilityPaceByOpenId?openId=" + rr.openId)
            .then((res) => {
              itPace = res.data.data;
            });
        });
    },
    addPlan() {
      initV.edit = true;
      let oo = JSON.parse(JSON.stringify(initV));
      if (this.tableData.length > 0) {
        oo.intensityOld = this.tableData[
          this.tableData.length - 1
        ].intensityNew;
        oo.vdot = this.tableData[this.tableData.length - 1].vdot;
        this.tableData.push(oo);
      } else {
        oo.intensityOld = initCon.useTime * 60 * 0.4;
        oo.vdot = initCon.vdot;
        this.tableData.push(oo);
      }
    },
    savePlan(row) {
      if (!row.date && row.date.length == 0) {
        this.$message.error("请选择日期");
        return false;
      }
      if (!row.intensityNew) {
        this.$message.error("请输入新强度值");
        return false;
      }
      row.startDate = row.date[0];
      row.endDate = row.date[1];
      this.$axios
        .post("/runAbility/putPersonRunAbilityDrillDate", row)
        .then((res) => {
          let rr = res.data.data;
          row.id = rr;
          row.edit = false;
          this.$$forceUpdate();
        });
    },
    delPlan(i, id) {
      if (id) {
        this.$axios
          .get("/runAbility/delPersonRunAbilityDrillDate?id=" + id)
          .then((res) => {
            this.tableData.splice(i, 1);
          });
      } else {
        this.tableData.splice(i, 1);
      }
    },
    // 添加 修改 训练内容
    aeCon(v) {
      // 查询之前是否有提交方案内容
      aeValId = v.id;
      this.$axios
        .get("/runAbility/getPersonDrillByDateId?id=" + aeValId)
        .then((res) => {
          let rr = res.data.data;
          this.intensityNew = v.intensityNew;
          this.has_strong = v.intensityNew;
          if (rr.length > 0) {
            this.cur_arr = rr;
            let sum = rr.reduce((sum, cur) => {
              return Number(sum) + Number(cur.intensity);
            }, 0);
            this.has_strong = (this.intensityNew - sum).toFixed(1);
          } else this.cur_arr = JSON.parse(JSON.stringify(init_C_A));
          this.setConShow = true;
        });
    },
    // 查看训练项目
    getAllPro() {
      this.$axios.get("/runAbility/getTrainingMode").then((res) => {
        let rr = res.data.data;
        rr.forEach((v) => {
          v.edit = false;
          if (
            v.name == "乳酸阈值跑" ||
            v.name == "轻松跑" ||
            v.name == "间歇跑" ||
            v.name == "马拉松配速跑"
          ) {
            v.noEdit = true;
          }
        });
        this.project = rr;
      });
    },
    // 添加训练项目
    addPro() {
      this.project.push({ name: "", info: "", intensity: "", edit: true });
    },
    // 保存训练
    savePro(row) {
      console.log(row);
      if (!row.name && !row.intensity) {
        this.$message.error("请输入名称与系数");
        return false;
      }
      this.$axios.post("/runAbility/putTrainingMode", row).then((res) => {
        let rr = res.data.data;
        if (!row.id) row.id = rr;
        if (
          row.name == "乳酸阈值跑" ||
          row.name == "轻松跑" ||
          row.name == "间歇跑" ||
          row.name == "马拉松配速跑"
        ) {
          row.noEdit = true;
        }
        row.edit = false;
      });
    },
    // 删除训练
    delPro(i, id) {
      console.log(i, id);
      if (id) {
        this.$axios
          .get("/runAbility/delTrainingMode?id=" + id)
          .then((res) => {
            this.project.splice(i, 1);
          });
      } else {
        this.project.splice(i, 1);
      }
    },
    // 选择训练方式
    ctrain(row) {
      row.pace = "";
      row.coefficient = "";
      let v = itPace[row.info];
      let vi = row.info;
      if (v) {
        row.pace = v;
      }
      let p = this.project.find((d) => {
        return d.name == vi;
      });
      if (p) row.coefficient = p.intensity;
      if (!vi) {
        row.useTime = "";
        row.intensity = 0;
      }
    },

    // 强度系数改变 计算强度值
    getStrong(row) {
      if (row) {
        if (row.coefficient && row.useTime) {
          row.intensity = (
            Number(row.coefficient) * Number(row.useTime)
          ).toFixed(1);
        } else {
          row.intensity = 0;
        }
      }
      var sum = this.cur_arr.reduce((sum, cur) => {
        return Number(sum) + Number(cur.intensity);
      }, 0);
      this.has_strong = (this.intensityNew - sum).toFixed(1);
    },

    // 输入框 训练分钟数
    ipt(v) {
      if (isNaN(v.useTime)) {
        this.$message.error("请输入数字");
        v.intensity = 0;
        v.useTime = "";
        this.$forceUpdate();
      }
      this.getStrong(v);
    },
    // 训练内容保存
    saveCon() {
    //   console.log(aeValId, this.cur_arr);
      let oo = {
        id: aeValId,
        list: this.cur_arr,
      };
      oo.list.forEach((s) => {
        s.coefficient = Number(s.coefficient);
        s.useTime = Number(s.useTime);
      });
      // console.log(oo)
      this.$axios
        .post("/runAbility/putPersonRunAbilityDrill", oo)
        .then((res) => {
          this.$message.success("保存成功");
          this.setConShow = false;
        });
    },
  },
  created() {
    initV.planId = this.$route.query.id;
    this.getPlan();
    this.getAllPro();
  },
};
</script>
<style lang="scss" scoped>
/* @import url(); 引入公共css类 */
.trainPerson {
  @include padShow();
}

.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-dialog {
  margin: 0 !important;
}
</style>