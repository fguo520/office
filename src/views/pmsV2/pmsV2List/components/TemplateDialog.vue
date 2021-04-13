<template>
  <el-dialog title="维护模板" :visible.sync="visible" :before-close="close" width="800px" :close-on-click-modal="false">
    <RadioButtonGroup v-model="ifstatus" :ButtonTypes="states" />
    <div v-show="ifstatus==0">
      <div class="item_div">
        <div class="left_div">
          <el-table ref="multipleTable" style="width: 100%" :data="addData" border height="500px" :header-cell-style="{ 'background-color': '#dadde3' }" @selection-change="handleSelectionChange" :row-key="(row)=>{return row.value}" v-if="dialogVisible">
            <el-table-column type="selection" width="50" :show-overflow-tooltip="false" align="center" :reserve-selection="true" />
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="列名称" align="center">
              <template #default="{ row }">
                <div v-copy="row.label" style="text-align:left">{{row.label}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="right_div">
          <div>模板名称： <el-input clearable v-model="listQuery.templateName" size="mini" style="width:200px"></el-input>
          </div>
          <el-table ref="tableContainer" class="el-table_right" style="width: 100%;margin-top:10px" :data="listQuery.templateList" border height="462px" :header-cell-style="{ 'background-color': '#dadde3' }" :row-key="(row)=>{return row.value}">
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="列名称" align="center">
              <template #default="{ row }">
                <div v-copy="row.label" style="text-align:left">{{row.label}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="50">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handRemove(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="item_foot">
        <el-button @click="close" size="mini">取消</el-button>
        <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
      </div>
    </div>
    <div v-show="ifstatus==1">
      <div class="table_div">
        <el-table :data="list" element-loading-text="数据加载中" border height="314px" :header-cell-style="{ 'background-color': '#dadde3' }">
          <el-table-column label="模板ID" align="center" width="100">
            <template slot-scope="scope">
              <div><span>{{scope.row.id}}</span></div>
            </template>
          </el-table-column>
          <el-table-column label="模板名称" align="center">
            <template slot-scope="scope">
              <div><span v-copy="scope.row.templateName">{{scope.row.templateName}}</span></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="remove(scope.row)">删除</el-button>
              <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="total" :pageNum.sync="page.pageIndex" :pageSize.sync="page.pageSize" @request="getList" />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Sortable from 'sortablejs';
import { RadioButtonGroup, Pagination } from "@/components"
import { createProductInfoTemp, queryProductInfoTemp, delProductInfoTemp, editProductInfoTemp } from '@/api/pmsV2/pmsV2List';
const defaultListQuery = {
  templateList: [],
  templateName: ""
}
const defaultPage = {
  pageIndex: 1,
  pageSize: 5
}
export default {
  name: "TemplateDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ifstatus: 0,
      states: [
        { label: "添加模板", value: 0 },
        { label: "查看模板", value: 1 },
      ],
      addData: [
        { label: "系统sku", value: "sku" },
        { label: "自定义sku", value: "client_sku" },
        { label: "产品英文名", value: "product_name" },
        { label: "产品中文名", value: "product_name_cn" },
        { label: "产品颜色属性", value: "product_color" },
        { label: "产品尺码属性", value: "product_size" },
        { label: "产品来源", value: "come_source" },
        { label: "开发类型", value: "develop_type" },
        { label: "图片来源", value: "image_source" },
        { label: "产品状态", value: "product_state" },
        { label: "产品物流属性", value: "with_battery" },
        { label: "产品侵权风险", value: "product_property" },
        { label: "产品用途", value: "declaration_urpose" },
        { label: "采购链接", value: "web_product_url" },
        { label: "供应商", value: "supplier_name" },
        { label: "产品特殊，亮点", value: "feature_list" },
        { label: "标题", value: "page_title" },
        { label: "关键词", value: "search_keyword" },
        { label: "关键词描述", value: "mate_description" },
        { label: "产品描述", value: "product_description" },
        { label: "最新供货价RMB", value: "last_supplier_price" },
        { label: "单价采购运费RMB", value: "purchase_freight" },
        { label: "产品报关英文名", value: "declaration_name" },
        { label: "产品报关中文名", value: "declaration_name_cn" },
        { label: "产品报关材质", value: "declaration_material" },
        { label: "产品报关价USD", value: "declaration_price_rate" },
        { label: "包装清单", value: "packing_list" },
        { label: "产品长度cm", value: "length" },
        { label: "产品宽度cm", value: "width" },
        { label: "产品高度cm", value: "height" },
        { label: "包装后长度cm", value: "pack_length" },
        { label: "包装后宽度cm", value: "pack_width" },
        { label: "包装后高度cm", value: "pack_height" },
        { label: "外箱长m", value: "carton_length" },
        { label: "外箱宽m", value: "carton_width" },
        { label: "外箱高m", value: "carton_height" },
        { label: "每箱pcs数量个", value: "carton_pcs_num" },
        { label: "整箱产品净重 kg", value: "carton_net_eight" },
        { label: "整箱产品毛重 kg", value: "carton_gross_weight" },
        { label: "产品净重g", value: "net_weight" },
        { label: "产品毛重g", value: "gross_weight" },
        { label: "包裹重量g", value: "pack_weight" },
        { label: "开发人员", value: "develop_admin_name" },
        { label: "产品图1", value: "image1" },
        { label: "产品图2", value: "image2" },
        { label: "产品图3", value: "image3" },
        { label: "产品图4", value: "image4" },
        { label: "产品图5", value: "image5" },
        { label: "产品图6", value: "image6" },
        { label: "产品图7", value: "image7" },
        { label: "产品图8", value: "image8" },
        { label: "产品图9", value: "image9" },
        { label: "产品图10", value: "image10" },
        { label: "产品图11", value: "image11" },
        { label: "产品图12", value: "image12" },
        { label: "产品图13", value: "image13" },
        { label: "产品图14", value: "image14" },
        { label: "产品图15", value: "image15" },
        { label: "标题（德语）", value: "page_title_de" },
        { label: "标题（法语）", value: "page_title_fr" },
        { label: "标题（西班牙语）", value: "page_title_es" },
        { label: "标题（意大利语）", value: "page_title_it" },
        { label: "关键词（德语）", value: "search_keyword_de" },
        { label: "关键词（法语）", value: "search_keyword_fr" },
        { label: "关键词（西班牙语）", value: "search_keyword_es" },
        { label: "关键词（意大利语）", value: "search_keyword_it" },
        { label: "产品描述（德语）", value: "product_description_de" },
        { label: "产品描述（法语）", value: "product_description_fr" },
        { label: "产品描述（西班牙语）", value: "product_description_es" },
        { label: "产品描述（意大利语）", value: "product_description_it" },
        { label: "产品特征，亮点（德语）", value: "feature_list_de" },
        { label: "产品特征，亮点（法语）", value: "feature_list_fr" },
        { label: "产品特征，亮点（西班牙语）", value: "feature_list_es" },
        { label: "产品特征，亮点（意大利语）", value: "feature_list_it" },
      ],
      listQuery: Object.assign({}, defaultListQuery),
      dialogVisible: true,
      page: Object.assign({}, defaultPage),
      list: [],
      total: null,
      id: "",
      tableRemoveCheck: false,
    }
  },
  components: {
    RadioButtonGroup,
    Pagination
  },
  watch: {
    ifstatus(newValue) {
      if (newValue == 1) {
        this.listQuery = Object.assign({}, defaultListQuery)
        this.listQuery.templateList = []
        this.$refs.multipleTable.clearSelection()
        this.page.pageIndex = 1
        this.getList()
      }
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.dialogVisible = true
        this.id = ""
        this.$emit("update:visible", false)
        this.listQuery = Object.assign({}, defaultListQuery)
      })
    },
    handleSelectionChange(val) {
      this.$nextTick(() => {
        if (this.tableRemoveCheck) {
          this.tableRemoveCheck = false;
          return
        }
        this.listQuery.templateList = val
        if (this.listQuery.templateList.length > 0) {
          this.rowDrop();
        }
      })
    },
    handRemove(rows, index) {
      const i = this.addData.map(i => i.value).indexOf(rows.value)
      this.$refs.multipleTable.toggleRowSelection(this.addData[i]);
      this.listQuery.templateList.splice(index, 1)
      this.tableRemoveCheck = true
    },
    async handleOk() {
      const length = this.listQuery.templateList.length;
      const name = this.listQuery.templateName.length;
      if (length == 0) {
        this.$message.warning("未选择")
        return false
      }
      if (name == 0) {
        this.$message.warning("未输入模板名称")
        return false
      }
      const templateList = this.listQuery.templateList.map(i => i.value)
      if (this.id) {
        const res = await editProductInfoTemp(this.id, { ...this.listQuery, templateList })
        if (res.code == 200) {
          this.$message.success(res.message)
          this.ifstatus = 1
        }
      } else {
        const res = await createProductInfoTemp({ ...this.listQuery, templateList })
        if (res.code == 200) {
          this.$message.success(res.message)
          this.ifstatus = 1
        }
      }
    },
    async getList() {
      const res = await queryProductInfoTemp(this.page)
      this.list = res.data.list
      this.total = res.data.total
    },
    remove(row) {
      this.$confirm(`此操作将永久删除模板【${row.templateName}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProductInfoTemp(row.id).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message)
            this.page.pageIndex = 1
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    edit(row) {
      const arr = JSON.parse(row.templateList)
      for (let j = 0; j < arr.length; j++) {
        for (let i = 0; i < this.addData.length; i++) {
          if (arr[j] == this.addData[i].value) {
            this.listQuery.templateList.push(this.addData.find(item => { return item.value == this.addData[i].value }))
          }
        }
      }
      this.ifstatus = 0
      this.id = row.id
      this.listQuery.templateName = row.templateName
      this.toggleSelection(this.listQuery.templateList)
      this.rowDrop()
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    rowDrop() {
      const tbody = document.querySelector('.el-table_right .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          let tData = JSON.parse(JSON.stringify(_this.listQuery.templateList));
          const currRow = tData.splice(oldIndex, 1)[0];
          tData.splice(newIndex, 0, currRow);
          _this.listQuery.templateList = [];
          setTimeout(() => {
            _this.listQuery.templateList = tData;
          }, 5);
        }
      })
    },
  }
}
</script>

<style  lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px;

  .el-tabs__content {
    padding: 0;
  }
}
.item_div {
  height: 500px;
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
  .left_div {
    width: 370px;
  }
  .right_div {
    width: 370px;
  }
}
.item_foot {
  margin-top: 15px;
  text-align: right;
}
.table_div {
  overflow: hidden;
}
</style>