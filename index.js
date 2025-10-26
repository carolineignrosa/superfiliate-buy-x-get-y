import express from "express";
import { createDiscountService } from "./discountService.js";
import fs from "fs";

const app = express();
const port = 3000;

app.get("/calculate-price", (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync("config.json"));
    const service = createDiscountService(config);
    const result = service.run(config.data);

    res.status(200);
    res.json({ finalPrice: result });
  } catch (err) {
    console.error(err.message);
    res.status(422).json({ error: "Error to calculate cart final value" });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
