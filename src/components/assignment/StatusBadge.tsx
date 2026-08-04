interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const getClasses = () => {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
      case 'COMPLETED':
      case 'PAID':
        return 'bg-green-100 text-green-700'

      case 'IN_USE':
      case 'IN PROGRESS':
        return 'bg-blue-100 text-blue-700'

      case 'MAINTENANCE':
      case 'UNAVAILABLE':
      case 'FAILED':
        return 'bg-red-100 text-red-700'

      case 'PENDING':
      case 'PENDING_ASSIGNMENT':
        return 'bg-amber-100 text-amber-700'

      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${getClasses()}`}
    >
      {status.replaceAll('_', ' ')}
    </span>
  )
}