import Button from './Button.jsx';

const DropDown = () => {
return (
  <div className="px-5 pt-5 pb-2">
    <select className="border p-2">
      <option value="p1">상품 1 - 10,000원</option>
      <option value="p2">상품 2 - 20,000원</option>
      <option value="p3">상품 3 - 30,000원</option>
      <option value="p4" disabled={true}>상품 4 - 15,000원</option>
      <option value="p5">상품 5 - 16,000원</option>
    </select>
    <Button className="bg-blue-500 p-2 px-4 mx-2 rounded-md text-white">추가</Button>
  </div>
)
}

export default DropDown
