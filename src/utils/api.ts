import { PipeLine, PipeLineHandler } from './pipeline'
import {
  allControllers,
  createClient,
  IController,
  IRequestAdapter,
} from '@mx-space/api-client'
import 'url-search-params-polyfill'
import 'url-polyfill'
export type RequestMethodType = 'GET' | 'POST' | 'DELETE' | 'PUT'
type Context = {
  request: any
  response:
    | (Omit<
        WechatMiniprogram.RequestSuccessCallbackResult<
          string | WechatMiniprogram.IAnyObject | ArrayBuffer
        >,
        'data'
      > & { data: any })
    | WechatMiniprogram.GeneralCallbackResult
    | null
  options: Partial<WechatMiniprogram.RequestOption>
}

class ResponseError extends Error {
  constructor(public ctx: Context) {
    super('Response Error')
  }

  get messageFromServer() {
    const m = (this.ctx?.response as any)?.data?.message
    if (typeof m == 'undefined') {
      return 'Network Error'
    }
    if (Array.isArray(m)) {
      return m[0]
    }
    return m ?? ''
  }
}

const BASE_URL = 'https://api.innei.ren/v2'
export interface RequestOption {
  data?: any
  params?: Record<string, any> | URLSearchParams
}
interface Response {
  data: any
  status: number
  ctx: Context
}
class RequestBus {
  public baseOption: Partial<WechatMiniprogram.RequestOption> = Object.freeze({
    header: {
      'content-type': 'application/json',
    },
    timeout: 10000,
    enableCache: false,
  })

  constructor(private baseUrl?: string) {}

  private urlBuilder(relativePath: string) {
    return this.baseUrl
      ? new URL(relativePath, this.baseUrl).toString()
      : relativePath
  }

  async request(
    method: RequestMethodType,
    url: string,
    option: Partial<RequestOption> = {},
  ) {
    url = this.urlBuilder(url)
    let { data, params } = option

    if (params) {
      if (params instanceof URLSearchParams) {
        url = url + '?' + params.toString()
      } else {
        url = url + '?' + new URLSearchParams(params).toString()
      }
    }
    return this.dispatch({
      url,
      //@ts-ignore
      method,
      data: data,
      ...this.baseOption,
    })
  }

  // @ts-ignore
  public get(path: string, options?: RequestOption): Promise<Response>
  //@ts-ignore
  public post(path: string, options?: RequestOption): Promise<Response>
  // //@ts-ignore
  // public patch(
  //   path: string,
  //   options?: RequestOption,
  // ): Promise<Response>
  //@ts-ignore
  public put(path: string, options?: RequestOption): Promise<Response>
  //@ts-ignore
  public delete(path: string, options?: RequestOption): Promise<Response>

  private afterResponsePipeline = new PipeLine<Context>()
  private beforeRequestPipeline = new PipeLine<{
    options: WechatMiniprogram.RequestOption
  }>()
  public addResponseHook(cb: PipeLineHandler<Context>) {
    this.afterResponsePipeline.addPipe(cb)
  }
  public addRequestHook(
    cb: PipeLineHandler<{ options: WechatMiniprogram.RequestOption }>,
  ) {
    this.beforeRequestPipeline.addPipe(cb)
  }
  //@ts-ignore
  private dispatch(options: any) {
    const self = this
    return new Promise<Response>(async (r, j) => {
      const req = wx.request({
        ...(await this.beforeRequestPipeline.handle({ options })).options,

        async complete(res, ...rest) {
          const handled = await self.afterResponsePipeline.handle({
            request: req,
            response: res,
            options: options,
          })

          if (
            handled.response.error ||
            handled.response.errMsg !== 'request:ok' ||
            !handled.response.statusCode.toString().startsWith('2')
          ) {
            return j(new ResponseError(handled))
          }
          r({
            data: handled.response.data,
            status: handled.response.statusCode,
            ctx: handled,
          })
        },
      })
    })
  }
}

;(['GET', 'POST', 'PUT', 'DELETE'] as RequestMethodType[]).forEach((method) => {
  RequestBus.prototype[method.toLowerCase()] = async function (
    this: RequestBus,
    url: string,
    option: Partial<RequestOption> = {},
  ) {
    return this.request(method, url, option)
  }
})

const $api = new RequestBus()

const adaptor: IRequestAdapter = {
  default: $api,
  get(url, options) {
    return $api.get(url, options)
  },
  post(url, options) {
    return $api.get(url, options)
  },
  put(url, options) {
    return $api.get(url, options)
  },
  delete(url, options) {
    return $api.get(url, options)
  },
  patch(url, options) {
    return $api.get(url, options)
  },
}

export const client = createClient(adaptor)(BASE_URL, {
  controllers: [...allControllers],
})
