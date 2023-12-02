import { LoginFlow, UiText } from '@ory/client'
import { FormEventHandler, useEffect, useState } from 'react'
import { ory } from '../../pkg/sdk'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import LoginForm from '@/src/components/page/LoginForm'
import { useHandleError } from '@/src/hooks/useHandleError'
import useFlow from '@/src/hooks/useFlow'
import Spinner from '@/src/components/ui/Spinner'
import TotpForm from '@/src/components/page/TotpForm'
import { GetStaticProps } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const LoginPage = () => {
  const router = useRouter()
  const {
    flow: flowId,
    return_to: returnTo,
    refresh: refresh,
    aal: aal,
    login_challenge: loginChallenge,
  } = router.query

  const [flow, setFlow] = useState<LoginFlow>()
  const [errorMessages, setErrorMessages] = useState<UiText[]>([])
  const handleError = useHandleError()
  const { getCsrfToken, getLoginMethod, getMessages } = useFlow()

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    if (flowId) {
      ory
        .getLoginFlow({
          id: String(flowId),
        })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(({ err }) => {
          console.error(err)
        })
    } else {
      ory
        .createBrowserLoginFlow({
          returnTo: returnTo ? String(returnTo) : undefined,
          refresh: refresh ? Boolean(refresh) : undefined,
          aal: aal ? String(aal) : undefined,
          loginChallenge: loginChallenge ? String(loginChallenge) : undefined,
        })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(({ data }) => {
          console.error(data)
        })
    }
  }, [flowId, router, router.isReady, returnTo, flow, refresh, aal, loginChallenge])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!flow) {
      return <div>Flow not found</div>
    }

    const form = new FormData(event.currentTarget)
    const identifier = form.get('identifier') || ''
    const password = form.get('password') || ''

    const csrf_token = getCsrfToken(flow)

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
        if ('redirect_to' in data) {
          window.location.href = data.redirect_to as string
          return
        }
        if (flow?.return_to) {
          window.location.href = flow.return_to
          return
        }

        await router.push(flow.return_to || '/dashboard')
      })
      .catch((err: AxiosError) => {
        console.log(err)
        try{
          const messages = getMessages(err.response!.data as LoginFlow)
          setErrorMessages(messages!)
        } catch (e) {
          throw e
        }
      })
      .catch((err: AxiosError) => handleError(err))
  }

  const handleTotpSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!flow) {
      return <div>Flow not found</div>
    }

    const form = new FormData(event.currentTarget)
    const totpCode = form.get('totp_code') || ''

    const csrf_token = getCsrfToken(flow)

    await ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          csrf_token: csrf_token,
          method: 'totp',
          totp_code: totpCode.toString(),
        },
      })
      .then(async ({ data }) => {
        if ('redirect_to' in data) {
          window.location.href = data.redirect_to as string
          return
        }
        if (flow?.return_to) {
          window.location.href = flow.return_to
          return
        }

        await router.push(flow.return_to || '/dashboard')
      })
      .catch((err: AxiosError) => handleError(err))
  }

  if (!flow) {
    return <Spinner />
  }

  if(getLoginMethod(flow) === 'password') {
    return (
      <>
        <div className='flex items-center justify-center h-screen'>
          <LoginForm handleLogin={handleSubmit} errorMessages={errorMessages}/>
        </div>
      </>
    )
  }

  if(getLoginMethod(flow) === 'totp') {
    return (
      <>
        <div className='flex items-center justify-center h-screen'>
          <TotpForm handleLogin={handleTotpSubmit} errorMessages={errorMessages} />
        </div>
      </>
    )
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale!,
      ['common']
    ))
  }
});

export default LoginPage
