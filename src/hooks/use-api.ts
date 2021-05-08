import { useEffect, useState } from 'react'
import { $api, RequestMethodType, RequestOption } from '../utils/api'

export const useApi = (
  url: string,
  method: RequestMethodType = 'GET',
  options?: Partial<RequestOption>,
) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>({})
  useEffect(() => {
    setLoading(true)
    $api.request(method, url, options).then(({ data }) => {
      setData(data)
      setLoading(false)
    })
  }, [url])

  return [loading, data] as const
}
