import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VehicleDetail from "./pages/VehicleDetails";
import { ThemeProvider } from "./components/theme-provider";
import MyVehicles from "./pages/MyVehicles";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Navbar></Navbar>
          <Routes>
            {/* Public only — logged in users get redirected to / */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Public for all */}
            <Route path="/" element={<Home />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />

            {/* Private — guests get redirected to /login */}
            <Route
              path="/add-vehicle"
              element={
                <PrivateRoute>
                  <AddVehicle />
                </PrivateRoute>
              }
            />
            <Route
              path="/vehicles/:id/edit"
              element={
                <PrivateRoute>
                  <EditVehicle />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-vehicles"
              element={
                <PrivateRoute>
                  <MyVehicles />
                </PrivateRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
