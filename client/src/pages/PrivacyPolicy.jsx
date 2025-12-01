import React, { useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f9fafc] text-[#111827] font-sans">
      <Header />

      <div className="mt-[140px]">
        {/* Banner */}
        <div className="relative">
          <img
            src="https://i.ibb.co/FLdz9SxX/KELVINBAN7.jpg"
            alt="Privacy Banner"
            className="w-full h-auto object-cover max-h-[500px]"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white px-4 text-center">
              Privacy <span className="text-[#5987b8]">Policy</span>
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-[90%] sm:w-[95%] w-full mx-auto px-4 py-12 md:py-20">
          <p className="text-base md:text-lg text-gray-700 mb-6">
            Thank you for visiting{" "}
            <span className="font-semibold">NovueStyle</span>. We value your
            trust and are committed to providing transparency regarding our
            policies. Below you will find our complete Privacy, Refund,
            Cancellation, Contact, Terms, and Shipping policies.
          </p>

          {/* ------------------- 3. Privacy Policy ------------------- */}
          <Section title="Privacy Policy">
            Your privacy is extremely important to us. We do not sell, share, or
            misuse your personal data.
            <br />
            <br />
            <span className="font-semibold">Information We Collect:</span>
            <ul className="list-disc ml-6 mt-2">
              <li>Name</li>
              <li>Mobile Number</li>
              <li>Address</li>
              <li>Email</li>
              <li>Order Details</li>
            </ul>
            <br />
            <span className="font-semibold">
              Why We Collect This Information:
            </span>
            <ul className="list-disc ml-6 mt-2">
              <li>To process and deliver your order</li>
              <li>To send shipping and status updates</li>
              <li>To provide customer support</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
            <br />
            <span className="font-semibold">Data Security:</span>
            <br />
            Your information is stored on encrypted servers. We **never** ask
            for OTP, UPI PIN, card CVV, or any sensitive banking details.
          </Section>
        </div>
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

export default PrivacyPolicy;
