import { useEffect, useState } from 'react'
import { ory } from '../../pkg/sdk'
import { Session } from '@ory/client'
import { AxiosError } from 'axios'
import { HttpError } from '@/src/types/error'
import { useHandleError } from '@/src/hooks/useHandleError'
import { useRouter } from 'next/router'

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<HttpError | null>(null)
  const handleError = useHandleError()
  const router = useRouter()

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
            router.push('/login')
            break
          default:
            setSession(null)
            setError(err.response ? new HttpError(err.response) : null)
            handleError(err)
            break
        }
        console.error(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleError])

  const getUser = (): User => {
    return {
      email: session?.identity?.traits.email,
      emailVerified:
        session?.identity?.verifiable_addresses?.some(({ verified }) => verified) ??
        false,
    }
  }

  return { session, isLoading, error }
}

export default useSession
