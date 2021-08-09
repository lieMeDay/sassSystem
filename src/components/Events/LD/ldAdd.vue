<template>
  <!-- 抽奖活动添加 -->
  <div class="addWrap">
    <div class="addBox">
      <div class="inbBox">
        <div class="in-b">
          <span>选择赛事</span>
          <el-select v-model="matchId" placeholder="请选择" :disabled="dcantoggle" @change="toggleM">
            <el-option v-for="item in matchList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <el-collapse accordion>
        <el-collapse-item v-for="(v, i) in LDData" :key="i">
          <template slot="title">
            <div class="actI">活动{{ i + 1 }}</div>
            <span>活动名称</span>
            <el-input v-model="v.lotteryName" placeholder="请输入内容" class="en"></el-input>
            <span>活动有效时间</span>
            <el-date-picker
              v-model="v.edate"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </template>
          <div class="in-b btn-see" v-if="v.id">
            <el-button type="primary" @click="seeLdRecord(v.id)">抽奖记录</el-button>
            <el-button type="primary" @click="goPer(v.id)">抽奖人员名单</el-button>
          </div>
          <div class="tips">
            <el-input type="textarea" :rows="4" placeholder="请输入抽奖说明" v-model="v.lotteryRule"></el-input>
          </div>
          <div class="tabBox">
            <el-table :data="v.prizeInfos" border style="width: 100%">
              <el-table-column label="名称">
                <template slot-scope="{ row }">
                  <el-input v-model="row.name" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="图片" align="center">
                <template slot-scope="{ row }">
                  <div class="changeLogo" v-if="!row.prizeImg">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    <input type="file" class="chooseIpt" @change="upLogo($event, row)" />
                  </div>
                  <div v-else class="seeLogo">
                    <img :src="row.prizeImg" alt />
                    <span class="avatar-uploader-icon">
                      <i
                        class="el-icon-delete"
                        @click="
                          row.prizeImg = '';
                          $forceUpdate();
                        "
                      ></i>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="发布数量" align="center">
                <template slot-scope="{ row, $index }">
                  <el-input
                    class="iptBox"
                    v-model="row.num"
                    placeholder="请输入内容"
                    @input="$forceUpdate()"
                    @change="pDNum($event, $index, 1, v)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="已抽取数量" align="center" v-if="v.id">
                <template slot-scope="{ row }">
                  <span>{{ row.coun }}</span>
                </template>
              </el-table-column>
              <el-table-column label="概率" align="center">
                <template slot-scope="{ row, $index }">
                  <el-input
                    class="iptBox"
                    v-model="row.prizeProb"
                    placeholder="请输入内容"
                    @input="$forceUpdate()"
                    @change="pDNum($event, $index, 2, v)"
                    :disabled="$index == v.prizeInfos.length - 1"
                  >
                  <!-- @input="change($event, $index, v)" -->
                    <span slot="suffix" class="dw">%</span>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否显示" align="center">
                <template slot-scope="{ row, $index }">
                  <el-radio-group v-model="row.state" @change="togState($event, $index, v)">
                    <el-radio :label="1" :disabled="$index == v.prizeInfos.length - 1">是</el-radio>
                    <el-radio :label="0" :disabled="$index == v.prizeInfos.length - 1">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column label="奖品链接" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.prizeLinks" placeholder="请输入奖品链接"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{ $index }">
                  <el-button
                    type="danger"
                    size="medium"
                    v-if="$index != v.prizeInfos.length - 1"
                    @click="delLine($index, v)"
                  >删除</el-button>
                  <el-button type="danger" size="medium" disabled v-else>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <p class="tabTips">* 该抽奖活动为九宫格抽奖，显示数量需为8条</p>
          </div>
          <div class="sbb">
            <el-button type="primary" @click="addJP(v)">添加奖品</el-button>
            <el-button type="primary" @click="save(v, i)">保存</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-button type="primary" @click="addBig">添加活动</el-button>
    </div>
  </div>
</template>

<script>
/*解决两个数相加精度丢失问题*/
const floatAdd = (a, b) => {
  var c, d, e;
  if (undefined == a || null == a || "" == a || isNaN(a)) {
    a = 0;
  }
  if (undefined == b || null == b || "" == b || isNaN(b)) {
    b = 0;
  }
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return (floatMul(a, e) + floatMul(b, e)) / e;
};
/*解决两个数相乘精度丢失问题*/
const floatMul = (a, b) => {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return (
    (Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c)
  );
};
//判断两个时间是否有交集
function isDateIntersection(start1, end1, start2, end2) {
  var x = new Date(start1.replace("-", "/").replace("-", "/")).getTime();
  var y = new Date(end1.replace("-", "/").replace("-", "/")).getTime();

  var a = new Date(start2.replace("-", "/").replace("-", "/")).getTime();
  var b = new Date(end2.replace("-", "/").replace("-", "/")).getTime();

  // if (startdate1 >= startdate2 && startdate1 <= enddate2) {

  //     return true;
  // }

  // if (enddate1 >= startdate2 && enddate1 <= enddate2) {
  //     return true;
  // }

  // if (startdate1 <= startdate2 && enddate1 >= enddate2) {
  //     return true;
  // }
  if (y < a || b < x) return false;
  else return true;
}
var mId = "";
export default {
  data() {
    return {
      matchList: [],
      LDData: [],
      matchId: "",
      dcantoggle: false,
      Deployment: 0,
    };
  },
  methods: {
    // 切换赛事
    toggleM(v) {
      this.matchId = v;
      let tt = this.matchList.filter((vv) => vv.id == v);
      this.LDData = [];
      this.addBig();
    },

    change(v, i, row) {
      let n = 0;
      for (let a = 0; a < row.prizeInfos.length - 1; a++) {
        if (row.prizeInfos[a].state == 1) {
          // n += Number(row.prizeInfos[a].prizeProb);
          n = floatAdd(n, Number(row.prizeInfos[a].prizeProb));
        }
      }
      if (100 - n < 0) {
        this.$confirm("概率总和为100", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        }).then(() => {
          row.prizeInfos[i].prizeProb = "";
        });
      } else {
        row.prizeInfos[row.prizeInfos.length - 1].prizeProb = Number(
          1 - n
        ).toFixed(3);
      }
      this.$forceUpdate();
    },
    //   数字判断
    pDNum(val, index, i, V) {
      // d ==> priceList
      if (isNaN(val)) {
        this.$confirm("请输入数字", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        }).then(() => {
          if (i === 1) {
            V.prizeInfos[index].num = "";
          } else if (i == 2) {
            V.prizeInfos[index].prizeProb = "";
          }
          this.$forceUpdate();
        });
      } else {
        if (i == 2) {
          if (val > 100 || val < 0) {
            this.$confirm("概率为0~100", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              showClose: false,
              closeOnClickModal: false,
              type: "warning",
            });
          }
          // let num = 0;
          // row.prizeInfos.map((v) => {
          //   if (v.state == 1) {
          //     num = floatAdd(num, v.prizeProb);
          //   }
          // });
          // this.Deployment = 0;
          // if (num < 100) {
          //   this.Deployment = (100 - num).toFixed(2);
          // }
        } else if (i == 1) {
          // V.prizeInfos[index].prizeProb = "";
          let sum = 0;
          // console.log(V.prizeInfos);
          V.prizeInfos.map((vv) => {
            if (vv.state == 1) {
              let n = vv.num;
              if (!n) n = 0;
              sum += parseInt(n);
            }
          });
          // console.log(sum);
          // let num = 0;
          V.prizeInfos.forEach((vv) => {
            if (vv.state == 1) {
              if(sum>0)
              vv.prizeProb = Math.ceil((Number(vv.num) / sum) * 10000) / 100;
              else vv.prizePro=0
              // num = floatAdd(num, v.prizeProb);
            }
          });
          // this.Deployment = 0;
          // if (num < 100) {
          //   this.Deployment = (100 - num).toFixed(2);
          // }
        }
      }
    },
    togState(v, i, row) {
      let n = 0;
      // console.log(row.prizeInfos);
      for (let a = 0; a < row.prizeInfos.length - 1; a++) {
        if (row.prizeInfos[a].state == 1) {
          // n += Number(row.prizeInfos[a].prizeProb);
          n = floatAdd(n, Number(row.prizeInfos[a].prizeProb));
        }
      }
      if (100 - n < 0) {
        this.$confirm("概率总和为100", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          type: "warning",
        }).then(() => {
          row.prizeInfos[i].prizeProb = "";
        });
      } else {
        let sum = 0;
        row.prizeInfos.map((vv) => {
          if (vv.state == 1) {
            let n = vv.num;
            if (!n) n = 0;
            sum += parseInt(n);
          } else {
            vv.prizeProb = 0;
          }
        });
        console.log(sum)
        row.prizeInfos.forEach((vv) => {
            // console.log(vv)
          if (vv.state == 1) {
            if(sum>0){
            vv.prizeProb = Math.ceil((Number(vv.num) / sum) * 10000) / 100;
            }else{
              vv.prizeProb=0
            }
          }
        });
        // row.prizeInfos[row.prizeInfos.length - 1].prizeProb = Number(
        //   1 - n
        // ).toFixed(3);
      }
      this.$forceUpdate();
    },
    // 上传logo
    upLogo(e, row) {
      // console.log(e, row);
      if (e) {
        row.logo = "";
        let file = e.target.files[0];
        let param = new FormData(); //创建form对象
        param.append("img", file); //通过append向form对象添加数据
        // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers: { "Content-Type": "multipart/form-data" },
        }; //添加请求头
        this.$axios
          .post("/match/uploadImg", param, config)
          .then((res) => {
            row.prizeImg = res.data.data.filePath;
            // console.log(row)
            this.$forceUpdate();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getALd() {
      let oo = { matchId: mId };
      this.$axios
        .get("/activity/getLotteryByMatchId", { params: oo })
        .then((res) => {
          this.$axios.get("/match/getMatchById", { params: oo }).then((val) => {
            let vv = val.data.data;
            this.matchList.push({ id: vv.id, name: vv.name });
            let rr = res.data.data;
            rr.forEach((v) => {
              let i = v.prizeInfos.findIndex((s) => {
                return s.type == 1;
              });
              let iv = v.prizeInfos.splice(i, 1)[0];
              v.prizeInfos.push(iv);
              v.edate = [
                this.$timestamp(v.startTime),
                this.$timestamp(v.endTime),
              ];
            });
            if (this.$route.query.aId) {
              let aId = this.$route.query.aId;
              rr = rr.filter((v) => {
                return v.id == aId;
              });
            }
            this.LDData = rr;
          });
        });
    },
    // 查看抽奖记录
    seeLdRecord(v) {
      this.$router.push({
        path: "/luckyDraw/ldRecord",
        query: {
          id: v,
        },
      });
    },
    // 查看抽奖人员
    goPer(v) {
      this.$router.push({
        path: "/luckyDraw/ldper",
        query: {
          id: v,
        },
      });
    },

    // 保存
    save(vv, i) {
      let that = this;
      let tt = vv.prizeInfos;
      let oo = tt.filter((v) => v.state == 1);
      if (this.LDData.length > 1) {
        for (let a = 0; a < this.LDData.length; a++) {
          if (a != i) {
            let darea = isDateIntersection(
              vv.edate[0],
              vv.edate[1],
              this.LDData[a].edate[0],
              this.LDData[a].edate[1]
            );
            if (darea) {
              this.$message.warning("该时间内已有活动");
              return false;
            }
          }
        }
      }
      if (oo.length != 8) {
        this.$message.warning("显示数量需为8条");
      } else {
        tt.forEach((v) => (v.matchId = this.matchId));
        vv.startTime = new Date(vv.edate[0]).getTime();
        vv.endTime = new Date(vv.edate[1]).getTime();
        vv.groupId = "";
        vv.matchId = this.matchId;
        vv.orgId = window.sessionStorage.getItem("orgId");
        // 修改保存
        if (vv.id) {
          this.bsave(vv);
        } else {
          // 添加保存
          this.asave(vv);
        }
      }
    },
    // 添加保存
    asave(obj) {
      // console.log(JSON.stringify(obj))
      this.$axios.post("/activity/addLottery", obj).then((res) => {
        this.$alert("添加成功", "提示", {
          confirmButtonText: "确定",
          showClose: false,
          closeOnClickModal: false,
          type: "success",
          callback: (action) => {
            if (action == "confirm") {
              this.$router.push("/luckyDraw");
            }
          },
        });
      });
    },
    // 修改保存
    bsave(obj) {
      // console.log(obj);
      // let oo=obj.prizeInfos.filter(v=>!v.id)
      // console.log(oo)
      // this.editBsave(oo,0,oo.length)
      this.$axios
        .put("/activity/putLottery", obj)
        .then((res) => {
          this.$message.success("修改成功");
        })
        .catch((err) => {
          this.$message.error("修改失败");
        });
    },

    delLine(i, row) {
      row.prizeInfos.splice(i, 1);
      let n = 0;
      // console.log(row.prizeInfos);
      for (let a = 0; a < row.prizeInfos.length - 1; a++) {
        if (row.prizeInfos[a].state == 1) {
          // n += Number(row.prizeInfos[a].prizeProb);
          n = floatAdd(n, Number(row.prizeInfos[a].prizeProb));
        }
      }
      if (1 - n < 0) {
      } else {
        row.prizeInfos[row.prizeInfos.length - 1].prizeProb = Number(
          1 - n
        ).toFixed(3);
      }
      this.$forceUpdate();
    },
    // 添加奖品
    addJP(v) {
      let obj = {
        name: "",
        prizeImg: "",
        num: "",
        prizeProb: "",
        prizeLinks: "",
        state: 0,
        type: 0,
      };
      // this.tableData.push(obj);
      v.prizeInfos.splice(v.prizeInfos.length - 1, 0, obj);
    },
    // 添加活动
    addBig() {
      let oo = {
        lotteryName: "",
        lotteryRule: "",
        matchId: "",
        prizeInfos: [
          {
            name: "谢谢参与",
            prizeImg: "",
            num: "",
            state: 1,
            prizeProb: "1",
            type: 1,
          },
        ],
      };
      this.LDData.push(oo);
    },
    // 获取赛事
    getMatch() {
      // console.log(window.sessionStorage.getItem('orgId'))
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      // console.log(obj)
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        let rr = res.data.data;
        this.$axios
          .get("/activity/getLotteryList", { params: obj })
          .then((val) => {
            let ss = val.data.data;
            let r = rr.filter(function (item) {
              ss.find((v) => v.id == item.id);
              if (!ss.find((v) => v.id == item.id)) {
                return { id: item.id, name: item.name };
              }
            });
            this.matchList = r;
            this.matchId = this.matchList[0].id;
            this.addBig();
          });
      });
    },
  },
  mounted() {
    if (this.$route.query.mId) {
      mId = this.$route.query.mId;
      this.matchId = Number(mId);
      this.dcantoggle = true;
      this.getALd();
      // this.getLd();
    } else {
      this.getMatch();
    }
  },
};
</script>

<style lang="scss" scoped>
.dw {
  line-height: 40px;
  font-size: 16px;
  color: #000;
}
.addWrap {
  @include padShow();
  .addBox {
    width: 100%;
    .inbBox {
      overflow: hidden;
    }
    .in-b {
      float: left;
      margin-bottom: 15px;
      &:first-child {
        margin-right: 20px;
      }
      &.btn-see {
        margin-left: 20px;
      }
      span {
        float: left;
        margin-right: 10px;
        line-height: 40px;
      }
    }
  }
}
.en {
  float: left;
  width: 250px;
}
.tips {
  overflow: hidden;
  width: 100%;
}
.tab {
  width: 100%;
  margin-top: 20px;
  overflow: hidden;
}
.tabBox {
  margin-top: 15px;
  & >>> .el-table__row td {
    padding: 0;
  }
}
.actI {
  margin-right: 10px;
}
.changeLogo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 50px;
  height: 50px;
  margin: 5px auto;
  &:hover {
    border-color: #409eff;
  }
  .chooseIpt {
    position: absolute;
    width: 50px;
    height: 50px;
    opacity: 0;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  input {
    cursor: pointer;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.seeLogo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 50px;
  height: 50px;
  margin: 5px auto;
  img {
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -1;
    color: white;
    background-color: rgba($color: #000, $alpha: 0.4);
  }
  &:hover .avatar-uploader-icon {
    z-index: 2;
    opacity: 1;
  }
}
.sbb {
  width: 100%;
  overflow: hidden;
  margin-top: 15px;
  text-align: center;
}
.tabTips {
  width: 100%;
  font-size: 14px;
  line-height: 30px;
  color: red;
}
</style>

