import Hero from "@/components/Hero";
import How from "@/components/How";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <div className="bg-black">
      <Hero />
      <How />
      <Pricing />
    </div>
  );
}
