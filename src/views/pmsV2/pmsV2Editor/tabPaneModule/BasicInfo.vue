<template>
  <el-form ref="form" :model="listQuery" label-width="180px" inline :rules="rules" size="mini">
    <el-form-item label="sku：" prop="sku">
      <div style="width:193px;">{{ listQuery.sku }}</div>
    </el-form-item>
    <el-form-item label="母体ID：" prop="productGroupSku">
      <div style="width:193px;">{{ listQuery.productGroupSku }}</div>
    </el-form-item><br>
    <el-form-item label="自定义SKU：" prop="clientSku">
      <div style="width:193px;">{{ listQuery.clientSku }}</div>
    </el-form-item>
    <el-form-item label="商品单位：" prop="unitName">
      <el-select v-model="listQuery.unitName" placeholder="请选择" filterable>
        <el-option v-for="item in home.attrsList['商品单位']" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
    </el-form-item><br>
    <el-form-item label="商品中文名：" prop="productNameCn">
      <el-input v-model="listQuery.productNameCn" style="width:193px;" @change="productNameCnChange" maxlength="200" show-word-limit class="inputLimit" />
    </el-form-item>
    <el-form-item label="开发人员：" prop="developAdminName">
      <el-select v-model="listQuery.developAdminName" placeholder="请选择">
        <el-option v-for="item in typeList['开发人员']" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item><br>
    <el-form-item label="采购人员：" prop="buyerName">
      <el-select v-model="listQuery.buyerName" placeholder="请选择">
        <el-option v-for="item in typeList['采购人员']" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="物流属性：" prop="withBattery">
      <el-select v-model="listQuery.withBattery" placeholder="请选择" filterable>
        <el-option v-for="item in home.attrsList['物流属性']" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-form-item prop="withBatteryRemark" style="margin-bottom:0;" v-if="getWithBatteryRemarkShow">
        <el-input v-model="listQuery.withBatteryRemark" maxlength="300" show-word-limit style="width:193px;" class="inputLimit" />
      </el-form-item>
    </el-form-item><br>
    <el-form-item label="商品品牌：" prop="productBrandArr">
      <el-cascader v-model="listQuery.productBrandArr" size="mini" :options="home.attrsList['商品品牌']" clearable placeholder="全部" :props="{label: 'brandName',value: 'id'}" filterable />
      <!-- <el-select v-model="listQuery.productBrandType" placeholder="请选择">
        <el-option v-for="item in home.attrsList['商品品牌']" :key="item.code" :label="item.name" :value="item.code" />
      </el-select> -->

    </el-form-item>
    <el-form-item label="发货仓库：" prop="warehouseShipping">
      <el-select v-model="listQuery.warehouseShipping" placeholder="请选择">
        <el-option v-for="item in home.attrsList['发货仓库']" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
    </el-form-item><br>
    <el-form-item label="商品类型：" prop="productType">
      <el-radio-group v-model="listQuery.productType">
        <el-radio label="0">普通产品</el-radio>
        <el-radio label="1">采购包材</el-radio>
        <el-radio label="2">物流包材</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="推荐指数：" prop="starLevel">
      <el-rate v-model="listQuery.starLevel" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" style="display: flex;align-items: center;height: 28px;" />
    </el-form-item><br>
    <el-form-item label="商品来源：" prop="comeSource">
      <el-radio-group v-model="listQuery.comeSource">
        <el-radio v-for="item in home.attrsList['商品来源']" :key="item.code" :label="item.code">{{ item.name }}</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="开发类型：" prop="developType">
      <el-radio-group v-model="listQuery.developType" @change="listQuery.salePlatform = []">
        <el-radio label="1">自主开发</el-radio>
        <el-radio label="3">指定开发</el-radio>
        <el-radio label="2">供应商后台</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="组合SKU：" prop="isCombSku">
      <el-radio-group v-model="listQuery.isCombSku">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="      " prop="salePlatform" v-show="listQuery.developType == '1' || listQuery.developType == '3' ">
      <div class="platformCLass">
        <el-checkbox-group v-model="listQuery.salePlatform" :max="2">
          <el-checkbox v-for="(item, index) in home.attrsList['自主开发平台']" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form-item><br v-show="listQuery.developType == '1' || listQuery.developType == '3' ">
    <el-form-item label="电源插头：" prop="powerSocket">
      <template #label>
        <el-tooltip class="item" effect="dark" content="不同国家的插头规格可能不一样，一旦设置，发货时会显示对应订单国家插头规格" placement="top-start">
          <div>电源插头<i class="el-icon-warning" />：</div>
        </el-tooltip>
      </template>
      <el-radio-group v-model="listQuery.powerSocket">
        <el-radio :label="true">有</el-radio>
        <el-radio :label="false">无</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="      " prop="powerSocketSpec" v-show="listQuery.powerSocket" :rules="getSalePlatformRule">
      <div class="powerSpecCLass">
        <el-radio-group v-model="listQuery.powerSocketSpec">
          <el-radio v-for="(item, index) in home.attrsList['电源规格']" :key="index" :label="item.code">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
    </el-form-item><br v-show="listQuery.powerSocket">
    <el-form-item label="CE认证：" prop="ceAuth">
      <el-radio-group v-model="listQuery.ceAuth">
        <el-radio :label="true">有</el-radio>
        <el-radio :label="false">无</el-radio>
      </el-radio-group>
      <el-upload action="#" :auto-upload="false" :file-list="fileList" :on-change="handleChange" ref="uploadFile" v-show="listQuery.ceAuth" :on-remove="removeFile">
        <!-- :before-remove="brforeRemove" -->
        <el-button size="small" type="text">点击上传</el-button>
        <el-button size="small" type="text" @click.stop="downloadFile" v-if="listQuery.ceOssUrl">下载文件</el-button>
      </el-upload>
    </el-form-item><br>
    <el-form-item label="质检比例：" prop="checkMemo">
      <el-select v-model="listQuery.checkMemo" placeholder="请选择" style="width:100px;" @change="checkMemoChange">
        <el-option label="抽检" value="1" />
        <el-option label="全检" value="2" />
        <el-option label="无需质检" value="3" />
      </el-select>
      <span v-show="listQuery.checkMemo !== '3'">
        <NumberInput v-model="listQuery.checkProportion" min='1' max='99' style="display: inline-flex;width:200px;" /> %
      </span>
    </el-form-item><br>
    <el-form-item label="侵权风险：" prop="productProperty">
      <el-select v-model="listQuery.productProperty" placeholder="请选择" size="mini" style="width:100px">
        <el-option label="仿牌" value="2" />
        <el-option label="非仿牌" value="1" />
        <el-option label="灰色产品" value="3" />
      </el-select>

      <el-input v-model.trim="listQuery.productPropetyContent" clearable style="display: inline-flex; width:200px;" v-if="listQuery.productProperty === '2'" />

      <!-- <div class="grayProductClass" style="" v-if="listQuery.productProperty === '3'">
        <el-checkbox-group v-model="listQuery.productPropetyContent_gray">
          <el-checkbox v-for="(item, index) in home.attrsList['自主开发平台']" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div> -->
      <ScrollSelect v-model="listQuery.productPropetyContent_gray" :list="home.attrsList['自主开发平台']" :multiple-limit="2" :prop="{ label:'name', value:'code' }" v-if="listQuery.productProperty === '3'" />
    </el-form-item><br>
    <el-form-item label="参考网站链接：">
      <div style="display:flex;">
        <div>国内 <i class="el-icon-circle-plus-outline" @click="addUrlForeign('referenceUrlForeign')" /> </div>

        <div style="display:flex;flex-direction:column;margin-left:5px;">
          <div v-for="(item, index) in listQuery.referenceUrlForeign" :key="index">
            <el-input v-model.trim="listQuery.referenceUrlForeign[index]" clearable style="width:650px;margin-top:3px;" />
            <el-link :href="item" type="info" :underline="false" target="_blank">打开链接</el-link>
            <i class="el-icon-remove-outline" @click="removeUrlForeign('referenceUrlForeign', index)" />
          </div>
        </div>
      </div>

      <div style="display:flex;">
        <div>外网 <i class="el-icon-circle-plus-outline" @click="addUrlForeign('referenceUrlInternal')" /> </div>

        <div style="display:flex;flex-direction:column;margin-left:5px;">
          <div v-for="(item, index) in listQuery.referenceUrlInternal" :key="index">
            <el-input v-model.trim="listQuery.referenceUrlInternal[index]" clearable style="width:650px;margin-top:3px;" />
            <el-link :href="item" type="info" :underline="false" target="_blank">打开链接</el-link>
            <i class="el-icon-remove-outline" @click="removeUrlForeign('referenceUrlInternal', index)" />
          </div>
        </div>
      </div>
    </el-form-item><br>
    <el-form-item label="商品分类：" prop="productClasses">
      <el-cascader v-model="listQuery.productClasses" size="mini" :options="typeList['商品类别']" clearable placeholder="全部" :props="{label: 'classnamecn',value: 'classid'}" style="width:700px" filterable />
    </el-form-item><br>
    <el-form-item label="推荐分类：">
      <el-input type="textarea" rows="3" v-model="listQuery.recommClass" style="width:700px;" disabled />
    </el-form-item><br>
    <el-form-item label="工厂规则型号：" prop="spec">
      <el-input v-model="listQuery.spec" style="width:700px;" maxlength="200" show-word-limit class="inputLimit" />
    </el-form-item><br>
    <el-form-item prop="length" label="单个商品尺寸(cm)：">
      长
      <NumberInput size="mini" v-model="listQuery.length" placeholder="长(cm)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" /> *
      宽
      <NumberInput size="mini" v-model="listQuery.width" placeholder="宽(cm)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" /> *
      高
      <NumberInput size="mini" v-model="listQuery.height" placeholder="高(cm)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />
    </el-form-item><br>
    <el-form-item prop="packLength" label="单个包装尺寸(cm)：">
      <template #label>
        <el-tooltip class="item" effect="dark" placement="top">
          <div>
            单个包装尺寸(cm) <i class="el-icon-warning" />：
          </div>
          <div slot="content">
            超尺寸规则：<br />
            常规：最大边长的包装尺寸>60cm<br />
            Amazon：[包装长+包装宽+包装高]>90cm
          </div>
        </el-tooltip>
      </template>
      长
      <NumberInput size="mini" v-model="listQuery.packLength" placeholder="长(cm)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" /> *
      宽
      <NumberInput size="mini" v-model="listQuery.packWidth" placeholder="宽(cm)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" /> *
      高
      <NumberInput size="mini" v-model="listQuery.packHeight" placeholder="高(cm)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />
      <div class="bigSizeClass">
        <span v-if="getBigSizeShow">常用超尺寸</span>
        <span v-if="getAMZBigSizeShow">亚马逊超尺寸</span>
      </div>
    </el-form-item>
    <el-form-item prop="packWeight" label="包裹重量(g)：">
      <template #label>
        <el-tooltip effect="dark" placement="top">
          <div>
            包裹重量(g) <i class="el-icon-warning" />：
          </div>
          <div slot="content">
            抛货规则：<br />
            X=单个包装尺寸的【长x宽x高】÷6000÷包裹重<br />
            1.重抛：X≥2 <br />
            2.轻抛：1.3＜X＜2 <br />
            3.无需抛货：X≤1.3<br />

            超重规则：<br />
            1.超重=包裹重＞2kg<br />
            2.不超重=包裹重≤2kg
          </div>
        </el-tooltip>
      </template>
      <NumberInput size="mini" v-model="listQuery.packWeight" placeholder="g" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />

      <span style="color:red; margin-left:10px;" v-show="listQuery.packWeight > 2000">超重</span>
      <span style="color:red; margin-left:10px;">{{ throwGoods }}</span>
    </el-form-item><br>
    <el-form-item prop="cartonLength" label="外箱包装尺寸(m)：">
      长
      <NumberInput size="mini" v-model="listQuery.cartonLength" placeholder="长(m)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" /> *
      宽
      <NumberInput size="mini" v-model="listQuery.cartonWidth" placeholder="宽(m)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" /> *
      高
      <NumberInput size="mini" v-model="listQuery.cartonHeight" placeholder="高(m)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />
    </el-form-item><br>
    <el-form-item prop="grossWeight" label="单个商品重量(g)：">
      <template #label>
        <el-tooltip class="item" effect="dark" placement="top">
          <span>
            单个商品重量(g) <i class="el-icon-warning" />：
          </span>
          <div slot="content">
            毛重≥净重
          </div>
        </el-tooltip>
      </template>
      毛重
      <NumberInput size="mini" v-model="listQuery.grossWeight" placeholder="毛重(g)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />
      净重
      <NumberInput size="mini" v-model="listQuery.netWeight" placeholder="净重(g)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />
    </el-form-item><br>
    <el-form-item prop="cartonGrossWeight" label="整箱商品重量(kg)：">
      <template #label>
        <el-tooltip class="item" effect="dark" placement="top">
          <span>
            整箱商品重量(kg) <i class="el-icon-warning" />：
          </span>
          <div slot="content">
            毛重≥净重
          </div>
        </el-tooltip>
      </template>
      毛重
      <NumberInput size="mini" v-model="listQuery.cartonGrossWeight" placeholder="毛重(kg)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />
      净重
      <NumberInput size="mini" v-model="listQuery.cartonNetEight" placeholder="净重(kg)" style="width:80px;" float='2' min="0" max="999999999" class="inptTextCenter" />
    </el-form-item><br>
    <el-form-item prop="cartonPcsNum" label="整箱数量：">
      <NumberInput size="mini" v-model="listQuery.cartonPcsNum" placeholder="请输入" style="width:193px;" min="0" max="999999999" />
    </el-form-item><br>

    <div style="text-align:center;margin-bottom:30px;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { getClientSku, getDepartMentUseByCode, productClassList, getRecommClass, uploadCeAttachment, getUserDepartMentCode, deleteOssFile } from "@/api/pmsV2/pmsV2Editor"
import { NumberInput, ScrollSelect } from "@/components"
export default {
  name: 'BasicInfo',
  components: {
    NumberInput,
    ScrollSelect
  },
  props: {
    home: null,
  },
  data() {
    const grossWeightValid = (rule, value, callback) => {
      if (value === '' || this.listQuery.netWeight === '') callback(new Error('此项不能为空'))
      if (value == 0) callback(new Error('毛重不能为0'))
      if (this.listQuery.netWeight == 0) callback(new Error('净重不能为0'))
      if (this.listQuery.netWeight > value) callback(new Error('净重不大于毛重'))
      return callback()
    }
    const cartonGrossWeightValid = (rule, value, callback) => {
      if (value === '' || this.listQuery.cartonNetEight === '') callback(new Error('此项不能为空'))
      if (value == 0) callback(new Error('毛重不能为0'))
      if (this.listQuery.cartonNetEight == 0) callback(new Error('净重不能为0'))
      if (this.listQuery.cartonNetEight > value) callback(new Error('净重不大于毛重'))
      return callback()
    }
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
      rules: {
        productNameCn: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },

        unitName: { validator: commodityReviewValid, trigger: ['change', 'blur'] },
        comeSource: { validator: commodityReviewValid, trigger: ['change', 'blur'] },
        powerSocket: { validator: commodityReviewValid, trigger: ['change', 'blur'] },
        developType: { validator: commodityReviewValid, trigger: ['change', 'blur'] },

        withBattery: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        withBatteryRemark: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        productClasses: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        grossWeight: { required: true, validator: grossWeightValid, trigger: ['change', 'blur'] },
        cartonGrossWeight: { required: true, validator: cartonGrossWeightValid, trigger: ['change', 'blur'] },
      },
      typeList: {
        '开发人员': [],
        '采购人员': [],
        '商品类别': []
      },
    };
  },
  created() {
    this.listQuery = this.home.listQuery
    const { $route: { query: { id } } } = this
    !id && getClientSku().then(res => {
      this.listQuery.clientSku = res.data
    })
    this.getTypeList()
  },
  computed: {
    getBigSizeShow() {
      const { developType, salePlatform, packLength, packWidth, packHeight } = this.listQuery
      return Math.max(packLength, packWidth, packHeight) > 60
    },
    getAMZBigSizeShow() {
      const { developType, salePlatform, packLength, packWidth, packHeight } = this.listQuery
      return (Number(packLength) + Number(packWidth) + Number(packHeight)) > 90
    },
    throwGoods() {
      const { packLength, packWidth, packHeight, packWeight } = this.listQuery
      const x = packLength * packWidth * packHeight / 6000 / packWeight
      if (packLength == 0 || packWidth == 0 || packHeight == 0 || packWeight == 0) return
      if (x <= 1.3) return `无需抛货 X≈${Number(x.toFixed(2))}`
      if (x > 1.3 && x < 2) return `轻抛 X≈${Number(x.toFixed(2))}`
      if (x >= 2) return `重抛 X≈${Number(x.toFixed(2))}`
    },
    fileList() {
      const { ceOssUrl } = this.listQuery;
      return ceOssUrl ? [{ url: ceOssUrl, name: ceOssUrl.split('/').slice(-1)[0] }] : []
    },
    getSalePlatformRule() {
      const { powerSocket } = this.listQuery
      return {
        required: powerSocket,
        message: '此项不能未空',
        trigger: ['change', 'blur']
      }
    },
    getSellRate() {
      const { packLength, packWidth, packHeight, packWeight } = this.listQuery;
      return packLength * packWidth * packHeight / 6000 / packWeight || ''
    },
    getWithBatteryRemarkShow() {
      const { withBattery } = this.listQuery
      const showOptions = ['2', '3', '4', '5', '18'];
      return showOptions.includes(withBattery)
    }
  },
  methods: {
    getTypeList() {
      Promise.all([
        getDepartMentUseByCode({ parameterCode: 10039 }),
        getDepartMentUseByCode({ parameterCode: 10040 }),
        getUserDepartMentCode()
      ]).then(res => {
        this.typeList['开发人员'] = Object.freeze(res[0].data)
        this.typeList['采购人员'] = Object.freeze(res[1].data)
        if (this.$route.query.id) return;
        switch (res[2].data) {
          case '10039':
            this.listQuery.developAdminName = res[0].data[0] && res[0].data[0].value
            break;
          case '10040':
            this.listQuery.buyerName = res[1].data[0] && res[1].data[0].value
            break;
        }
      })
      productClassList().then(res => {
        const obj = {};
        const gradeArr = [];
        res.data.forEach(item => {
          obj.hasOwnProperty(item.parentid) ? obj[item.parentid].push(item) : obj[item.parentid] = [item]
        })
        for (let itemArr in obj) {
          let index = obj[itemArr][0].grade - 1
          if (gradeArr[index] instanceof Object) {
            gradeArr[index][itemArr] = obj[itemArr]
          } else {
            gradeArr[index] = {}
            gradeArr[index][itemArr] = obj[itemArr]
          }
        }
        const classList = gradeArr.reduceRight((obj, gradeItem, index) => {
          Object.values(gradeItem).forEach(itemArr => {
            itemArr.forEach(item => {
              item.children = obj[item.classid]
            })
          })
          return gradeItem
        })
        this.typeList['商品类别'] = Object.freeze(classList[0])
      })
    },
    async productNameCnChange(productNameCn) {
      const res = await getRecommClass({ productNameCn })
      this.listQuery.recommClass = res.data.join('\n')
    },
    checkMemoChange(value) {
      this.listQuery.checkProportion = (function () {
        switch (value) {
          case '1':
            return ''
          case '2':
            return '100'
          case '3':
            return '0'
        }
      }())
    },
    async handleChange(file) {
      this.$refs.uploadFile.handleRemove(file)
      if (this.listQuery.ceOssUrl !== '') this.replaceFile = true
      if (file.size / 1024 / 1024 >= 10) {
        this.$message.warning("上传的文件需小于10MB")
        return
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      const res = await uploadCeAttachment(formData)
      this.$message.success('上传成功')
      this.listQuery.ceOssUrl = res.data
    },
    // brforeRemove() {
    //   if (this.listQuery.ceOssUrl === '') return true
    //   return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'warning' })
    // },
    async removeFile() {
      // if (this.listQuery.ceOssUrl === '') return
      // const res = await deleteOssFile({
      //   ossUrl: this.listQuery.ceOssUrl,
      //   type: 1,
      //   productId: this.$route.query.id || ''
      // })
      // this.$message.success(res.data)
      this.listQuery.ceOssUrl = ''
    },
    downloadFile() {
      window.open(this.listQuery.ceOssUrl, '_self')
    },
    addUrlForeign(key) {
      if (this.listQuery[key].length >= 5) return;
      this.listQuery[key].push("")
    },
    removeUrlForeign(key, index) {
      this.listQuery[key].splice(index, 1)
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
.inptTextCenter {
  /deep/ .el-input__inner {
    text-align: center;
  }
}
@mixin checkClass {
  width: 700px;
  max-height: 100px;
  border: 1px solid gray;
  padding: 10px;
  overflow-y: scroll;

  .el-checkbox {
    width: 110px;
    height: 30px;
  }
}
.platformCLass {
  @include checkClass;
}
.grayProductClass {
  margin-top: 10px;
  @include checkClass;
}

.powerSpecCLass {
  @include checkClass;
  .el-radio {
    width: 250px;
    height: 30px;
  }
}
.bigSizeClass {
  position: absolute;
  top: 0;
  right: -103px;
  overflow: hidden;
  height: 32px;
  width: 100px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    color: red;
    height: 16px;
    font-size: 12px;
    line-height: 16px;
  }
}
.el-icon-circle-plus-outline {
  color: blue;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    color: rgb(121, 121, 248);
  }
}
.el-icon-remove-outline {
  color: red;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    color: rgb(245, 121, 121);
  }
}
.inputLimit {
  /deep/ .el-input__count {
    position: absolute;
    left: 10px;
  }
}
</style>
