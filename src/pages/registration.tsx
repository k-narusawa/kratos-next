import { RegistrationFlow } from '@ory/client'
import { FormEventHandler, useEffect, useState } from 'react'
import { ory } from '../../pkg/sdk'
import Error from 'next/error'
import { useRouter } from 'next/router'
import useLoginFlow from '@/src/hooks/useLoginFlow'
import RegistrationForm from '@/src/components/page/RegitrationForm'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'

const RegisterPage = () => {
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [flow, setFlow] = useState<RegistrationFlow>()
  const { getCsrfToken } = useLoginFlow()

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    console.log(flowId)
    if (flowId) {
      console.log(flowId)
      ory
        .getRegistrationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(({ err }) => {
          console.log(err)
        })
    }

    ory
      .createBrowserRegistrationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(({ err }) => {
        console.log(err)
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const handleRegistration: FormEventHandler<HTMLFormElement> = async (event) => {
    if (!flow) {
      return <div>Flow not found</div>
    }
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const email = form.get('traits.email') || ''
    const password = form.get('password') || ''

    const csrf_token = getCsrfToken(flow)

    await ory
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: {
          csrf_token: csrf_token,
          traits: {
            email: email,
          },
          method: 'password',
          password: password.toString(),
        },
      })
      .then(async ({ data }) => {
        if (data.continue_with) {
          for (const item of data.continue_with) {
            console.log(item)
            switch (item.action) {
              case 'show_verification_ui':
                console.log('show_verification_ui')
                router.push('/verification?flow=' + item.flow.id)
                break
              default:
                break
            }
          }
        }
        // If continue_with did not contain anything, we can just return to the home page.
        router.push(flow?.return_to || '/')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (!flow) {
    return <Error statusCode={500}></Error>
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <RegistrationForm handleRegistration={handleRegistration} />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common'])),
  },
})

export default RegisterPage
