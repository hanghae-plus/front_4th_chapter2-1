import React from "react";
import { productList, Product } from "../model/datas";
import SelectProduct from "./SelectProduct";
  
interface ButtonsProps {
    handleAddButton: () => void;
}

const Buttons: React.FC<ButtonsProps> = ({
    handleAddButton
}) => {
    return (
        <button 
        id="add-to-cart" 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddButton}
        >
            추가
        </button>
    )
};

export default Buttons;