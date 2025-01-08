import { Product } from '../../../shared/entity/model/Product';

const ProductOption = ({
  product,
  onChange = () => {},
}: {
  product: Product;
  onChange?: () => void;
}) => {
  return {
    view: `
    <option ${product.quantity === 0 ? 'disabled' : null} value="${
      product.id
    }">${product.name} - ${product.price}원</option>
  `,
    events: [
      {
        selector: 'option',
        type: 'change',
        event: onChange,
      },
    ],
  };
};

export default ProductOption;
