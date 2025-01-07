import { productList } from "advanced/store/productList";

function ProductOptions() {
  return productList.map((product) => {
    return (
      <option
        key={product.id}
        id={product.id}
        disabled={product.remaining === 0}
      >
        {product.name} - {product.price}원
      </option>
    );
  });
}

export default ProductOptions;
