import { ChangeEvent } from 'react'

export interface RadioChangeEvent extends ChangeEvent<HTMLInputElement> {
  value: string
}
export interface RadioOption {
  name: string
  selected: boolean
}
export interface RadioGroupProps {
  options: RadioOption[]
  handleOptionChange: (event: RadioChangeEvent) => void
}
