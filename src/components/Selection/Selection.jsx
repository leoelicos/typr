export default function Selection() {
  const list = ['timed', 'untimed']
  return (
    <ul>
      {list.map((name) => (
        <button key={name} onClick={handleClickSelection} />
      ))}
    </ul>
  )
}
