import { RegistrationFlow } from '@ory/client'
import { FormEventHandler, useEffect, useState } from 'react'
import { ory } from '../../pkg/sdk'
import Error from 'next/error'
import { useRouter } from 'next/router'
import TextInput from '@/src/components/ui/TextInput'
import Button from '@/src/components/ui/Button'
import useFlow from '@/src/hooks/useFlow'
import RegistrationForm from '@/src/components/page/RegitrationForm'
import Card from '@/src/components/ui/Card'

const RegisterPage = () => {
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [flow, setFlow] = useState<RegistrationFlow>()
  const { getCsrfToken } = useFlow()

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

    console.log(flow)

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
        console.log('This is the user session: ', data, data.identity)

        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case 'show_verification_ui':
                await router.push('/verification?flow=' + item.flow.id)
                return
            }
          }
        }
        // If continue_with did not contain anything, we can just return to the home page.
        await router.push(flow?.return_to || '/')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (!flow) {
    return <Error statusCode={500}></Error>
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900'>
      <Card>
        <RegistrationForm handleRegistration={handleRegistration} />
      </Card>
    </div>
  )
}

export default RegisterPage
