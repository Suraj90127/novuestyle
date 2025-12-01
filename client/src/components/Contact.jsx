import React, { useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";

const Contact = () => {
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

          {/* ------------------- 2. Contact Us Policy ------------------- */}
          <Section title="Contact Us – NovueStyle">
            For order updates, shipping queries, or general support, you can
            contact us through the details below:
            <ul className="list-disc ml-6 mt-2">
              <li>
                Email: <span className="font-medium">novuestyle@gmail.com</span>
              </li>
              <li>
                WhatsApp: <span className="font-medium">8368704837</span>
              </li>
            </ul>
            <br />
            <span className="font-semibold">Support Hours:</span>
            <br />
            Monday – Saturday: 10 AM to 7 PM
            <br />
            Response time: usually within 12–24 hours.
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

export default Contact;
