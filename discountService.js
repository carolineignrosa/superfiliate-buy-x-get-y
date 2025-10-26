export function createDiscountService(globalConfig) {
  function calculateDiscount(price, discount) {
    return price - price * (discount / 100);
  }

  function calculateFinalPrice(lineItems, cheapestEligibleItem = null) {
    const finalPrice = lineItems.reduce((acc, item, index) => {
      const priceToAdd =
        cheapestEligibleItem?.index === index
          ? calculateDiscount(item.price, globalConfig.discounts.discount_value)
          : item.price;
      return acc + Number(priceToAdd);
    }, 0);

    if (cheapestEligibleItem) {
      console.log(`Discount applied to ${cheapestEligibleItem.name}!`);
    }
    return finalPrice;
  }

  function getCheapestEligibleItem(lineItems, preRequisites) {
    let cheapestItem = null;
    lineItems.forEach((item, index) => {
      const currentItem = { ...item, index };
      if (
        canUpdateCheapestItem({
          cheapestItem,
          preRequisites,
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

  function getPreRequisites(lineItems) {
    return lineItems.reduce((acc, item, index) => {
      if (globalConfig.discounts.prerequisite_skus.includes(item.sku)) {
        acc.push({ ...item, index });
      }
      return acc;
    }, []);
  }

  function canUpdateCheapestItem(args) {
    const { cheapestItem, preRequisites, item } = args;
    const isEligible = globalConfig.discounts.eligible_skus.includes(item.sku);
    const isCheaper = !cheapestItem || item.price < cheapestItem.price;
    const isNotPreRequisite =
      preRequisites.length &&
      (preRequisites.length > 1 || preRequisites[0]?.index !== item.index);

    return isEligible && isNotPreRequisite && isCheaper;
  }

  function run(cart) {
    const preRequisites = getPreRequisites(cart.lineItems);

    if (preRequisites.length < 1) {
      console.log("No discounts available.");
      return calculateFinalPrice(cart.lineItems).toFixed(2);
    }

    const cheapestEligibleItem = getCheapestEligibleItem(
      cart.lineItems,
      preRequisites
    );

    return calculateFinalPrice(cart.lineItems, cheapestEligibleItem).toFixed(2);
  }

  return { run };
}
