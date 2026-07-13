import ProductView from "@/components/ProductView";
// Import từ file data dành riêng cho Lifestyle
import { lifestyleData, filterPriceRanges, filterCategories, filterSizes } from "@/data/LifestyleCategories";

export default function LifestylePage() {
  return (
    <ProductView 
      categorySlug="lifestyle"
      title={lifestyleData.title}
      subtitle={lifestyleData.subtitle}
      products={lifestyleData.products}
      filterPriceRanges={filterPriceRanges}
      filterCategories={filterCategories}
      filterSizes={filterSizes}
    />
  );
}