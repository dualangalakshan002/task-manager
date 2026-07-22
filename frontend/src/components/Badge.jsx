export default function Badge({ text, className = '' }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {text}
    </span>
  );
}
