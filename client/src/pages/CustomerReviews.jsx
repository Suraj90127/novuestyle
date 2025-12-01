import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoOptionsSharp } from "react-icons/io5";

import img1 from "../assets/wOaxXHwCr.webp";
import img2 from "../assets/rqDjsEnl.webp";
import img3 from "../assets/rqDjsEnl.webp";
import img4 from "../assets/wOaxXHwCr.webp";
import MobileFooter from "../components/MobileFooter";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([
    {
      name: "Reema L.",
      date: "10/23/2024",
      rating: 5,
      comment:
        "Absolutely loved the 'Stay Bold' T-shirt! The fabric is soft and the print quality is amazing.",
      productName: "Stay Bold - Minimalist Typography T-Shirt",
      image: img1,
    },
    {
      name: "Reena L.",
      date: "10/23/2024",
      rating: 5,
      comment:
        "Great fit and amazing feel. This 'Hustle Hard' tee is now my daily go-to!",
      productName: "Hustle Hard - Classic Black Graphic Tee",
      image: img2,
    },
    {
      name: "Pawan C.",
      date: "10/23/2024",
      rating: 5,
      comment:
        "Print Kalvin nailed it! Loved the Hanuman graphic tee. Print is sharp and looks just like the photo.",
      productName: "Hanuman Strength - Spiritual Oversized T-Shirt",
      image: img3,
    },
    {
      name: "Sushma R.",
      date: "10/22/2024",
      rating: 5,
      comment:
        "T-shirt quality is so good, and delivery was super fast. Highly recommend!",
      productName: "Positive Vibes Only - White Comfort Fit Tee",
      image: img4,
    },
    {
      name: "Basanti R.",
      date: "10/21/2024",
      rating: 5,
      comment:
        "My son loved the ‘Tiny Rebel’ tee I got from Print Kalvin. Thank you!",
      productName: "Tiny Rebel - Kids' Street Style Tee",
      image: img3,
    },
    {
      name: "Meena K.",
      date: "10/21/2024",
      rating: 5,
      comment:
        "The designs are super trendy and the delivery experience was great!",
      productName: "Dream Big - Women's Cotton Round Neck T-Shirt",
      image: img2,
    },
    {
      name: "Sweta S.",
      date: "9/13/2024",
      rating: 5,
      comment:
        "Very impressed with the quality. The color hasn’t faded even after multiple washes.",
      productName: "Wave Rider - Navy Blue Casual Tee",
      image: img1,
    },
    {
      name: "Rahul K.",
      date: "10/1/2024",
      rating: 3,
      comment:
        "T-shirt print started fading after a few washes. Expected better quality.",
      productName: "Classic Chill - Printed Cotton T-Shirt",
      image: img1,
    },
  ]);

  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleSort = (order) => {
    const sortedReviews = [...reviews].sort((a, b) =>
      order === "low" ? a.rating - b.rating : b.rating - a.rating
    );
    setReviews(sortedReviews);
    setShowSortOptions(false);
  };

  return (
    <div className="bg-[#ecf1f2]">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 mt-[150px] md:mt-[180px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="text-yellow-500 text-2xl mr-2">★★★★★</div>
            <span className="text-lg font-semibold">178 Reviews</span>
          </div>
          <div className="relative">
            <IoOptionsSharp
              size={24}
              className="cursor-pointer"
              onClick={() => setShowSortOptions(!showSortOptions)}
            />
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleSort("low")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Low Rating
                </button>
                <button
                  onClick={() => handleSort("high")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  High Rating
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {reviews.map((review, index) => (
            <div key={index} className="border border-gray-300 bg-white">
              <img
                src={review.image}
                alt={review.productName}
                className="mb-3 w-full h-56 object-cover"
              />
              <h3 className="text-base font-semibold mb-1 px-2">
                {review.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1 px-2">{review.date}</p>
              <div className="text-yellow-500 mb-2 px-2">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              <p className="text-sm mb-2 px-2">{review.comment}</p>
              <p className="text-xs text-gray-500 px-2">{review.productName}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default CustomerReviews;
