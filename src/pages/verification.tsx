import { ory } from '@/pkg/sdk'
import useVerificationFlow from '@/src/hooks/useVerificationFlow'
import { VerificationFlow } from '@ory/client'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'

const VerificationPage = () => {
  const router = useRouter()
  const [flow, setFlow] = useState<VerificationFlow>()
  const { getCsrfToken } = useVerificationFlow()

  useEffect(() => {
    ory
      .createBrowserVerificationFlow()
      .then(({ data }) => {
        console.log(data)
        setFlow(data)
        ory.updateVerificationFlow({
          flow: data.id,
          updateVerificationFlowBody: {
            csrf_token: getCsrfToken(data),
            method: 'code',
            email: 'knarusawa2240+2@gmail.com',
          },
        })
      })
      .catch(({ data }) => {
        console.error(data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    console.log('handleSubmit')
    if (!flow) {
      console.log('flow not found')
      return
    }
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const code = form.get('code') || ''
    const csrf_token = getCsrfToken(flow)
    console.log('code', code)

    await ory
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: {
          code: code ? String(code) : undefined,
          csrf_token: csrf_token,
          method: 'code',
        },
      })
      .then(({ data }) => {
        console.log(data)
        if (data.return_to) {
          router.push(data.return_to)
        }
      })
      .catch(({ err }) => {
        console.error(err)
      })
  }

  return (
    <div>
      <h1>Verification Page</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' name='code' />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default VerificationPage
