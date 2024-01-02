import { RegistrationFlow, UiNodeAttributes, UiNodeInputAttributes } from '@ory/client'

type Flow = RegistrationFlow

const useRegistrationFlow = () => {
  const getCsrfToken = (flow: Flow) => {
    return flow.ui.nodes
      .map(({ attributes }) => attributes)
      .filter((attrs): attrs is UiNodeInputAttributes => isUiNodeInputAttributes(attrs))
      .find(({ name }) => name === 'csrf_token')?.value
  }

  const isUiNodeInputAttributes = (pet: UiNodeAttributes) => {
    return (pet as UiNodeInputAttributes).name !== undefined
  }

  return { getCsrfToken }
}

export default useRegistrationFlow
