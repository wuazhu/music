import * as types from './mutationTypes'

const mutations = {
  [types.SET_SINGER](state, payload){
    state.singer = payload
  }
}

export default mutations
