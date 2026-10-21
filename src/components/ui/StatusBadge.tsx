import type { ProjectStatus } from "@/content/projects";

/**
 * Nhãn trạng thái dự án. Ba kiểu phải nhìn khác nhau ngay cả khi không đọc chữ:
 * Hoàn thành = chấm đặc, Đang thực hiện = chấm nhịp, Kế hoạch = vòng rỗng + viền đứt.
 */
const STYLES: Record<ProjectStatus, string> = {
  completed: "border-accent-600/30 bg-accent-50 text-accent-600",
  inProgress: "border-progress-600/30 bg-progress-50 text-progress-600",
  planned: "border-dashed border-ink-500/45 bg-surface text-ink-500",
};

export default function StatusBadge({
  status,
  label,
  className = "",
}: {
  status: ProjectStatus;
  label: string;
  className?: string;
}) {
  return (
    <span
      data-status={status}
      className={`label-mono inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 ${STYLES[status]} ${className}`}
    >
      <span className={`status-dot status-dot--${status}`} aria-hidden />
      {label}
    </span>
  );
}
