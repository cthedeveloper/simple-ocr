import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home"; // Your OCR component
import About from "./pages/About"; // An example about page
import Settings from "./pages/Settings"; // An example settings page

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Wrapping all routes inside Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
