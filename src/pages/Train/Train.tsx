import React, { FC, useEffect, useRef, useState } from 'react'
import { RadioChangeEvent, RadioGroupProps, RadioOption } from './TrainTypes.ts'
import './train.scss'
import Game from '../../components/Game/Game.jsx'
const Train = () => {
  const [trainScreen, setTrainScreen] = useState('train-select')
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

  const trainMode = options[0].selected ? 'timed' : options[1].selected ? 'untimed' : null

  return (
    <div className="train">
      {trainScreen === 'train-select' ? <TrainSelect options={options} handleOptionChange={handleOptionChange} trainMode={trainMode} setTrainScreen={setTrainScreen} /> : trainScreen === 'type' ? <TrainType /> : trainScreen === 'end' ? <div className="train-end">TrainEnd</div> : null}
    </div>
  )
}

export default Train

const RadioGroup: FC<RadioGroupProps> = ({ options, handleOptionChange }) => {
  return (
    <div className="timed-radio-group">
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

interface TrainSelectProps {
  options: {
    name: string
    selected: boolean
  }[]
  handleOptionChange: (event: RadioChangeEvent) => void
  trainMode: 'timed' | 'untimed' | null
  setTrainScreen: React.Dispatch<React.SetStateAction<string>>
}
const TrainSelect: FC<TrainSelectProps> = ({ options, handleOptionChange, trainMode, setTrainScreen }) => {
  return (
    <div className="train-select">
      <h1 className="train-heading">Train</h1>
      <h2 className="train-subheading">Choose your training</h2>
      <div className="train-selection">
        <fieldset>
          <legend>Timed:</legend>
          <RadioGroup options={options} handleOptionChange={handleOptionChange} />
        </fieldset>
      </div>
      <div>{trainMode ? 'Selected ' + trainMode : 'Please select an option'}</div>
      <div className="train-start">
        <button
          className="train-start-button"
          onClick={() => {
            console.log({ options })
            if (options[0].selected || options[1].selected) setTrainScreen('type')
          }}
        >
          Start
        </button>
      </div>
    </div>
  )
}

const TrainType = () => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!ref) return
    if (!ref.current) return
    ref.current.focus()
  })
  return (
    <div className="train-type">
      <h1 className="train-type-heading">Type into the box</h1>
      <Game ref={ref} />
    </div>
  )
}
