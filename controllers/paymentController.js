const crypto = require('crypto');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const pendingTransactions = {};


// Create a SHA-256 hasher
function genSecretKey(){
    return  crypto.randomBytes(32).toString('hex');
}



// stripe payment (2)

const plans =[
    {id:"basic" ,name: "Basic", price: "Rs 59",priceInPaise:59*100, benefits: ["Standard Definition (SD)","1 screen"]},
    {id:"standard", name: "Standard", price: "Rs 199",priceInPaise:199*100, benefits: ["High Definition (HD)","2 screens"]},
    {id:"premium", name: "Premium", price: "Rs 349", priceInPaise:349*100, benefits: ["Ultra High Definition (UHD)","4 screens"]},
  ]

// use 4000003560000008 as card number for testing
const onSubscribe = async (req, res) => {
    try {
        const planID=req.query.plan;
        //find match of plan with id in plans
        const planMatch = plans.find((plan) => plan.id === planID);
        if (!planMatch) throw Error("plan not found");

        const transactionSecretKey = genSecretKey();
        pendingTransactions[transactionSecretKey] = planMatch.id;

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
            price_data:{
                currency:"inr",
                product_data:{
                name:planMatch.id
                },
                unit_amount:planMatch.priceInPaise
            },
            quantity:1
            }
        ],
        success_url: `${process.env.CLIENT_URL}/success?redeemKey=${transactionSecretKey}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
}
}


const redeemSubscription = async (req, res) => {
    try {
        const { transactionKey } = req.query;
        const planID = pendingTransactions[transactionKey];
        if (!planID)
            res.status(404).json({ error: "Transaction Key not found or invalid!" });
        else{  
            delete pendingTransactions[transactionKey];
            console.log("Transaction successful for plan", planID);
            res.json({ planID });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


module.exports = { onSubscribe, redeemSubscription };
