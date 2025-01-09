import { productList } from '../../../shared/entity/data/productList';
import ProductOption from '../views/ProductOption';

const updateSelectedOptions = () => {
  const SelectView = document.getElementById('product-select');
  if (!SelectView) return;

  SelectView.innerHTML = '';
  const Options = productList.reduce((template, item) => {
    const OptionView = ProductOption({
      product: item,
    });
    return template + OptionView.view;
  }, '');
  SelectView.innerHTML = Options;
};

export { updateSelectedOptions };
