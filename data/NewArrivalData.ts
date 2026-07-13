export interface Product {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

export const mockDeals: Product[] = [
  {
    image: "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM2_Front%20view.png?wid=1300&hei=1300",
    alt: "Cool Looking Lapel",
    category: "Accessories",
    name: "Cool Looking Lapel 1",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM1_Closeup%20view.png?wid=1300&hei=1300",
    alt: "Cool Looking Lapel",
    category: "Accessories",
    name: "Cool Looking Lapel 2",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM2_Front%20view.png?wid=1300&hei=1300",
    alt: "Cool Looking Lapel",
    category: "Accessories",
    name: "Cool Looking Lapel 3",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM1_Closeup%20view.png?wid=1300&hei=1300",
    alt: "Cool Looking Lapel",
    category: "Accessories",
    name: "Cool Looking Lapel 4",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
];

export const mockNewArrivals: Product[] = [
  {
    image: "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM2_Front%20view.png?wid=1300&hei=1300",
    alt: "Cool Looking Lapel",
    category: "Accessories",
    name: "New Lapel 1",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM1_Closeup%20view.png?wid=1300&hei=1300",
    alt: "Cool Looking Lapel",
    category: "Accessories",
    name: "New Lapel 2",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
];