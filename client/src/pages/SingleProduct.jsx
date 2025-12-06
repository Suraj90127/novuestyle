import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import image2 from "../assets/Frame_48097704_1.jpg";
import MayLike from "../components/MayLike";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  get_category,
  get_product,
  getDiscount,
  getShipping,
} from "../store/reducers/homeReducer";

import {get_coupons } from "../store/reducers/couponReducer";
import LoginModal from "../Authentication/Login";
import RegisterModal from "../Authentication/Register";
import ForgetModal from "../Authentication/ForgetPassword";
import Reviews from "../components/Reviews";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";
import { Share, Share2, Star } from "lucide-react";
import { sendMetaEventSafe } from "../utils/sendMetaEvent";
import Cookies from "js-cookie";

export default function Component() {
  const { product,shipping } = useSelector(
    (state) => state.home
  );

  
  const { coupons, loader } = useSelector((state) => state.coupon);
  const { userInfo } = useSelector((state) => state.auth);
  const shippingFee = shipping?.shipping?.shipping_fee;
  const [openAccordion, setOpenAccordion] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const swiperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(null);
  const [quantity] = useState(1);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setForgetModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(
    product?.size?.[0] || "medium"
  );
    const [cartCount, setCartCount] = useState(0);
  // const [ setCurrentSlideIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    backgroundImage: `url(${mainImage})`,
    backgroundRepeat: "no-repeat",
  });
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    mouseX: 0,
    mouseY: 0,
  });

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedColor(product.images[0].color);
      setMainImage(product.images[0].url);
    }
    if (product?.size?.length > 0) {
      setSelectedSize(product.size[0]);
    }
    window.scrollTo(0, 0);
  }, [product]);

  // Get current color image
  const getCurrentColorImage = () => {
    if (!product?.images) return "";
    const colorImage = product.images.find(
      (img) => img.color === selectedColor
    );
    return colorImage ? colorImage.url : product.images[0]?.url || "";
  };

  // Get all thumbnails for the selected color
  const getColorThumbnails = () => {
    // Get images for the selected color
    const colorImages =
      product?.images?.filter((img) => img.color === selectedColor) || [];
    const thumbnails = colorImages.map((img) => img.url);

    // If no images found for selected color, use the first color's images
    if (thumbnails.length === 0 && product?.images?.length > 0) {
      const firstColor = product.images[0].color;
      const firstColorImages = product.images.filter(
        (img) => img.color === firstColor
      );
      return firstColorImages.map((img) => img.url);
    }

    return thumbnails;
  };
  const discountData = Array.isArray(coupons) ? coupons : [];


  const { slug, sslug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const currentSlug = slug || sslug;
    if (currentSlug) {
      dispatch(get_product(currentSlug));
    }
  }, [dispatch, slug, sslug]);

  useEffect(() => {
    dispatch(get_coupons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDiscount());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getShipping());
  }, [dispatch]);


const CART_KEY = "guestCart";

const makeSafeProduct = (product) => ({
  _id: product._id,
  name: product.name,
  slug: product.slug,
  price: product.price,
  discount: product.discount,
  stock: product.stock,
  sellerId: product.sellerId,
  shopName: product.shopName,
  category: product.category,
  subCategory: product.subCategory,
  gender: product.gender,
  design: product.design,
  fabric: product.fabric,
  section: product.section,
  rating: product.rating,

  // sirf required image data
  images: Array.isArray(product.images)
    ? product.images.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      }))
    : [],

  // size array safe hai
  size: product.size,
});


const add_card = async (id, product) => {
  // console.log("PRO:", product);

  const productId = product?._id || id;
  const color = selectedColor || "Default";
  const size = selectedSize || "Default";

  const price = product?.price
    ? product.price - Math.floor((product.price * product.discount) / 100)
    : 0;

  // Tracking
  try {
    await sendMetaEventSafe({
      eventType: "AddToCart",
      price,
      order: null,
      products: [
        {
          productInfo: {
            _id: productId,
            price: product.price,
          },
          quantity: 1,
        },
      ],
      userInfo: userInfo || {},
    });
  } catch (e) {
    console.log("META SAFE ERROR:", e?.message);
  }

  try {
    let existing = [];
    try {
      const raw = Cookies.get(CART_KEY);
      existing = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const index = existing.findIndex(
      (item) =>
        String(item.productId) === String(productId) &&
        item.color === color &&
        item.size === size
    );

    const safeProduct = makeSafeProduct(product);

    if (index >= 0) {
      existing[index].quantity = (existing[index].quantity || 1) + 1;
    } else {
      existing.push({
        productId,
        quantity: 1,
        color,
        size,
        price,           // discounted price
        product: safeProduct,   // 🔥 safe, light object
        name: product.name,
        slug: product.slug,
        image: mainImage?mainImage: product.images?.[0]?.url,
      });
    }

    Cookies.set(CART_KEY, JSON.stringify(existing), { expires: 7 });

    // optional cart badge
    if (typeof setCartCount === "function") {
      const total = existing.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setCartCount(total);
    }

    console.log("UPDATED CART:", existing);
    toast.success("Added to cart");
  } catch (e) {
    console.log("guest cart cookie error:", e);
    toast.error("Something went wrong");
  }
};

  const thumbnails = getColorThumbnails();
  

  // Initialize main image on first load and color change
  useEffect(() => {
    const currentImages = getColorThumbnails();
    if (currentImages.length > 0 && !mainImage) {
      setMainImage(currentImages[0]);
    }
  }, [selectedColor]);

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setCurrentSlideIndex(swiper.activeIndex);
    setMainImage(thumbnails[swiper.activeIndex]);
  };

  // Handle color selection
   const handleColorSelect = (imgObj,i) => {
    console.log("ooo", imgObj);
    console.log("i", i);
    
    setSelectedColor(imgObj.color);
    index(i)
    setMainImage(imgObj.url);

    // Reset to first slide of the new color
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0);
      setCurrentSlideIndex(0); // This will work now
    }
  };
  


  useEffect(() => {
    if (mainImage) {
      const img = new Image();
      img.src = mainImage;
      img.onload = () => {
        setImageLoading(false);
      };
    }
  }, [mainImage]);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);
  const openForgetModal = () => setForgetModalOpen(true);
  const openRegisterModal = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setRegisterModalOpen(false);
  const closeForgetModal = () => setForgetModalOpen(false);

  const buy = (id, product) => {

    // console.log("PRO 2222:", product);

    const productId = product?._id || id;
  const color = selectedColor || "Default";
  const size = selectedSize || "Default";

    if (!userInfo) {
      openLoginModal();
      return;
    }

    let price = 0;
    if (product.discount !== 0) {
      price =
        product.price - Math.floor((product.price * product.discount) / 100);
    } else {
      price = product.price;
    }

    const safeProduct = makeSafeProduct(product);


    const obj1 = [
      {
        productId,
        quantity: 1,
        color,
        size,
        price,           // discounted price
        product: safeProduct,   // 🔥 safe, light object
        name: product.name,
        slug: product.slug,
         image: mainImage?mainImage: product.images?.[0]?.url,
      }
    ]
    navigate("/checkout", {
      state: {
        products: obj1,
        price: price * quantity,
        shipping_fee: shippingFee,
        items: 1,
      },
    });
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="bg-white">
      <Header cartCount={cartCount} setCartCount={setCartCount} />
      <div className="flex flex-col md:flex-row gap-6 md:w-[80%] mx-auto md:mt-[100px] mt-[90px] md:h-[90vh] overflow-hidden">
        {/* LEFT SECTION (Sticky Images) */}
        <style>
          {`
          .swiper-button-next, .swiper-button-prev {
            width: 44px !important;
            height: 44px !important;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s, opacity 0.2s;
            color: #333 !important;
            opacity: 0.85;
          }
          .swiper-button-next:hover, .swiper-button-prev:hover {
            background-color: #f0f0f0;
            opacity: 1;
          }
          .swiper-button-next::after, .swiper-button-prev::after {
            font-size: 18px !important;
            font-weight: bold;
          }
          .swiper-button-prev {
            left: 10px !important;
          }
          .swiper-button-next {
            right: 10px !important;
          }
          @media (min-width: 768px) {
             .swiper-button-prev {
                left: 20px !important;
              }
              .swiper-button-next {
                right: 20px !important;
              }
          }
          
          .swiper-pagination {
            position: relative !important;
            bottom: -25px !important;
            padding-top: 15px;
          }
          .swiper-pagination-bullet-active {
            background: #000 !important;
          }
        `}
        </style>

        {/* LEFT SECTION (Sticky Image Slider) */}
        <div className="w-full md:w-[45%] p-2 md:pr-8 md:sticky md:top-[100px] h-fit self-start">
          {/* Swiper Main Image Slider */}
          <Swiper
            ref={swiperRef}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation, Thumbs]}
            className="border border-gray-200"
            onSlideChange={handleSlideChange}
          >
            {thumbnails.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative overflow-hidden">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                  )}
                  <img
                    src={src}
                    alt={`Product image ${index + 1}`}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"
                      }`}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* RIGHT SECTION (Product Info) */}
        <div className="hide-scrollbar md:w-[55%] w-full p-2 bg-white relative overflow-y-auto md:h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-20 md:pb-2">
          {" "}
          {/* Added padding bottom for mobile */}
          {/* Title */}
          <div className=" flex justify-between items-center mb-2">
            <h1 className="text-2xl text-gray-900">{product?.name}</h1>
            <span>
              <Share2 className="text-gray-500" />
            </span>
          </div>
          {/* PRICE SECTION */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-semibold text-gray-900">
                ₹
                {product?.price
                  ? product.price -
                  Math.floor((product.price * product.discount) / 100)
                  : 0}
              </span>
              {product?.discount > 0 && (
                <span className="text-green-600 text-lg font-semibold">
                  ₹{Math.floor((product.price * product.discount) / 100)} OFF
                </span>
              )}
            </div>
            <div className=" flex justify-between items-center mb-2">
              <p className="text-gray-600 text-sm">
                MRP:{" "}
                <span className="line-through text-gray-400">
                  ₹{product?.price}
                </span>{" "}
                Inclusive of all Taxes
              </p>
              <span className="text-sm flex items-center gap-1">
                <Star className="h-[13px] text-yellow-500" />{" "}
                {product?.rating || 0} ({product?.reviewsCount || 0})
              </span>
            </div>
            <p className="text-[#5987b8] text-sm mt-1">
              Lowest price in last 30 days
            </p>
          </div>
          {/* COUPONS / OFFERS */}
          <div className="my-4">
            <h2 className="text-sm font-semibold mb-2">
              Save extra with these offers
            </h2>
            <div className="w-full mx-auto py-2">
              {discountData && discountData.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={3}
                  loop={true}
                  autoplay={{ delay: 3000 }}
                  className=""
                  breakpoints={{
                    100: { slidesPerView: 1.2 },
                    768: { slidesPerView: 1.6 },
                    1024: { slidesPerView: 2 },
                  }}
                >
                  {discountData.slice(0, 3).map((item, index) => (
                    <SwiperSlide key={index}>
                      <div className="border border-gray-200 rounded-md bg-gradient-to-b from-[#f9f3df] to-[white] p-3 text-[12px] shadow-sm hover:shadow-md transition">
                        {/* Price and Discount Info */}
                        <div className="flex items-center mb-1">
                          <span className="text-yellow-600 mr-1">⚙️</span>
                          <span className="text-green-700 font-semibold">
                            Get it for as low as ₹
                            {item.price - (item.price * item.discount) / 100}
                          </span>
                          <span className="line-through text-gray-500 ml-1">
                            ₹{item.price}
                          </span>
                        </div>

                        {/* Coupon Details */}
                        <div className="text-gray-800 mb-2">
                          <span className="font-semibold text-[#b45309]">
                            {item.name} Offer
                          </span>{" "}
                          <span>
                            Save {item.discount}% — Limited to {item.userlimit}{" "}
                            users!
                          </span>
                        </div>

                        {/* Footer Section */}
                        <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            Code:{" "}
                            <span className="text-[#b45309]">{item.name}</span>
                          </span>
                          <button
                            onClick={handleCopy}
                            className="text-gray-600 underline hover:text-green-700"
                          >
                            {copied ? "Copied!" : "Copy Code"}
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className="text-gray-500 text-sm">No discounts available.</p>
              )}
            </div>
          </div>
          {/* COUNTDOWN BAR */}
          <div className="bg-green-100 text-green-700 text-center text-sm py-2 mb-5 font-medium">
            Sale ends in : 00h : 14m : 32s
          </div>
          {/* Color Selection with Images */}
          {product?.images?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Select Color -{" "}
                <span className="capitalize font-[400]">{selectedColor}</span>
              </h3>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={3}
                loop={true}
                autoplay={{ delay: 3000 }}
                className=""
                breakpoints={{
                  100: { slidesPerView: 4 },
                  768: { slidesPerView: 5 },
                  1024: { slidesPerView: 8 },
                }}
              >
                {product.images.map((imgObj, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => handleColorSelect(imgObj,index)}
                    className={`border-2 overflow-hidden h-[80px] ${selectedColor === imgObj.color
                      ? "border-[#5987b8] ring-2 ring-blue-200"
                      : "border-gray-300"
                      }`}
                  >
                    <img
                      src={imgObj.url}
                      alt={imgObj.color}
                      className=" object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {/* SIZE SELECTION */}
          {product?.size?.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Select Size</h3>
                <button className="text-primary text-sm hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.size.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-center rounded-lg border font-medium transition-all ${selectedSize === size
                      ? 'bg-primary text-white border-primary shadow-lg'
                      : 'bg-white border-gray-300 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* ADD TO CART & BUY NOW - Desktop version */}
          <div className="hidden md:flex flex-col gap-3 mt-6">
            <button
              onClick={() => add_card(product?._id, product)}
              className="border border-gray-800 text-gray-900 w-full py-3 hover:bg-gray-100 transition font-medium"
              disabled={!product?.stock}
            >
              Add to Cart
            </button>
            <button
              onClick={()=>buy(product?._id, product)}
              className="bg-primary w-full text-white font-semibold py-3 transition"
            >
              Buy Now
            </button>
          </div>
          <div className="mt-2">
            <img src={image2} className="w-full" alt="" />
          </div>
          {/* KEY HIGHLIGHTS */}
          {product?.keyHighlights?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Key Highlights
              </h3>
              <div className="">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={3}
                  loop={true}
                  autoplay={{ delay: 3000 }}
                  className=""
                  breakpoints={{
                    100: { slidesPerView: 2.5 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 2 },
                  }}
                >
                  {product.keyHighlights.map((highlight, index) => (
                    <SwiperSlide
                      key={index}
                      className="border border-gray-200  overflow-hidden"
                    >
                      <img
                        src={highlight}
                        alt={`Highlight ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
          {/* BOTTOM DESCRIPTION & DETAILS */}
          <div className="mt-8 border-t border-gray-200 pt-4 text-sm">
            {[
              {
                id: "desc",
                title: "Description",
                content: (
                  <div
                    className="text-sm text-gray-600 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        product?.description ||
                        "<p>No description available for this product.</p>",
                    }}
                  />
                ),
              },
              {
                id: "ship",
                title: "Shipping Information",
                content: (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Orders are processed and shipped within 48 hours.
                    Personalized or custom items may take longer depending on
                    the customization details.
                  </p>
                ),
              },
              {
                id: "reviews",
                title: "Customer Reviews",
                content: (
                  <div className="pt-2">
                    <Reviews product={product} />
                  </div>
                ),
              },
            ].map((section) => (
              <div key={section.id} className="border-b border-gray-200 py-3">
                <button
                  onClick={() =>
                    setOpenAccordion((prev) =>
                      prev === section.id ? null : section.id
                    )
                  }
                  className="w-full flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-600 transform transition-transform duration-200 ${openAccordion === section.id ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${openAccordion === section.id
                    ? "max-h-[800px] mt-2"
                    : "max-h-0"
                    }`}
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Mobile Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg md:hidden z-50">
        <div className="flex gap-3">
          <button
           onClick={() => add_card(product?._id, product)}
            className="flex-1 border border-gray-800 text-gray-900 py-3 hover:bg-gray-100 transition font-medium"
            disabled={!product?.stock}
          >
            Add to Cart
          </button>
          <button
            onClick={()=>buy(product?._id, product)}
            className="flex-1 bg-[#5987b8] text-white font-semibold py-3 transition"
          >
            Buy Now
          </button>
        </div>
      </div>

      <MayLike />

      <Footer />

      {/* Auth Modals */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          closeModal={closeLoginModal}
          openRegisterModal={openRegisterModal}
          openForgetModal={openForgetModal}
        />
      )}
      {isRegisterModalOpen && (
        <RegisterModal
          isOpen={isRegisterModalOpen}
          closeModal={closeRegisterModal}
          openLoginModal={() => {
            closeRegisterModal();
            openLoginModal();
          }}
        />
      )}
      {isForgetModalOpen && (
        <ForgetModal isOpen={isForgetModalOpen} onClose={closeForgetModal} />
      )}
    </div>
  );
}
