import { oauth } from '@/pkg/sdk'
import Button from '@/src/components/ui/Button'
import { useHandleError } from '@/src/hooks/useHandleError'
import { OAuth2ConsentRequest } from '@ory/client'
import { AxiosError } from 'axios'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ConsentPage = ({}) => {
  const router = useRouter()
  const [consentRequest, setConsentRequest] = useState<OAuth2ConsentRequest>()
  const handleError = useHandleError()
  const { t } = useTranslation('common')

  const { consent_challenge: consentChallenge } = router.query

  useEffect(() => {
    console.log('consentChallenge', consentChallenge)
    if (!consentChallenge) {
      return
    } else {
      console.log('consentChallenge', consentChallenge)
      oauth
        .getOAuth2ConsentRequest({
          consentChallenge: consentChallenge.toString(),
        })
        .then(({ data }) => {
          console.log('getOAuth2ConsentRequest', data)
          setConsentRequest(data)
        })
        .catch((err: AxiosError) => handleError(err))
    }
  }, [consentChallenge, handleError, router])

  const handleAccept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!consentRequest) {
      return
    } else {
      await oauth
        .acceptOAuth2ConsentRequest({
          consentChallenge: consentRequest.challenge.toString(),
        })
        .then(({ data }) => {
          if (data.redirect_to) {
            router.push(data.redirect_to)
          }
        })
        .catch((err: AxiosError) => handleError(err))
    }
  }

  const handleReject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!consentRequest) {
      return
    } else {
      await oauth
        .rejectOAuth2ConsentRequest({
          consentChallenge: consentRequest.challenge.toString(),
        })
        .then(({ data }) => {
          if (data.redirect_to) {
            router.push(data.redirect_to)
          }
        })
        .catch((err: AxiosError) => handleError(err))
    }
  }

  if (!consentRequest) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>Consent</h1>
      <form onSubmit={handleAccept}>
        <Button
          type='submit'
          className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'
        >
          {t('consent.accept')}
        </Button>
      </form>
      <form onSubmit={handleReject}>
        <Button
          type='submit'
          className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'
        >
          {t('consent.reject')}
        </Button>
      </form>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale!,
      ['common']
    ))
  }
});

export default ConsentPage
