import * as React from 'react'
import { useState } from 'react'
import { View, Text, Button } from 'remax/wechat'
import { useAppEvent } from 'remax/macro'
import { Markdown } from '../../components/markdown'
import { useApi } from '../../hooks/use-api'
import { PaddingLayout } from '../../layout/padding'
// import Button from
import Loading from 'weui-miniprogram/miniprogram_dist/loading/loading'
export default () => {
  const [url, setUrl] = useState('/notes/latest')
  const [isLoading, { data, next, prev }] = useApi(url)
  const { nid = 1, text = '', title = '' } = data || {}
  const hasNextPage = prev
  const hasPrevPage = next
  const fetch = (nid: number) => {
    setUrl('/notes/nid/' + nid)
  }

  useAppEvent('onShareAppMessage', () => {
    return {
      title: title,
      path: '/page/user?id=123',
    }
  })

  useAppEvent('onShareTimeline', () => {
    // console.log(title)

    return {
      title: title,
      imageUrl: '',
    }
  })

  // React.useEffect(() => {
  //   const onCopyUrl: WechatMiniprogram.OnCopyUrlCallback = (res) => {

  //     return {...res, }
  //   }

  //   wx.onCopyUrl(onCopyUrl)
  //   return () => {
  //     wx.offCopyUrl(onCopyUrl)
  //   }
  // }, [])
  return (
    <View>
      {isLoading ? (
        <View style={{ marginTop: '5em' }}>
          <Loading type="circle" />
        </View>
      ) : (
        <PaddingLayout>
          <View>
            <Text style={{ fontSize: '1.5em', fontWeight: 'lighter' }}>
              {title}
            </Text>
          </View>
          <Markdown>{text}</Markdown>
          <View style={{ display: 'flex' }}>
            <Button
              type="primary"
              disabled={!hasPrevPage}
              onClick={() => {
                fetch(hasPrevPage.nid)
              }}
            >
              上一篇
            </Button>
            <Button
              type="primary"
              disabled={!hasNextPage}
              onClick={() => {
                fetch(hasNextPage.nid)
              }}
            >
              下一篇
            </Button>
          </View>
        </PaddingLayout>
      )}
    </View>
  )
}
