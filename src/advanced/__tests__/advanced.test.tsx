import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import Main from "../Main";
import { CartProvider } from "advanced/contexts/CartProvider";

describe("장바구니 테스트", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderApp = () =>
    render(
      <CartProvider>
        <Main />
      </CartProvider>
    );

  it("초기 상태: 상품 목록과 DOM 요소가 올바르게 렌더링 되는지 확인", () => {
    const { container } = renderApp();
    // 총액 확인
    const totalElement = container.querySelector("#cart-total");
    expect(totalElement).toHaveTextContent("총액: 0원");
    expect(totalElement).toHaveTextContent("(포인트: 0)");

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveTextContent("상품1 - 10000원");
    expect(options[3]).toBeDisabled(); // 상품4는 품절

    // 재고 상태 확인
    const stockStatus = container.querySelector("#stock-status");
    expect(stockStatus).toHaveTextContent("상품4: 품절");
  });

  it("상품을 장바구니에 추가할 수 있는지 확인", async () => {
    renderApp();

    // 상품1 추가
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "p1" } });

    const addButton = screen.getByRole("button", { name: /추가/i });
    fireEvent.click(addButton);

    // 장바구니에 상품1 추가 확인
    const cartItem = await screen.findByText(/상품1 - 10000원 x 1/i);
    expect(cartItem).toBeInTheDocument();
  });

  it("장바구니에서 상품 수량을 변경할 수 있는지 확인", async () => {
    renderApp();

    // 상품1 추가 후 수량 변경
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "p1" } });
    fireEvent.click(screen.getByRole("button", { name: /추가/i }));

    const increaseButton = await screen.findByRole("button", { name: "+" });
    fireEvent.click(increaseButton);

    const cartItem = screen.getByText(/상품1 - 10000원 x 2/i);
    expect(cartItem).toBeInTheDocument();
  });

  it("장바구니에서 상품을 삭제할 수 있는지 확인", async () => {
    renderApp();

    // 상품 추가
    fireEvent.change(screen.getByRole("combobox", { name: /상품 선택/i }), {
      target: { value: "p1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /추가/i }));

    // 삭제 버튼 클릭
    const deleteButton = await screen.findByRole("button", { name: /삭제/i });
    fireEvent.click(deleteButton);

    // 총액 초기화 확인
    const totalElement = screen.getByText((content, element) => {
      const hasText = (node: Element) =>
        node.textContent === "총액: 0원(포인트: 0)";
      return hasText(element!);
    });

    expect(totalElement).toBeInTheDocument();
  });

  it("총액 및 할인이 올바르게 적용되는지 확인", async () => {
    renderApp();

    // 상품1 10개 추가
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "p1" } });
    const addButton = screen.getByRole("button", { name: /추가/i });
    for (let i = 0; i < 10; i++) fireEvent.click(addButton);

    // 할인 적용 확인
    const total = screen.getByText(/총액: 90000원/i); // 10% 할인 적용
    expect(total).toBeInTheDocument();
    expect(screen.getByText(/\(10.0% 할인 적용\)/i)).toBeInTheDocument();
  });
});
