import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingActions from "@/components/FloatingActions";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Manifesto from "@/components/Manifesto";
import Collections from "@/components/Collections";
import Philosophy from "@/components/Philosophy";
import Process from "@/components/Process";
import Reels from "@/components/Reels";
import Stats from "@/components/Stats";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Quote from "@/components/Quote";
import Footer from "@/components/Footer";
import { loadContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await loadContent();

  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <FloatingActions />
      <Nav site={content.site} />
      <main>
        <Hero hero={content.hero} stats={content.stats} />
        <TrustBar trustBar={content.trustBar} />
        <Manifesto manifesto={content.manifesto} />
        <Collections items={content.products} />
        <Philosophy philosophy={content.philosophy} />
        <Process process={content.atelierProcess} />
        <Reels />
        <Stats />
        <Gallery items={content.gallery} />
        <Testimonials items={content.testimonials} />
        <Faq items={content.faqs} />
        <Quote quote={content.quote} site={content.site} />
      </main>
      <Footer site={content.site} footer={content.footer} />
    </SmoothScroll>
  );
}
