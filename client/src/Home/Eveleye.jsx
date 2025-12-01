import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getheadingfirst } from "../store/reducers/homeReducer";
import gif1 from "../assets/gif/hoodie1.gif";
import gif2 from "../assets/gif/hoodie2.gif";
import gif3 from "../assets/gif/hoodie3.gif";
import gif4 from "../assets/gif/hoodie4.gif";
import gif5 from "../assets/gif/hoodie5.gif";
import { userDetail } from "../store/reducers/authReducer";

const Eveleye = ({ openLoginModal }) => {
  const dispatch = useDispatch();
  const { categorys, firstheading } = useSelector((state) => state.home);

  const data = [
    {
      img: gif1,
      sname: "Hoodies",
      sslug: "hoodies",
    },
    {
      img: gif5,
      sname: "T-Shirts",
      sslug: "t-shirts",
    },
    {
      img: gif2,
      sname: "Jackets",
      sslug: "jackets",
    },
    {
      img: gif4,
      sname: "Jeans",
      sslug: "jeans",
    },
  ];

  useEffect(() => {
    dispatch(userDetail())
    dispatch(getheadingfirst());
  }, [dispatch]);

  const ProductRow = () => (
    <>
      {/* For small and medium screens → horizontal scroll */}
      <div className="block lg:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max px-1">
          {data.map((product, index) => (
            <div
              key={index}
              className="bg-white flex-shrink-0 w-[208px] md:w-[180px] rounded-lg overflow-hidden"
            >
              <div className="w-full h-[264px] md:h-[150px] relative">
                <Link
                  to={`/product-customizer?productName=${product.sname}&baseImageUrl=${product.img}`}
                >
                  <img
                    src={product.img}
                    alt={product.sname}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              <h3 className="text-xs md:text-sm text-center text-gray-400 py-2 line-clamp-2">
                {product.sname}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* For large screens → grid view */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {data.map((product, index) => (
          <div
            key={index}
            className="bg-white group relative overflow-hidden rounded-lg"
          >
            <div className="w-full h-full overflow-hidden relative">
              <Link
                to={`/product-customizer?productName=${product.sname}&baseImageUrl=${product.img}`}
              >
                <img
                  src={product.img}
                  alt={product.sname}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <h3 className="text-base text-center text-gray-400 line-clamp-2 py-2">
              {product.sname}
            </h3>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="w-[100%] md:w-[93%] mx-auto px-2 py-1">
      <div className="text-center mb-3 md:mb-8">
        <h1 className="text-2xl md:text-2xl font-medium text-heading ]">
          Print Your Choice
        </h1>
      </div>
      <ProductRow />
    </div>
  );
};

export default Eveleye;
