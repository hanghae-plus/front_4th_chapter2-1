import { useState } from 'react'
import { Product } from '../lib/types'

interface ProductSelectProps {
  products: Product[]
  handleAddCart: (productId: string) => void
}

function ProductSelect({ products, handleAddCart }: ProductSelectProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // 상품 선택
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = e.target.value
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId,
    )
    if (selectedProduct) {
      setSelectedProduct(selectedProduct)
    }
  }

  // 장바구니 추가
  const onClickAddCart = () => {
    if (selectedProduct) {
      handleAddCart(selectedProduct.id)
    }
  }

  return (
    <>
      <select className="border rounded p-2 mr-2" onChange={handleChange}>
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.stock === 0}
          >
            {product.name} - {product.value.toLocaleString()}원
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onClickAddCart}
      >
        추가
      </button>
    </>
  )
}

export default ProductSelect
