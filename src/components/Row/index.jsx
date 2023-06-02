import './style/row.css'
export default function Row({ children, location }) {
  console.log({ location })
  const rowType = location === 0 ? 'typing' : ''
  return <div className={`row ${rowType}`}>{children}</div>
}
