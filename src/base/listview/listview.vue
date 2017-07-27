<template>
<scroll class="listView" :probeType="probeType" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll">
	<ol class="groups">
		<li v-for="group in data" class="singer-group" ref="listGroup">
			<h3 class="singer-title">{{group.title}}</h3>
			<ol class="singer-list-group">
				<li v-for="item in group.items" class="singer-item" @click="selecItem(item)">
					<img v-lazy="item.avatar" alt=""><span>{{item.name}}</span>
				</li>
			</ol>
		</li>
	</ol>
	<div class="shortcut" @touchstart="shortTouchHandle" @touchmove.stop.prevent="shortMoveHandle">
		<ol>
			<li v-for="(item,index) in shortCutTitle" :class="{'active':currentIndex===index}" :data-index="index">{{item}}
			</li>
		</ol>
	</div>
	<div class="fixtitle" v-show="fixtitle" ref="fixtop">
		<h4>{{fixtitle}}</h4>
	</div>
	<div class="loading-container" v-show="!data.length">
		<loading></loading>
	</div>
</scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {
	dataAttr
} from 'common/dom'
const FIXTITLE_HEIGHT = 36
export default {
	name: "ListView",
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	components: {
		Scroll,
		Loading
	},
	data() {
		return {
			scrollY: -1,
			currentIndex: 0,
			probeType: 3,
			diff: -1
		}
	},
	created() {
		this.touchObj = {}
		this.listenScroll = true
		this.listHeight = []
	},
	methods: {
		selecItem(item) {
			this.$emit('selectSinger', item)
		},
		shortTouchHandle(e) {
			let index = dataAttr(e.target, 'index')

			let firstTouch = e.touches[0]
			this.touchObj.index = index
			this.touchObj.firstY = firstTouch.pageY
			this._scrollTo(index)
		},
		shortMoveHandle(e) {
			let second = e.touches[0]
			this.touchObj.second = second.pageY
			let delta = ((this.touchObj.second - this.touchObj.firstY) / 16 | 0) + parseInt(this.touchObj.index)
			this._scrollTo(delta)
		},
		scroll(pos) {
			this.scrollY = pos.y
		},
		_scrollTo(index) {
			if (!index && index != 0) {
				return
			}
			if (index < 0) {
				index = 0
			} else if (index > this.listHeight.length - 2) {
				index = this.listHeight.length - 2
			}
			this.scrollY = -this.listHeight[index]
			this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
		},
		_calculateHeight() {
			this.listHeight = []
			const list = this.$refs.listGroup
			let height = 0
			this.listHeight.push(height)
			for (let i = 0; i < list.length; i++) {
				let item = list[i]
				height += item.clientHeight
				this.listHeight.push(height)
			}
		}
	},
	watch: {
		data() {
			setTimeout(() => {
				this._calculateHeight()
			}, 20)
		},
		scrollY(newY) {
			// console.log('newy', newY);
			const listHeight = this.listHeight
			// 当在最顶部的时候向下拉
			if (newY > 0) {
				this.currentIndex = 0
				return
			}
			// 当在中间的时候拖动
			for (let i = 0; i < listHeight.length - 1; i++) {
				let height1 = listHeight[i]
				let height2 = listHeight[i + 1]
				if (-newY >= height1 && -newY < height2) {
					this.currentIndex = i
					this.diff = height2 + newY
					return
				}
			}
			// 当滚动到最后一个的时候且 -newY >最后一个元素的上限
			this.currentIndex = this.listHeight.length - 2
		},
		diff(newVal) {

			let fixTop = (newVal > 0 && newVal < FIXTITLE_HEIGHT) ? newVal - FIXTITLE_HEIGHT : 0
			if (this.fixTop === fixTop) {
				return
			}
			this.fixTop = fixTop
			this.$refs.fixtop.style.transform = `translate3d(0,${fixTop}px,0)`
		}
	},
	computed: {
		shortCutTitle() {
			return this.data.map((group) => {
				return group.title.substring(0, 1)
			})
		},
		fixtitle() {
			if (this.scrollY > 0) {
				return ''
			}
			return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
		}
	}
}
</script>
