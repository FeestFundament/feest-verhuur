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
    description: "Elegante witte statafel, perfect voor elk feest. Optioneel met tafelrok verkrijgbaar.",
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
    name: "Statafel zwart",
    description: "Stijlvolle zwarte statafel voor een chique uitstraling.",
    price: 12.50,
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
