
type DashboardCardProps = {
  titulo: string
  valor: number
}

function DashboardCard({ titulo, valor }: DashboardCardProps) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <p>{valor}</p>
    </div>
  )
}

export default DashboardCard
