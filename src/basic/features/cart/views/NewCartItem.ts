import { Product } from '../../../shared/entity/model/Product';

// !rule : interface
// !rule : ComponentName + Props
interface NewCartItemProps {
  item: Product;
}

// !rule : ComponentName
// !rule : function, not arrow function
// !rule : object parameter
function NewCartItem({ item }: NewCartItemProps) {
  return `
        <span>${item.name} - ${item.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                  data-product-id="${item.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                  data-product-id="${item.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                  data-product-id="${item.id}">삭제</button>
        </div>
      `;
}

// !rule : export specific function
export { NewCartItem };
