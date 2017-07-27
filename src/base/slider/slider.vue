<template>
<div class="slider" ref="slider">
  <div class="slider-group" ref="sliderGroup">
    <slot></slot>
  </div>
  <div class="dots">
    <span class="dot" v-for="(item,index) in dots" :class="{active: dotIndex === index}"></span>
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import {
  addClass
} from 'common/dom'

export default {
  name: 'Slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      dots: [],
      dotIndex: 0
    }
  },
  methods: {
    _setSlidesWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let childrenLength = this.$refs.sliderGroup.children.length
      let parentWidth = this.$refs.slider.clientWidth
      var groupWidth;
      groupWidth = childrenLength * parentWidth + 'px'
      if (this.loop && !isResize) {
        groupWidth = (2 + childrenLength) * parentWidth + 'px'
      }
      this.$refs.sliderGroup.style.width = groupWidth
    },
    _initDots() {
      this.dots = new Array(this.children.length)
      // console.log(this.dots);
    },
    _initScroll() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.dotIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._autoPlay()
        }
      })
    },
    _autoPlay() {
      let pageIndex = this.dotIndex + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setInterval(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  mounted() {
    this._setSlidesWidth()
    this._initDots()
    this._initScroll()

    if (this.loop) {
      this._autoPlay()
    }

    window.addEventListener('resize', () => {
      console.log('resize');
      window.resizeRoot()
      if (!this.slider) return
      // this.$router.refresh()

      this._setSlidesWidth(true)
      this.slider.refresh()
    })
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>
