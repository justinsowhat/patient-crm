import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./shared/components/contexts/authContext";
import { AppRoutes } from "./AppRoutes";
import { queryCache } from "./reactQuery";
import { QueryClientProvider } from "react-query";

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <QueryClientProvider client={queryCache}>
          <AppRoutes />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
