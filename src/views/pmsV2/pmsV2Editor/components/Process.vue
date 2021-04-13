<template>
  <div class="processClass">
    <div :class="['step', getStatusClass(1)]">
      <div class="stepNum">1</div>
      <div class="tip">填写信息</div>
      <div :class="['line', 'intervalLine', getLineAnima(1)]"></div>
    </div>
    <div :class="['step', getStatusClass(2)]">
      <div class="stepNum">2</div>
      <div class="tip">编辑内容</div>
      <div :class="['line',  getLineAnima(2)]"></div>
    </div>
    <div :class="['step', getStatusClass(3)]">
      <div class="branch">
        <div class='squareBoxTop'></div>

        <div class='squareBoxBottom'></div>
      </div>
      <div class="branchTip">
        <div class="branchTipTop">图片处理</div>
        <div class="branchTipBottom">编辑处理</div>
      </div>
      <div :class="['line', 'intervalLine',  getLineAnima(3)]"></div>
    </div>
    <div :class="['step', getStatusClass(4)]" style="flex:none;">
      <div class="stepNum">4</div>
      <div class="tip">终审</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Process',
  props: {
    processNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      active: 1
    };
  },
  methods: {
    getStatusClass(stepIndex) {
      const { developStatus, editStatus, imageStatus, checkStatus } = this.processNode
      if (stepIndex === 1) {
        switch (developStatus) {
          case 1:
            return ''
          case 2:
            return 'active'
          case 3:
            return 'error'
        }
      }
      if (stepIndex === 2) {
        if (editStatus === undefined || imageStatus === undefined) return ''
        if (editStatus === 1 && imageStatus === 1) return ''
        if (editStatus === 3 || imageStatus === 3) return 'error'
        return 'active'
      }
      if (stepIndex === 3) {
        return {
          activeTop: imageStatus === 2 ? true : false,
          errorTop: imageStatus === 3 ? true : false,
          activeBottom: editStatus === 2 ? true : false,
          errorBottom: editStatus === 3 ? true : false,
        }
      }
      if (stepIndex === 4) {
        switch (checkStatus) {
          case 1:
            return ''
          case 2:
            return 'active'
          case 3:
            return 'error'
        }
      }
    },
    getLineAnima(stepIndex) {
      const { developStatus, editStatus, imageStatus, checkStatus } = this.processNode
      if (stepIndex === 1) {
        if (developStatus === undefined) return ''
        return developStatus !== 1 && editStatus == 1 && imageStatus == 1 ? 'lineAnima' : ''
      }
      if (stepIndex === 2) {
        if (editStatus === undefined || imageStatus === undefined) return ''
        return (editStatus == 2 && imageStatus == 2) || (editStatus == 1 && imageStatus == 1) ? '' : 'lineAnima'
      }
      if (stepIndex === 3) {
        if (checkStatus === undefined) return ''
        return (editStatus == 2 && imageStatus == 2) && checkStatus !== 2 ? 'lineAnima' : ''
      }
    }
  },
};
</script>

<style scoped lang='scss'>
.processClass {
  height: 80px;
  width: 50%;
  margin: 0 auto 20px;
  display: flex;
  justify-content: space-around;

  .step {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;

    $lineColor: rgb(192, 196, 204);

    .stepNum {
      display: inline-block;
      flex-basis: 30px;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      border: 2px solid gray;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      background-color: white;
    }

    .tip {
      white-space: nowrap;
      margin: 0 8px;
    }

    .line {
      flex-grow: 1;
      height: 2px;
      background-color: $lineColor;
      position: relative;
    }
    .lineAnima:after {
      position: absolute;
      top: 0;
      left: 0;
      background: #fff;
      border-radius: 10px;
      width: 10%;
      height: inherit;
      opacity: 0.4;
      animation: lineAnima 1.5s ease-in-out infinite;
      content: "";
    }
    @keyframes lineAnima {
      from {
        width: 0%;
      }
      to {
        width: 100%;
      }
    }
    .intervalLine {
      margin: 0 10px;
    }

    .branch {
      height: 100%;
      width: 20%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      @mixin squareBox {
        height: 40%;
        width: 100%;
        border-left: 2px solid $lineColor;
      }
      .squareBoxTop {
        @include squareBox;
        border-top: 2px solid $lineColor;
      }
      .squareBoxBottom {
        @include squareBox;
        border-bottom: 2px solid $lineColor;
      }
    }
    .branchTip {
      height: 100%;
      margin: 0 8px;

      .branchTipTop {
        height: 50%;
      }
      .branchTipBottom {
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }
  }

  $activeColor: rgb(103, 194, 58);
  .active {
    color: $activeColor;
    .stepNum {
      border: 2px solid $activeColor;
    }
    .line {
      background-color: $activeColor;
    }
  }
  .activeTop {
    .branch .squareBoxTop {
      border-left: 2px solid $activeColor;
      border-top: 2px solid $activeColor;
    }
    .branchTip .branchTipTop {
      color: $activeColor;
    }
  }
  .activeBottom {
    .branch .squareBoxBottom {
      border-left: 2px solid $activeColor;
      border-bottom: 2px solid $activeColor;
    }
    .branchTip .branchTipBottom {
      color: $activeColor;
    }
  }
  .activeTop.activeBottom {
    .line {
      background-color: $activeColor;
    }
  }

  $errorColor: rgb(238, 51, 51);
  .error {
    color: $errorColor;
    .stepNum {
      border: 2px solid $errorColor;
    }
    .line {
      background-color: $errorColor;
    }
  }
  .errorTop {
    .branch .squareBoxTop {
      border-left: 2px solid $errorColor;
      border-top: 2px solid $errorColor;
    }
    .line {
      background-color: $errorColor;
    }
    .branchTip .branchTipTop {
      color: $errorColor;
    }
  }
  .errorBottom {
    .branch .squareBoxBottom {
      border-left: 2px solid $errorColor;
      border-bottom: 2px solid $errorColor;
    }
    .line {
      background-color: $errorColor;
    }
    .branchTip .branchTipBottom {
      color: $errorColor;
    }
  }
}
</style>
