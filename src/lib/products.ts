import statafelImage from "@/assets/statafel-wit.jpg";
import biertafelImage from "@/assets/biertafel.jpg";
import barImage from "@/assets/bar.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  colors?: string[];
  visible?: boolean;
  priceType?: "daily" | "fixed";
}

// Helper to get only visible products
export const getVisibleProducts = () => products.filter(p => p.visible !== false);

export const products: Product[] = [
  {
    id: "1",
    name: "Statafel wit",
    description: "Elegante witte statafel. Beschikbaar met zwarte of witte tafelrok. Voor andere kleuren doeken, vraag een offerte aan.",
    price: 7.50,
    image: statafelImage,
    category: "Tafels",
    visible: true
  },
  {
    id: "2",
    name: "Biertafel set",
    description: "Complete set met biertafel en 2 banken. Ideaal voor buitenevenementen.",
    price: 10.00,
    image: biertafelImage,
    category: "Tafels",
    visible: true
  },
  {
    id: "3",
    name: "Mobiele bar",
    description: "Professionele mobiele bar voor uw feest. Ombouw verkrijgbaar als apart product.",
    price: 75.00,
    image: barImage,
    category: "Bars",
    visible: false
  },
  {
    id: "7",
    name: "Bar ombouw",
    description: "Stijlvolle ombouw voor de mobiele bar. Geeft uw bar een professionele uitstraling.",
    price: 35.00,
    image: barImage,
    category: "Bars",
    visible: false
  },
  {
    id: "8",
    name: "Bartafel",
    description: "Professionele bartafel. Ombouw verkrijgbaar als apart product.",
    price: 45.00,
    image: statafelImage,
    category: "Tafels",
    visible: false
  },
  {
    id: "9",
    name: "Bartafel ombouw",
    description: "Stijlvolle ombouw voor de bartafel. Geeft uw bartafel een professionele uitstraling.",
    price: 25.00,
    image: statafelImage,
    category: "Tafels",
    visible: false
  },
  {
    id: "4",
    name: "Tafelrok",
    description: "Stijlvolle tafelrok voor statafels. Verkrijgbaar in zwart of wit. Voor andere kleuren, vraag een offerte aan.",
    price: 4.99,
    image: statafelImage,
    category: "Tafels",
    colors: ["Zwart", "Wit"],
    visible: true
  },
  {
    id: "5",
    name: "Party tent 3x3m",
    description: "Waterdichte partytent, ideaal voor elk evenement.",
    price: 30.00,
    image: statafelImage,
    category: "Tenten",
    visible: true
  },
  {
    id: "12",
    name: "Party tent 6x3m",
    description: "Grote waterdichte partytent, perfect voor grotere evenementen.",
    price: 45.00,
    image: statafelImage,
    category: "Tenten",
    visible: true
  },
  {
    id: "6",
    name: "LED verlichting",
    description: "Sfeervolle LED verlichting in verschillende kleuren.",
    price: 15.00,
    image: statafelImage,
    category: "Verlichting",
    visible: false
  },
  {
    id: "10",
    name: "Fust",
    description: "Verse fusten voor uw feest. Verschillende merken beschikbaar.",
    price: 65.00,
    image: statafelImage,
    category: "Dranken",
    visible: false
  },
  {
    id: "11",
    name: "Opbouw service",
    description: "Professionele opbouw van alle gehuurde materialen. Startprijs €50 + €30 per uur + reiskosten.",
    price: 50.00,
    image: statafelImage,
    category: "Diensten",
    visible: true,
    priceType: "fixed"
  }
];
