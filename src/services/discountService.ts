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
    prerequisiteItems: Item[]
  ): Item | null {
    let cheapestItem: Item | null = null;
    lineItems.forEach((item, index) => {
      const currentItem = { ...item, index };
      if (
        canUpdateCheapestItem({
          cheapestItem,
          prerequisiteItems,
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

  function getPrerequisites(lineItems: Item[]): Item[] {
    return lineItems.reduce((acc, item, index) => {
      if (globalConfig.discounts.prerequisite_skus.includes(item.sku)) {
        acc.push({ ...item, index });
      }
      return acc;
    }, [] as Item[]);
  }

  function canUpdateCheapestItem(args: UpdateCheapestItemArgs): boolean {
    const { cheapestItem, prerequisiteItems, item } = args;

    const isEligible = globalConfig.discounts.eligible_skus.includes(item.sku);
    const isCheaper =
      !cheapestItem || Number(item.price) < Number(cheapestItem.price);
    const isNotPrerequisite =
      prerequisiteItems.length > 1 ||
      prerequisiteItems[0]?.index !== item.index;

    return isEligible && !!isNotPrerequisite && isCheaper;
  }

  function run(data: GlobalConfig["data"]): string {
    const prerequisites = getPrerequisites(data.lineItems);

    if (prerequisites.length < 1) {
      console.log("No discounts available.");
      return calculateFinalPrice(data.lineItems).toFixed(2);
    }

    const cheapestEligibleItem = getCheapestEligibleItem(
      data.lineItems,
      prerequisites
    );

    return calculateFinalPrice(data.lineItems, cheapestEligibleItem).toFixed(2);
  }

  return { run };
}
