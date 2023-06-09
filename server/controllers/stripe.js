import Stripe from "stripe";
import Hotel from "../models/hotel";
import User from "../models/user";
import Order from "../models/order";
const queryString = require('querystring');
const stripe = require('stripe')
('sk_test_51MLkBfSA2R3C3haDKCAqt4AErd6G8fOfBy0KoiFlgC5ZtlHxx2gbnomXbyfKU74V1mCecJlqZ6Gagc2478nZbnLz00DUJ0fEJQ');

export const createConnectAccount = async (req, res) => {
    const user = await User.findById(req.auth._id);
    console.log("User>> ", user);

    if(!user.stripe_account_id){
        const account = await stripe.accounts.create({
            type: 'standard',
            email: user.email
        });
        console.log("Stripe Account =>> ", account);
        user.stripe_account_id = account.id;
        user.save();
    }
    
    let onBoardingLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: "account_onboarding"

    });
    console.log("On Boarding Link>> ", onBoardingLink)
    onBoardingLink = Object.assign(onBoardingLink, {
        "stripe_user[email]": user.email || undefined,
    });
    console.log("On Boarding Link>> ", onBoardingLink)

    let link = `${onBoardingLink.url}?${queryString.stringify(onBoardingLink)}`;
    console.log("Link sent to frontend for onBoarding>> ",link)
    res.send(link);
}



export const getAccountStatus = async(req, res) => {
    console.log("Account aaya backend me");
    const user = await User.findById(req.auth._id);
    
    const account = await stripe.accounts.retrieve(user.stripe_account_id);

    // console.log("Account>> ", account);
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            stripe_seller: account,
        },
        {new: true}
    ).select("-password")
    
    // console.log(updatedUser);
    res.json(updatedUser);
    
}

export const getAccountBalance = async(req, res) => {
    const user = await User.findById(req.auth._id);
    try{
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id,
        });
        console.log("Balance >>> ", balance);
        res.json(balance);
    }
    catch(err) {
        console.log(err);
    }
}

export const getSessionId = async(req, res) => {
    // console.log("You hit user Id", req.auth._id);
    // console.log(req);
    // 1) Get hotel ID from req.body
    const hotelId = req.body._id;
    // 2) Find the hotel based on hotel id from db
    const item = await Hotel.findById(hotelId).populate('postedBy').exec();
    // console.log("Item >>> ", item);
    // 3) 20% charge as application fee 
    console.log("Item Price >> ", item.price);
    const fee = Math.ceil((item.price *20)/100);
    console.log("Fee ", fee);
    
    // 4) Create a session 
    const session = await stripe.checkout.sessions.create({
        // 5) Purchasing item defaultMaxListeners, it will be shown to user on checkout
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.title,
                    },
                    unit_amount: item.price*100,
                },
                quantity: 1,
            },
        ], 
        mode: 'payment',
        payment_method_types: ["card"],
        // 6) Create Payment Intent with application fee and destination charge 80%
        payment_intent_data: {
            application_fee_amount: fee*100,
            transfer_data: {
                destination: item.postedBy.stripe_account_id,
            }
        },
        // Success and Cancel urls
        success_url: `http://localhost:3000/stripe/success/${item._id}`,
        cancel_url: `http://localhost:3000/stripe/cancel`
    });
    // 7) Add this session object to user in the Database
    console.log("Not Saving Stripe Session in database"); 
    console.log("Id second time", req.body._id);
    
    // await User.findByIdAndUpdate(req.body._id, {stripeSession: session}).exec().then((res) => {
    //     console.log("Response",res);
    // });
    const user = await User.findById(req.body._id).exec();

    if (!user) {
        console.log(`User with ID ${req.body._id} not found`);
    } else {
        console.log(user);
    }
    await User.findByIdAndUpdate(req.auth._id,{ stripeSession: session })
    // console.log("Updated User ", updatedUser);
    // 8) Send session Id as response to frontend
    // console.log("Session >>>",session);
    res.send({
        sessionId: session.id
    })

    // console.log("Session >>> ", session);
}


// Send the Session Id to Frontend
// Then in Frontend, we can use this session Id to create a page where users can securely enter their card details and Checkout with Stripe
// After completion, they will get redirect to /stripe/success page 
// In the success page... we will do more stuff once user lands on that page
// For example, we will create a new order... 
// User will have the hotel as booked under his name, user can see the booking in his dashboard etc..

export const stripeSuccess = async(req, res) => {
    try{
        // Get hotel id from req.body 
    const {path} = req.body;
    // console.log("Hotel Id", path);
    console.log("Ordered By ", req.auth._id);

    // Find currently logged In User 
    const user = await User.findById(req.auth._id).exec();

    // Check if the user has Stripe Session 
    if(!user.stripeSession) return;

    // Retrieve stripe session, based on session id we previously save in user db
    const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id);

    if(session.payment_status == "paid"){
        const orderExist = await Order.findOne({"session.id": session.id}).exec();

        if(orderExist) {
            res.json({success: true});
        }else{
            let newOrder = await new Order({
                hotel: path,
                session,
                orderedBy: user._id
            }).save();

            console.log("New Order ",newOrder)

            // Remove user's stripeSession
            await User.findByIdAndUpdate(user._id, {
                $set: {stripeSession: {}}
            })

            res.json({ success: true });
        }
    }
    }catch(err) {
        console.log("Stripe success failed");
    }

}