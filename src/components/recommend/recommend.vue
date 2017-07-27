<template>
<div class="recommend">
	<scroll class="recommend-content" :data="dissList" ref="scroll">
		<div>
			<div class="sliders" v-if="sliders.length">
				<slider>
					<div class="slider-item" v-for="item in sliders">
						<a :href="item.linkUrl">
            <img :src="item.picUrl" alt="" @load="loadImg">
          </a>
					</div>
				</slider>
			</div>
			<div class="hot">
				<div>
					<h1><span>热门歌单推荐</span></h1>
					<ul class="hot-list">
						<li v-for="i in dissList" :dissid="i.dissid">
							<div class="pic"><img v-lazy="i.imgurl" :alt="i.dissname"></div>
							<div class="info">
								<p class="titile" v-html="i.dissname"></p>
								<p class="desc" v-html="i.creator.name"></p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="loading-container" v-show="!dissList.length">
			<loading></loading>
		</div>
	</scroll>
</div>
</template>

<script>
import {
	getRecommend,
	getDiscList
} from 'api/recommend'

import {
	ERR_OK
} from 'api/config'

import Loading from 'base/loading/loading'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import axios from 'axios'
export default {
	name: 'Recommend',
	components: {
		Slider,
		Scroll,
		Loading
	},
	data() {
		return {
			sliders: [],
			dissList: [],
			checkLoad: false
		}
	},
	created() {
		this._getRecommend()
		setTimeout(() => {

			this._getDiscList()
		}, 1000)

	},
	methods: {
		_getRecommend() {
			getRecommend().then((res) => {
				if (res.code === ERR_OK) {
					this.sliders = res.data.slider
				} else {

				}
			})
		},
		_getDiscList() {
			getDiscList().then((res) => {
				// console.log(res);
				this.dissList = res.data.list
				// console.log(this.dissList);
			})
		},
		loadImg() {
			if (!this.checkLoad) {
				// console.log('imgload');
				this.$refs.scroll.refresh()
			}
			this.checkLoad = true
		}
	}
}
</script>
