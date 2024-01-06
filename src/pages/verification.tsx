import { ory } from '@/pkg/sdk'
import Error from '@/src/components/page/Error'
import ResendVerificationEmailForm from '@/src/components/page/ResendVerificationEmailForm'
import VerificationComplete from '@/src/components/page/VerificationComplete'
import VerificationEmailForm from '@/src/components/page/VerificationEmailForm'
import useVerificationFlow from '@/src/hooks/useVerificationFlow'
import { VerificationFlow } from '@ory/client'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'

const VerificationPage = () => {
  const router = useRouter()
  const [flow, setFlow] = useState<VerificationFlow>()
  const { getCsrfToken } = useVerificationFlow()
  const { flow: flowId } = router.query

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    if (flowId) {
      ory
        .getVerificationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(({ err }) => {
          router.push('/login')
        })
      return
    }

    ory
      .createBrowserVerificationFlow({
        returnTo: '/verification',
      })
      .then(({ data }) => {
        console.log(data)
        setFlow(data)
      })
      .catch(({ err }) => {
        console.error(err)
        router.push('/login')
      })
  }, [flow, flowId, router, router.isReady])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    console.log('handleSubmit')
    if (!flow) {
      console.log('flow not found')
      return
    }
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const code = form.get('code') || undefined
    const email = form.get('email') || undefined
    const csrf_token = getCsrfToken(flow)
    console.log('code', code)

    await ory
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: {
          email: email ? email.toString() : undefined,
          code: code ? code.toString() : undefined,
          csrf_token: csrf_token,
          method: 'code',
        },
      })
      .then(({ data }) => {
        setFlow(data)
        if (data.return_to) {
          router.push(data.return_to)
        }
      })
      .catch(({ err }) => {
        console.error(err)
      })
  }

  if (flow?.state === 'choose_method') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <ResendVerificationEmailForm handleSubmit={handleSubmit} />
      </div>
    )
  }

  if (flow?.state === 'sent_email') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <VerificationEmailForm handleSubmit={handleSubmit} />
      </div>
    )
  }

  if (flow?.state === 'passed_challenge') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <VerificationComplete />
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <Error errorMessage='' />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common'])),
  },
})

export default VerificationPage
