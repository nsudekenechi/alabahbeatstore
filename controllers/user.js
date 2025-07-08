const { ListBucketIntelligentTieringConfigurationsCommand, GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const sendEmail = require("../config/mail");
const { Beats, Licenses } = require("../models/beat");
const { Cart, Orders, User } = require("../models/user");
const { getSignedURL } = require("./admin");
const generateLicensePDFBuffer = require("../config/pdf-lib");

const addToCart = async (req, res) => {

    if (!req.body?.beat || !req.body?.license) return res.status(400).json({ err: "Beat and License are required." });
    const { beat, license } = req.body;
    try {
        const beatExists = await Cart.findOne({ "cart.beat": beat }) //getting beat id inside cart array => cart.beat
        const alreadyAdded = await Cart.findOne({ user: req.user._id });
        if (beatExists) return res.status(400).json({ err: "You’ve already added this beat to your cart. Please select another." });
        let cart = !alreadyAdded ? await Cart.create(({
            user: req.user._id,
            cart: [{ beat, license }]
        })) : await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $push: { cart: { beat, license } } },
            { new: true }
        );

        return res.json({ message: "Added Successfully", data: cart })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

const getCart = async (req, res) => {
    try {
        const { cart } = await Cart.findOne({ user: req.user._id });
        const cartItems = [];
        for (const item of cart) {
            const beatId = item.beat;
            const licenseId = item.license;
            const beat = await Beats.findById(beatId)
            const beatWithUrl = await getSignedURL([beat]); //Getting URL for image and mp3 file
            const license = await Licenses.findById(licenseId);
            cartItems.push({
                name: beat.name,
                image: beatWithUrl[0]?.url?.image,
                mp3: beatWithUrl[0]?.url?.mp3,
                price: license?.price,
                license: license?.name,
                format: license?.format,
                cart_id: item._id
            })
        }
        return res.json({ cartItems, total: cartItems.reduce((total, item) => total + item.price, 0) });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ err })

    }
}

const deleteCartItem = async (req, res) => {
    if (!req.params.id) return res.status(400).json({ err: "Cart Item ID is required!" });
    const id = req.params.id;
    try {
        const cart = await Cart.findOneAndUpdate({ user: req.user._id },
            {
                $pull: { cart: { _id: id } }
            },
            {
                new: true
            });

        getCart(req, res);

    } catch (err) {
        console.log(err)
        return res.status(400).json({ err })

    }
}

const checkoutWithPaystack = async (req, res) => {
    const { email, _id: user } = req.user;
    const { cart } = await Cart.findOne({ user });
    let totalAmount = 0;
    let cartItems = [];
    try {
        // getting prices of items from user's cart instead of getting directly from frontend
        for (const cartItem of cart) {
            const { license, beat } = cartItem;
            const { price } = await Licenses.findById(license);
            totalAmount += price;
            cartItems.push({
                beat,
                license,
                price
            })
        }

        let { data: { authorization_url, reference } } = await handlePaymentWithPayStack(email, totalAmount);
        // storing orders
        await Orders.create({
            user,
            reference,
            amount: totalAmount,
            cartItems
        })
        return res.json({ authorization_url, reference });
    } catch (err) {
        console.error(err)
        return res.json({ err });

    }
}

const verifyPaymentWithPayStack = async (req, res) => {
    
    if (!req.params.reference) return res.status(400).json({ err: "No transaction reference provided" });
    const { reference } = req.params;
    const { data, err } = await handleVerifyPaymentWithPayStack(reference);
    if (err) return res.status(400).json({ err });
    if (data.status != "success") return res.status(400).json({ err: "Couldn't verify payment, something went wrong" })
    try {

        // update order
        await Orders.findOneAndUpdate({ reference }, { verified: true });
        // send user download link 
        const order = await Orders.findOne({reference}).populate({
                    path: 'cartItems.beat', // populate beatId
                    model: 'beats'
                    }).populate({
                    path: 'cartItems.license', // populate licenseId
                    model: 'licenses'
        }).populate({
            path: 'user',
            model: 'users'
        });

        const {user, cartItems} = order;
        let body = "";
        let beatPurchases = [];
        for (const { beat, license } of cartItems.toObject()) {
        const beatUrl = await getSignedURL([beat], true); // assuming returns [{ url: { image, mp3, etc } }]
        const urls = beatUrl[0].url;
        // Add image
        body += `<img src='${urls["image"]}' class='beat-img'/>`;

        // UPDATING BEAT TO NOT AVAILABLE, WHEN PURCHASE IS EXCLUSIVE
        if(license.name.includes("exclusive")){
            await Beats.findByIdAndUpdate( beat._id, {isAvailable: false});
        }
       
        // Add license format download links
        for (const format of license.format) {
        const downloadLink = urls[format];
        body += `<a href='${downloadLink}' download class='download-btn'>Download ${format}</a>`;
        }

        beatPurchases.push({title:beat.name, licenseType: license.name})
        }
     
         // Adding attachments
         let purchaseDate = new Date().toLocaleDateString("en-us", {dateStyle:"full"});
         let licensePDF = await generateLicensePDFBuffer(beatPurchases, user.fullname, user.email, purchaseDate);
        // sending user email
        sendEmail(user.email, "Your beat is ready for download", body,  user.fullname, [{
        filename: 'Beat_License.pdf',
        content: licensePDF,
        contentType: 'application/pdf',
      }]);

    //Clearing  user's cart 
    await Cart.findOneAndDelete({user: user._id});
    return res.json({msg:"Order delivered Successfully"});

} catch (err) {
        return res.status(400).json({ err })
}
}
const handlePaymentWithPayStack = async (email, amount) => {
    const req = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.PAYSTACK_SK}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, amount: amount * 100, callback_url: "http://alabahbeatstore.com/user/dashboard" }),
    })

    const resp = await req.json();
    return resp
}

const handlePaymentWithFlutterWave = () => {

}

const handleVerifyPaymentWithPayStack = async (reference) => {
    let response = {
        data: null,
        err: null
    };
    try {
        let req = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SK}` } })
        let res = await req.json();
        response.data = res.data;
    } catch (err) {
        response.err = err
    }

    return response
}

module.exports = { addToCart, getCart, deleteCartItem, checkoutWithPaystack, verifyPaymentWithPayStack }