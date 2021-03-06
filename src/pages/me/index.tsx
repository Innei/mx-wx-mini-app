import * as React from 'react'
import { Text, View } from 'remax/wechat'
import { Markdown } from '../../components/markdown'
import { useApi } from '../../hooks/use-api'
import { PaddingLayout } from '../../layout/padding'
import Loading from 'weui-miniprogram/miniprogram_dist/loading/loading'
import { client } from '../../utils/api'
export default () => {
  const [loading, data] = useApi(
    React.useCallback(() => client.page.getBySlug('about'), []),
  )
  const text = data?.text ?? ''
  return (
    <View>
      {loading ? (
        <View style={{ marginTop: '5em' }}>
          <Loading type="circle" />
        </View>
      ) : (
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
