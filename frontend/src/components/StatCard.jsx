export default function StatCard({ label, value, subtitle, icon: Icon, iconColor, barColor }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/40">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColor}`}>
          {Icon && <Icon size={20} />}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      {subtitle && <p className="mt-3 text-xs text-gray-400">{subtitle}</p>}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: '60%' }} />
      </div>
    </div>
  );
}