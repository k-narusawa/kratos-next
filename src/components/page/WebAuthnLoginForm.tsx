import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import { LoginFlow, UiNodeInputAttributes, UiNodeScriptAttributes, UiText } from '@ory/client'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { FormEventHandler, HTMLAttributeReferrerPolicy, useEffect, useState } from 'react'
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

interface WebAuthnLoginFormProps {
  flow: LoginFlow,
  errorMessages: UiText[]
}

const WebAuthnLoginForm: React.FC<WebAuthnLoginFormProps> = ({
  flow: flow,
  errorMessages,
}) => {
  const { t } = useTranslation('common')
  const [identifier, setIdentifier] = useState<string | undefined>(undefined)
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined)
  const [webauthn_login, setWebAuthnLogin] = useState<string | undefined>(undefined)
  const [webauthnScript, setWebAuthnScript] = useState<webauthn_script | undefined>(undefined)
  const [loginTrigger, setLoginTrigger] = useState<string | undefined>(undefined)

  useEffect(() => {
    const nodes = flow.ui.nodes

  nodes.forEach((node) => {
      if(node.attributes.node_type === 'input'){
        const attributes = node.attributes as UiNodeInputAttributes
        if(attributes.name === 'identifier'){
          setIdentifier(attributes.value)
        }else if(attributes.name === 'csrf_token'){
          setCsrfToken(attributes.value)
        }else if(attributes.name === 'webauthn_login_trigger'){
          setLoginTrigger(attributes.onclick)
        }else if(attributes.name === 'webauthn_login'){
          setWebAuthnLogin(attributes.value)
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

  if(!webauthnScript || !loginTrigger || !csrfToken || !identifier){
    return <div>e...</div>
  }
    

  return (
    <Card>
      <form action='' method=''>
        <h5
          className='
            text-2xl font-semibold text-center 
            text-gray-900 dark:text-white
            mb-10 mt-5
          '
        >
          {t('webauthn.title')}
        </h5>
        {errorMessages &&
          errorMessages.map((errorMessage, index) => (
            <div key={index} className='text-red-500 text-center'>
              {/* FIXME: ここフォールバックできるようにしたい */}
              {t(`ory.error_message.${errorMessage.id}`)}
            </div>
          ))}
        
        <div className='flex flex-col items-center'>
          <input type='hidden' name='csrf_token' value={csrfToken} />
          <input type='hidden' name='identifier' value={identifier} />
          <input type='hidden' name='webauthn_login' value={webauthn_login} />
          <input type='button' name='webauthn_login_trigger' 
            value={t('webauthn.login')} 
            onClick={async () => {
              const run = new Function(loginTrigger)
              await run()
            }} 
            />
        </div>
      </form>
      <Script
        src={webauthnScript?.src}
        async={webauthnScript.async}
        referrerPolicy={webauthnScript?.referrerpolicy as HTMLAttributeReferrerPolicy}
        crossOrigin='anonymous'
        integrity={webauthnScript?.integrity}
        type={webauthnScript?.type}
        id={webauthnScript?.id}
        nonce={webauthnScript?.nonce}
      />
    </Card>
  )
}

export default WebAuthnLoginForm
