import React, { FC, useState, ChangeEvent } from 'react'

const Train = () => {
  const [trainScreen, setTrainScreen] = useState('selection')
  const [options, setOptions] = useState([
    { name: 'timed', selected: false },
    { name: 'untimed', selected: false }
  ])

  const handleOptionChange = (event: RadioChangeEvent) => {
    if (event.target.value === 'timed')
      setOptions([
        { name: 'timed', selected: true },
        { name: 'untimed', selected: false }
      ])
    else
      setOptions([
        { name: 'timed', selected: false },
        { name: 'untimed', selected: true }
      ])
  }

  const [trainMode, setTrainMode] = useState('timed')

  console.log(trainMode, setTrainMode)
  if (trainScreen === 'type') return <div className="train-type">TrainType</div>
  if (trainScreen === 'end') return <div className="train-end">TrainEnd</div>

  return (
    <div className="train">
      <div className="train-selection">
        <fieldset>
          <legend>Select a typing mode:</legend>
          <RadioGroup options={options} handleOptionChange={handleOptionChange} />
        </fieldset>
      </div>
      <div className="train-start">
        <button onClick={() => setTrainScreen('type')} />
      </div>
    </div>
  )
}

export default Train

interface RadioChangeEvent extends ChangeEvent<HTMLInputElement> {
  value: string
}
interface RadioOption {
  name: string
  selected: boolean
}
interface RadioGroupProps {
  options: RadioOption[]
  handleOptionChange: (event: RadioChangeEvent) => void
}

const RadioGroup: FC<RadioGroupProps> = ({ options, handleOptionChange }) => {
  return (
    <div>
      {options.map((option: RadioOption) => {
        return (
          <label key={option.name}>
            <input type="radio" value={option.name} checked={option.selected} onChange={handleOptionChange} />
            {option.name}
          </label>
        )
      })}
    </div>
  )
}
