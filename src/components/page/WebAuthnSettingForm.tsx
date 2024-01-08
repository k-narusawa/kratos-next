import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import { LoginFlow, SettingsFlow, UiNodeInputAttributes, UiNodeScriptAttributes, UiText } from '@ory/client'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { HTMLAttributeReferrerPolicy, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface webauthn_script{
  src: string
  async: boolean
  referrerpolicy: HTMLAttributeReferrerPolicy
  crossorigin: string
  integrity: string
  type: string
  id: string
  nonce: string
}

interface WebAuthnSettingFormProps {
  flow: SettingsFlow,
}

const WebAuthnSettingForm: React.FC<WebAuthnSettingFormProps> = ({
  flow: flow,
}) => {
  const { t } = useTranslation('common')
  const router = useRouter() 
  const [registerTrigger, setRegisterTrigger] = useState<string | undefined>(undefined)
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined)
  const [webauthnScript, setWebAuthnScript] = useState<webauthn_script | undefined>(undefined)

  useEffect(() => {
    const nodes = flow.ui.nodes
    nodes.forEach((node) => {
      if(node.attributes.node_type === 'input'){
        const attributes = node.attributes as UiNodeInputAttributes
        if(attributes.name === 'webauthn_register_trigger'){
          setRegisterTrigger(attributes.onclick)
        }else if(attributes.name === 'csrf_token'){
          setCsrfToken(attributes.value)
        }
      }

      if(node.attributes.node_type === 'script'){
        const attributes = node.attributes as UiNodeScriptAttributes
        if(attributes.id === 'webauthn_script'){
          setWebAuthnScript({
            src: attributes.src,
            async: attributes.async ?? true,
            referrerpolicy: attributes.referrerpolicy as HTMLAttributeReferrerPolicy,
            crossorigin: attributes.crossorigin,
            integrity: attributes.integrity,
            type: attributes.type,
            id: attributes.id,
            nonce: attributes.nonce
          })
        }
      }
    })
  }, [flow])

  if(!webauthnScript || !registerTrigger || !csrfToken){
    return <div>e...</div>
  }
    

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <Card>
          <form action={flow.ui.action} method={flow.ui.method}>
            <h5 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
              WebAuthn
            </h5>
            <div className='flex flex-col items-center justify-center w-full'>
              <input name='csrf_token' value={csrfToken} type='hidden' />
              <input name='webauthn_register' value='' type='hidden' />
              <input name='webauthn_register_displayname' />
              <Button 
                name='webauthn_register_trigger' 
                type='button'
                onClick={async() => {
                  const run = new Function(registerTrigger)
                  await run()
                }}>
                {t('settings.webauthn.register')}
              </Button>
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

export default WebAuthnSettingForm
