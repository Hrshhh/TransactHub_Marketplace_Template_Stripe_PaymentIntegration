import express  from "express";
import { createConnectAccount, getAccountStatus, getAccountBalance, getSessionId, stripeSuccess } from "../controllers/stripe";
import { requireSignIn } from "../middlewares/index";

const router = express.Router();

router.post('/create-connect-account', requireSignIn, createConnectAccount);
router.post('/get-account-status', requireSignIn, getAccountStatus);
router.post('/get-account-balance', requireSignIn, getAccountBalance);
router.post('/get-session-id', requireSignIn, getSessionId);
router.post('/stripe-success', requireSignIn, stripeSuccess);


module.exports = router;