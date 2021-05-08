import * as React from 'react'
import { useState } from 'react'
import { View, Text, Button } from 'remax/wechat'
import { Markdown } from '../../components/markdown'
import { useApi } from '../../hooks/use-api'
import { PaddingLayout } from '../../layout/padding'
// import Button from
export default () => {
  const [url, setUrl] = useState('/notes/latest')
  const [isLoading, { data, next, prev }] = useApi(url)
  const { nid = 1, text = '', title = '' } = data || {}
  const hasNextPage = prev
  const hasPrevPage = next
  const fetch = (nid: number) => {
    setUrl('/notes/nid/' + nid)
  }
  return (
    <View>
      {!isLoading && (
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
