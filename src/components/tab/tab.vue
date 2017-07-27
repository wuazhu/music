<template>
  <div class="tab">
    <nav>
      <router-link to="/recommend">
        <span>推荐</span>
      </router-link>
      <router-link to="/singer">
        <span>歌手</span>
      </router-link>
      <router-link to="/rank">
        <span>排行</span>
      </router-link>
      <router-link to="/search">
        <span>搜索</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Tab'
}
</script>
