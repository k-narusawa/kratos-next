import { SettingsFlow } from '@ory/client'
import { FormEventHandler, useEffect, useState } from 'react'
import { ory } from '../../../pkg/sdk'
import Error from 'next/error'
import { useRouter } from 'next/router'
import useLoginFlow from '@/src/hooks/useLoginFlow'
import { AxiosError } from 'axios'
import { useHandleError } from '@/src/hooks/useHandleError'
import PasswordSettingForm from '@/src/components/page/PasswordSettingForm'
import useSession from '@/src/hooks/useSession'

const PasswordSettingPage = () => {
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [flow, setFlow] = useState<SettingsFlow>()
  const { getCsrfToken } = useLoginFlow()
  const handleError = useHandleError()
  const { session } = useSession()

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    if (flowId) {
      router.push('/login')
    }

    ory
      .createBrowserSettingsFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err: AxiosError) => handleError(err))
  }, [flowId, router, router.isReady, returnTo, flow, handleError])

  const handleChangePassword: FormEventHandler<HTMLFormElement> = async (event) => {
    if (!flow) {
      router.push('/login')
      return
    }
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const password = form.get('password') || ''

    const csrf_token = getCsrfToken(flow)

    await ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          csrf_token: csrf_token,
          method: 'password',
          password: password.toString(),
        },
      })
      .then(async ({ data }) => {
        await ory
          .disableMySession({
            id: session!.id,
          })
          .catch((err: AxiosError) => handleError(err))
        await router.push('/login')
        // await ory // FIXME: ここでエラーが出る
        //   .disableMyOtherSessions()
        //   .catch((err: AxiosError) => handleError(err))
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
      <PasswordSettingForm handleChangePassword={handleChangePassword} />
    </div>
  )
}

export default PasswordSettingPage
