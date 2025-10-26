## Buy X, get Y

### Description

This app contains a service that calculates discounts for a given list of cart items. To be able to calculate, the service needs to receive the list of items to calculate and a JSON config argument to get the discount definitions. If the requirements are not met, no discount will be applied, and the sum of all prices as it is will be returned.

### Requirements

1. If there's no prerequisite item, no discount should be applied
2. If there's no eligible item, no discount should be applied
3. If the eligible item is also the unique prerequisite item, no discount should be applied
4. If there's at least one prerequisite item, and one or more eligible, the discount should be applied to the cheapest item

### How to run

There's two ways to run the `discoutService`:

#### Running tests

I've build the existing test file (/tests/test.ts) to valdiate different data set for the discount logic. It's not using any framework because I didn't want to over complicate the app configuration, but with this manual unit test is possible to define different scenarios to be validated.

1. Run `npm install`
2. Define the test cases in the test file by calling the `test()` function passing two args
3. The first arg should be the expected final price to the cart items
4. The second one should be the data to be tested

Example

```
test("110.99", {
  reference: "2d832fe0-6c96-4515-9be7-4c00983539c1",
  lineItems: [
    { name: "Peanut Butter", price: "39.0", sku: "PEANUT-BUTTER" },
    { name: "Fruity", price: "34.99", sku: "FRUITY" },
    { name: "Chocolate", price: "32", sku: "CHOCOLATE" },
    { name: "Cocoa", price: "10", sku: "COCOA" },
  ],
});
```

You can define multiple test cases by calling the `test` function multiple times.

3. Run `npm run test`

You should be able to see which tests succeeded, and also see the failed the ones with the comparison of the expected and the returned values.

#### Calling the API

This mode is to be used as an API, which can be called with a curl request, for example.

1. Run `npm install`
2. Define the config to be used by the app in the `config.json` file placed in the root directory
   Example

```
{
  "calculate_price": {
    "discounts": {
      "prerequisite_skus": ["PEANUT-BUTTER", "COCOA", "FRUITY"],
      "eligible_skus": ["BANANA-CAKE", "COCOA", "CHOCOLATE"],
      "discount_unit": "percentage",
      "discount_value": "50.0"
    },
    "cart": {
      "reference": "2d832fe0-6c96-4515-9be7-4c00983539c1",
      "lineItems": [
        { "name": "Peanut Butter", "price": "39.0", "sku": "PEANUT-BUTTER" },
        { "name": "Fruity", "price": "34.99", "sku": "FRUITY" },
        { "name": "Chocolate", "price": "32", "sku": "CHOCOLATE" },
        { "name": "Cocoa", "price": "10", "sku": "COCOA" }
      ]
    }
  }
}
```

3. Run `npm run api`
4. From another window, run `curl -v localhost:3000/calculate-price`

You should receive a JSON response with the `finalPrice` prop if everything works fine, and an error JSON if something is wrong when trying to run the discount service.

### Future improvements

1. Add a interface to allow users to define the config and the items list
2. Handle different discount types than 'percentage'
3. Define more strict types for SKUs based on the possible items
