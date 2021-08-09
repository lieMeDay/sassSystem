<template>
  <!-- 完赛证书模板 -->
  <div class="cavCer">
    <div class="cavTit">
      <div class="txt">编辑完赛证书模板</div>
      <div class="btnBox">
        <div>
          <el-button type="text" icon="el-icon-upload" class="cPic">
            选择模板图片
            <input type="file" class="iptA" name="" id="cIpt" @change="upPic">
          </el-button>
          <div class="s">|</div>
        </div>
        <div>
          <el-button type="text" icon="el-icon-circle-plus-outline" @click="addDom">添加项目</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="delDom">删除项目</el-button>
          <div class="s">|</div>
        </div>
        <div>
          <el-button type="text" icon="el-icon-upload" @click="save">保存文字</el-button>
        </div>
        <div>
          <i class="el-icon-close closeB" @click="alertClose"></i>
        </div>
      </div>
    </div>
    <div class="cavWrap">
      <div class="cavLeft" ref="cavBox">
        <div class="cavPb" ref="tocav">
          <div
            class="cc"
            v-for="(item,index) in listDom"
            :key="index"
            :class="[{'act':String(selectedI)==String(index)},`${index}`]"
            :style="{fontSize:item.fontSize+'px',color:item.fontColor}"
            ref="cb"
            @click="selectedI=index;showX=item.left;showY=item.top;showFS=item.fontSize;showColor=item.fontColor"
            @mousedown="movePos"
          >
          <!-- <img :style="{width:item.imgSize+'px'}" :src="item.val" v-if="item.name=='erCode'"> -->
          {{item.val}}
          <!-- <div @mousedown="movePos">{{item.val}}</div> -->
          </div>
          <img :src="image" alt="" v-show="image">
        </div>
      </div>
      <div class="cavRight">
        <div v-if="String(selectedI)==''">请添加或选择</div>
        <ul v-else>
          <li>
            <span>字段名</span>
            <div>
              <el-select @change="selectChanged" v-model="nameOpt" placeholder="请选择">
                <el-option
                  v-for="item in nameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <span>x</span>
            <div>
              <el-input v-model="showX" placeholder="0" @keyup.enter.native="changeC(1)"></el-input>
            </div>
          </li>
          <li>
            <span>y</span>
            <div>
              <el-input v-model="showY" placeholder="0" @keyup.enter.native="changeC(2)"></el-input>
            </div>
          </li>
          <li>
            <span>字体大小</span>
            <div>
              <el-input v-model="showFS" placeholder="16" @keyup.enter.native="changeC(3)">
                <template slot="append" class="nop">px</template>
              </el-input>
            </div>
          </li>
          <li>
            <span>颜色</span>
            <div>
              <el-color-picker v-model="showColor" @change="colorC" size="mini"></el-color-picker>
            </div>
          </li>
          <li>
            <span>分享码大小</span>
            <div>
              <el-input v-model="showSize" placeholder="30" @keyup.enter.native="changeC(4)">
                <template slot="append" class="nop">px</template>
              </el-input>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
var hasMsg = {};
export default {
  data() {
    return {
      cerVal: "",
      image: "",
      imgUrl: "",
      listDom: [],
      nameList: [
        {
          value: "name",
          label: "选手姓名",
        },
        {
          value: "entryNumber",
          label: "选手赛号",
        },
        {
          value: "groupName",
          label: "赛项",
        },
        {
          value: "sex",
          label: "性别",
        },
        {
          value: "dis",
          label: "距离",
        },
        {
          value: "rank",
          label: "排名",
        },
        {
          value: "sexRank",
          label: "性别排名",
        },
        {
          value: "useTime",
          label: "比赛用时",
        },
        {
          value: "useHH",
          label: "比赛用时·小时",
        },
        {
          value: "useMM",
          label: "比赛用时·分钟",
        },
        {
          value: "useSS",
          label: "比赛用时·秒",
        },
        {
          value: "justHH",
          label: "比赛用时·(仅时)",
        },
        {
          value: "pace",
          label: "配速",
        },
        {
          value:'cardNum',
          label:"打卡次数"
        }
        // {
        //   value: "erCode",
        //   label: "分享码",
        // },
      ],
      nameOpt: "选手姓名",
      showX: 0,
      showY: 0,
      showFS: 16,
      showColor: "#000",
      selectedI: "", //选中的字段下标
      showSize:30
    };
  },
  watch: {
    cerVal(val) {
      // console.log(this.cerVal.imgUrl);
      if (this.cerVal.imgUrl) {
        hasMsg = this.cerVal;
        this.getImg(this.cerVal.imgUrl, "h");
      } else {
        this.getImg();
      }
    },
  },
  methods: {
    // 上传图片
    upPic(e) {
      let that = this;
      that.image = "";
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append("img", file); //通过append向form对象添加数据 // console.log(param.get("img")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      that.$axios
        .post("/match/uploadImg", param, config)
        .then((res) => {
          //   console.log(res.data);
          that.imgUrl = res.data.data.filePath;
          that.getImg(that.imgUrl);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //   键盘回车
    changeC(i) {
      let d = this.listDom[this.selectedI];
      if (i == 3) {
        d.fontSize = this.showFS;
      }else if (i==4){
        d.imgSize=this.showSize
      }
    },
    //   添加字段
    addDom() {
      if (this.imgUrl != "") {
        this.listDom.push({
          fontColor: "#000000",
          fontSize: 16,
          left: 0,
          name: "name",
          top: 0,
          val: "张三",
        });
        this.selectedI = this.listDom.length - 1;
        this.nameOpt = this.listDom[this.selectedI].name;
        this.showX = this.listDom[this.selectedI].left;
        this.showY = this.listDom[this.selectedI].top;
        this.showFS = this.listDom[this.selectedI].fontSize;
        this.showColor = this.listDom[this.selectedI].fontColor;
      } else {
        this.$message.error("请选择消息模板");
      }
    },
    // 删除字段
    delDom() {
      console.log(11, this.selectedI);
      if (this.selectedI || this.selectedI == 0) {
        let a = this.listDom;
        // console.log(a[this.selectedI].left, a[this.selectedI].top);

        this.listDom.splice(this.selectedI, 1);
        this.$forceUpdate();
        console.log(this.listDom);
        this.selectedI = "";
      }
    },
    // 改变字段状态
    selectChanged(value) {
      //   console.log(value);
      // name entryNumber  groupName  useTime  rank   sexRank  height  width
      let d = this.listDom[this.selectedI];
      if (value == "name") {
        d.name = "name";
        d.val = "张三";
      } else if (value == "entryNumber") {
        d.name = "entryNumber";
        d.val = "1";
      } else if (value == "groupName") {
        d.name = "groupName";
        d.val = "10KM组";
      } else if (value == "dis") {
        d.name = "dis";
        d.val = "1KM";
      }else if (value == "rank") {
        d.name = "rank";
        d.val = "100";
      } else if (value == "sexRank") {
        d.name = "sexRank";
        d.val = "32";
      } else if (value == "sex") {
        d.name = "sex";
        d.val = "男";
      } else if (value == "useTime") {
        d.name = "useTime";
        d.val = "00:00:00";
      } else if (value == "useHH") {
        d.name = "useHH";
        d.val = "00";
      } else if (value == "useMM") {
        d.name = "useMM";
        d.val = "01";
      } else if (value == "useSS") {
        d.name = "useSS";
        d.val = "02";
      }
      /* 
       {
          value: "justHH",
          label: "比赛用时·(仅时)",
        },
        {
          value: "pace",
          label: "配速",
        },
        {
          value:'cardNum',
          label:"打卡次数"
        }
      */
      else if (value == "justHH") {
        d.name = "justHH";
        // d.val = "10.5h";
        d.val = "h";
      }else if (value == "pace") {
        d.name = "pace";
        // d.val = "03'30\"";
        d.val = "p";
      }else if (value == "cardNum") {
        d.name = "cardNum";
        d.val = "21";
      }else if (value == "useSS") {
        d.name = "useSS";
        d.val = "02";
      }
       else if (value == "erCode") {
        d.name = "erCode";
        d.val = "/static/images/share.jpg";
      }
    },
    // 颜色改变
    colorC(value) {
      // console.log(value)
      let d = this.listDom[this.selectedI];
      d.fontColor = value;
    },
    getImg(src, has) {
      // console.log(src,has)
      // src='http://192.168.0.101:9090/wfumg16q.jpg'
      if (src) {
        var img_url = src;
        var img = new Image();
        img.src = img_url;
        img.onload = () => {
          var w = img.width;
          var h = img.height;
          // console.log(w, h);
          // console.log(
          //   this.$refs.cavBox,
          //   this.$refs.cavBox.offsetHeight,
          //   this.$refs.cavBox.offsetWidth
          // );
          var maxWidth = this.$refs.cavBox.offsetWidth - 40;
          var maxHeight = this.$refs.cavBox.offsetHeight - 20;
          if (maxWidth < 200) {
            maxWidth = 200;
          }
          var wb = w / maxWidth;
          var hb = h / maxHeight;
          if (wb >= hb) {
            //宽度固定，高度缩放
            img.width = maxWidth;
            img.height = h / wb;
          } else {
            //高度固定，宽度缩放
            img.height = maxHeight;
            img.width = w / hb;
          }
          // console.log(img.width, img.height);
          this.$refs.tocav.style.width = img.width + "px";
          this.$refs.tocav.style.height = img.height + "px";
          this.image = img_url;
          this.imgUrl = img_url;
          if (has) {
            // console.log(img.width, img.height);
            let str = JSON.parse(hasMsg.items);
            let ww = hasMsg.width;
            let hh = hasMsg.height;
            str.forEach((v, i) => {
              v.left = parseInt((v.left / ww) * img.width);
              v.top = parseInt((v.top / hh) * img.height);
            });
            this.listDom = str;
            this.$nextTick(() => {
              this.listDom.forEach((v, i) => {
                this.$refs.cb[i].style.left =
                  v.left + "px";
                this.$refs.cb[i].style.top =
                  v.top + "px";
                this.$refs.cb[i].style.fontSize = parseInt(
                  v.fontSize * ((img.width / ww + img.height / hh) / 2)
                );
              });
            });
          }
        };
      } else {
        this.image = "";
        this.imgUrl = "";
        this.listDom = [];
      }
    },
    movePos(e) {
      //目标元素
      // console.log(this.$refs.cb)
      // let e=
      // e=this.$refs.cb
      let el = e.target;
      let posX = e.clientX - el.offsetLeft;
      let posY = e.clientY - el.offsetTop;

      document.onmousemove = (e) => {
        //计算元素位置(需要判断临界值)
        let left = e.clientX - posX;
        let top = e.clientY - posY;

        /*****  临界值 starting（此区域代码可注释）  ***/
        // 获取父元素 自元素 的宽高
        let {
          offsetHeight: parentNodeHeight,
          offsetWidth: parentNodeWidth,
          offsetTop: parentNodeTop,
          offsetLeft: parentNodeLeft,
        } = this.$refs.tocav;
        let {
          offsetHeight: sonNodeHeight,
          offsetWidth: sonNodeWidth,
        } = this.$refs.cb[this.selectedI];
        console.log(left,parentNodeLeft)
        // 左上角(left)
        if (left < 0) {
          left = 0;
        }
        if (top < 0) {
          top = 0;
        }
        // 左下角
        if (top > parentNodeHeight-sonNodeHeight) {
          top = parentNodeHeight-sonNodeHeight
        }
        if (left > parentNodeWidth - sonNodeWidth) {
          left = parentNodeWidth - sonNodeWidth
        }
        /*****  临界值 ending  ***/

        this.showX = left;
        this.showY = top;

        //移动当前元素
        el.style.left = left + "px";
        el.style.top = top + "px";
        this.listDom[this.selectedI].left = this.showX;
        this.listDom[this.selectedI].top = this.showY;
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    // 保存
    save() {
      let obj = {};
      obj.items = JSON.stringify(this.listDom);
      obj.imgUrl = this.imgUrl;
      obj.height = this.$refs.tocav.offsetHeight;
      obj.width = this.$refs.tocav.offsetWidth;
      // console.log(obj);
      // console.log(this.cerVal);
      if (this.cerVal.imgUrl) {
        obj.id = this.cerVal.id;
        this.$axios.put("/match/certificate/put", obj).then((res) => {
          let puts = { close: true, id: "" };
          this.$emit("cavcerId", puts);
        });
      } else {
        this.$axios.post("/match/certificate/add", obj).then((res) => {
          let puts = { close: true, id: res.data.data };
          this.$emit("cavcerId", puts);
        });
      }
    },
    // 关闭弹框
    alertClose() {
      // console.log(this.cerVal);
      let puts = { close: true, id: 0 };
      if (this.cerVal) {
        let puts = { close: true, id: this.cerVal };
      }
      this.$emit("cavcerId", puts);
    },
  },
  mounted() {
    let that = this;
    window.onresize = function() {
      that.getImg(that.imgUrl);
      // that.getImg("http://www.xian-zong.com:9090/peit9uyg.png")
    };
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
};
</script>

<style scoped>
.cavCer {
  width: 100%;
  /* height: calc(100% - 32px); */
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  /* top: 32px; */
}
.cavTit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e0e0e0;
  border-bottom: 1px solid #d0d0d0;
  line-height: 50px;
}
.txt {
  padding: 0 10px;
}
.btnBox {
  display: flex;
  margin-right: 10px;
}
.btnBox div {
  display: flex;
  align-items: center;
}
.closeB {
  width: 30px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  font-size: 20px;
}
.s {
  margin: 0 5px;
  color: #409eff;
}
.cavWrap {
  width: 100%;
  height: calc(100% - 50px);
  position: relative;
}
.cavLeft {
  position: absolute;
  width: calc(100% - 260px);
  height: 100%;
  background-color: #fff;
  float: left;
  border-radius: 3px;
  text-align: center;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cavPb {
  display: flex;
  /* margin: auto; */
  position: absolute;
}
img {
  width: 100%;
  height: 100%;
}
.cc {
  background: white;
  color: #000;
  font-size: 16px;
  line-height: 1;
  text-align: center;
  position: absolute;
  cursor: pointer;
  background-color: transparent;
}
.cc.act {
  background-color: #ffff0066;
}
.cavRight {
  width: 260px;
  height: 100%;
  background-color: #e0e0e0;
  float: right;
  line-height: 50px;
}
ul {
  width: 100%;
}

li {
  width: 90%;
  padding: 0 5%;
  border-bottom: 1px solid #999;
  overflow: hidden;
}
li > span {
  width: 35%;
  float: left;
  margin-right: 5%;
  text-align: right;
}
li > div {
  float: left;
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
li > div > * {
  width: 100%;
}
li > div >>> .el-input-group__append {
  padding: 0 5px;
  background-color: #fff;
}
.cPic {
  position: relative;
}
.iptA {
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
