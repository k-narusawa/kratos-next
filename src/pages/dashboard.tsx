import { LogoutLink } from '@/src/components/ui/LogoutLink'
import Button from '@/src/components/ui/Button'
import useSession from '@/src/hooks/useSession'
import Spinner from '@/src/components/ui/Spinner'
import AccountDetail from '@/src/components/page/AccountDetail'
import { ory } from '@/pkg/sdk'
import { useState } from 'react'
import { RegistrationFlow } from '@ory/client'
import { AxiosError } from 'axios'
import { useHandleError } from '@/src/hooks/useHandleError'
import useFlow from '@/src/hooks/useFlow'
import { GetStaticProps } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'

const DashboardPage = () => {
  const { session, isLoading, error } = useSession()
  const [flow, setFlow] = useState<RegistrationFlow>()
  const handleError = useHandleError()
  const { getCsrfToken } = useFlow()
  const { t } = useTranslation('common')

  const onLogout = LogoutLink()

  const resendVerificationEmail = () => {
    ory
      .createBrowserRegistrationFlow()
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err: AxiosError) => handleError(err))

    ory
      .updateRegistrationFlow({
        flow: flow!.id,
        updateRegistrationFlowBody: {
          method: 'code',
          csrf_token: getCsrfToken(flow!),
          resend: "true",
          traits: {
            email: session!.identity!.traits.email,
          },
        },
      })
  }

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
      <div className='flex flex-col items-center md:justify-center min-h-screen py-2'>
        <AccountDetail
          email={session.identity.traits.email}
          emailVerified={false}
          mfaEnabled={false}
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
    ...(await serverSideTranslations(
      locale!,
      ['common']
    ))
  }
});

export default DashboardPage
