type Props = { items: string[] };

/**
 * Băng chữ chạy ngang. Nhân bản đủ để luôn rộng hơn màn hình lớn — nếu nội dung
 * hẹp hơn khung thì trên desktop sẽ không thấy chuyển động.
 */
export default function Marquee({ items }: Props) {
  const filled =
    items.length >= 12 ? items : [...items, ...items, ...items].slice(0, 24);

  const row = (key: string) => (
    <div key={key} className="marquee__track" aria-hidden>
      {filled.map((item, i) => (
        <span
          key={`${key}-${i}-${item}`}
          className="label-mono flex items-center gap-2.5 whitespace-nowrap text-ink-500"
        >
          <span className="h-1 w-1 shrink-0 rounded-full bg-highlight" />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-bg-alt py-4">
      <div className="marquee">
        {row("a")}
        {row("b")}
      </div>
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
