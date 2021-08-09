<template>
  <!-- 赛事 商品推荐 -->
  <div class="advW">
    <el-form :inline="true">
      <el-form-item>
        <el-select
          class="select long"
          v-model="mId"
          filterable
          multiple
          clearable
          placeholder="请选择"
          @change="togM"
        >
          <el-option v-for="item in matchList" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span class="yd">{{ item.showDate }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="tabData" style="margin-top:10px;">
      <el-table-column label="商品图片" align="center">
        <template slot-scope="{row}">
          <div class="ImgA" v-if="row.imgUrl">
            <div class="imgB">
              <img :src="row.imgUrl" class="img" />
            </div>
          </div>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="{row}">
          <el-select
            filterable
            v-model="row.name"
            default-first-option
            placeholder="请选择或输入"
            @change="toggleL(row)"
          >
            <el-option
              v-for="item in allGoods"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{$index}">
          <el-button
            type="primary"
            icon="el-icon-top"
            circle
            v-if="$index!=0"
            @click="tabData.splice($index -1,0,tabData[$index]);tabData.splice($index+1, 1);"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-bottom"
            circle
            v-if="$index!=tabData.length-1"
            @click="tabData.splice($index + 2,0,tabData[$index]);tabData.splice($index, 1);"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="tabData.splice($index,1)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" class="sb" @click="save">保存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matchList: [{ id: 0, name: "全选" }],
      mId: "",
      allGoods: [],
      tabData: [
        { imgUrl: "", name: "", price: "", actPrice: "", links: "", id: "" },
      ],
    };
  },
  methods: {
    init() {
      let obj = { orgId: window.sessionStorage.getItem("orgId") };
      // console.log(obj)
      this.$axios.get("/match/getMatchByOrgId", { params: obj }).then((res) => {
        let rr=res.data.data
        rr.forEach((vv) => {
          vv.states = this.$nowInDateBetwen(vv.matchDate, vv.matchEndDate);
          vv.showDate = vv.matchDate.substring(0, 10);
        });
        this.matchList=rr
        this.mId = [rr[0].id];
        console.log(this.mId)
        this.getGoods();
      });
      this.$axios
        .get("http://report.lvtutech.com/sbr/sbr/match/getShopKu")
        .then((res) => {
          let rr = res.data.data;
          this.allGoods = rr;
        });
    },
    add() {
      this.tabData.push({
        imgUrl: "",
        name: "",
        price: "",
        actPrice: "",
        links: "",
        id: "",
      });
    },
    toggleL(val) {
      //   console.log(val);
      let a = this.allGoods.find((v) => {
        return v.name == val.name;
      });
      if (a) {
        val.imgUrl = a.imgUrl;
        val.price = a.price;
        val.actPrice = a.actPrice;
        val.links = a.links;
        val.id = 0;
        val.matchId = 0;
      }
    },
    togM(val) {
      if (val.length > 0) {
        if (val[val.length - 1] == 0) {
          this.mId = [0];
        } else {
          let a = val.findIndex((item) => item === 0);
          if (a >= 0) {
            val.splice(a, 1);
          }
          this.mId = val;
        }
        this.getGoods();
      } else {
        this.mId = "";
        this.tabData = [];
      }
    },
    save() {
      let oo = {
        matchIds: "",
        shops: [],
      };
      if (this.mId.length == 0) {
        this.$message.error("请选择赛事");
        return false;
      } else {
        if (this.mId[0] == 0) {
          oo.matchIds = this.matchList
            .map(function (elem, index) {
              if (elem.id != 0) {
                return elem.id;
              }
            })
            .join(",");
        } else {
          oo.matchIds = this.mId.join(",");
        }
      }
      let a = this.tabData.find((v) => {
        return v.name == "";
      });
      if (a) {
        this.$message.error("请选择商品");
      } else {
        oo.shops = this.tabData;
        this.$axios
          .post("/match/addMatchShop", oo)
          .then((res) => {
            this.$message.success("保存成功");
          })
          .catch((err) => {
            this.$message.error("保存失败");
          });
      }
    },
    getGoods() {
      let oo = { matchId: "" };
      if (this.mId.length == 0) {
        this.$message.error("请选择赛事");
        return false;
      } else {
        if (this.mId[0] == 0) {
          oo.matchId = this.matchList
            .map(function (elem, index) {
              if (elem.id != 0) {
                return elem.id;
              }
            })
            .join(",");
        } else {
          oo.matchId = this.mId.join(",");
        }
        this.$axios.get("/match/getMatchShop", { params: oo }).then((res) => {
          let rr = res.data.data;
          if (rr.length == 0) {
            rr = [
              {
                imgUrl: "",
                name: "",
                price: "",
                actPrice: "",
                links: "",
                id: "",
              },
            ];
          }
          this.tabData = rr;
        });
      }
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.advW {
  @include padShow();
  .select {
    width: 250px;
  }
  .long {
    width: 440px;
    margin-right: 20px;
  }
}
.yd {
  float: right;
  color: #8492a6;
  font-size: 13px;
  margin-right: 20px;
}
.img {
  width: 70px;
  height: 70px;
}
.sb {
  margin-top: 20px;
}
</style>
