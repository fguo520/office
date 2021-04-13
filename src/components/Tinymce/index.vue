<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <div class="tinymce">
      <textarea :id="tinymceId" class="tinymce-textarea" />
    </div>

    <div class="editor-custom-btn-container" v-if="editorImage">
      <EditorImage class="editor-upload-btn" @successCBK="imageSuccessCBK" :params="params" :action="action" />
    </div>
    <div class="showLimit" v-if="showLimit&&limit">
      <span :class="['limitChart', {limitRed : characters>limit}]">
        {{ characters }}
      </span>
      /{{ limit }}
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import EditorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce@5.3.2/tinymce.min.js'
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce@5.6.2/tinymce.min.js'
// const tinymceCDN = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js'
// const tinymceCDN = 'https://cdn.bootcdn.net/ajax/libs/tinymce/5.5.1/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { EditorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 100000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    plugins: null,
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    resetContent: {
      type: Boolean,
      default: true
    },
    editorImage: {
      type: Boolean,
      default: true
    },
    action: {
      type: String,
      default: "",
    },
    params: {
      type: Object,
      default: () => { return {} }
    },
    limit: undefined,
    showLimit: {
      type: Boolean,
      default: false
    },
    limitHtml: {
      type: Boolean,
      default: false
    },
    limitReset: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      },
      lastContent: "",
      characters: 0,
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (this.resetContent && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        language_url: "https://cdn.jsdelivr.net/npm/tinymce-lang/langs/zh_CN.js",
        height: this.height,
        branding: false,//右下角技术支持
        // statusbar: false, //隐藏底部
        elementpath: false,//禁止底部左侧dom信息
        body_class: 'panel-body ',
        // placeholder: "", //预展示文本
        fullscreen_native: true,
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: this.plugins ? this.plugins : plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.$emit('input', editor.getContent())
            this.$emit("update:resetContent", false)

            //editor.execCommand('undo');  重置富文本
            if (this.limit == null && isNaN(Number(this.limit))) return
            let length = this.limitHtml ? editor.getContent().length : editor.getBody().textContent.length
            if (this.limitReset) {
              length > Number(this.limit) ? editor.setContent(this.lastContent) : this.lastContent = editor.getContent();
            }
            this.characters = length
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        images_upload_handler(blobInfo, success, failure, progress) {
          progress(0);
          const token = _this.$store.getters.token;
          getToken(token).then(response => {
            const url = response.data.qiniu_url;
            const formData = new FormData();
            formData.append('token', response.data.qiniu_token);
            formData.append('key', response.data.qiniu_key);
            formData.append('file', blobInfo.blob(), url);
            upload(formData).then(() => {
              success(url);
              progress(100);
            })
          }).catch(err => {
            failure('出现未知问题，刷新页面，或者联系程序员')
            console.log(err);
          });
        },
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`))
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce {
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  /deep/ div {
    z-index: 0;
  }
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  // z-index: 2005;
}

.showLimit {
  position: absolute;
  bottom: 0;
  right: 20px;
  transform: translate(50% 50%);
}
.limitChart {
  transition: all 0.3s ease-in-out;
}
.limitRed {
  color: red;
}

.fullscreen {
  .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }
  .showLimit {
    z-index: 10000;
    position: fixed;
  }
}

.editor-upload-btn {
  display: inline-block;
}
</style>
