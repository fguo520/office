<template>
  <div class="container">
    <div class="content">
      <el-card class="elCardOption" shadow="never">
        <el-form ref="form" :model="listQuery" label-width="100px" :rules="rules">
          <el-form-item label="平台：" prop="platformCode">
            <el-select v-model="listQuery.platformCode" placeholder="请选择" size="mini" clearable>
              <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.platformName" :value="item.platformCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称：" prop="name">
            <el-input v-model="listQuery.name" size="mini" />
          </el-form-item>
          <el-form-item label="水印类型：" prop="type">
            <el-radio-group v-model="listQuery.type" @change="radioChange">
              <el-radio :label="1">文字水印</el-radio>
              <el-radio :label="2">图片水印</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="水印透明度">
            <el-slider v-model="listQuery.transparency" :format-tooltip="(val) => `${val}%`" />
          </el-form-item>

          <template v-if="listQuery.type === 1">
            <el-form-item label="文字内容：" prop="text">
              <el-input v-model="listQuery.text" size="mini" maxlength="21" show-word-limit @input="textInput"></el-input>
            </el-form-item>
            <el-form-item label="文字大小：" prop="size">
              <el-input-number v-model="listQuery.size" size="mini" :min="0" @change="sizeInput"></el-input-number>
            </el-form-item>
            <el-form-item label="文字颜色：" prop="color">
              <el-color-picker v-model="listQuery.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="文字字体：" prop="fontType">
              <el-select v-model="listQuery.fontType" placeholder="请选择" size="mini" clearable>
                <el-option v-for="item in typeList.fontTypeOption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </template>

          <template v-if="listQuery.type === 2">
            <el-form-item label="添加图片" prop="file">
              <el-upload class="watermarkUploader" action="" :show-file-list="false" :on-change="handleChange" accept=".jpg,.png" :auto-upload="false">
                <img v-if="imageUrl" :src="imageUrl" class="imgUpload">
                <i v-else class="el-icon-plus uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="水印缩放">
              <el-slider v-model="listQuery.pretreatment" :min="1" :format-tooltip="(val) => `${val}%`"></el-slider>
            </el-form-item>
          </template>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="mini">保存</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <div class="backPicureContainer">
        <div class="backPicure" ref="backPicure">
          <div class="tip">底图大小：1000 * 1000</div>
          <div :style="containerStyle" id="watermarkContainer" ref="watermarkContainer">
            <span v-show="listQuery.type === 1" :style="fontStyle">{{ listQuery.text }}</span>
            <img :style="imgStyle" :src="imageUrl" ref="imgwatermark" class="imgwatermark" v-show="listQuery.type === 2" ondragstart="return false;">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { add, listById, update, getPlatform } from "@/api/common/sysWatermark";
const defaultListQuery = {
  platformCode: "",
  id: "",
  transparency: 100,
  color: "#000000",
  text: "",
  size: 40,
  fontType: "",
  file: "",
  pretreatment: 20,
  dx: 0,
  dy: 0,
}
export default {
  data() {
    const fileRule = [
      {
        required: true,
        validator: (rules, value, cb) => {
          let { imageUrl } = this;
          if (!imageUrl) {
            return cb(new Error("此项为必填项"));
          }
          cb();
        },
        trigger: "blur",
      },
    ];
    return {
      listQuery: Object.assign({ name: "", type: 1, position: "nw", }, defaultListQuery),
      typeList: {
        fontTypeOption: [
          { value: "wqy-zenhei", label: "文泉驿正黑" },
          { value: "wqy-microhei", label: "文泉微米黑" },
          { value: "fangzhengshusong", label: "方正书宋" },
          { value: "fangzhengkaiti", label: "方正楷体" },
          { value: "fangzhengheiti", label: "方正黑体" },
          { value: "fangzhengfangsong", label: "方正仿宋" },
        ],
        platformList: [],
      },
      imageUrl: '',
      rules: {
        platformCode: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        name: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        type: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        text: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        size: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        color: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        fontType: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        file: fileRule,
      }
    };
  },
  props: {
    id: undefined
  },
  async created() {
    this.getTypeList();
    if (!this.id) return;
    const res = await listById({ id: this.id })
    for (var item in res.data) {
      const hasKey = Object.keys(this.listQuery).includes(item);
      if (hasKey) this.listQuery[item] = res.data[item];
    }
    this.imageUrl = res.data.imageUrl;
  },
  mounted() {
    this.modelMove()
  },
  computed: {
    containerStyle() {
      const { listQuery } = this
      return {
        left: `${listQuery.dx}px`,
        top: `${listQuery.dy}px`,
        opacity: listQuery.transparency / 100,
      }
    },
    fontStyle() {
      const { listQuery } = this
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
      return {
        color: listQuery.color,
        fontSize: `${listQuery.size}px`,
        fontFamily: getFontFamily(listQuery.fontType)
      }
    },
    imgStyle() {
      const { listQuery, imageUrl } = this
      const length = imageUrl ? listQuery.pretreatment * 10 : 0
      return {
        width: `${length}px`,
        // height: `${length}px`
      }
    }
  },
  methods: {
    async getTypeList() {
      const res = await getPlatform()
      this.typeList.platformList = res.data
    },
    modelMove() {
      let maxMoveX = this.$refs.backPicure.clientWidth;
      let maxMoveY = this.$refs.backPicure.clientHeight;
      let target = this.$refs.watermarkContainer;
      this.$refs.watermarkContainer.addEventListener("mousedown", (e) => {
        let targetWidth = target.clientWidth;
        let targetHeight = target.clientHeight;
        let targetLeft = target.offsetLeft;
        let targetTop = target.offsetTop;
        let startX = e.clientX;
        let startY = e.clientY;
        function getTop(top) {
          if (top < 0) return 0;
          if (top + targetHeight > maxMoveY) return maxMoveY - targetHeight;
          return top
        }
        function getLeft(left) {
          if (left < 0) return 0;
          if (left + targetWidth > maxMoveX) return maxMoveX - targetWidth;
          return left
        }
        document.onmousemove = (e) => {
          let moveX = e.clientX - startX;
          let moveY = e.clientY - startY;
          let setLeft = targetLeft + moveX * 2;
          let setTop = targetTop + moveY * 2
          this.listQuery.dx = getLeft(setLeft);
          this.listQuery.dy = getTop(setTop);
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      })
    },
    textInput() {
      this.$nextTick(() => {
        let maxLeft = this.$refs.backPicure.clientWidth;
        let targetLeft = this.$refs.watermarkContainer.offsetLeft;
        let targetWidth = this.$refs.watermarkContainer.clientWidth;
        if (targetLeft + targetWidth > maxLeft) {
          this.$refs.watermarkContainer.style.left = `${maxLeft - targetWidth}px`
        }
      })
    },
    sizeInput() {
      this.$nextTick(() => {
        let maxTop = this.$refs.backPicure.clientHeight;
        let targetTop = this.$refs.watermarkContainer.offsetTop;
        let targetHeight = this.$refs.watermarkContainer.clientHeight;
        if (targetTop + targetHeight > maxTop) {
          const setTop = maxTop - targetHeight < 0 ? 0 : maxTop - targetHeight
          this.$refs.watermarkContainer.style.top = `${setTop}px`
        }
      })
    },
    handleChange(file, fileList) {
      this.listQuery.file = file.raw;
      const URL = window.URL || window.webkitURL
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    radioChange() {
      this.listQuery = Object.assign({}, { ...this.listQuery, ...defaultListQuery });
      this.imageUrl = "";
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const formData = new FormData();
        for (var item in this.listQuery) {
          formData.append(item, this.listQuery[item])
        }
        const requestAPi = this.id ? update : add
        const res = await requestAPi(formData)
        if (res.code === 200) {
          this.$message({ type: "success", message: res.data })
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 50px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;

    .elCardOption {
      width: 400px;
      margin-right: 10px;

      .watermarkUploader {
        /deep/ .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          &:hover {
            border-color: #41af7c;
          }
        }
        .uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 100px;
          height: 100px;
          line-height: 100px;
          text-align: center;
        }
        .imgUpload {
          width: 100px;
          height: 100px;
          display: block;
        }
      }
    }

    .backPicureContainer {
      width: 500px;
      height: 500px;
      overflow: hidden;
      margin-left: 10px;

      .backPicure {
        width: 1000px;
        height: 1000px;
        overflow: hidden;
        background-color: rgb(202, 201, 201);
        white-space: nowrap;
        transform-origin: 0% 0%;
        transform: scale(0.5);
        position: relative;

        .tip {
          position: absolute;
          font-size: 40px;
          top: 50%;
          left: 50%;
          color: rgb(168, 167, 167);
          transform: translate(-50%, -50%);
          user-select: none;
        }

        #watermarkContainer {
          display: inline-block;
          position: absolute;
          cursor: move;
          user-select: none;
          -moz-user-select: none;
          vertical-align: middle;

          .imgwatermark {
            vertical-align: middle;
          }
        }
      }
    }
  }
}
</style>