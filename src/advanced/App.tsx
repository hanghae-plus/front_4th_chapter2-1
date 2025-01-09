import { ProductListContextProvider } from "./contexts";
import { MainPage } from "./pages/MainPage";

export function App() {
  return (
    <ProductListContextProvider>
      <MainPage />
    </ProductListContextProvider>
  );
}
