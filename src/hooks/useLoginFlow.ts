import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  UiNodeAttributes,
  UiNodeInputAttributes,
  UiTextTypeEnum,
  VerificationFlow,
} from '@ory/client'

type Flow = LoginFlow | RegistrationFlow | VerificationFlow | RecoveryFlow

const useLoginFlow = () => {
  const getCsrfToken = (flow: Flow) => {
    return flow.ui.nodes
      .map(({ attributes }) => attributes)
      .filter((attrs): attrs is UiNodeInputAttributes => isUiNodeInputAttributes(attrs))
      .find(({ name }) => name === 'csrf_token')?.value
  }

  const isUiNodeInputAttributes = (pet: UiNodeAttributes) => {
    return (pet as UiNodeInputAttributes).name !== undefined
  }

  const getLoginMethod = (flow: Flow) => {
    const messages = flow.ui.messages

    if (messages === undefined) {
      return 'login'
    }

    for (const message of messages) {
      switch (message.id) {
        case 1010004:
          return 'totp'
        case 1010012:
          return 'webauthn'
      }
    }
    return 'login'
  }

  const getMessages = (flow: Flow) => {
    return flow.ui.messages
  }

  return { getCsrfToken, getLoginMethod, getMessages }
}

export default useLoginFlow
