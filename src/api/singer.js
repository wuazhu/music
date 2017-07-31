import jsonp from 'common/jsonp'
import {
  commonParams,
  options
} from './config'

export function getSinger() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    pagesize: 100,
    pagenum: 1,
    key: 'all_all_all',
    platform: 'yqq',
    loginUin: '317516763',
    hostUin: 0,
    uin: 0,
    needNewCode: 0,
    g_tk: 952633643
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}
