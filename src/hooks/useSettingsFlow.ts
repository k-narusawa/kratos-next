import {
  SettingsFlow,
  UiNodeAttributes,
  UiNodeInputAttributes,
  VerificationFlow,
} from '@ory/client'

type Flow = SettingsFlow

const useSettingsFlow = () => {
  const getUser = (flow: Flow): User => {
    return {
      email: flow.identity.traits.email,
      emailVerified:
        flow.identity.verifiable_addresses?.some(({ verified }) => verified) ?? false,
    }
  }

  const enabledMfa = (flow: Flow) => {
    return !!flow.ui.nodes
      .map(({ attributes }) => attributes)
      .filter((attrs): attrs is UiNodeInputAttributes => isUiNodeInputAttributes(attrs))
      .find(({ name }) => name === 'totp_unlink')?.value
  }

  const getCsrfToken = (flow: Flow) => {
    return flow.ui.nodes
      .map(({ attributes }) => attributes)
      .filter((attrs): attrs is UiNodeInputAttributes => isUiNodeInputAttributes(attrs))
      .find(({ name }) => name === 'csrf_token')?.value
  }

  const isUiNodeInputAttributes = (pet: UiNodeAttributes) => {
    return (pet as UiNodeInputAttributes).name !== undefined
  }

  return { getUser, enabledMfa, getCsrfToken }
}

export default useSettingsFlow
