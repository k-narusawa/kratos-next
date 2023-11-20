import { LoginFlow } from '@ory/client'
import { FormEventHandler, useEffect, useState } from 'react'
import ory from '../../pkg/sdk'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import Card from '@/src/components/Card'
import LoginForm from '@/src/components/page/LoginForm'

const LoginPage = () => {
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [flow, setFlow] = useState<LoginFlow>()

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    ory
      .toSession()
      .then(({ data }) => {
        console.log(data)
        router.push('/dashboard')
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return
          default:
            console.error(err)
            break
        }
      })

    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          data.active
          setFlow(data)
        })
        .catch(({ err }) => {
          console.error(err)
        })
    } else {
      ory
        .createBrowserLoginFlow({
          returnTo: returnTo ? String(returnTo) : undefined,
        })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(({ err }) => {
          console.error(err)
        })
    }
  }, [flowId, router, router.isReady, returnTo, flow])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!flow) {
      return <div>Flow not found</div>
    }

    const form = new FormData(event.currentTarget)
    const identifier = form.get('identifier') || ''
    const password = form.get('password') || ''

    const csrf_token =
      flow.ui.nodes.find(
        (node) =>
          node.group === 'default' &&
          'name' in node.attributes &&
          node.attributes.name === 'csrf_token',
      )?.attributes.value || ''

    await ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          csrf_token: csrf_token,
          method: 'password',
          identifier: identifier.toString(),
          password: password.toString(),
        },
      })
      .then(async ({ data }) => {
        console.log(data)

        // アクションによってはここで色々やる
        await router.push(flow.return_to || '/dashboard')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  if (!flow) {
    return <Error statusCode={500}></Error>
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900'>
      <Card>
        <LoginForm handleSubmit={handleSubmit} />
      </Card>
    </div>
  )
}

export default LoginPage
