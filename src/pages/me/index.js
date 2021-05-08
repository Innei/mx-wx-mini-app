import * as React from 'react'
import { View } from 'remax/wechat'
import { $api } from '../../utils/api'

export default () => {
  // console.log(data)
  $api
    .get('/pages/slug/about')
    .then((r) => {
      console.log(r, 'aa')
    })
    .catch((j) => {
      console.dir(j)
    })
  return <View>Me</View>
}
