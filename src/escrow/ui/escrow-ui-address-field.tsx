import type { ReactNode } from 'react'

import { Field, FieldContent, FieldDescription, FieldLabel } from '@/core/ui/field'
import { Input } from '@/core/ui/input'

export function EscrowUiAddressField({
  description,
  label,
  onChange,
  picker,
  placeholder,
  value,
}: {
  description: string
  label: string
  onChange(value: string): void
  picker?: ReactNode
  placeholder: string
  value: string
}) {
  const id = label.toLowerCase().replaceAll(/\s+/g, '-')

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent className="gap-2.5">
        {picker}
        <Input
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          value={value}
        />
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
    </Field>
  )
}
