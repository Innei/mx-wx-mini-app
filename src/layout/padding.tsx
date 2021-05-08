import React, { FC } from 'react'
import { View } from 'remax/wechat'

export const PaddingLayout: FC = (props) => {
  return <View style={{ padding: '1em' }}>{props.children}</View>
}
