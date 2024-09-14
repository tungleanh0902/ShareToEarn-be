require('dotenv').config();

export const config = {
    'secret': 'nodeauthsecret',
    'database': `mongodb+srv://${process.env.NEXT_PUBLIC_MONGO_NAME}:${process.env.NEXT_PUBLIC_MONGO_PW}@cluster0.uwsvq.mongodb.net/nftauction?retryWrites=true&w=majority`
};