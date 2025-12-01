const axios = require("axios");
const { log } = require("console");
const crypto = require("crypto");
require("dotenv").config();

const sha256 = (value) => {
  if (!value) return "";
  const str = String(value).trim().toLowerCase();
  return crypto.createHash("sha256").update(str).digest("hex");
};

exports.sendPurchaseEvent = async (req, res) => {
  // console.log("fghjkl");

  console.log("req", req.body);

  try {
    const {
      eventType,
      orderId,
      value,
      currency = "INR",
      email,
      phone,
      contents = [],
      client_event_id,
      event_source_url,
    } = req.body;

    if (!eventType || !orderId) {
      return res.status(400).json({ error: "eventType & orderId required" });
    }

    // Deduplication event_id
    const event_id = client_event_id;

    // SAFE USER DATA (NO ERRORS NOW)
    const user_data = {
      em: typeof email === "string" ? sha256(email) : undefined,
      ph: typeof phone === "string" ? sha256(phone) : undefined,
      client_ip_address: req.ip,
      client_user_agent: req.headers["user-agent"],
    };

    const mapped_contents = contents.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.item_price,
    }));

    const payload = {
      data: [
        {
          event_name: eventType,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          action_source: "website",
          event_source_url,
          user_data,
          custom_data: {
            currency,
            value,
            order_id: orderId,
            contents: mapped_contents,
          },
        },
      ],
    };
    console.log("process.env.GRAPH_API_VERSION", process.env.GRAPH_API_VERSION);
    console.log("process.env.META_PIXEL_ID", process.env.META_PIXEL_ID);

    console.log("process.env.META_ACCESS_TOKEN", process.env.META_ACCESS_TOKEN);

    const fbRes = await axios.post(
      `https://graph.facebook.com/${process.env.GRAPH_API_VERSION}/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
      payload
    );

    console.log("fbRes", fbRes);

    return res.json({
      success: true,
      event_id,
      fb: fbRes.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.response?.data || error.message,
    });
  }
};
