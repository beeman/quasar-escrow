import { Field, FieldContent, FieldDescription, FieldLabel } from '@/core/ui/field'
import { Input } from '@/core/ui/input'

export function EscrowUiAmountField({
  description,
  label,
  onChange,
  placeholder,
  value,
}: {
  description: string
  label: string
  onChange(value: string): void
  placeholder: string
  value: string
}) {
  const id = label.toLowerCase().replaceAll(/\s+/g, '-')

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent className="gap-2">
        <Input
          id={id}
          inputMode="numeric"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
    </Field>
  )
}
