import React, { useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";

const SippingPolicy = () => {
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
              Shipping <span className="text-[#5987b8]">Policy</span>
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

          {/* ------------------- 5. Shipping Policy ------------------- */}
          <Section title="Shipping Policy – NovueStyle">
            We deliver to most major cities across India.
            <br />
            <br />
            <span className="font-semibold">Order Processing:</span>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Your product is prepared within 2 days after placing the order.
              </li>
              <li>Orders are shipped on the 3rd day.</li>
            </ul>
            <br />
            <span className="font-semibold">Delivery Time:</span>
            <ul className="list-disc ml-6 mt-2">
              <li>Estimated delivery: 4–5 working days</li>
              <li>Remote areas may take extra time.</li>
            </ul>
            <br />
            <br />
            <span className="font-semibold">Shipping Partners:</span>
            We deliver through trusted courier partners such as:
            <br />
            <p>Delhivery, Bluedart, Xpressbees, DTDC, Shadowfax, and others.</p>
            <br />
            <span className="font-semibold">Important:</span>
            <ul className="list-disc ml-6 mt-2">
              <li>
                If the wrong address is provided, the parcel may be returned —
                this is the customer's responsibility.
              </li>
              <li>COD charges (if applicable) are non-refundable</li>
            </ul>
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

export default SippingPolicy;
