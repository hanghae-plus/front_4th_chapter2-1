import React, { Dispatch, SetStateAction } from "react";
import { itemList } from "../constants/constants";
import { IItem } from "../types/types";

interface ProduceOptionsProps {
  setSelectedItemId: Dispatch<SetStateAction<Pick<IItem, "id">["id"]>>;
}

export default function ProductOptions(props: ProduceOptionsProps) {
  const { setSelectedItemId } = props;
  return (
    <select
      id="product-select"
      className="border rounded p-2 mr-2"
      onChange={(event) => setSelectedItemId(event.target.value)}
    >
      {itemList.map((item: IItem) => (
        <option value={item.id} disabled={!item.qty}>
          {`${item.name} - ${item.price}원`}
        </option>
      ))}
    </select>
  );
}
