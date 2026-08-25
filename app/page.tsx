"use client";

import Categories from "@/components/categories";
import FeaturedProducers from "@/components/featured-producers";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import NewsLetter from "@/components/news-letter";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Categories />
      <FeaturedProducers />
      <NewsLetter />
      <Footer />
    </>
  );
}

export default Home;