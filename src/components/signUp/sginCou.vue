<template>
  <div class="sginCou">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label>
        <el-select v-model="mId" placeholder="请选择" @change="getSGroup">
          <el-option
            v-for="item in mArr"
            :key="item.matchId"
            :label="item.name"
            :value="item.matchId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-select v-model="gId" placeholder="请选择" @click="getShop">
          <el-option v-for="item in gArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" class="tab">
      <el-table-column prop="shopName" label="优惠券名称">
        <template slot-scope="{row}">
          <el-input v-model="row.shopName" placeholder="请输入名称"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="shopImg" label="优惠券图片" width="100">
        <template slot-scope="{row}">
          <div v-if="row.shopImg" class="logoB">
            <img :src="row.shopImg" class="avatar" />
            <div class="logoA">
              <i class="el-icon-delete delI" @click="row.shopImg=''"></i>
            </div>
          </div>
          <el-upload
            v-else
            class="avatar-uploader"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="(res,file)=>{AvatarSuccess(row,res,file)}"
            :before-upload="beforeAvatarUpload"
            name="img"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="shopLinks" label="优惠券链接">
        <template slot-scope="{row}">
          <el-input v-model="row.shopLinks" placeholder="请输入名称"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="是否有效" width="100">
        <template slot-scope="{row}">
          <el-select v-model="row.state" placeholder="请选择">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="60">
        <template slot-scope="{$index}">
          <el-button type="danger" @click="tableData.splice($index,1)" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="add">添加</el-button>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mId: "",
      gId: "",
      mArr: [],
      gArr: [],
      tableData: [
        {
          id: 0,
          shopImg: "",
          shopName: "",
          shopLinks: "",
          state: 1,
        },
      ],
      actionUrl: "",
    };
  },
  methods: {
    getSMatch() {
      let orgId = window.sessionStorage.getItem("orgId");
      // console.log(orgId)
      this.$axios.get("/match/signUp/getByOrgId?orgId=" + orgId).then((res) => {
        let rr = res.data.data;
        this.mArr = rr;
        if (rr.length > 0) {
          this.mId = rr[0].matchId;
          this.getSGroup();
        }
      });
    },
    getSGroup() {
      this.$axios.get("/match/getMatchById?matchId=" + this.mId).then((res) => {
        let rr = res.data.data.matchInfo;
        this.gArr = rr;
        if (rr.length > 0) {
          this.gId = rr[0].id;
          this.getShop();
        }
      });
    },
    getShop() {
      let oo = { matchId: this.mId, groupId: this.gId };
      this.$axios("/match/signUp/getMatchSignUpShop", { params: oo }).then(
        (res) => {
          let rr = res.data.data;
          if (rr.length > 0) this.tableData = rr;
        }
      );
    },
    AvatarSuccess(row, res, file) {
      console.log(res);
      row.shopImg = res.data.filePath;
    },
    beforeAvatarUpload(params) {
      const isLt2M = params.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    add() {
      this.tableData.push({
        id: 0,
        shopImg: "",
        shopName: "",
        shopLinks: "",
        state: 1,
      });
    },
    save() {
      let oo = {
        matchId: this.mId,
        groupId: this.gId,
        list: this.tableData.filter((v) => {
          return v.shopLinks != "";
        }),
      };
      if (oo.list.length == 0) {
        this.$message.error("请填写优惠券");
        return false;
      }
      this.$axios.post("/match/signUp/putMatchSignUpShop", oo).then((res) => {
        this.$message.success("保存成功");
      });
    },
  },
  created() {
    this.actionUrl = this.$img_url + "/match/uploadImg";
    this.getSMatch();
  },
};
</script>
<style lang="scss" scoped>
.sginCou {
  @include padShow();
}
.tab {
  width: 100%;
  margin-bottom: 20px;
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
</style>