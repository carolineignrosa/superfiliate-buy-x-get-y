import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createDiscountService } from "./services/discountService";

const app = express();
const port = 3000;

const configPath = path.join(__dirname, "../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// CON: Makes more sense to have a POST request since we're sending a complex JSON body,
// a GET request is more suitable for fetching data not really calculating it on the fly.
app.get("/calculate-price", (req: Request, res: Response) => {
  try {
    const service = createDiscountService(config.calculate_price);
    // CON: I believe there is a misunderstanding here, the cart should come as an API argument, not a hardcoded property.
    const result = service.run(config.calculate_price.cart);

    res.status(200);
    // CON: Should have returned a more descriptive object with each item and
    // their respective discounted price, as well as the total discount applied.
    res.json({ finalPrice: result });
  } catch (err: any) {
    console.error(err.message);
    res.status(422).json({ error: "Error to calculate cart final price" });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
