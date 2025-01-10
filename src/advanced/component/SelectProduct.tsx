
import React from "react";
import { productList } from "../model/datas";

const SelectProduct: React.FC = () => {
    return (
        <select id="product-select" className="border rounded p-2 mr-2">
            {productList.map((product) => (
                <option key={product.id} value={product.id}>
                    {product.name} - {product.price}원
                </option>
            ))}
        </select>
    )
}

export default SelectProduct;