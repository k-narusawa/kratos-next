import TextInput from "@/src/components/TextInput"
import { NodeInputProps } from "./helpers"

export function NodeInputDefault<T>(props: NodeInputProps) {
  const { node, attributes, value = "", setValue, disabled } = props

  const onClick = () => {
    if (attributes.onclick) {
      const run = new Function(attributes.onclick)
      run()
    }
  }

  // Render a generic text input field.
  return (
    <TextInput
      title={node.meta.label?.text}
      onClick={onClick}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      type={attributes.type}
      name={attributes.name}
      value={value}
      disabled={attributes.disabled || disabled}
      // help={node.messages.length > 0}
      // state={
      //   node.messages.find(({ type }) => type === "error") ? "error" : undefined
      // }
      // subtitle={
      //   <>
      //     {node.messages.map(({ text, id }, k) => (
      //       <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
      //         {text}
      //       </span>
      //     ))}
      //   </>
      // }
    />
  )
}