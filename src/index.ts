import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createDiscountService } from "./services/discountService";

const app = express();
const port = 3000;

const configPath = path.join(__dirname, "../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

app.get("/calculate-price", (req: Request, res: Response) => {
  try {
    const service = createDiscountService(config.calculate_price);
    const result = service.run(config.calculate_price.cart);

    res.status(200);
    res.json({ finalPrice: result });
  } catch (err: any) {
    console.error(err.message);
    res.status(422).json({ error: "Error to calculate cart final price" });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
