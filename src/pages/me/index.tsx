import * as React from 'react'
import { Text, View } from 'remax/wechat'
import { Markdown } from '../../components/markdown'
import { useApi } from '../../hooks/use-api'
import { PaddingLayout } from '../../layout/padding'

export default () => {
  // console.log(data)
  const [loading, { data }] = useApi('/pages/slug/about')
  const text = data?.text ?? ''
  return (
    <View>
      {!loading && (
        <PaddingLayout>
          <View>
            <Text style={{ fontSize: '1.5em', fontWeight: 'lighter' }}>
              关于我
            </Text>
          </View>
          <Markdown>{text}</Markdown>
        </PaddingLayout>
      )}
    </View>
  )
}
