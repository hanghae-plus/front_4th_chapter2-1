import { http, HttpResponse } from "msw";

export const products = [
  { id: "p1", name: "상품1", cost: 10000, quantity: 50 },
  { id: "p2", name: "상품2", cost: 20000, quantity: 30 },
  { id: "p3", name: "상품3", cost: 30000, quantity: 20 },
  { id: "p4", name: "상품4", cost: 15000, quantity: 0 },
  { id: "p5", name: "상품5", cost: 25000, quantity: 10 }
];

export const handlers = [
  http.get("/products", () => {
    return HttpResponse.json({
      products
    });
  })
];
