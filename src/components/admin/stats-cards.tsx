import { BuildingIcon, TagIcon, MapPinIcon, TrendingUpIcon } from 'lucide-react'

interface Props {
  total: number
  byCategory: [string, number][]
  byCity: [string, number][]
}

const CARDS = [
  {
    key: 'total',
    label: 'Total Listings',
    icon: BuildingIcon,
    color: 'bg-blue-50 text-blue-600',
    getValue: (p: Props) => p.total.toLocaleString('fr-BE'),
    getSub: () => 'in the directory',
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: TagIcon,
    color: 'bg-violet-50 text-violet-600',
    getValue: (p: Props) => p.byCategory.length.toString(),
    getSub: (p: Props) =>
      p.byCategory[0] ? `top: ${p.byCategory[0][0]}` : '',
  },
  {
    key: 'cities',
    label: 'Cities',
    icon: MapPinIcon,
    color: 'bg-emerald-50 text-emerald-600',
    getValue: (p: Props) => p.byCity.length.toString(),
    getSub: (p: Props) =>
      p.byCity[0] ? `top: ${p.byCity[0][0]}` : '',
  },
  {
    key: 'top',
    label: 'Top Category',
    icon: TrendingUpIcon,
    color: 'bg-amber-50 text-amber-600',
    getValue: (p: Props) => p.byCategory[0]?.[0] ?? '—',
    getSub: (p: Props) =>
      p.byCategory[0] ? `${p.byCategory[0][1].toLocaleString('fr-BE')} listings` : '',
  },
]

export default function StatsCards(props: Props) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, color, getValue, getSub }) => (
        <div key={key} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={15} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 truncate">{getValue(props)}</div>
          <div className="text-xs text-gray-400 mt-1 truncate">{getSub(props)}</div>
        </div>
      ))}
    </div>
  )
}
