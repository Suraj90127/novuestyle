import React, { useEffect } from "react";
import bannerImage from "../assets/white_help_1296x.jpg"; // Replace with your actual banner image path
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";

const TermCondition = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50">
      <Header />

      {/* Banner Section */}
      <div className="relative mt-[110px] md:mt-[140px]">
        <div className="h-64 md:h-96 w-full overflow-hidden">
          <img
            src={bannerImage}
            alt="Print Kalvin Terms & Conditions"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#5987b8] bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black tracking-wider uppercase">
              TERMS & CONDITIONS
            </h1>
          </div>
        </div>
      </div>
      <div className="md:w-[90%] sm:w-[95%] w-full mx-auto px-4 py-12 md:py-20">
        <Section title="Terms & Conditions – NovueStyle">
          Please read our Refund Policy before placing an order, as these terms
          are based on those conditions.
          <br />
          <br />
          <span className="font-semibold">Order Terms:</span>
          <ul className="list-disc ml-6 mt-2">
            <li>Every product is custom-printed based on your order.</li>
            <li>Once printing starts, orders cannot be cancelled.</li>
            <li>
              Refund is only applicable if a defect is clearly shown in the
              unboxing video.
            </li>
          </ul>
          <br />
          <span className="font-semibold">Return/Refund Terms:</span>
          <ul className="list-disc ml-6 mt-2">
            <li>Unboxing video is mandatory.</li>
            <li>Only manufacturing defects are covered.</li>
            <li>Wrong size selection is the customer's responsibility.</li>
            <li>Shipping charges are non-refundable.</li>
          </ul>
          <br />
          <span className="font-semibold">Usage Terms:</span>
          <ul className="list-disc ml-6 mt-2">
            <li>
              Any misuse of the website, fraudulent orders, or fake claims may
              lead to legal action.
            </li>
            <li>Policies may be updated at any time.</li>
          </ul>
          <p>Placing an order means you accept all Terms & Conditions.</p>
        </Section>
      </div>

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

// Reusable section block
const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl md:text-3xl font-bold text-[#5987b8] mb-3">
      {title}
    </h2>
    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
      {children}
    </p>
  </div>
);

export default TermCondition;
