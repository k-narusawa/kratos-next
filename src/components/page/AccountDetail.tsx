import Card from '@/src/components/ui/Card'
import DefaultHR from '@/src/components/ui/DefaultHR'
import Link from 'next/link'

interface AccountDetailProps {
  email: string
  emailVerified: boolean
  mfaEnabled: boolean
}

const AccountDetail: React.FC<AccountDetailProps> = ({
  email: email,
  emailVerified: emailVerified,
  mfaEnabled: mfaEnabled,
}) => {
  return (
    <>
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
            <p className='mt-2 text-lg ml-4'>{email}</p>
          </div>
        </div>
        <DefaultHR />
        <div className='flex flex-col w-full'>
          <div className='flex flex-row mt-2 justify-between'>
            <p className='ml-4 mr-4'>パスワード</p>
            <Link
              href='/settings/password'
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
    </>
  )
}

export default AccountDetail
