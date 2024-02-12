import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./shared/components/contexts/authContext";
import { AppRoutes } from "./AppRoutes";
import { queryCache } from "./reactQuery";
import { QueryClientProvider } from "react-query";
import { EditProvider } from "./shared";

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <QueryClientProvider client={queryCache}>
          <EditProvider>
            <AppRoutes />
          </EditProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
