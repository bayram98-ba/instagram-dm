type Status = "Yeni" | "Təsdiqlənib" | "Göndərilib";

const styles: Record<Status, string> = {
  Yeni:         "bg-[var(--new-bg)] text-[var(--new)]",
  Təsdiqlənib:  "bg-[var(--confirmed-bg)] text-[var(--confirmed)]",
  Göndərilib:   "bg-[var(--shipped-bg)] text-[var(--shipped)]",
};

const dots: Record<Status, string> = {
  Yeni:        "bg-[var(--new)]",
  Təsdiqlənib: "bg-[var(--confirmed)]",
  Göndərilib:  "bg-[var(--shipped)]",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-[.05em] ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}
