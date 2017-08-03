<template>
<transition name="slide">
  <div class="singer-detail">
    <music-list :list="musicList" :title="title" :bg-img="bgImg"></music-list>
  </div>
</transition>
</template>
<script>
import {
  mapGetters
} from 'vuex'

import {
  getSingerDetail
} from 'api/singer'

import {
  ERR_OK
} from 'api/config'

import {
  createSong
} from 'common/song'
import MusicList from 'components/musicList'
export default {
  name: "singerDetail",
  components: {
    MusicList
  },
  data() {
    return {
      musicList: []
    }
  },
  methods: {
    _getSingerDetail() {
      // 判断如果刷新页面读取不到 id 就返回歌手页面
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      // 否则就根据 store 里的歌手 id 去获取数据
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.musicList = this._resizeSongsList(res.data.list)
          // console.log(this.musicList);
        }
      })
    },
    _resizeSongsList(list) {
      let ret = []
      list.forEach((item) => {
        let {
          musicData
        } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  computed: {
    title() {
      // 这里的 title 可以直接从 getters 里的 singer获取
      return this.singer.name
    },
    bgImg() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerDetail()
  }
}
</script>
