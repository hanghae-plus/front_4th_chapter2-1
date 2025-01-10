import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, it, describe, vi, expect } from "vitest";
import { products } from "@mocks/handlers";
import { server } from "@mocks/server";
import { CartPage } from "@advanced/pages/cart";
import { CartManagement } from "@advanced/widgets/cart";
import { useCart } from "@advanced/features/cart";
import { useSelect } from "@advanced/shared/model";

vi.mock("@advanced/features/cart", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useCart: vi.fn()
  };
});

vi.mock("@advanced/shared/model", () => ({
  useSelect: vi.fn()
}));

describe("advanced test", () => {
  const mockOnAdd = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(useCart).mockReturnValue({
      cart: [],
      stock: products,
      handleAddCartItem: mockOnAdd,
      handleRemoveCartItem: vi.fn(),
      handleDeleteCartItem: vi.fn()
    });

    vi.mocked(useSelect).mockReturnValue({
      value: "p1",
      onChange: mockOnChange
    });
  });

  it("상품 목록이 올바르게 렌더링되어야 한다", () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json(products);
      })
    );

    render(<CartManagement />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    products.forEach(async (item) => {
      await waitFor(() => {
        const option = screen.getByRole("option", {
          name: `${item.name} - ${item.cost}원`
        });

        expect(option).toBeInTheDocument();

        if (item.quantity === 0) {
          expect(option).toHaveAttribute("disabled");
        }
      });
    });
  });

  it("초기 상태: DOM 요소가 올바르게 생성되었는지 확인", () => {
    render(<CartPage />);

    // h1 태그 확인
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("장바구니");

    // Select 컴포넌트 확인
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // 추가 버튼 확인
    const addButton = screen.getByRole("button", { name: "추가" });
    expect(addButton).toBeInTheDocument();

    // 총액 확인
    const totalAmount = screen.getByText(/총액:/);
    expect(totalAmount).toHaveTextContent("총액: 0원");

    // 총 포인트 확인
    const totalPoint = screen.getByText(/포인트:/);
    expect(totalPoint).toHaveTextContent("(포인트: 0)");
  });

  it("상품을 장바구니에 추가할 수 있는지 확인", () => {
    render(<CartManagement />);

    const addButton = screen.getByRole("button", { name: "추가" });
    fireEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith(products[0]);
  });
});
