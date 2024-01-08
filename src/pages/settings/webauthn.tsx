import { ory } from '../../../pkg/sdk'
import {
  FormEventHandler,
  HTMLAttributeReferrerPolicy,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  SettingsFlow,
  UiNodeAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
} from '@ory/client'
import useLoginFlow from '@/src/hooks/useLoginFlow'
import SettingsComplete from '@/src/components/page/SettingsComplete'
import WebAuthnSettingForm from '@/src/components/page/WebAuthnSettingForm'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'

interface webauthn_script {
  src: string
  async: string
  referrerpolicy: string
  crossorigin: string
  integrity: string
  type: string
  id: string
  nonce: string
}

const SettingsWebAuthnPage = () => {
  const router = useRouter()
  const [flow, setFlow] = useState<SettingsFlow>()

  useEffect(() => {
    ory
      .createBrowserSettingsFlow()
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(({ err }) => {
        console.log(err)
      })
  }, [router])

  if (!flow) {
    return <div>Flow not found</div>
  }

  if (flow?.state === 'success') {
    ;<div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <SettingsComplete />
    </div>
  }

  if (flow) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <WebAuthnSettingForm flow={flow} />
      </div>
    )
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common'])),
  },
})

export default SettingsWebAuthnPage
