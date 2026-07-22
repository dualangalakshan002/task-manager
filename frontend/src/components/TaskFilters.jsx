import { STATUSES, PRIORITIES, SORT_OPTIONS } from '../utils/constants';

/** Search + status/priority filters + sort. Controlled by the parent page. */
export default function TaskFilters({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input
        value={filters.search}
        onChange={set('search')}
        placeholder="Search by title..."
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
      />

      <select value={filters.status} onChange={set('status')}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700">
        <option value="">All Statuses</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={filters.priority} onChange={set('priority')}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700">
        <option value="">All Priorities</option>
        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>

      <select value={filters.sort} onChange={set('sort')}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700">
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
