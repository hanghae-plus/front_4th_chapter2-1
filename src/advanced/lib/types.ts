interface Product {
  id: string
  name: string
  value: number
  stock: number
}

interface Cart extends Omit<Product, 'stock'> {
  quantity: number
}

export type { Cart, Product }
