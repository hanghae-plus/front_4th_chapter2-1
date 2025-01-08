const ShoppingCartItemSelectField = () => {
  return (
    <div className="flex gap-2 mb-6">
      <select className="flex-1 border rounded-lg px-4 py-2 bg-white">
        <option>상품1 - 10,000원</option>
        <option>상품2 - 20,000원</option>
        <option disabled>상품4 - 15,000원 (품절)</option>
      </select>
      <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">추가</button>
    </div>
  );
};

export default ShoppingCartItemSelectField;
