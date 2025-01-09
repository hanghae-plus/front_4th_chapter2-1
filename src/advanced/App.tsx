import {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useState,
} from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const App = () => {
  const [productList, setProductList] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ]);

  const [selectedProductList, setSelectedProductList] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(productList[0].id);

  const handleClickAddItem = () => {
    setProductList((prev) =>
      prev.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      }),
    );

    setSelectedProductList((prev) => {
      const selectedProduct = productList.find((product) => product.id === selectedProductId);
      if (!selectedProduct) return prev;
      const existingProduct = prev.find((product) => product.id === selectedProductId);
      if (existingProduct) {
        return prev.map((product) => {
          if (product.id === selectedProductId) {
            return { ...product, quantity: product.quantity + 1 };
          }
          return product;
        });
      }

      return [...prev, { ...selectedProduct, quantity: 1 }];
    });
  };

  const handleClickRemoveItem = () => {
    setProductList((prev) => {
      const selectedProduct = selectedProductList.find(
        (product) => product.id === selectedProductId,
      );
      if (!selectedProduct) return prev;
      return prev.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity + selectedProduct.quantity };
        }
        return product;
      });
    });

    setSelectedProductList((prev) => prev.filter((product) => product.id !== selectedProductId));
  };

  const handleClickIncreaseQuantity = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const productId = e.currentTarget.dataset.productId;
    if (productList.find((product) => product.id === productId)?.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }
    setProductList((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      }),
    );
    setSelectedProductList((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      }),
    );
  };
  const handleClickDecreaseQuantity = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const productId = e.currentTarget.dataset.productId;
    setProductList((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      }),
    );
    setSelectedProductList((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      }),
    );
    setSelectedProductList((prev) => prev.filter((product) => product.quantity > 0));
  };

  const handleChangeProduct = (e: ChangeEvent<HTMLSelectElement>) => setSelectedProductId(e.target.value);

  const calculateCartTotal = () => {
    const subTotal = selectedProductList.reduce((prev, cur) => prev + (cur.price * cur.quantity), 0);
    let totalAmount = selectedProductList.map((product) => {
      const total = product.price * product.quantity;
      let discount = 0;
      if(product.quantity >= 10) {
        if(product.id === 'p1') {
          discount = 0.1;
        } else if(product.id === 'p2') {
          discount = 0.15;
        } else if(product.id === 'p3') {
          discount = 0.2;
        } else if(product.id === 'p4') {
          discount = 0.05;
        } else if(product.id === 'p5') {
          discount = 0.25;
        }
      }
      return total * (1 - discount);
    }).reduce((prev, cur) => prev + cur, 0);


    let discountRate = 0;

    if(selectedProductList.reduce((prev, cur) => prev + cur.quantity, 0) >= 30) {
      const bulkDiscount = totalAmount * 0.25;
      const itemDiscount = subTotal - totalAmount;
      if(bulkDiscount > itemDiscount) {
        discountRate = 0.25;
      } else {
        discountRate = (subTotal - totalAmount) / subTotal;
      }
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }

    if(new Date().getDay() === 2) {
      totalAmount *= (1 - 0.1);
      discountRate = Math.max(discountRate, 0.1);
    }
    return { totalAmount, discountRate };
  };



  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        let luckyProduct = productList[Math.floor(Math.random() * productList.length)];
        if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
          alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
          setProductList((prev) => prev.map((product) => {
            if (product.id === luckyProduct.id) {
              return { ...product, price: product.price * (1 - 0.2) };
            }
            return product;
          }));

          setSelectedProductList((prev) => prev.map((product) => {
            if (product.id === luckyProduct.id) {
              return { ...product, price: product.price * (1 - 0.2) };
            }
            return product;
          }));
        }
      }, 30000);
    }, Math.random() * 10000);

    setTimeout(() => {
      setInterval(() => {
        const suggestedProduct = productList.find((product) => product.id !== selectedProductId && product.quantity > 0);
        if(suggestedProduct) {
          alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          setProductList((prev) => prev.map((product) => {
            if (product.id === suggestedProduct.id) {
              return { ...product, price: product.price * (1 - 0.05) };
            }
            return product;
          }));
          setSelectedProductList((prev) => prev.map((product) => {
            if (product.id === suggestedProduct.id) {
              return { ...product, price: product.price * (1 - 0.05) };
            }
            return product;
          }));
        }
      }, 60000);
    }, Math.random() * 20000);
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <div
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {selectedProductList.map((product) => (
            <div key={product.id} id={product.id} className="flex justify-between items-center mb-2">
              <span>
                {product.name} - {product.price}원 x {product.quantity}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={product.id}
                  data-change="-1"
                  onClick={handleClickDecreaseQuantity}
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={product.id}
                  data-change="1"
                  onClick={handleClickIncreaseQuantity}
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  data-product-id={product.id}
                  onClick={handleClickRemoveItem}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {selectedProductList.reduce((prev, cur) => prev + (cur.price * cur.quantity), 0)}원
          {calculateCartTotal().discountRate > 0 && (
            <span
              className="text-green-500 ml-2">({(calculateCartTotal().discountRate * 100).toFixed(1)}% 할인 적용)</span>
          )}
          <span id="loyalty-points" className="text-blue-500 ml-2">
            (포인트: {selectedProductList.reduce((prev, cur) => prev + (cur.price * cur.quantity), 0) / 1000})
          </span>
        </div>
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          value={selectedProductId}
          onChange={handleChangeProduct}
        >
          {productList.map((product) => (
            <option key={product.id} value={product.id} disabled={product.quantity === 0}>
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleClickAddItem}
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {productList
            .filter((product) => product.quantity === 0 || product.quantity < 5)
            .map((product) => {
              const message =
                product.quantity === 0 ? '품절' : `재고 부족 (${product.quantity}개 남음)`;
              return `${product.name}: ${message}`;
            })
            .join(' ')}
        </div>
      </div>
    </div>
  );
};

export default App;
