<template>
<div class="music-list">
  <div class="hbar" ref="hbar">
    <div class="left"><i class="icon" @click="goback">&#xe74f;</i></div>
    <div class="center" v-html="title"></div>
    <div class="right"></div>
  </div>
  <div class="album" :style="bgStyle" ref="bgImg">
    <div class="filters" ref="filterBlur"></div>
    <div class="btn"><button>我是按钮</button></div>
  </div>
  <div class="bg-layer" ref="bgLayer"></div>
  <scroll :data="list" :probe-type="probeType" :listen-scroll="listenScroll" class="list" ref="list" @scroll="scroll">
    <div class="song-list-wrap">
      <song-list :songs="list"></song-list>
    </div>
  </scroll>
</div>
</template>
<script>
import SongList from 'base/songList'
import Scroll from 'base/scroll/scroll'

const RESERVED_HEIGHT = 40

export default {
  name: "musicList",
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: []
    },
    bgImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      musicList: [],
      scrollY: 0
    }
  },
  methods: {
    goback() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y

    }
  },
  watch: {
    scrollY(newY) {
      // 滑动时候白色背景
      let translateY = Math.max(this.maxScrollY, this.scrollY)
      this.$refs.bgLayer.style.transform = `translate3d(0,${translateY}px,0)`
      this.$refs.bgLayer.style.webkitTransform = `translate3d(0,${translateY}px,0)`

      let index = 0
      let blurPercent = 0
      let scalePercent = Math.abs(newY / this.bgImgHeight)
      if (newY > 0) {
        // 向下拉的时候设置图片缩放比例
        index = 5
        let scale = scalePercent + 1
        this.$refs.bgImg.style.transform = `scale(${scale})`
      } else {
        blurPercent = Math.min(50, scalePercent * 50)
      }

      if (newY < translateY) {
        // 计算顶上去的比例与定高 RESERVED_HEIGHT 的比例设置头部颜色
        let pecent = (Math.abs(newY - translateY) / RESERVED_HEIGHT)
        this.$refs.hbar.style.background = `rgba(49,194,124,${pecent})`
        // 如果是到达位置就设置图片 index 比列表高
        index = 5
        this.$refs.bgImg.style.paddingTop = `${RESERVED_HEIGHT}px`
      } else {
        this.$refs.hbar.style.background = 'transparent'
        this.$refs.bgImg.style.paddingTop = '70%'
      }
      this.$refs.filterBlur.style['backdrop-filter'] = `blur(${blurPercent}px)`
      this.$refs.bgImg.style.zIndex = index

    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 设置最大可以拉动距离
    this.bgImgHeight = this.$refs.bgImg.clientHeight
    this.maxScrollY = -this.bgImgHeight + RESERVED_HEIGHT
    // 设置歌曲列表/图片距离
    this.$refs.list.$el.style.top = `${this.bgImgHeight}px`
  },
  components: {
    SongList,
    Scroll
  }
}
</script>
