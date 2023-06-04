import Key from '../Key'
import './legend.scss'
import { useMemo } from 'react'

const Legend = ({ render, pressed, value, composite }) =>
  useMemo(
    () => (
      <div className={`legend ${render ? '' : 'blank'} ${pressed ? 'pressed' : ''}`}>
        <Key
          value={value}
          composite={composite}
          underscore={value === 'F' || value === 'J'}
        />
      </div>
    ),
    [pressed, render, value, composite]
  )

export default Legend
