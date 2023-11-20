import ory from '../../pkg/sdk'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { LogoutLink } from '@/src/components/LogoutLink'
import { Session } from '@ory/client'
import Button from '@/src/components/Button'
import Card from '@/src/components/Card'

const DashboardPage = () => {
  const [session, setSession] = useState<Session | undefined>(undefined)
  const [hasSession, setHasSession] = useState<boolean>(false)

  const onLogout = LogoutLink()
  const router = useRouter()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(data)
        setHasSession(true)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return router.push('/login?aal=aal2')
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, [router])

  if (session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <Card>
          <h5 className='
            text-2xl font-semibold text-center 
          text-gray-900 dark:text-white'>
            アカウント
          </h5>
          <div className='items-center flex flex-row'>
            <p className='mt-2 text-lg ml-4'>{session.identity?.traits.email}</p>
            <Button className='ml-10' onClick={() => router.push("/")}>
              変更
            </Button>
          </div>
          <div className='mt-4'>
            <Button className='ml-2' onClick={() => router.push("/")}>
              パスワード変更
            </Button>
          </div>
        </Card>
        <div className='mt-4'>
          <Button onClick={onLogout} variant='secondary'>ログアウト</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Link href='/login' passHref>
        ログイン
      </Link>
      <br />
      <Link href='/registration' passHref>
        登録
      </Link>
    </>
  )
}

export default DashboardPage
