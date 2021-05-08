import { PipeLine, PipeLineHandler } from './pipeline'

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

const BASE_URL = 'https://api.innei.ren/v1'
interface RequestOption {
  data: any
  params: Record<string, any> | URLSearchParams
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

  constructor(private baseUrl: string) {}

  public urlBuilder(relativePath: string) {
    return this.baseUrl + relativePath
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
  public dispatch(options: any) {
    const self = this
    return new Promise<Response>(
      // (r, j: (ag: Response & { message: string }) => any) => {
      async (r, j) => {
        const req = wx.request({
          ...(await this.beforeRequestPipeline.handle({ options })).options,
          // async success(res) {},
          // fail(err) {
          //   console.log(err)

          //   j(err.errMsg)
          // },
          async complete(res, ...rest) {
            // console.log(res, ...rest)

            const handled = await self.afterResponsePipeline.handle({
              request: req,
              response: res,
              options: options,
            })
            // console.log('handle', handled)
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
      },
    )
  }
}

;['GET', 'POST', 'PUT', 'DELETE'].forEach((method) => {
  RequestBus.prototype[method.toLowerCase()] = async function (
    this: RequestBus,
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
})

export const $api = new RequestBus(BASE_URL)
