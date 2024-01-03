import { oauth } from '@/pkg/sdk'
import ConsentForm from '@/src/components/page/ConsentForm'
import Button from '@/src/components/ui/Button'
import Spinner from '@/src/components/ui/Spinner'
import { useHandleError } from '@/src/hooks/useHandleError'
import { OAuth2ConsentRequest } from '@ory/client'
import { AxiosError } from 'axios'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ConsentPage = ({}) => {
  const router = useRouter()
  const [consentRequest, setConsentRequest] = useState<OAuth2ConsentRequest>()
  const handleError = useHandleError()  

  const { consent_challenge: consentChallenge } = router.query

  useEffect(() => {
    if (!consentChallenge) {
      return
    } else {
      oauth
        .getOAuth2ConsentRequest({
          consentChallenge: consentChallenge.toString(),
        })
        .then(({ data }) => {
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
          acceptOAuth2ConsentRequest: {
            grant_scope: consentRequest.requested_scope,
            grant_access_token_audience: consentRequest.requested_access_token_audience,
          }
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
      <div className='flex items-center justify-center h-screen'>
        <Spinner />
        <h2 className='ml-4'>Flow not found</h2>
      </div>
    )
  }

  return (
    <>
        <div className='flex items-center justify-center h-screen'>
          <ConsentForm handleAccept={handleAccept} consentRequest={consentRequest}/>
        </div>
      </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common'])),
  },
})

export default ConsentPage
