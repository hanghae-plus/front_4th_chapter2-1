import { ProductListContextProvider } from "./contexts";
import { MainPage } from "./pages";

export function App() {
  return (
    <ProductListContextProvider>
      <MainPage />
    </ProductListContextProvider>
  );
}
