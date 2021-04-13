<template>
  <div class="elUploadContainer">
    <el-upload ref="upload" action="#" list-type="picture-card" :auto-upload="false" :multiple="true" :file-list="fileList" drag :on-change="handleChange" :limit="getLimit" :on-exceed="limitExceed" accept=".jpg,.png">
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url">
        <span class="minWatermark" v-if="watermark.type == 1 && file.isWatermark" :style="getMinWaterTextStyle">{{ watermark.text }}</span>
        <img class="minWatermark" v-if="watermark.type == 2 && file.isWatermark" :src="watermark.imageUrl" :style="getMinWaterImgStyle">

        <span class="el-upload-list__item-actions">
          <span @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in" />
          </span>
          <span @click="handleReplace(file)">
            <i class="el-icon-sort" />
          </span>
          <span @click="handleRemove(file)">
            <i class="el-icon-delete" />
          </span>
          <span style="position:absolute;top:-10px;left:3px;margin:0;" v-if="Object.keys(watermark).length !== 0">
            <el-checkbox v-model="file.isWatermark" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialog.visible" width="540px">
      <div class="maxwatermarkContaier">
        <img class="maxPicture" :src="dialog.imageUrl" ondragstart="return false;" />
        <span class="maxwatermark" v-if="watermark.type == 1 && dialog.isWatermark" :style="getMaxWaterTextStyle">{{ watermark.text }}</span>
        <img class="maxwatermark" v-if="watermark.type == 2 && dialog.isWatermark" :src="watermark.imageUrl" :style="getMaxWaterImgStyle" ondragstart="return false;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from "@/api/shopee/shopeeEditor";
import Sortable from 'sortablejs'
function getFontFamily(type) {
  switch (type) {
    case "fangzhengshusong":
      return "宋体"
    case "fangzhengkaiti":
      return "楷体"
    case "fangzhengheiti":
      return "黑体"
    case "fangzhengfangsong":
      return "仿宋"
    case "wqy-zenhei":
      return "思源黑体 CN Bold"
    case "wqy-microhei":
      return "思源黑体 CN ExtraLight"
  }
}
export default {
  name: "UploadImage",
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    sku: {
      type: [String, Number],
      default: ""
    },
    watermark: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: {
        visible: false,
        imageUrl: '',
        isWatermark: true,
      },
      currentReplaceIndex: null,
    }
  },
  computed: {
    getLimit() {
      return this.currentReplaceIndex ? 10 : 9
    },
    getMaxWaterTextStyle() {
      const { watermark } = this;
      return {
        left: `${watermark.dx / 2}px`,
        top: `${watermark.dy / 2}px`,
        fontSize: `${watermark.size / 2}px`,
        lineHeight: `${watermark.size / 2}px`,
        opacity: watermark.transparency / 100,
        color: watermark.color,
        fontFamily: getFontFamily(watermark.fontType)
      }
    },
    getMaxWaterImgStyle() {
      const { watermark } = this;
      return {
        left: `${watermark.dx / 2}px`,
        top: `${watermark.dy / 2}px`,
        opacity: watermark.transparency / 100,
        width: `${watermark.pretreatment * 5}px`
      }
    },
    getMinWaterTextStyle() {
      const { watermark } = this;
      return {
        left: `${watermark.dx * 146 / 1000}px`,
        top: `${watermark.dy * 146 / 1000}px`,
        fontSize: `${watermark.size * 146 / 100}px`,
        lineHeight: `${watermark.size * 146 / 100}px`,
        transform: `scale(0.1)`,
        opacity: watermark.transparency / 100,
        color: watermark.color,
        fontFamily: getFontFamily(watermark.fontType)
      }
    },
    getMinWaterImgStyle() {
      const { watermark } = this;
      return {
        left: `${watermark.dx * 146 / 1000}px`,
        top: `${watermark.dy * 146 / 1000}px`,
        opacity: watermark.transparency / 100,
        width: `${watermark.pretreatment * 146 / 100}px`
      }
    }
  },
  mounted() {
    this.setSort()
    this.clickEvent = (e) => {
      if (e.target.className !== 'el-upload-dragger') return;
      this.currentReplaceIndex = null;
    }
    this.$refs.upload.$refs["upload-inner"].$el.addEventListener('click', this.clickEvent)
  },
  beforeDestroy() {
    this.$refs.upload.$refs["upload-inner"].$el.removeEventListener('click', this.clickEvent)
    this.clickEvent = null;
  },
  methods: {
    handlePictureCardPreview(file, fileList) {
      this.dialog = {
        imageUrl: file.url,
        isWatermark: file.isWatermark,
        visible: true,
      }
    },
    handleReplace(file) {
      this.$refs.upload.$refs["upload-inner"].$el.click()
      const fileList = this.$refs.upload.uploadFiles;
      this.currentReplaceIndex = fileList.indexOf(file);
    },
    handleRemove(file) {
      this.$refs.upload.handleRemove(file)
      const fileList = this.$refs.upload.uploadFiles;
      this.$emit("update:fileList", fileList)
    },
    async handleChange(file, fileList) {
      const { currentReplaceIndex, $message } = this
      const regExcel = /(\.jpg)|(\.png)/
      this.handleRemove(file)
      if (!this.sku) {
        $message({ type: "warning", message: "请选择店铺" })
        return
      }
      if (!regExcel.test(file.raw.name) && (file.size / 1024 / 1024 <= 2)) {
        $message({ type: "warning", message: "允许上传png/jpg图片格式,且图片大小于2MB" })
        return
      }
      const formData = new FormData();
      formData.append('file', file.raw);
      formData.append('sku', this.sku);
      const res = await uploadImage(formData)
      if (currentReplaceIndex !== null) {
        // this.$refs.upload.$children[0].$el.childNodes[currentReplaceIndex].style.display = "none"
        // fileList.splice(currentReplaceIndex, 1, { url: res.message })
        fileList[currentReplaceIndex].url = res.message
        this.$emit("update:fileList", fileList)
        this.currentReplaceIndex = null
      } else {
        fileList.push({ url: res.message, isWatermark: false })
        this.$emit("update:fileList", fileList)
      }
    },
    limitExceed() {
      this.$message({
        type: 'warning',
        message: "最多上传9张图片"
      })
    },
    setSort() {
      const el = this.$refs.upload.$el.querySelectorAll('.el-upload-list.el-upload-list--picture-card')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        animation: 150,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this.fileList.splice(evt.oldIndex, 1)[0]
          this.fileList.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.elUploadContainer > div:first-child {
  & {
    display: flex;
    justify-content: space-between;

    /deep/ ul {
      // display: flex;
      width: 88%;
    }
  }
}
/deep/ .el-upload-dragger {
  height: 148px;
  width: 148px;
}
/deep/ .el-upload-list__item {
  div {
    width: 100%;
    height: 100%;
  }

  .el-upload-list__item-thumbnail {
    object-fit: cover;
  }

  .el-icon-sort {
    transform: rotate(90deg);
  }
}
.minWatermark {
  position: absolute;
  transform-origin: 0% 0%;
  white-space: nowrap;
}
.maxwatermarkContaier {
  width: 500px;
  height: 500px;
  position: relative;
  overflow: hidden;
  user-select: none;

  .maxPicture {
    width: 500px;
    height: 500px;
  }

  .maxwatermark {
    position: absolute;
  }
}
</style>

