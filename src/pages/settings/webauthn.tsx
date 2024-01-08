import { ory } from '../../../pkg/sdk'
import { FormEventHandler, HTMLAttributeReferrerPolicy, MouseEventHandler, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SettingsFlow, UiNodeAttributes, UiNodeInputAttributes, UiNodeScriptAttributes } from '@ory/client'
import useLoginFlow from '@/src/hooks/useLoginFlow'
import Card from '@/src/components/ui/Card'
import SettingsComplete from '@/src/components/page/SettingsComplete'
import Script from 'next/script'

interface webauthn_script{
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
  const { getCsrfToken } = useLoginFlow()
  const [registerTrigger, setRegisterTrigger] = useState<string | undefined>(undefined)
  const [webauthnScript, setWebAuthnScript] = useState<webauthn_script | undefined>(undefined)

  useEffect(() => {
    ory
      .createBrowserSettingsFlow()
      .then(({ data }) => {
        setFlow(data)
        const webAuthnNode = data.ui.nodes
          .filter((node) => node.group === 'webauthn')
        webAuthnNode.forEach((node) => {
          if(node.attributes.node_type === 'input'){
            const attributes = node.attributes as UiNodeInputAttributes
            if(attributes.name === 'webauthn_register_trigger'){
              setRegisterTrigger(attributes.onclick)
            }
          }

          if(node.attributes.node_type === 'script'){
            const attributes = node.attributes as UiNodeScriptAttributes
            if(attributes.id === 'webauthn_script'){
              setWebAuthnScript({
                src: attributes.src,
                async: attributes.async as boolean ? 'true' : 'false',
                referrerpolicy: attributes.referrerpolicy,
                crossorigin: attributes.crossorigin,
                integrity: attributes.integrity,
                type: attributes.type,
                id: attributes.id,
                nonce: attributes.nonce
              })
            }
          }
        })
      })
      .catch(({ err }) => {
        console.log(err)
      })
  }, [router])

    if (!flow) {
      return <div>Flow not found</div>
    }

  if (flow?.state === 'success') {
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <SettingsComplete />
    </div>
  }

  if (webauthnScript && registerTrigger && flow) {
    return (
      <>
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
          <Card>
            <form action={flow.ui.action} method={flow.ui.method}>
              <h5 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
                WebAuthn
              </h5>
              <div className='flex flex-col items-center justify-center w-full'>
                <input name='csrf_token' value={getCsrfToken(flow)} type='hidden' />
                <input name='webauthn_register' value='' type='hidden' />
                <input name='webauthn_register_displayname' />
                <input name='webauthn_register_trigger' 
                  type='button'
                  value='保存'
                  onClick={async() => {
                    const run = new Function(registerTrigger)
                    await run()
                  }} />
              </div>
            </form>
          </Card>
        </div>
        <Script
          src={webauthnScript.src} 
          async={true}
          referrerPolicy={webauthnScript.referrerpolicy as HTMLAttributeReferrerPolicy}  
          crossOrigin='anonymous'
          integrity={webauthnScript.integrity}
          type='text/javascript'
          id={webauthnScript.id}
          nonce={webauthnScript.nonce}
        />
      </>
    )
  }
}

export default SettingsWebAuthnPage