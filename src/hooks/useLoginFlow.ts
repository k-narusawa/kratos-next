import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  UiNodeAttributes,
  UiNodeInputAttributes,
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
    return flow.ui.nodes
      .map(({ attributes }) => attributes)
      .filter((attrs): attrs is UiNodeInputAttributes => isUiNodeInputAttributes(attrs))
      .find(({ name }) => name === 'method')?.value
  }

  const getMessages = (flow: Flow) => {
    return flow.ui.messages
  }

  return { getCsrfToken, getLoginMethod, getMessages }
}

export default useLoginFlow
