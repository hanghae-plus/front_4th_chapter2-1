import Cart from './components/cart'
import ProductSelect from './components/product-select'
import { useCart } from './hooks/use-cart'
import { useProducts } from './hooks/use-products'
import { PRODUCTS } from './lib/constants'

function App() {
  const { products, updateStock, checkStock } = useProducts({
    initialProducts: PRODUCTS,
  })

  const { cart, addToCart, addQuantity, minusQuantity, clearCart } = useCart({
    updateStock,
    checkStock,
    products,
  })

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart
          cart={cart}
          handleMinusQuantity={minusQuantity}
          handleAddQuantity={addQuantity}
          handleClearCart={clearCart}
        />
        <ProductSelect products={products} handleAddCart={addToCart} />
        <div className="text-sm text-gray-500 mt-2">상품4: 품절</div>
      </div>
    </div>
  )
}

export default App
