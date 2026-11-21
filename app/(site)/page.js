import Banner from "@/components/Banner";
import Newsletter from "@/components/Newsletter";
import PopularEquipment from "@/components/PopularEquipment";

export default function Home() {
  return (
    <main>
      <Banner />
      <PopularEquipment/>
      <Newsletter/>
    </main>
  );
}