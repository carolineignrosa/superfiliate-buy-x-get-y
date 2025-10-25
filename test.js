import calculateCartPrice from "./calculateCartPrice.js";

function test(expectedReturnValue, data) {
  console.log("New test for:", data.reference);

  const result = calculateCartPrice(data);
  console.log("Final price:", result);

  if (expectedReturnValue != result)
    console.error(`Expected ${expectedReturnValue} but received ${result}`);

  const successColor = "\x1b[32m%s\x1b[0m";
  console.log(successColor, "Test succeeded! \n");
}

test(110.99, {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c1",
  lineItems: [
    { name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" },
    { name: "Fruity", price: "34.99", sku: "FRUITY" },
    { name: "Chocolate", price: "32", sku: "CHOCOLATE" },
    { name: "Cocoa", price: "10", sku: "COCOA" },
  ],
});

test(110.99, {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c2",
  lineItems: [
    { name: "Cocoa", price: "10", sku: "COCOA" },
    { name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" },
    { name: "Fruity", price: "34.99", sku: "FRUITY" },
    { name: "Chocolate", price: "32", sku: "CHOCOLATE" },
  ],
});

test(26, {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c3",
  lineItems: [
    { name: "Cocoa", price: "10", sku: "COCOA" },
    { name: "Chocolate", price: "32", sku: "CHOCOLATE" },
  ],
});

test(144.99, {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c4",
  lineItems: [
    { name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" },
    { name: "Cocoa", price: "10.0", sku: "COCOA" },
    { name: "Fruity", price: "34.99", sku: "FRUITY" },
    { name: "Banana Cake", price: "34.0", sku: "BANANA-CAKE" },
    { name: "Chocolate", price: "32.0", sku: "CHOCOLATE" },
  ],
});

test(39, {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c5",
  lineItems: [{ name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" }],
});

test(32, {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c6",
  lineItems: [{ name: "Chocolate", price: "32.0", sku: "CHOCOLATE" }],
});
