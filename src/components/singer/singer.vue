<template>
<div class="singer">
  <list-view :data="singerList" @selectSinger="selectSinger"></list-view>
  <router-view></router-view>
</div>
</template>

<script>
import {
  getSinger
} from 'api/singer'
import {
  ERR_OK
} from 'api/config'
import Singer from 'common/singer'
import ListView from 'base/listview/listview'

import {
  mapMutations
} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  data() {
    return {
      singerList: []
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSinger()
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSinger() {
      getSinger().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this.resizeList(res.data.list)
        }
      })
    },
    resizeList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>
