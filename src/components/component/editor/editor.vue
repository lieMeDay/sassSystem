<template>
  <div id="txt_fuwb">
    <!-- 图片上传组件辅助-->
    <el-upload
      class="avatar-uploader"
      :action="serverUrl"
      name="img"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
      style="display:none;"
    ></el-upload>
    <!-- 
    ref="myQuillEditor"-->
    <quill-editor
      v-model="content"
      :options="editorOption"
      ref="myQuillEditor"
      @change="onEditorChange($event)"
      style="height:300px;"
    ></quill-editor>
  </div>
</template>

<script>

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", "medium", "large", "huge", "false"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
  ["link", "image", "video"],
];
export default {
  data() {
    return {
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      content: null,
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            },
          },
        },
      },
      // serverUrl:"http://192.168.1.24:8899/upload/img",
      // serverUrl: "http://www.xian-zong.com/api/upload/img", // 这里写你要上传的图片服务器地址
      serverUrl: "http://mm.lvtutech.com/api/upload/img",
    };
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      //内容改变事件
      // console.log("---内容改变事件---");
      this.content = html;
        // console.log(html);
    },
    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },

    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data.filePath);
        // console.log(res.data.filePath)
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
  },
  mounted() {

  },
};
</script>
<style scoped>
#txt_fuwb {
  height: 360px;
}
#txt_fuwb >>> .quill-editor {
  height: 360px !important;
}
#txt_fuwb >>> .ql-container {
  height: 300px;
}
#txt_fuwb >>>.ql-snow .ql-tooltip.ql-flip{
  left: 0 !important;
}

/* 滚动条样式 */
#txt_fuwb >>> .ql-editor::-webkit-scrollbar {
  width: 4px;
}

#txt_fuwb >>> .ql-editor::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  background: #535353;
}

#txt_fuwb >>> .ql-editor::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  border-radius: 10px;
  background: #ededed;
}
@media screen and (max-width: 1350px) {
  #txt_fuwb {
    height: 400px;
  }
  #txt_fuwb >>> .quill-editor {
    height: 400px !important;
  }
  #txt_fuwb >>> .ql-container {
    height: 300px;
  }
}
</style>
<style lang="scss" scoped>
#txt_fuwb >>> .ql-editor {
  // 滚动条样式
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    @include scrollCss-thumb();
  }

  &::-webkit-scrollbar-track {
    @include scrollCss-track();
  }
}
</style>
