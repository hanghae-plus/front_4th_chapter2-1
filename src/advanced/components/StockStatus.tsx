import React, { Dispatch, SetStateAction } from "react";
import { itemList } from "../constants/constants";
import { IItem } from "../types/types";

interface StockStatusProps {
  inventory: IItem[];
}

export default function StockStatus(props: StockStatusProps) {
  const { inventory } = props;
  return (
    <div id={"stock-status"} className="text-sm text-gray-500 mt-2">
      {inventory.map((item: IItem) => {
        if (item.qty === 0) {
          return <span>{item.name}: 품절</span>;
        } else if (item.qty <= 5) {
          return <span>{"재고 부족 (" + item.qty + "개 남음)"}</span>;
        } else {
          return <span></span>;
        }
      })}
    </div>
  );
}
