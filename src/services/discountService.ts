import { GlobalConfig, Item, UpdateCheapestItemArgs } from "../types";

export function createDiscountService(globalConfig: GlobalConfig) {
  function calculateDiscount(price: number, discount: string) {
    return price - price * (Number(discount) / 100);
  }

  function calculateFinalPrice(
    lineItems: Item[],
    cheapestEligibleItem: Item | null = null
  ): number {
    const finalPrice = lineItems.reduce((acc, item, index) => {
      const price = Number(item.price);
      const priceToAdd =
        cheapestEligibleItem?.index === index
          ? calculateDiscount(price, globalConfig.discounts.discount_value)
          : price;
      return acc + priceToAdd;
    }, 0);

    if (cheapestEligibleItem) {
      console.log(`Discount applied to ${cheapestEligibleItem.name}!`);
    }
    return finalPrice;
  }

  function getCheapestEligibleItem(
    lineItems: Item[],
    preRequisiteItems: Item[]
  ): Item | null {
    let cheapestItem: Item | null = null;
    lineItems.forEach((item, index) => {
      const currentItem = { ...item, index };
      if (
        canUpdateCheapestItem({
          cheapestItem,
          preRequisiteItems,
          item: currentItem,
        })
      ) {
        cheapestItem = currentItem;
      }
    });

    if (!cheapestItem) {
      console.log("No discounts available.");
    }

    return cheapestItem;
  }

  function getPreRequisites(lineItems: Item[]): Item[] {
    return lineItems.reduce((acc, item, index) => {
      if (globalConfig.discounts.prerequisite_skus.includes(item.sku)) {
        acc.push({ ...item, index });
      }
      return acc;
    }, [] as Item[]);
  }

  function canUpdateCheapestItem(args: UpdateCheapestItemArgs): boolean {
    const { cheapestItem, preRequisiteItems, item } = args;

    const isEligible = globalConfig.discounts.eligible_skus.includes(item.sku);
    const isCheaper =
      !cheapestItem || Number(item.price) < Number(cheapestItem.price);
    const isNotPreRequisite =
      preRequisiteItems.length > 1 ||
      preRequisiteItems[0]?.index !== item.index;

    return isEligible && !!isNotPreRequisite && isCheaper;
  }

  function run(data: GlobalConfig["data"]): string {
    const preRequisites = getPreRequisites(data.lineItems);

    if (preRequisites.length < 1) {
      console.log("No discounts available.");
      return calculateFinalPrice(data.lineItems).toFixed(2);
    }

    const cheapestEligibleItem = getCheapestEligibleItem(
      data.lineItems,
      preRequisites
    );

    return calculateFinalPrice(data.lineItems, cheapestEligibleItem).toFixed(2);
  }

  return { run };
}
