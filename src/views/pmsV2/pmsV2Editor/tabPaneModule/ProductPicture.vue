<template>
  <div>
    <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
      <el-form-item label="图片来源：" prop="imageSource">
        <el-radio-group v-model="listQuery.imageSource">
          <el-radio label="1">采集图</el-radio>
          <el-radio label="3">自己拍照</el-radio>
          <el-radio label="2">供应商提供图</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <el-form-item label="采集链接：" prop="imageSourceUrl" v-if="listQuery.imageSource=='1'">
        <el-input type="textarea" rows="4" v-model="listQuery.imageSourceUrl" style="width:750px;" maxlength="400" show-word-limit />
      </el-form-item><br v-if="listQuery.imageSource=='1'">
      <el-form-item label="图片上传：">
        <template #label>
          <el-tooltip class="item" effect="dark" placement="top">
            <div>
              图片上传 <i class="el-icon-warning" />：
            </div>
            <div slot="content">
              本地上传，选择小于2M的图片上传，支持JPG、JPEG、GIF、PNG图片格式
            </div>
          </el-tooltip>
        </template>
        <el-button size="small" type="primary" @click="uploadPicture">点击上传</el-button>
        <span>{{ listQuery.baseInfoPic.length  }} / {{ limitPictureCount }}</span>
        <div class="topBar">
          <div @click="activeBarIndex = 1" :class="['topBarItem', { activeBar: activeBarIndex === 1}]">全部图片</div>
          <div @click="activeBarIndex = 2" :class="['topBarItem', { activeBar: activeBarIndex === 2}]">白底封面图</div>
          <div @click="activeBarIndex = 3" :class="['topBarItem', { activeBar: activeBarIndex === 3}]">非白底封面图</div>
          <div @click="activeBarIndex = 4" :class="['topBarItem', { activeBar: activeBarIndex === 4}]">系统采集图</div>
        </div>
        <transition-group name="imageContainer" tag="div" class="imageContainer" ref="imageContainer" v-show="activeBarIndex!==4">
          <div class="imageBox" v-for="(item, index) in listQuery.baseInfoPic" :key="item.id">
            <div v-if="getImageShow(item.imageType)">
              <div class="deleteBtn" @click="deleteImage(index)">X</div>
              <el-image :src="item.imageUrl" :preview-src-list="getPreviewList" ref="image" />
            </div>
          </div>
        </transition-group>

        <transition-group name="imageContainer" tag="div" class="imageContainer" v-show="activeBarIndex==4">
          <div class="imageBox" v-for="item in getCollectionImage" :key="item">
            <el-image :src="item" :preview-src-list="getCollectionImage" ref="image" />
          </div>
        </transition-group>
      </el-form-item><br>
    </el-form>

    <UpLoadImageDialog :visible.sync="visible" @callback="imageCallback" :home="home" :limit="limitPictureCount" />

    <div style="text-align:center;margin-bottom:10px;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </div>
</template>

<script>
import { deleteOssFile } from '@/api/pmsV2/pmsV2Editor'
import UpLoadImageDialog from "../components/UpLoadImageDialog";
import Sortable from 'sortablejs'
export default {
  name: 'ProductPicture',
  components: {
    UpLoadImageDialog
  },
  props: {
    home: null
  },
  data() {
    const commodityReviewValid = (rule, value, callback) => {
      const { developStatus } = this.listQuery;
      if (developStatus === 2 && (typeof value === 'object' ? value.length === 0 : value === '')) {
        callback(new Error('此项不能为空！'))
        return
      }
      callback()
    }
    return {
      listQuery: {},
      collectionImage: [],
      rules: {
        imageSource: { validator: commodityReviewValid, trigger: ['change', 'blur'] },
      },
      activeBarIndex: 1,
      visible: false,
      limitPictureCount: 20
    };
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  mounted() {
    this.setSort()
  },
  computed: {
    getImageShow() {
      return (imageType) => {
        switch (this.activeBarIndex) {
          case 1:
            return true
          case 2:
            return imageType == 2
          case 3:
            return imageType == 3
          case 4:
            return imageType == 4
        }
      }
    },
    getPreviewList() {
      const { listQuery, getImageShow } = this
      return listQuery.baseInfoPic.filter(item => getImageShow(item.imageType)).map(item => item.imageUrl)
    },
    getCollectionImage() {
      const { supplyPrices } = this.listQuery
      if (!supplyPrices || supplyPrices.length === 0) return [];
      return supplyPrices.map(item => item.define1.split(',')).flat().filter(item => item !== '')
    }
  },
  methods: {
    uploadPicture() {
      const { listQuery, $message, limitPictureCount } = this
      if (listQuery.baseInfoPic.length >= limitPictureCount) {
        $message.warning(`最多上传${limitPictureCount}张图片`)
        return
      }
      this.visible = true
    },
    async deleteImage(index) {
      try {
        // const confirm = await this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', { type: 'warning' })
        // const res = await deleteOssFile({
        //   ossUrl: this.listQuery.baseInfoPic[index].imageUrl,
        //   type: 3,
        //   id: this.$route.query.id || ''
        // })
        // this.$message.success(res.data)
        this.listQuery.baseInfoPic.splice(index, 1)
      } catch (error) { }
    },
    setSort() {
      const el = this.$refs.imageContainer.$el
      Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        animation: 150,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.listQuery.baseInfoPic.splice(evt.oldIndex, 1)[0]
          this.listQuery.baseInfoPic.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    imageCallback(images) {
      const { baseInfoPic } = this.listQuery
      this.listQuery.baseInfoPic = baseInfoPic.concat(images)
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate(valid => {
        callBackValid = valid
      })
      return callBackValid
    }
  },
};
</script>

<style scoped lang='scss'>
$imageContainerSize: 750px;
.topBar {
  width: $imageContainerSize;
  height: 50px;
  background-color: rgb(242, 242, 242);
  margin-top: 10px;
  padding: 1px 1px 0;
  display: flex;
}
.topBarItem {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}
.activeBar {
  background-color: white;
}
.imageContainer {
  border: 1px solid rgb(242, 242, 242);
  margin-bottom: 10px;
  height: 500px;
  width: $imageContainerSize;
  overflow: scroll;
}
.imageBox {
  position: relative;
  display: inline-block;
  margin: 10px;

  /deep/ .el-image__inner {
    transition: all 0.3s ease-in-out;
    width: 100px;
    height: 100px;
  }

  .deleteBtn {
    width: 15px;
    height: 15px;
    background-color: rgb(192, 5, 5);
    border-radius: 50%;
    color: white;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    opacity: 0.8;
    position: absolute;
    cursor: pointer;
    right: -5px;
    top: -5px;
    z-index: 1999;
    user-select: none;

    &:hover {
      background-color: red;
    }
  }

  &:hover {
    /deep/ .el-image__inner {
      transform: scale(1.1);
    }
  }
}
.imageContainer-enter-active,
.imageContainer-leave-active {
  transition: all 1s;
}
.imageContainer-enter {
  opacity: 0;
  transform: translateY(-30px);
}
.imageContainer-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
