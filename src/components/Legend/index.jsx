import Key from '../Key'
import './legend.scss'
import { useMemo } from 'react'

const Legend = ({ render, pressed, value, composite }) => {
  const memoizedLegend = useMemo(
    () => (
      <div className={`legend ${render ? '' : 'blank'} ${pressed ? 'pressed' : ''}`}>
        <Key
          value={value}
          composite={composite}
        />
      </div>
    ),
    [pressed, render, value, composite]
  )

  return memoizedLegend
}

export default Legend
