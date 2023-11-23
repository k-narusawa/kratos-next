import { useEffect, useState } from 'react'
import { ory } from '../../pkg/sdk'
import { Session } from '@ory/client'
import { AxiosError } from 'axios'
import { HttpError } from '@/src/types/error'

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<HttpError | null>(null)

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setIsLoading(false)
        setSession(data)
      })
      .catch((err: AxiosError) => {
        setIsLoading(false)
        switch (err.response?.status) {
          case 401:
            setSession(null)
            break
          default:
            setError(err.response ? new HttpError(err.response) : null)
            break
        }
        console.error(err)
      })
  }, [])

  return { session, isLoading, error }
}

export default useSession
