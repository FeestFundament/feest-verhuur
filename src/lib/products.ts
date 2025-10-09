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
}

export const products: Product[] = [
  {
    id: "1",
    name: "Statafel wit",
    description: "Elegante witte statafel. Beschikbaar met zwarte of witte tafelrok. Voor andere kleuren doeken, vraag een offerte aan.",
    price: 12.50,
    image: statafelImage,
    category: "Tafels"
  },
  {
    id: "2",
    name: "Biertafel set",
    description: "Complete set met biertafel en 2 banken. Ideaal voor buitenevenementen.",
    price: 25.00,
    image: biertafelImage,
    category: "Tafels"
  },
  {
    id: "3",
    name: "Mobiele bar",
    description: "Professionele mobiele bar voor uw feest. Inclusief verlichte achterwand.",
    price: 75.00,
    image: barImage,
    category: "Bars"
  },
  {
    id: "4",
    name: "Tafelrok zwart",
    description: "Stijlvolle zwarte tafelrok voor statafels. Voor andere kleuren, vraag een offerte aan.",
    price: 5.00,
    image: statafelImage,
    category: "Tafels"
  },
  {
    id: "5",
    name: "Party tent 3x3m",
    description: "Waterdichte partytent, ideaal voor elk evenement.",
    price: 45.00,
    image: statafelImage,
    category: "Tenten"
  },
  {
    id: "6",
    name: "LED verlichting",
    description: "Sfeervolle LED verlichting in verschillende kleuren.",
    price: 15.00,
    image: statafelImage,
    category: "Verlichting"
  }
];
