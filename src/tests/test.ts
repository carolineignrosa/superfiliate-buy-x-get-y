import { GlobalConfig } from "../types";
import { createDiscountService } from "../services/discountService";

function test(expectedReturnValue: string, data: GlobalConfig["data"]) {
  console.log("New test for", data.reference);

  const testConfig: GlobalConfig = {
    discounts: {
      prerequisite_skus: ["PEANUT-BUTTER", "COCOA", "FRUITY"],
      eligible_skus: ["BANANA-CAKE", "COCOA", "CHOCOLATE"],
      discount_unit: "percentage",
      discount_value: "50.0",
    },
    data,
  };

  const service = createDiscountService(testConfig);
  const result = service.run(data);

  if (expectedReturnValue != result)
    console.error(`Expected ${expectedReturnValue} but received ${result}`);

  const successColor = "\x1b[32m%s\x1b[0m";
  console.log(successColor, "Test succeeded! \n");
}

/** Cocoa as eligible */
test("110.99", {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c1",
  lineItems: [
    { name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" },
    { name: "Fruity", price: "34.99", sku: "FRUITY" },
    { name: "Chocolate", price: "32", sku: "CHOCOLATE" },
    { name: "Cocoa", price: "10", sku: "COCOA" },
  ],
});

/** Cocoa as eligible in a different order */
test("110.99", {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c2",
  lineItems: [
    { name: "Cocoa", price: "10", sku: "COCOA" },
    { name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" },
    { name: "Fruity", price: "34.99", sku: "FRUITY" },
    { name: "Chocolate", price: "32", sku: "CHOCOLATE" },
  ],
});

/** Cocoa as pre requisite */
test("26.00", {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c3",
  lineItems: [
    { name: "Cocoa", price: "10", sku: "COCOA" },
    { name: "Chocolate", price: "32", sku: "CHOCOLATE" },
  ],
});

/** Different set of items */
test("144.99", {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c4",
  lineItems: [
    { name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" },
    { name: "Cocoa", price: "10.0", sku: "COCOA" },
    { name: "Fruity", price: "34.99", sku: "FRUITY" },
    { name: "Banana Cake", price: "34.0", sku: "BANANA-CAKE" },
    { name: "Chocolate", price: "32.0", sku: "CHOCOLATE" },
  ],
});

/** No eligible and consequently no discount */
test("39.00", {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c5",
  lineItems: [{ name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" }],
});

/** No pre requisite and consequently no discount */
test("32.00", {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c6",
  lineItems: [{ name: "Chocolate", price: "32.0", sku: "CHOCOLATE" }],
});
