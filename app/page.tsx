import Hero from "@/components/Hero";
import FactsStrip from "@/components/FactsStrip";
import Tour from "@/components/tour/Tour";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import PriceSection from "@/components/PriceSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <FactsStrip />
      <Tour />
      <Gallery />
      <Amenities />
      <PriceSection />
      <Contact />
      <Footer />
    </main>
  );
}
