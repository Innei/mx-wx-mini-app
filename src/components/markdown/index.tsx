import * as React from 'react'
import M, { ReactMarkdownOptions } from 'react-markdown'
import {
  NormalComponents,
  SpecialComponents,
} from 'react-markdown/src/ast-to-react'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import { Image, Text, View } from 'remax/wechat'
// @ts-ignore
import styles from './styles.css'

// @ts-ignore
const renderers: () => Partial<NormalComponents & SpecialComponents> = () => {
  const images = []
  return {
    p(h) {
      return (
        <React.Fragment>
          {React.Children.map(h.children, (props) => {
            if (typeof props === 'string') {
              return <Text style={{ wordBreak: 'break-all' }}>{props}</Text>
              // HACK
              // @ts-ignore
            } else if (props?.key.startsWith('img')) {
              return <View>{props}</View>
            } else {
              return props
            }
          })}
          <View style={{ paddingTop: '1em' }} />
        </React.Fragment>
      )
    },
    strong(props) {
      return <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
    },
    h1(props) {
      return (
        <View style={{ fontSize: '1.2em' }}>
          <Text style={{ fontWeight: 'lighter', fontSize: '.8em' }}>H1</Text>{' '}
          {props.children}
        </View>
      )
    },
    h2(props) {
      return (
        <View style={{ fontSize: '1.2em' }}>
          <Text style={{ fontWeight: 'lighter', fontSize: '.8em' }}>H2</Text>{' '}
          {props.children}
        </View>
      )
    },
    h3(props) {
      return (
        <View style={{ fontSize: '1.2em' }}>
          <Text style={{ fontWeight: 'lighter', fontSize: '.8em' }}>H3</Text>{' '}
          {props.children}
        </View>
      )
    },
    h4(props) {
      return (
        <View style={{ fontSize: '1.2em' }}>
          <Text style={{ fontWeight: 'lighter', fontSize: '.8em' }}>H4</Text>{' '}
          {props.children}
        </View>
      )
    },
    h5(props) {
      return (
        <View style={{ fontSize: '1.2em' }}>
          <Text style={{ fontWeight: 'lighter', fontSize: '.8em' }}>H5</Text>{' '}
          {props.children}
        </View>
      )
    },
    // @ts-ignore
    img(props: { node: any; src: string; alt: string }) {
      images.push(props.src)
      return (
        <View style={{ textAlign: 'center' }}>
          <Image
            src={props.src}
            mode="aspectFill"
            lazyLoad
            webp
            onClick={() => {
              wx.previewImage({
                urls: images,
                current: props.src,
              })
            }}
          />
        </View>
      )
    },
    a(props) {
      // console.log(props.children);

      return (
        <Text style={{ color: '#66C2BA' }}>
          {props.children}
          {props.children[0] !== props.href && (
            <Text style={{ marginLeft: '1em' }}>-&gt; {props.href}</Text>
          )}
        </Text>
      )
    },
    details(p) {
      return (
        <View>
          {/* {p.children.map((i) => {
            if (i.type == 'text' && i.value.trim() === '') {
              i.value = ''
            }
            return i
          })} */}
          {p.children}
        </View>
      )
    },
    summary(props) {
      return (
        <View style={{ fontWeight: 500, textAlign: 'center' }}>
          {props.children}
        </View>
      )
    },

    del(props) {
      return (
        <Text style={{ textDecoration: 'line-through' }}>{props.children}</Text>
      )
    },
    span(props) {
      // console.log(props)

      return <Text>{props.children}</Text>
    },

    text(props) {
      const { className } = props
      return <Text className={styles[className]}>{props.children}</Text>
    },
    ul(props) {
      return (
        <View
          style={{
            paddingLeft: '1em',
            listStyleType: 'disc',
            listStyle: 'inside',
          }}
        >
          {props.children}
        </View>
      )
    },
    ol(props) {
      return (
        <View
          style={{
            paddingLeft: '1em',
            listStyleType: 'decimal',
            listStyle: 'inside',
          }}
        >
          {props.children}
        </View>
      )
    },
    li(props) {
      return (
        <View style={{ margin: '.5em 0', display: 'list-item' }}>
          {props.children}
        </View>
      )
    },
    blockquote(props) {
      return (
        <View
          style={{
            padding: '.5em 1em',
            background: '#F6FAFD',
            borderLeft: '10rpx solid #5296D5',
          }}
        >
          {props.children}
        </View>
      )
    },
    em(props) {
      return <Text style={{ fontStyle: 'italic' }}>{props.children}</Text>
    },
    br() {
      return <View style={{ paddingTop: '.5em' }} />
    },
    code(props) {
      // console.log(props)

      return (
        <Text style={{ background: '#F3F4F4', fontFamily: 'monospace' }}>
          {props.children}
        </Text>
      )
    },
    pre(props) {
      // console.log(props)

      return (
        <View style={{ background: '#F3F4F4', fontFamily: 'monospace' }}>
          {props.children}
        </View>
      )
    },
  }
}
export const Markdown = (props: ReactMarkdownOptions) => {
  return (
    <View style={{ fontSize: '28rpx' }}>
      <M
        components={renderers()}
        {...props}
        remarkPlugins={[gfm]}
        rehypePlugins={[
          rehypeRaw,
          // (o) => {
          //   return (tree, file) => {
          //     // @ts-ignore
          //     tree.children.forEach((t) => {
          //       if (t.type == 'raw') {
          //         t.value = '小程序暂不支持解析 HTML DOM 元素, 请前往原地址查看'
          //       }
          //     })
          //   }
          // },
        ]}
      />
    </View>
  )
}
