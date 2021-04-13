<template>
  <el-dialog :title="dialogTitle" :visible.sync="visible" :close-on-click-modal="false" :before-close="close" custom-class="logDialog" v-bind="$attrs" width="800px">
    <div slot="title" v-if="$slots.title">
      <slot name="title" />
    </div>

    <slot name="tableOutside" />

    <el-table border :data="list" max-height="500px">
      <el-table-column v-for="(item, index) in config.title" :key="index" :label="item.label" align="center" v-show="!$slots.default" :width="item.width">
        <template #default="{ row }">
          <el-tooltip class="item" effect="dark" :content="row[item.property]" placement="right" :disabled="!(item.tooltip || false)" popper-class="logTooltip" :enterable="false">
            <div class="tooltipClass" v-copy="row[item.property]">{{row[item.property]}}</div>
          </el-tooltip>
        </template>
      </el-table-column>

      <slot />
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="sizeChange" @current-change="currentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="TaskLogData.pageNum" :page-size="TaskLogData.pageSize" :page-sizes="[5, 10, 30, 50, 100]" :total="total" />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini"> 关 闭 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "log-view",
  data() {
    return {
      TaskLogData: {
        pageNum: 1,
        pageSize: 5,
      },
      list: [],
      total: 0,
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: function () {
        return {
          title: [],
          request() { },
          param: {},
        };
      },
    },
    dialogTitle: {
      type: [String, Number],
      default: "日志"
    }
  },
  beforeDestroy() {
    this.close();
  },
  watch: {
    visible: function (newValue, oldValue) {
      if (newValue) {
        this.TaskLogData.pageNum = 1;
        this.request();
      }
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    async request() {
      const { request, param } = this.config;
      const res = await request({ ...this.TaskLogData, ...param });
      if (res.data.list) this.list = res.data.list;
      if (res.data.total) this.total = res.data.total;
    },
    sizeChange(val) {
      this.TaskLogData.pageNum = 1;
      this.TaskLogData.pageSize = val;
      this.request();
    },
    currentChange(val) {
      this.TaskLogData.pageNum = val;
      this.request();
    },
  },
};
</script>

<style lang="scss">
.logDialog /deep/.el-dialog__body {
  padding: 0;
  overflow: hidden;
}
.logDialog /deep/.el-dialog__footer {
  text-align: center !important;
  padding: 30px 20px 20px !important;
}
.logTooltip {
  max-width: 300px;
}
.tooltipClass {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  cursor: pointer;
}
</style>
