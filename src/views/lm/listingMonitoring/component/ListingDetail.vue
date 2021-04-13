<template>
  <el-popover placement="left" :width="width" trigger="click" @show="show" v-bind="$attrs" popper-class="ListingPopover" ref="ListingPopover">
    <div class="listingDetailTitle" v-if="title">
      <div class="title">{{ title }}</div>

      <div class="subTitle">
        <el-switch v-model="showStyleSwitch" active-text="折线" inactive-text="卡片" />
        <div class="subTitleLeft">
          <span> <label v-copy="row.sku">sku：</label> {{ row.sku }} </span>
          <span> <label v-copy="row.productNameCn">中文名：</label> {{ row.productNameCn }} </span>
        </div>
      </div>
    </div>

    <div class="listingDetailContainer" :style="containerDefaultStyle" v-if="!showStyleSwitch">
      <div class="listingDetailItem" v-for="(item, index) in list" :key="item.dateStr" :style="itemDefaultStyle">
        <div :class="['detailTime', getClass(index)]" @click="detailItem(index)">
          {{ item.dateStr }}
        </div>
        <div class="detailContent">
          <slot :item="item"></slot>
        </div>
      </div>
    </div>

    <ve-line :data="getChartData" :width="width-20+'px'" v-if="showStyleSwitch"></ve-line>

    <div slot="reference">
      <slot name="reference"></slot>
    </div>

    <slot name="other"></slot>
  </el-popover>
</template>

<script>
// import VeLine from 'v-charts/lib/line.common'
export default {
  name: "listing-detail",
  components: {
    // VeLine
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    title: String,
    width: {
      type: [Number, String],
      default: 1000
    },
    span: {
      type: [Number, String],
      default: 10
    },
    row: {
      type: Object,
      default: () => ({})
    },
    whichShow: {
      type: Object,
      default: () => ({})
    },
    chartData: {
      type: Array,
      default: () => []
    },
    showStyle: {
      type: String,
      default: 'lineChart',
      validator: function (value) {
        return ['lineChart', 'card'].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      showStyleSwitch: true,
    }
  },
  created() {
    switch (this.showStyle) {
      case "lineChart":
        this.showStyleSwitch = true;
        return;
      case "card":
        this.showStyleSwitch = false;
        return;
    }
  },
  computed: {
    getClass() {
      return function (index) {
        switch (Math.floor(index / 7)) {
          case 0:
            return "itembackgroundGreen"
          case 1:
            return "itembackgroundBlue"
          case 2:
            return "itembackgroundRed"
          case 3:
            return "itembackgroundYellow"
        }
      }
    },
    itemDefaultStyle() {
      const { width, span } = this
      return {
        width: (width - 27 - span * 2) / span + 'px',
      }
    },
    containerDefaultStyle() {
      const { chartData, whichShow, span } = this;
      const { otherContent, ...showRow } = whichShow;
      const ShowRowNum = Object.values(showRow).filter(item => item).length + 1
      return {
        height: `${(25 + 20 * ShowRowNum + 12) * (30 / span) + 10}px`
      }
    },
    getChartData() {
      return {
        columns: Object.keys(this.chartData[0] || {}),
        rows: this.chartData || []
      }
    }
  },
  methods: {
    detailItem(index) {
      this.$emit("itemClick", index)
    },
    show() {
      this.$emit("show")
    },
  }
};
</script>

<style lang="scss">
.ListingPopover {
  // transform: translateX(-580px);

  .listingDetailTitle {
    text-align: center;
    color: #303133;
    font-size: 16px;
    line-height: 1;
    // margin-bottom: 12px;

    .title {
      font-weight: bold;
    }
    .subTitle {
      display: flex;
      justify-content: space-between;
      font-weight: bold;

      .subTitleLeft {
        span {
          color: gray;
          font-size: 14px;
          margin: 5px 0;

          label {
            cursor: pointer;
          }
        }
        span:nth-of-type(2) {
          margin-left: 30px;
        }
      }
    }
  }

  .listingDetailContainer {
    margin: auto;
    font-size: 10px;

    .listingDetailItem {
      float: left;
      text-align: left;
      border: 1px solid gray;
      transition: all 0.1s ease-in-out;
      margin: 1px;
      background-color: white;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }

      .detailTime {
        font-weight: bold;
        font-size: 14px;
        padding: 3px 0;
        text-align: center;
        background-color: rgb(189, 189, 189);
        cursor: pointer;
      }

      .detailContent {
        padding: 5px;
        font-size: 13px;
      }

      .itembackgroundYellow {
        background-color: rgb(240, 240, 181) !important;
      }
      .itembackgroundBlue {
        background-color: rgb(177, 177, 238) !important;
      }
      .itembackgroundRed {
        background-color: rgb(233, 183, 183) !important;
      }
      .itembackgroundGreen {
        background-color: rgb(181, 212, 181) !important;
      }
    }
  }
  .el-dialog__body {
    padding: 0;

    .dialogSubtitle {
      text-align: center;
    }
  }
}
</style>