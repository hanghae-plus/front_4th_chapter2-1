import { describe } from "vitest";
import React from "react";
import ReactDOM from "react-dom/client";
import { ProductListContextProvider } from "../contexts";
import { MainPage } from "../pages";

describe("advanced test", () => {
  it("App이 정상적으로 렌더링 되는지 확인", () => {
    const rootElement = document.createElement("div");
    rootElement.setAttribute("id", "app");
    document.body.appendChild(rootElement);

    expect(() => {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(ProductListContextProvider, null, React.createElement(MainPage)));
    }).not.toThrow();
  });
});
