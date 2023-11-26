import { useRouter } from 'next/navigation'
import { LogoutLink } from '@/src/components/ui/LogoutLink'
import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import DefaultHR from '@/src/components/ui/DefaultHR'
import useSession from '@/src/hooks/useSession'
import Link from 'next/link'
import Spinner from '@/src/components/ui/Spinner'

const DashboardPage = () => {
  const { session, isLoading, error } = useSession()

  const onLogout = LogoutLink()

  if (isLoading) return <Spinner />

  if (error)
    return (
      <div>
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )

  if (session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <Card>
          <h5 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
            アカウント
          </h5>
          <div className='flex flex-col w-full'>
            <div className='flex flex-row mt-2 justify-between'>
              <p className='ml-4 mr-4'>メールアドレス</p>
              <Link
                href='/'
                className='text-blue-600 dark:text-blue-500 no-underline hover:underline'
              >
                変更する
              </Link>
            </div>
            <div className='flex flex-row justify-between'>
              <p className='mt-2 text-lg ml-4'>{session.identity?.traits.email}</p>
            </div>
          </div>
          <DefaultHR />
          <div className='flex flex-col w-full'>
            <div className='flex flex-row mt-2 justify-between'>
              <p className='ml-4 mr-4'>パスワード</p>
              <Link
                href='/'
                className='text-blue-600 dark:text-blue-500 no-underline hover:underline'
              >
                変更する
              </Link>
            </div>
            <div className='flex flex-row justify-between'>
              <p className='mt-2 text-lg ml-4'>******</p>
            </div>
          </div>
          <DefaultHR />
          <div className='flex flex-col w-full'>
            <div className='flex flex-row mt-2 justify-between'>
              <p className='ml-4 mr-4'>多要素認証</p>
              <Link
                href='/settings/totp'
                className='text-blue-600 dark:text-blue-500 no-underline hover:underline'
              >
                変更する
              </Link>
            </div>
            <div className='flex flex-row justify-between'>
              <p className='mt-2 text-lg ml-4'>未設定</p>
            </div>
          </div>
        </Card>
        <div className='mt-4'>
          <Button onClick={onLogout} variant='secondary'>
            ログアウト
          </Button>
        </div>
      </div>
    )
  }

  return null // FIXME: ここどうするか考えなきゃいけない
}

export default DashboardPage
