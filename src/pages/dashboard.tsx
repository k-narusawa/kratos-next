import ory from '../../pkg/sdk'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { LogoutLink } from '@/src/components/ui/LogoutLink'
import { Session } from '@ory/client'
import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import DefaultHR from '@/src/components/ui/DefaultHR'

const DashboardPage = () => {
  const [session, setSession] = useState<Session | undefined>(undefined)

  const onLogout = LogoutLink()
  const router = useRouter()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
            return router.push('/error')
          case 422:
            return router.push('/login?aal=aal2')
          case 401:
            return router.push('/login')
        }
        // Something else happened!
        return Promise.reject(err)
      })
  }, [router])

  if (session) {
    return (
      <div className='md:flex md:flex-col items-center justify-center min-h-screen py-2'>
        <Card>
          <h5 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
            アカウント
          </h5>
          <div className='flex flex-col md:flex-row items-center md:justify-between w-full'>
            <p className='mt-2 text-lg ml-4'>Email: {session.identity?.traits.email}</p>
            <div className='mt-4 md:mt-0 md:ml-auto'>
              <Button className='ml-2' onClick={() => router.push("/")}>
                変更
              </Button>
            </div>
          </div>
          <DefaultHR />
          <div className='flex flex-col md:flex-row items-center md:justify-between w-full'>
            <p className='mt-2 text-lg ml-4'>Password: ******</p>
            <div className='mt-4 md:mt-0 md:ml-auto'>
              <Button className='ml-2' onClick={() => router.push("/")}>
                変更
              </Button>
            </div>
          </div>
          <DefaultHR />
          <div className='flex flex-col md:flex-row items-center md:justify-between w-full'>
            <p className='mt-2 text-lg ml-4'>MFA: None</p>
            <div className='mt-4 md:mt-0 md:ml-auto'>
              <Button className='ml-2' onClick={() => router.push("/settings/totp")}>
                変更
              </Button>
            </div>
          </div>
        </Card>
        <div className='mt-4'>
          <Button onClick={onLogout} variant='secondary'>ログアウト</Button>
        </div>
    </div>
    )
  }

  return null // FIXME: ここどうするか考えなきゃいけない
}

export default DashboardPage
