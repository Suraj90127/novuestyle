import React from "react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Section } from "lucide-react";

const Footer = () => {
  const { categorys } = useSelector((state) => state.home);

  // console.log("categorys on footer", categorys);

  return (
    <footer className="bg-[#5987b8] text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-5">Categories</h3>
          <ul className="space-y-3">
            {categorys && categorys.length > 0 ? (
              categorys.map((cat, i) => (
                <li key={i}>
                  <Link
                    to={`/products/search?value=${encodeURIComponent(
                      cat.slug
                    )}`}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">No categories found</li>
            )}
          </ul>
        </div>

        {/* Need Help */}
        <div>
          <h3 className="font-semibold text-lg mb-5">Need Help</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <Link to="/privacy" className="hover:text-white">
                Track Your Order
              </Link>
            </li>
            {/* <li>
              <Link to="/privacy" className="hover:text-white">
                Returns & Exchanges
              </Link>
            </li> */}
            <li>
              <a
                href="https://wa.me/918368704837"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-lg mb-5">Company</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <Link to="/shipping-policy" className="hover:text-white">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/term-condition" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-white">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="font-semibold text-lg mb-5">Get in touch</h3>
          <div title="">
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
          </div>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5987b8] hover:bg-gray-200 transition"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5987b8] hover:bg-gray-200 transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5987b8] hover:bg-gray-200 transition"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 text-center py-5">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} MAXIFY SOLUTION. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
