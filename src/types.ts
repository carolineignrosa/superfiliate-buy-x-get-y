export type GlobalConfig = {
  discounts: {
    prerequisite_skus: string[];
    eligible_skus: string[];
    discount_unit: "percentage";
    discount_value: string;
  };
  data: {
    reference: string;
    lineItems: Item[];
  };
};

export type Item = {
  name: string;
  price: string;
  sku: string;
  index?: number;
};

export type UpdateCheapestItemArgs = {
  cheapestItem: Item | null;
  preRequisiteItems: Item[];
  item: Item;
};
