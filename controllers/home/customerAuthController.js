const customerModel = require("../../models/customerModel");
const  axios = require('axios');
const otpModel = require("../../models/otpModel.js");
const { responseReturn } = require("../../utiles/response");
const { createToken } = require("../../utiles/tokenCreate");
const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { log } = require("console");
const fast2sms = require('fast-two-sms');


// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

 const apiKey = process.env.FAST2SMS_API_KEY || "FCwYW9NiVj7rVGpteu8OoGk57p9brahuvO3wDDAzfvqWWYtmUg9kfnvgNJzi";

class customerAuthController {
  customer_register = async (req, res) => {
    const { name, phone, email, password } = req.body;

    // console.log("sdhkjdfshj",req.body);
    

    try {
      const customer = await customerModel.findOne({ email });
      if (customer) {
        responseReturn(res, 404, { error: "Email already exits" });
      } else {
        const createCustomer = await customerModel.create({
          name: name,
          email: email,
          phone: phone,
          password: await bcrypt.hash(password, 10),
          method: "menualy",
        });
        await sellerCustomerModel.create({
          myId: createCustomer.id,
        });
        const token = await createToken({
          id: createCustomer.id,
          name: createCustomer.name,
          email: createCustomer.email,
          method: createCustomer.method,
        });
      res.cookie("customerToken", token, {
  httpOnly: true,
  secure: false,       // localhost pe false, production https pe true
  sameSite: "lax",     // agar alag domain use karoge to "none" + secure: true
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});
        responseReturn(res, 201, { message: "Register success", token });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // customer_login = async (req, res) => {
  //   const { phone } = req.body;

  //   console.log("phone",phone);
    
  //   try {
  //     const customer = await customerModel
  //       .findOne({ phone })
  //       .select("+password");
  //     if (customer) {
  //       const match = await bcrypt.compare(password, customer.password);
  //       if (match) {
  //         const token = await createToken({
  //           id: customer.id,
  //           name: customer.name,
  //           email: customer.email,
  //           method: customer.method,
  //         });
  //       res.cookie("customerToken", token, {
  //       httpOnly: true,
  //       secure: false,       // localhost pe false, production https pe true
  //       sameSite: "lax",     // agar alag domain use karoge to "none" + secure: true
  //       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //     });
  //         responseReturn(res, 201, { message: "Login success", token });
  //       } else {
  //         responseReturn(res, 404, { error: "Password wrong" });
  //       }
  //     } else {
  //       responseReturn(res, 404, { error: "Email not found" });
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

customer_login = async (req, res) => {
  const { phone } = req.body;
  
  console.log("phone", phone);
  
  // Validate phone number
  if (!phone || phone.length !== 10) {
    return responseReturn(res, 400, { error: "Please enter a valid 10-digit mobile number" });
  }
  
  try {
    // Check if user exists
    const customer = await customerModel.findOne({ phone });
    
    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    const payload = {
      route: "q",  
      sender_id: "TXTIND",
      message: `Verification Code: ${otp}`, 
      language: "english",
      numbers: phone
    };

    
    if (customer) {
      // User exists - update OTP
      customer.otp = otp;
      customer.otpExpires = otpExpires;
      await customer.save();

    } else {
      // New user - create account
      const tempPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      const newCustomer = new customerModel({
        phone: phone,
        otp: otp,
        otpExpires: otpExpires,
        method: "mobile",
        password: hashedPassword,
        name: `User${phone.slice(-4)}` // Default name
      });
      
      await newCustomer.save();
    }
    
    // Send OTP via Fast2SMS
    try {
    
      if (!apiKey) {
        // For development/testing, just return OTP in response
        console.log(`DEV MODE: OTP for ${phone} is ${otp}`);
        
        return responseReturn(res, 200, { 
          message: "OTP sent successfully (DEV MODE)", 
          otpSent: true,
          phone: phone,
          existingUser: !!customer,
          otp: otp, // Send OTP in response for development
          devMode: true
        });
      }

    const {data} = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      payload,
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
 
      console.log("Fast2SMS Response:", data);
      
      if (data.return === true) {
        responseReturn(res, 200, { 
          message: "OTP sent successfully", 
          otpSent: true,
          phone: phone,
          existingUser: !!customer
        });
      } else {
        console.error("Fast2SMS Error:", data.message || data);
        // Fallback: Return OTP in development
        console.log(`FALLBACK: OTP for ${phone} is ${otp}`);
        
        responseReturn(res, 400, { 
          message: "OTP sent successfully", 
          otpSent: true,
          phone: phone,
          existingUser: !!customer,
          otp: otp, // For development/testing
          fallback: true
        });
      }
      
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      
      // Fallback: Return OTP in response for development
      console.log(`ERROR FALLBACK: OTP for ${phone} is ${otp}`);
      
      responseReturn(res, 200, { 
        message: "OTP sent successfully (Fallback Mode)", 
        otpSent: true,
        phone: phone,
        existingUser: !!customer,
        otp: otp, // Send OTP in response for development/testing
        fallback: true
      });
    }
    
  } catch (error) {
    console.log("Server error:", error.message);
    responseReturn(res, 500, { error: "Server error. Please try again." });
  }
};

// Add OTP verification function
verify_otp = async (req, res) => {
  const { phone, otp } = req.body;
  
  console.log("Verifying OTP:", { phone, otp });
  
  try {
    // Find user with valid OTP
    const customer = await customerModel.findOne({ 
      phone,
      otp: parseInt(otp), // Convert otp to number for comparison
      otpExpires: { $gt: Date.now() } // Check if OTP is not expired
    });
    
    if (!customer) {
      return responseReturn(res, 400, { error: "Invalid or expired OTP" });
    }
    
    // Clear OTP after successful verification
    customer.otp = undefined;
    customer.otpExpires = undefined;
    await customer.save();
    
    // Generate token
    const token = await createToken({
      id: customer._id,
      phone: customer.phone,
      name: customer.name,
      email: customer.email || "",
      method: customer.method,
    });
    
    // Set cookie
    res.cookie("customerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    
    console.log("OTP verified successfully for user:", customer.phone);
    
    responseReturn(res, 200, { 
      message: "Login successful", 
      token,
      user: {
        id: customer._id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        isNewUser: customer.name === `User${customer.phone.slice(-4)}` // Check if default name
      }
    });
    
  } catch (error) {
    console.log("OTP verification error:", error.message);
    responseReturn(res, 500, { error: "Server error during OTP verification" });
  }
};

// Add resend OTP function
resend_otp = async (req, res) => {
  const { phone } = req.body;
  
  console.log("Resending OTP for:", phone);
  
  try {
    const customer = await customerModel.findOne({ phone });
    
    if (!customer) {
      return responseReturn(res, 404, { error: "Phone number not found" });
    }
    
    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpires = Date.now() + 10 * 60 * 1000;
    
    // Update OTP
    customer.otp = otp;
    customer.otpExpires = otpExpires;
    await customer.save();
    
    // Send OTP via Fast2SMS
    try {
      const apiKey = process.env.FAST2SMS_API_KEY;
      
      if (!apiKey) {
        console.log(`DEV MODE: New OTP for ${phone} is ${otp}`);
        return responseReturn(res, 200, { 
          message: "OTP resent successfully (DEV MODE)", 
          otpSent: true,
          otp: otp,
          devMode: true
        });
      }
      
      const options = {
        authorization: apiKey,
        message: `Your new OTP is ${otp}. Valid for 10 minutes.`,
        numbers: [phone]
      };
      
      const response = await fast2sms.sendMessage(options);
      console.log("Resent OTP response:", response);
      
      responseReturn(res, 200, { 
        message: "OTP resent successfully", 
        otpSent: true 
      });
      
    } catch (smsError) {
      console.error("Resend SMS failed:", smsError);
      // Fallback
      console.log(`FALLBACK: New OTP for ${phone} is ${otp}`);
      
      responseReturn(res, 200, { 
        message: "OTP resent successfully (Fallback)", 
        otpSent: true,
        otp: otp,
        fallback: true
      });
    }
    
  } catch (error) {
    console.log("Resend OTP error:", error.message);
    responseReturn(res, 500, { error: "Failed to resend OTP" });
  }
};

// Add OTP verification function
verify_otp = async (req, res) => {
  const { phone, otp } = req.body;
  
  try {
    const customer = await customerModel.findOne({ 
      phone,
      otp,
      otpExpires: { $gt: Date.now() } // Check if OTP is not expired
    });
    
    if (!customer) {
      return responseReturn(res, 400, { error: "Invalid or expired OTP" });
    }
    
    // Clear OTP after successful verification
    customer.otp = undefined;
    customer.otpExpires = undefined;
    await customer.save();
    
    // Generate token
    const token = await createToken({
      id: customer._id,
      phone: customer.phone,
      name: customer.name || `User${customer.phone.slice(-4)}`,
      email: customer.email || "",
      method: customer.method,
    });
    
    // Set cookie
    res.cookie("customerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    
    responseReturn(res, 200, { 
      message: "Login successful", 
      token,
      user: {
        id: customer._id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        isNewUser: !customer.name // Check if it's a first-time user
      }
    });
    
  } catch (error) {
    console.log(error.message);
    responseReturn(res, 500, { error: "Server error during OTP verification" });
  }
};



// Add resend OTP function
resend_otp = async (req, res) => {
  const { phone } = req.body;
  
  try {
    const customer = await customerModel.findOne({ phone });
    
    if (!customer) {
      return responseReturn(res, 404, { error: "Phone number not found" });
    }
    
    const otp = Math.floor(1000 + Math.random() * 9000);
    
    // Update OTP
    customer.otp = otp;
    customer.otpExpires = Date.now() + 10 * 60 * 1000;
    await customer.save();
    
    // Send OTP via Fast2SMS
    const options = {
      authorization: process.env.FAST2SMS_API_KEY || "FCwYW9NiVj7rVGpteu8OoGk57p9brahuvO3wDDAzfvqWWYtmUg9kfnvgNJzi",
      message: `Your new OTP is ${otp}. Valid for 10 minutes.`,
      numbers: [phone]
    };
    
    const response = await fast2sms.sendMessage(options);
    console.log("Resent OTP:", response);
    
    responseReturn(res, 200, { 
      message: "OTP resent successfully", 
      otpSent: true 
    });
    
  } catch (error) {
    console.log(error.message);
    responseReturn(res, 500, { error: "Failed to resend OTP" });
  }
};
   getCurrentUser = async (req, res) => {
      try {
        let { id } = req;

        if (!id) {
          return res.status(400).json({ error: "User ID missing" });
        }

        const customer = await customerModel
          .findById(id)
          .select("-password");

        if (!customer) {
          return res.status(404).json({ error: "User not found" });
        }

        const user = {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          method: customer.method,
          phone: customer.phone,
        };

        return res.status(200).json({ data: user });
      } catch (error) {
        console.log("Get current user error:", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
  };


  customer_logout = async (req, res) => {
    res.cookie("customerToken", "", {
      expires: new Date(Date.now()),
    });
    responseReturn(res, 200, { message: "Logout success" });
  };

  sendOtp = async (req, res) => {
    const { email } = req.body;
    // console.log("email", email);
    const user = await customerModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log(user.name, 'This is user')

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP in DB
    await otpModel.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send OTP email
    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #1c3058; text-align: center;">Password Reset OTP</h2>
          <p style="font-size: 16px; color: #333333;">Hello, ${user.name}</p>
          <p style="font-size: 16px; color: #333333;">
            You requested a password reset. Please use the following OTP (One-Time Password) to reset your password. 
            <strong style="display: block; font-size: 24px; margin: 20px 0; text-align: center; color: #1c3058;">${otp}</strong>
            This OTP will expire in <strong>2 minutes</strong>.
          </p>
          <p style="font-size: 16px; color: #333333;">If you did not request this change, please ignore this email.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://yourwebsite.com" style="text-decoration: none; color: #ffffff; background-color: #1c3058; padding: 10px 20px; border-radius: 5px;">Visit Our Website</a>
          </div>
          <p style="font-size: 12px; color: #999999; margin-top: 30px; text-align: center;">
            © ${new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      `,
    };
    

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to send OTP" });
      } else {
        res.status(200).json({ message: "OTP sent to your email" });
      }
    });
  };

 

  verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, npassword } = req.body;
    const otpRecord = await otpModel.findOne({ email: email, otp: otp });
    if (!otpRecord)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    // Update password
    const hashedPassword = await bcrypt.hash(npassword, 10);
    await customerModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    // Delete the OTP record after successful password reset
    await otpModel.findOneAndDelete({ email, otp });

    responseReturn(res, 200, { message: "Password updated successfully" });
  };


 
  get_all_customers = async (req, res) => {
    try {
      let { page = 1, parPage = 10, searchValue = '' } = req.query;
      
      // Convert to numbers
      page = parseInt(page);
      parPage = parseInt(parPage);
      
      // Validate pagination parameters
      if (page < 1) page = 1;
      if (parPage < 1) parPage = 10;
      
      // Calculate skip value
      const skipPage = parPage * (page - 1);
      
      // Build search query
      let searchQuery = {};
      if (searchValue && searchValue.trim() !== '') {
        const searchRegex = new RegExp(searchValue.trim(), 'i');
        searchQuery = {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { phone: { $regex: searchRegex } },
            { method: searchRegex }
          ]
        };
      }
      
      // Execute queries in parallel for better performance
      const [customers, totalCustomers] = await Promise.all([
        // Get paginated customers
        customerModel.find(searchQuery)
          .select('-password') // Exclude password field
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 }) // Latest first
          .lean(),
        
        // Get total count
        customerModel.countDocuments(searchQuery)
      ]);
      
      // Calculate total pages
      const totalPages = Math.ceil(totalCustomers / parPage);
      
      // Prepare response
      const response = {
        success: true,
        customers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCustomers,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          perPage: parPage
        }
      };
      
      // responseReturn(res, 200, response);
      return res.status(200).json({ data: response });
      
    } catch (error) {
      console.error('Error fetching customers:', error.message);
      responseReturn(res, 500, {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };


  delete_customer_permanently = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Check if customer exists
    const customer = await customerModel.findById(customerId);
    
    if (!customer) {
      return responseReturn(res, 404, {
        success: false,
        message: 'Customer not found'
      });
    }


    // Delete the customer
    const deletedCustomer = await customerModel.findByIdAndDelete(customerId);

    responseReturn(res, 200, {
      success: true,
      message: 'Customer deleted successfully',
      deletedCustomer: {
        id: deletedCustomer._id,
        name: deletedCustomer.name,
        email: deletedCustomer.email
      }
    });

  } catch (error) {
    console.error('Error deleting customer:', error.message);
    
    if (error.name === 'CastError') {
      return responseReturn(res, 400, {
        success: false,
        message: 'Invalid customer ID format'
      });
    }
    
    responseReturn(res, 500, {
      success: false,
      message: 'Failed to delete customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

bulk_delete_customers = async (req, res) => {
  try {
    const { customerIds } = req.body;

    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return responseReturn(res, 400, {
        success: false,
        message: 'No customer IDs provided'
      });
    }

    // Validate customer IDs
    const validIds = customerIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return responseReturn(res, 400, {
        success: false,
        message: 'No valid customer IDs provided'
      });
    }

    // Delete customers
    const result = await customerModel.deleteMany({
      _id: { $in: validIds }
    });

    responseReturn(res, 200, {
      success: true,
      message: `Successfully deleted ${result.deletedCount} customer(s)`,
      deletedCount: result.deletedCount,
      details: {
        requested: customerIds.length,
        valid: validIds.length,
        deleted: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Error bulk deleting customers:', error.message);
    responseReturn(res, 500, {
      success: false,
      message: 'Failed to delete customers'
    });
  }
};


}

module.exports = new customerAuthController();
