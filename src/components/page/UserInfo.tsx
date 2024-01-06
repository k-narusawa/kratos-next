import Card from '@/src/components/ui/Card'
import DefaultHR from '@/src/components/ui/DefaultHR'
import Link from 'next/link'
import VerifiedIcon from '@mui/icons-material/Verified'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported'
import { useTranslation } from 'next-i18next'

interface UserInfoProps {
  email: string
  emailVerified: boolean
  mfaEnabled: boolean
  disabledMFA: () => void
}

const UserInfo: React.FC<UserInfoProps> = ({
  email: email,
  emailVerified: emailVerified,
  mfaEnabled: mfaEnabled,
  disabledMFA: disabledMFA,
}) => {
  const { t } = useTranslation('common')

  return (
    <>
      <Card>
        <h5 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
          {t('userinfo.account')}
        </h5>
        <div className='flex flex-col w-full'>
          <div className='flex flex-row mt-2 justify-between'>
            <p className='ml-4 mr-4'>{t('userinfo.email')}</p>
            <Link
              href='/'
              className='text-blue-600 dark:text-blue-500 no-underline hover:underline'
            >
              {t('userinfo.change')}
            </Link>
          </div>
          {emailVerified ? (
            <div className='flex flex-row mt-1 ml-4 mr-4'>
              <VerifiedIcon className='text-emerald-700' />
              <p className=' ml-1 text-emerald-700'>{t('userinfo.verified')}</p>
            </div>
          ) : (
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row mt-1 ml-4 mr-4'>
                <BrowserNotSupportedIcon className='text-red-500' />
                <p className=' ml-1 text-red-500'>{t('userinfo.unverified')}</p>
              </div>
              <Link
                href='/verification'
                className='text-blue-600 dark:text-blue-500 no-underline hover:underline'
              >
                {t('userinfo.resend')}
              </Link>
            </div>
          )}
          <div className='flex flex-row justify-between'>
            <p className='mt-2 text-lg ml-4'>{email}</p>
          </div>
        </div>
        <DefaultHR />
        <div className='flex flex-col w-full'>
          <div className='flex flex-row mt-2 justify-between'>
            <p className='ml-4 mr-4'>{t('userinfo.password')}</p>
            <Link
              href='/settings/password'
              className='text-blue-600 dark:text-blue-500 no-underline hover:underline'
            >
              {t('userinfo.change')}
            </Link>
          </div>
          <div className='flex flex-row justify-between'>
            <p className='mt-2 text-lg ml-4'>******</p>
          </div>
        </div>
        <DefaultHR />
        <div className='flex flex-col w-full'>
          <div className='flex flex-row mt-2 justify-between'>
            <p className='ml-4 mr-4'>{t('userinfo.mfa')}</p>
            {mfaEnabled ? (
              <div className='flex flex-row justify-between'>
                <a
                  onClick={disabledMFA}
                  className='cursor-pointer text-blue-600 dark:text-blue-500 no-underline hover:underline'
                >
                  {t('userinfo.deactivate')}
                </a>
              </div>
            ) : (
              <Link
                href='/settings/totp'
                className='text-blue-600 dark:text-blue-500 no-underline hover:underline'
              >
                {t('userinfo.activate')}
              </Link>
            )}
          </div>
          <div className='flex flex-row justify-between'>
            {mfaEnabled ? (
              <p className='mt-2 text-lg ml-4'>{t('userinfo.set')}</p>
            ) : (
              <p className='mt-2 text-lg ml-4'>{t('userinfo.not_set')}</p>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}

export default UserInfo
