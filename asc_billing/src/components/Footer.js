import React, { useState, useEffect } from "react";
import billing from "../api/billing";

export default function Footer() {
  const [stocks, setStock] = useState([]);
  useEffect(() => {
    async function cb() {
      const response = await billing.get("stock-less-than-ten");
      setStock(response.data.items);
    }
    cb();
  }, []);

  return (
    <marquee>
      {stocks.map((stock) => (
        <span style={{ marginRight: 10 }}>
          {stock.product_name} -{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            {stock.rem_qty}
          </span>
          ,
        </span>
      ))}
    </marquee>
  );
}
