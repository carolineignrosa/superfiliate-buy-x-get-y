import fs from "fs";

const configBuffer = fs.readFileSync("config.json");
const config = JSON.parse(configBuffer);

function main(cart) {
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

function calculateDiscount(price, discount) {
  return price - price * (discount / 100);
}

function calculateFinalPrice(lineItems, cheapestEligibleItem = {}) {
  const finalPrice = lineItems.reduce((acc, item, index) => {
    const priceToAdd =
      cheapestEligibleItem?.index === index
        ? calculateDiscount(item.price, config.discounts.discount_value)
        : item.price;
    return acc + Number(priceToAdd);
  }, 0);

  if (cheapestEligibleItem) {
    console.log(
      `Discount applied! New price for ${cheapestEligibleItem.name}: ${cheapestEligibleItem.price}`
    );
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

  return cheapestItem;
}

function getPreRequisites(lineItems) {
  return lineItems.reduce((acc, item, index) => {
    if (config.discounts.prerequisite_skus.includes(item.sku)) {
      acc.push({ ...item, index });
    }
    return acc;
  }, []);
}

function canUpdateCheapestItem(args) {
  const { cheapestItem, preRequisites, item } = args;
  const isEligible = config.discounts.eligible_skus.includes(item.sku);
  const isCheaper = !cheapestItem || item.price < cheapestItem.price;
  const isNotPreRequisite =
    preRequisites.length &&
    (preRequisites.length > 1 || preRequisites[0]?.index !== item.index);

  return isEligible && isNotPreRequisite && isCheaper;
}

export default main;
