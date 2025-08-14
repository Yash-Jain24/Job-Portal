# Job Portal Backend

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npm run dev`

### Required ENV
- `MONGODB_URI`
- `JWT_SECRET`
- `ALCHEMY_RPC_URL` (Sepolia recommended)
- `ADMIN_WALLET_ADDRESS` (your testnet admin wallet)
- optional: `REQUIRED_FEE_WEI` default 1e13 (0.00001 ETH approx on 1e18)
- optional: `PAYMENT_VALID_FOR_HOURS` default 12
- optional: `CHAIN_ID` default 11155111 (Sepolia)
