import { LogoutLink } from '@/src/components/ui/LogoutLink'
import Button from '@/src/components/ui/Button'
import useSession from '@/src/hooks/useSession'
import Spinner from '@/src/components/ui/Spinner'
import AccountDetail from '@/src/components/page/AccountDetail'
import { ory } from '@/pkg/sdk'
import { useEffect, useState } from 'react'
import { SettingsFlow } from '@ory/client'
import { AxiosError, AxiosResponse } from 'axios'
import { useHandleError } from '@/src/hooks/useHandleError'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import useSettingsFlow from '@/src/hooks/useSettingsFlow'
import { useRouter } from 'next/router'

const DashboardPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()
  const { session, isLoading, error } = useSession()
  const { getUser, getCsrfToken , enabledMfa} = useSettingsFlow()
  const [user, setUser] = useState<User>()
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false)
  const handleError = useHandleError()
  const router = useRouter()
  const { t } = useTranslation('common')

  const onLogout = LogoutLink()

  useEffect(() => {
    ory
      .createBrowserSettingsFlow()
      .then(({ data }) => {
        setFlow(data)
        setUser(getUser(data))
        setMfaEnabled(enabledMfa(data))
      })
      .catch((err: AxiosError) => handleError(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const disabledMFA = async () => {
    if (!flow) return

    const csrf_token = getCsrfToken(flow)

    await ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          csrf_token: csrf_token,
          method: 'totp',
          totp_unlink: true,
        },
      })
      .catch((err: AxiosError) => handleError(err))
    await router.reload()
  }

  if (isLoading) return <Spinner />

  if (error)
    return (
      <div>
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )

  if (session && user) {
    return (
      <div className='flex flex-col items-center md:justify-center min-h-screen py-2'>
        <AccountDetail
          email={user.email}
          emailVerified={user.emailVerified}
          mfaEnabled={ mfaEnabled }
          disabledMFA={ disabledMFA }
        />
        <div className='mt-4'>
          <Button onClick={onLogout} variant='secondary'>
            {t('logout')}
          </Button>
        </div>
      </div>
    )
  }

  return null // FIXME: ここどうするか考えなきゃいけない
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common'])),
  },
})

export default DashboardPage
