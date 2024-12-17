import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./authContext";  // Import AuthProvider
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./Login";

function App() {
  const { user } = useAuth();

  return (
    <div className="App flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full mx-auto p-5">
        {user ? (
          <>
            <div className="mb-4">
              <FileUpload />
            </div>
          </>
        ) : (
          <Login />
        )}
      </main>
      <Footer />
    </div>
  );
}

const WrappedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default WrappedApp;


