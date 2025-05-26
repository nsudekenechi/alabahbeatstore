const { Beats, Licenses } = require("../models/beat");
const { Cart } = require("../models/user");
const { getSignedURL } = require("./admin");

const addToCart = async (req, res) => {

    if (!req.body?.beat) return res.status(400).json({ err: "Beat and License are required." });
    const { beat, license } = req.body;
    try {
        const beatExists = await Cart.findOne({ "cart.beat": beat })
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
module.exports = { addToCart, getCart, deleteCartItem }