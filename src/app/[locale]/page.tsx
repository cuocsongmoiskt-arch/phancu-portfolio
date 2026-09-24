import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import CoreCapabilities from "@/components/sections/CoreCapabilities";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import Experience from "@/components/sections/Experience";
import SelectedWork from "@/components/sections/SelectedWork";
import TechnicalFoundation from "@/components/sections/TechnicalFoundation";
import Contact from "@/components/sections/Contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <CoreCapabilities />
      <MarqueeStrip />
      <Experience />
      <SelectedWork />
      <TechnicalFoundation />
      <Contact />
    </>
  );
}
