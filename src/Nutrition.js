export const Nutrition = ({ label, quantity, unit }) => {
  return (
    <div>
      <p><b>{label}</b> - {quantity.toFixed(1)} {unit}</p>
    </div>
  )
}