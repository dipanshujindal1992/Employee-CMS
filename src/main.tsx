import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

import { setupInterceptors } from "./api/api";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);

setupInterceptors(store);
