import { useEffect, useState } from 'react'
import { client } from '../utils/api'

export function useApi<T = any>(path: string): [boolean, T]
export function useApi<T extends (...args: any) => Promise<any>>(
  caller: T,
  ...args: (string | number)[]
): [boolean, Awaited<ReturnType<T>>]

export function useApi(params: Function | string, ...args: any[]) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>({})

  useEffect(() => {
    setLoading(true)

    if (typeof params === 'string') {
      const url = params
      const caller = url.split('/').reduce((caller, path) => {
        return caller[path]
      }, client.proxy)

      // @ts-ignore
      caller[method.toLowerCase()]().then((data) => {
        setData(data)
        setLoading(false)
      })
    } else {
      const caller = params

      caller.call(this, ...args).then((data) => {
        setData(data)
        setLoading(false)
      })
    }
  }, [params, args.join('-')])

  return [loading, data] as const
}
