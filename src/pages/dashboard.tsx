import { useRouter } from 'next/navigation'
import { LogoutLink } from '@/src/components/ui/LogoutLink'
import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import DefaultHR from '@/src/components/ui/DefaultHR'
import useSession from '@/src/hooks/useSession'

const DashboardPage = () => {
  const { session, isLoading, error } = useSession()

  const onLogout = LogoutLink()
  const router = useRouter()

  if (isLoading) return <div>loading...</div>

  if (error)
    return (
      <div>
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )

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
              <Button className='ml-2' onClick={() => router.push('/')}>
                変更
              </Button>
            </div>
          </div>
          <DefaultHR />
          <div className='flex flex-col md:flex-row items-center md:justify-between w-full'>
            <p className='mt-2 text-lg ml-4'>Password: ******</p>
            <div className='mt-4 md:mt-0 md:ml-auto'>
              <Button className='ml-2' onClick={() => router.push('/')}>
                変更
              </Button>
            </div>
          </div>
          <DefaultHR />
          <div className='flex flex-col md:flex-row items-center md:justify-between w-full'>
            <p className='mt-2 text-lg ml-4'>MFA: None</p>
            <div className='mt-4 md:mt-0 md:ml-auto'>
              <Button className='ml-2' onClick={() => router.push('/settings/totp')}>
                変更
              </Button>
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
