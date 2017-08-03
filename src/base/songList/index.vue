<template>
<div class="song-list">
  <ul>
    <li v-for="item in songs">
      <div class="title">{{item.name}}</div>
      <div class="desc">{{getDesc(item)}}</div>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  name: "songList",
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    getDesc(songs) {
      return `${songs.singer}. ${songs.album}`
    }
  },
  data() {
    return {

    }
  }
}
</script>
