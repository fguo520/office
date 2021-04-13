<template>
  <div class="cardContainer">
    <el-card shadow="never" v-bind="$attrs" ref="card">
      <slot />

      <transition name="el-zoom-in-bottom">
        <div class="mask" v-show="!spread && !singleRow"></div>
      </transition>

      <div class="buttonContainer">
        <slot name="button" />
      </div>
    </el-card>

    <div class="shrinkButton" v-show="!singleRow">
      <div class="shrinkButtonLeft" @click="openClose">
        <i :class="{spread}" />
        <span>{{ spread ? "合并" : "展开" }}</span>
      </div>

      <div class="shrinkButtonRight" @click="keyToLock">
        <div :class="['lock', {unlock:!lock, lockTip}]">
          <div class="lockHead">
            <div class="circle"></div>
          </div>
          <div class="lockBody">
            <div class="hole"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
function debounce(fn, wait) {
  var timeout = null;
  return function () {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  }
}
export default {
  data() {
    return {
      spread: true,
      canScroll: true,//用于防止表格滑动到底部后，点击展开后触发滑动事件
      singleRow: true,
      lock: false,
      lockTip: false
    }
  },
  created() {
    this.spread = JSON.parse(localStorage.getItem("cardContainerSpread"));
    this.lock = JSON.parse(localStorage.getItem("cardContainerLock"))
  },
  mounted() {
    const { tableScroll, resize } = this
    const card = this.$refs.card.$el;
    const tableRef = this.$parent.$slots.container[0].data.ref;
    const table = this.$parent.$slots.container[0].context.$refs[tableRef].$refs.singleTable.bodyWrapper;
    table && table.addEventListener("scroll", tableScroll)

    resize()
    const erd = elementResizeDetectorMaker()
    erd.listenTo(card, resize.bind(this))

    this.$on("hook:beforeDestroy", () => {
      table.removeEventListener("scroll", tableScroll);
      erd.uninstall(card)
    })
  },
  methods: {
    resize(e) {
      const target = this.$refs.card.$el
      const rowHeight = this.$refs.card.$el.children[0].scrollHeight - 40;
      this.singleRow = rowHeight <= 90 ? true : false;
      if (this.singleRow) {
        target.style.height = ""
      } else {
        target.style.height = `${this.spread ? '' : 110}px`
      }
    },
    scaling() {
      const target = this.$refs.card.$el
      if (this.spread) {
        //需要等待class类名发生改变时在进行设置maxHeight
        this.$nextTick(() => {
          target.style.height = `${target.scrollHeight}px`
          //等待动画结束后
          setTimeout(() => { target.style.height = "" }, 500)
        })
      } else {
        if (this.singleRow) return;
        target.style.height = `${target.scrollHeight}px`
        //在动画之前设置高度height
        setTimeout(() => { target.style.height = `${110}px` }, 30)
      }
    },
    openClose() {
      if (this.lock) {
        this.playLockTip()
        return
      };
      this.spread = !this.spread
      localStorage.setItem("cardContainerSpread", JSON.stringify(this.spread))
      this.canScroll = false;
      setTimeout(() => {
        this.canScroll = true
      }, 500)
      this.scaling()
    },
    tableScroll() {
      if (!this.spread || !this.canScroll || this.lock) return
      this.spread = false;
      this.scaling()
    },
    keyToLock() {
      this.lock = !this.lock
      localStorage.setItem("cardContainerLock", JSON.stringify(this.lock))
    },
    playLockTip() {
      if (this.lockTip) return
      this.lockTip = true;
      setTimeout(() => {
        this.lockTip = false;
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.cardContainer {
  position: relative;

  /deep/ .el-card {
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }

  .mask {
    position: absolute;
    width: 100%;
    height: 60px;
    bottom: 0px;
    right: 0px;
    padding-right: 20px;
    z-index: 10;
    background-image: linear-gradient(rgba(255, 0, 0, 0), rgb(238, 238, 238));
  }
  .buttonContainer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    bottom: 5px;
    right: 20px;
    z-index: 20;
    transition: all 0.3s ease-in-out;
  }

  .shrinkButton {
    display: flex;
    width: 110px;
    height: 15px;
    background-color: rgb(236, 236, 236);
    position: absolute;
    bottom: 1px;
    left: 50%;
    border-top-right-radius: 1em;
    border-top-left-radius: 1em;
    text-align: center;
    cursor: pointer;
    user-select: none;
    transform: translateX(-50%);
    z-index: 1000;

    .shrinkButtonLeft {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      border-top-left-radius: 1em;

      &:hover {
        background-color: rgb(223, 223, 223);
        span {
          transform: translateX(5px);
          opacity: 1;
        }
        i {
          transform: translateX(0px);
        }
      }

      i {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        width: 15px;
        height: 15px;
        transform: translateX(20px);
        transition: all 0.3s ease-in-out;

        &:before {
          content: "";
          display: inline-block;
          position: absolute;
          top: 3px;
          left: 4px;
          width: 1px;
          height: 10px;
          background-color: black;
          transform: rotate(-45deg);
          transform-origin: 50% 50%;
          transition: all 0.6s cubic-bezier(0.86, 0, 0.07, 1) 0.4s;
        }

        &:after {
          content: "";
          display: inline-block;
          position: absolute;
          top: 3px;
          left: 11px;
          width: 1px;
          height: 10px;
          background-color: black;
          transform: rotate(45deg);
          transform-origin: 50% 50%;
          transition: all 0.6s cubic-bezier(0.86, 0, 0.07, 1) 0.4s;
        }
      }
      .spread {
        &:before {
          transform: rotate(-135deg);
        }
        &:after {
          transform: rotate(135deg);
        }
      }

      span {
        display: inline-block;
        font-size: 14px;
        transform: translateX(10px);
        opacity: 0;
        transition: all 0.3s ease-in-out;
      }
    }
    .shrinkButtonRight {
      width: 30px;
      border-top-right-radius: 1em;
      border-left: 1px solid grey;
      padding-right: 5px;

      &:active {
        background-color: rgb(223, 223, 223);
      }

      .lock {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .lockHead {
          width: 8px;
          height: 5px;
          overflow: hidden;
          transform-origin: 80% center;
          transition: all 0.6s ease-in-out;

          .circle {
            width: 6px;
            height: 8px;
            border-radius: 50%/35%;
            border: 1px solid black;
            margin: auto;
          }
        }
        .lockBody {
          width: 10px;
          height: 10px;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10%;

          .hole {
            height: 3px;
            width: 1px;
            background-color: white;
            border-radius: 30%;
          }
        }
      }
      .unlock {
        .lockHead {
          transform: rotateY(-180deg);
        }
      }
      .lockTip {
        animation: lockTip 2s 1;
      }
      @keyframes lockTip {
        10% {
          transform: scale(1.2);
        }
        20% {
          transform: scale(1.2) rotate(30deg);
        }
        40% {
          transform: scale(1.2) rotate(-30deg);
        }
        60% {
          transform: scale(1.2) rotate(30deg);
        }
        80% {
          transform: scale(1.2) rotate(-30deg);
        }
        100% {
          transform: scale(1);
        }
      }
    }
  }
}
</style>
