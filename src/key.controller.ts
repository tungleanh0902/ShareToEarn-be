import { ethers } from 'ethers';

const Key = require('./key.model')

export const onManageKey = {
    doSaveKey: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const key = req.body.key
            const tokenId = req.body.tokenId
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            await Key.create({
                address,
                tokenId,
                key,
            })

            res.status(200).send(address);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doChangeKeyOwner: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const newOwner = req.body.newOwner
            const tokenId = req.body.tokenId
            const signature = req.body.signature
            const message = req.body.message
            console.log("doChangeKeyOwner");

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            await Key.findOneAndUpdate({tokenId}, {
                address: newOwner,
            })

            res.status(200).send(address);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doGetKey: async (req: any, res: any, next: any) => {
        console.log("doGetKey");

        try {
            const tokenId = req.query.tokenId

            let keyRecord = await Key.findOne({
                tokenId
            }).exec()
            res.status(200).send(keyRecord);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    }
}