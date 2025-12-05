import React from "react";
import Header from "../sections/includes/Header";
import Footer from "../sections/includes/Footer";
import HomeJobList from "../Home/HomeJobList";

const Home = () => {
  return (
    <>
      <Header />

      <div className="content-container p-6">
        <h2 className="text-2xl font-bold mb-6">Latest Jobs</h2>

        {/* New job listing component */}
        <HomeJobList />
      </div>

      <Footer />
    </>
  );
};

export default Home;
