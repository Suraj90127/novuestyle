import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// https://novuestyle.com/api/meta/purchase

export const sendMetaEvent = async (
  eventType,
  price,
  order,
  products,
  userInfo
) => {
  const event_id = uuidv4();
  // console.log("price", price);
  // console.log("order", order);
  // console.log("products", products);
  // console.log("userInfo", userInfo);
  const totalAmount = order.amount
    ? order.amount / 100
    : products.reduce((a, b) => a + b.productInfo.price * b.quantity, 0);

  // CLIENT-SIDE PIXEL
  if (window.fbq) {
    window.fbq("track", eventType, {
      value: price,
      currency: "INR",
      contents: products.map((i) => ({
        id: i._id,
        quantity: i.quantity,
        item_price: i.productInfo.price,
      })),
      eventID: event_id,
    });
  }

  console.log("Sending to CAPI:", order, products, userInfo);

  // SERVER-SIDE CAPI
  await axios.post("http://localhost:8000/api/meta/purchase", {
    eventType: eventType,
    orderId: order.receipt || order.id || order._id,
    value: price,
    email: userInfo.email,
    phone: order.notes?.phone || userInfo.phone,
    contents: products.map((i) => ({
      id: i._id,
      quantity: i.quantity,
      item_price: i.productInfo.price,
    })),
    client_event_id: event_id,
    event_source_url: window.location.href,
  });
};

// export const sendMetaEventSafe = async ({
//   eventType,
//   price = 0,
//   order = {},
//   products = [],
//   userInfo = {},
// }) => {
//   try {
//     const event_id = uuidv4();

//     console.log("eventType", eventType);
//     console.log("price", price);
//     console.log("order", order);
//     console.log("products", products);
//     console.log("userInfo", userInfo);

//     const safeProducts = Array.isArray(order) ? order : [];
//     let order_id = safeProducts[0]?.productInfo?._id;

//     console.log("order_id", order_id);

//     console.log("safeProducts", safeProducts);

//     // CLIENT-SIDE (SAFE)
//     if (window.fbq) {
//       window.fbq("track", eventType, {
//         value: price || 0,
//         currency: "INR",
//         contents: safeProducts.map((i) => ({
//           id: i?.productInfo?._id || "",
//           quantity: i?.quantity || 1,
//           item_price: i?.productInfo?.price || 0,
//         })),
//         eventID: event_id,
//       });
//     }

//     // SERVER-SIDE CAPI (SAFE)
//     await axios.post(
//       "http://localhost:8000/api/meta/purchase",
//       {
//         eventType: eventType,
//         orderId: order?.receipt || order_id || order?.id || "NO_ORDER_ID", // safe mode
//         value: price || 0,
//         email: userInfo?.email || null,
//         phone: userInfo?.phone || order?.notes?.phone || "9876543211",
//         contents: safeProducts.map((i) => ({
//           id: i?.productInfo?._id || "",
//           quantity: i?.quantity || 1,
//           item_price: i?.productInfo?.price || 0,
//         })),
//         client_event_id: event_id,
//         event_source_url: window.location.href,
//       }
//       // {
//       //   headers: userInfo?.token
//       //     ? { Authorization: `Bearer ${userInfo.token}` }
//       //     : {}, // SAFE guest mode
//       // }
//     );

//     console.log("SAFE CAPI EVENT SUCCESS");
//   } catch (err) {
//     console.log("SAFE META EVENT ERROR (IGNORED):", err?.message);
//   }
// };



export const sendMetaEventSafe = async ({
  eventType,
  price = 0,
  order = {},
  products = [],
  userInfo = {},
}) => {
  try {
    const event_id = uuidv4();

    console.log("eventType", eventType);
    console.log("price", price);
    console.log("order", order);
    console.log("products", products);
    console.log("userInfo", userInfo);

    // products ko hamesha array bana do
    const list = Array.isArray(products)
      ? products
      : products
      ? [products]
      : [];

    // Meta ke liye simple contents structure
    const contents = list.map((p) => ({
      id: p?._id || p?.productInfo?._id || "",
      quantity: p?.quantity || 1,
      item_price: p?.productInfo?.price || p?.price || 0,
    }));

    // --------- 1) META PIXEL ----------
    if (window.fbq) {
      window.fbq("track", eventType, {
        value: price || 0,
        currency: "INR",
        contents,
        eventID: event_id,
      });
    }

    // --------- 2) GOOGLE ANALYTICS (GA4) ----------
    if (window.gtag) {
      // GA ke event names thode different hote hain
      let gaEventName = "view_item";
      if (eventType === "AddToCart") gaEventName = "add_to_cart";
      else if (eventType === "Purchase") gaEventName = "purchase";
      else if (eventType === "InitiateCheckout") gaEventName = "begin_checkout";

      window.gtag("event", gaEventName, {
        currency: "INR",
        value: price || 0,
        items: contents.map((c) => ({
          item_id: c.id,
          price: c.item_price,
          quantity: c.quantity,
        })),
      });
    }

    // --------- 3) META CAPI (SERVER SIDE) ----------
    await axios.post("http://localhost:8000/api/meta/purchase", {
      eventType,
      orderId:
        order?.receipt ||
        order?.id ||
        order?._id ||
        "NO_ORDER_ID", // AddToCart / ViewContent ke liye ok
      value: price || 0,
      email: userInfo?.email || null,
      phone: userInfo?.phone || order?.notes?.phone || null,
      contents,
      client_event_id: event_id,
      event_source_url: window.location.href,
    });

    console.log("SAFE CAPI EVENT SUCCESS");
  } catch (err) {
    console.log("SAFE META EVENT ERROR (IGNORED):", err?.message);
  }
};