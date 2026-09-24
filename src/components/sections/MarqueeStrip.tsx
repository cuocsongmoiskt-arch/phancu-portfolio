import { useTranslations } from "next-intl";
import Marquee from "@/components/ui/Marquee";

type Item = { tags: string[] };

/** Băng từ khoá năng lực chạy chậm — lấy thẳng từ nội dung thật, không thêm chữ mới. */
export default function MarqueeStrip() {
  const t = useTranslations("capabilities");
  const items = t.raw("items") as Item[];
  const words = items.flatMap((i) => i.tags.slice(0, 3));

  return <Marquee items={words} />;
}
