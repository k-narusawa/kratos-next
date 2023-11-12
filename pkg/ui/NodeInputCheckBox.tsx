import { getNodeLabel } from "@ory/integrations/ui"

import { NodeInputProps } from "./helpers"
import Checkbox from "@/components/Checkbox"

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled,
}: NodeInputProps) {
  // Render a checkbox.s
  return (
    <>
      <Checkbox
        label={getNodeLabel(node)}
        checked={attributes.value === "true"}
        onChange={(e) => setValue(e.target.checked ? "true" : "false")}
      />
    </>
  )
}