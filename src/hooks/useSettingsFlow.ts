import { ory } from '@/pkg/sdk'
import { useHandleError } from '@/src/hooks/useHandleError'
import { SettingsFlow, UiNodeAttributes, UiNodeInputAttributes } from '@ory/client'
import { useEffect } from 'react'

type Flow = SettingsFlow

const useSettingsFlow = () => {
  const getUser = (flow: Flow): User => {
    return {
      email: flow.identity!.traits.email,
      enabledMfa: mfaEnabled(flow),
    }
  }

  const mfaEnabled = (flow: Flow) => {
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

  return { getUser, getCsrfToken }
}

export default useSettingsFlow
