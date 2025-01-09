import { SelectOption } from './_components/SelectOption';

// dummy
export const productList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];

export const ProductSelector = () => {
  return (
    <>
      <select id="product-select" className="border rounded p-2 mr-2">
        {productList.map((product) => (
          <SelectOption key={product.id} product={product} />
        ))}
      </select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </>
  );
};
