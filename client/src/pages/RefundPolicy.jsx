import React, { useEffect } from "react";
import policyBanner from "../assets/white_help_1296x.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* Hero Banner */}
      <div className="mt-[100px] md:mt-[140px] relative">
        <div className="h-48 md:h-64 w-full overflow-hidden">
          <img
            src={policyBanner}
            alt="Print Kalvin Policies"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          {/* <h1 className="text-2xl md:text-4xl font-bold text-white">Our Policies</h1> */}
        </div>
      </div>

      {/* Policy Container */}
      <div className=" mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Shipping Policy */}
        {/* <section className="mb-12 bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Shipping Policy
          </h2>
          <ul className="space-y-5">
            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Shipping Time</h3>
                <p className="text-gray-600">
                  Orders are usually delivered within 5-7 business days. Personalized items take longer to process. 
                  Mixed orders (personalized + non-personalized) will be split and shipped separately.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Shipping Charges</h3>
                <p className="text-gray-600">
                  Flat rate of ₹70 for all India orders. International shipping charges apply and vary by destination.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Order Tracking</h3>
                <p className="text-gray-600">
                  Tracking details will be sent via WhatsApp, email, and SMS once your order ships.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Customs & Duties</h3>
                <p className="text-gray-600">
                  International customers are responsible for all customs duties, taxes, and fees imposed by their country.
                </p>
              </div>
            </li>
          </ul>
        </section> */}

        {/* Return Policy */}
        {/* <section className="mb-12 bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Return Policy
          </h2>
          <ul className="space-y-5">
            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">General Returns</h3>
                <p className="text-gray-600">
                  7-day return policy for unused, unworn items. Personalized items (jewelry, coins, utensils, idols) are final sale unless defective.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Return Process</h3>
                <p className="text-gray-600">
                  Contact customer support to initiate returns. You must pack items securely (as received) and create a packing video. Original shipping fees are non-refundable.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">International Orders</h3>
                <p className="text-gray-600">
                  Orders shipped outside India cannot be returned or exchanged.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Missing Items</h3>
                <p className="text-gray-600">
                  Report missing items within 48 hours of delivery with a 360° unboxing video. Claims without proper evidence may not be honored.
                </p>
              </div>
            </li>
          </ul>
        </section> */}

        {/* Refund Policy */}
        {/* <section className="mb-12 bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Refund Policy
          </h2>
          <ul className="space-y-5">
            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Processing Time</h3>
                <p className="text-gray-600">
                  Approved refunds are processed within 7-10 business days to your original payment method.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Refund Initiation</h3>
                <p className="text-gray-600">
                  Refunds begin 48 hours after we receive returned items at our warehouse.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="bg-blue-100 text-[#5987b8] rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Exchanges</h3>
                <p className="text-gray-600">
                  Exchanges follow the same process as returns. Replacement items ship only after we receive the original return.
                </p>
              </div>
            </li>
          </ul>
        </section> */}

        {/* Contact Information */}
        {/* <section className="bg-blue-50 p-6 md:p-8 rounded-lg">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Print Kalvin</strong></p>
            <p>Sadar Bazar, Ajmer Road</p>
            <p>Degana JN. 341503, Nagaur Rajasthan</p>
            <p className="mt-3">
              <strong>Phone:</strong> 9660246464, 7976642865
            </p>
            <p>
              <strong>Email:</strong> support@printkalvin.com
            </p>
          </div>
        </section> */}

        <Section title="Cancellation & Refund Policy – NovueStyle">
          All our products are custom-printed based on your order, so
          cancellations or refunds are not allowed in normal cases.
          <br />
          <br />
          However, you may request a refund if any of the following issues
          occur:
          <ul className="list-disc ml-6 mt-2">
            <li>Fabric is damaged</li>
            <li>Print quality is defective</li>
            <li>Wrong product received</li>
          </ul>
          <br />
          Then you must record a complete unboxing video from the moment you cut
          the parcel until the product is fully shown.
          <br />
          <br />
          If the defect is clearly visible in the video, you may request a
          same-day refund.
          <br />
          <br />
          <span className="font-semibold">Important Conditions:</span>
          <ul className="list-disc ml-6 mt-2">
            <li>
              Refund/return will not be accepted without an unboxing video.
            </li>
            <li>
              Color differences due to screen lighting are not considered
              defects.
            </li>
            <li>
              Since every item is custom printed, the fabric and design
              selection is the customer’s responsibility.
            </li>
            <li>
              In case of an approved refund, shipping charges must be paid by
              the customer.
            </li>
            <li>Refunds are not available for any other reason.</li>
          </ul>
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

export default RefundPolicy;
