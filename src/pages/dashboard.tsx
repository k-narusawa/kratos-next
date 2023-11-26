import { LogoutLink } from '@/src/components/ui/LogoutLink'
import Button from '@/src/components/ui/Button'
import useSession from '@/src/hooks/useSession'
import Spinner from '@/src/components/ui/Spinner'
import AccountDetail from '@/src/components/page/AccountDetail'

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
        <AccountDetail
          email={session.identity.traits.email}
          emailVerified={false}
          mfaEnabled={false}
        />
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
