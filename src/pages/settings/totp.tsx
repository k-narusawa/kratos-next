import { ory } from '../../../pkg/sdk'
import { FormEventHandler, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SettingsFlow } from '@ory/client'
import useLoginFlow from '@/src/hooks/useLoginFlow'
import useSession from '@/src/hooks/useSession'
import Card from '@/src/components/ui/Card'
import Button from '@/src/components/ui/Button'
import TextInput from '@/src/components/ui/TextInput'
import Image from 'next/image'
import SettingsComplete from '@/src/components/page/SettingsComplete'
import Error from '@/src/components/page/Error'

interface qr_details {
  enabled: boolean
  totp_qr: string
}

interface qr_attributes {
  id: string
  src: string
}

const TotpPage = () => {
  const router = useRouter()
  const [flow, setFlow] = useState<SettingsFlow>()
  const { getCsrfToken } = useLoginFlow()

  const [qr_details, setQrDetails] = useState<qr_details | undefined>(undefined)

  useEffect(() => {
    ory
      .createBrowserSettingsFlow()
      .then(({ data }) => {
        setFlow(data)
        data.ui.nodes
          .filter((node) => node.group === 'totp')
          .forEach((node) => {
            const attributes = node.attributes as qr_attributes | undefined
            if (!attributes) {
              return (
                <div className='flex flex-col items-center justify-center min-h-screen py-2'>
                  <Error errorMessage='' />
                </div>
              )
            } else {
              if (attributes.id === 'totp_qr') {
                setQrDetails({
                  enabled: false,
                  totp_qr: attributes.src,
                })
              }
            }
          })
      })
      .catch(({ err }) => {
        console.log(err)
      })
  }, [router])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!flow) {
      return <div>Flow not found</div>
    }

    const form = new FormData(event.currentTarget)
    const totpCode = form.get('totp_code') || ''
    const csrf_token = getCsrfToken(flow)

    await ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          csrf_token: csrf_token,
          method: 'totp',
          totp_code: totpCode.toString(),
        },
      })
      .then(({ data }) => {
        console.log(data)
        setFlow(data)
      })
      .catch(({ err }) => {
        console.log(err)
      })
  }

  if (flow?.state === 'success') {
    ;<div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <SettingsComplete />
    </div>
  }

  if (qr_details) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <Card>
          <form onSubmit={handleSubmit}>
            <h5 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
              多要素認証
            </h5>
            <div className='flex flex-col items-center justify-center w-full'>
              <Image
                src={qr_details.totp_qr}
                width={200}
                height={200}
                alt='QR'
                className='mx-auto mb-10'
              />
              <TextInput
                id='totp_code'
                type='text'
                name='totp_code'
                label='認証コード'
                placeholder='認証コード'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
              />
              <div className='flex flex-col items-center'>
                <Button type='submit' className='mb-10 mt-5 justify-center'>
                  設定
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    )
  }
}

export default TotpPage
