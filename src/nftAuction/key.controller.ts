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
            if (signerAddr.toLocaleLowerCase() != address) {
                return res.status(401).send("Invalid signature");
            }

            await Key.create({
                address,
                tokenId,
                key,
            })

            return res.status(200).send(address);
        } catch (err: any) {
            console.log(err.message) 
            return res.status(400).send(err.message);
        }
    },

    doChangeKeyOwner: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const newOwner = req.body.newOwner
            const tokenId = req.body.tokenId
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                return res.status(401).send("Invalid signature");
            }

            await Key.findOneAndUpdate({tokenId}, {
                address: newOwner,
            })

            return res.status(200).send(address);
        } catch (err: any) {
            console.log(err.message) 
            return res.status(400).send(err.message);
        }
    },

    doGetKey: async (req: any, res: any, next: any) => {
        try {
            const tokenId = req.query.tokenId

            let keyRecord = await Key.findOne({
                tokenId
            }).exec()
            return res.status(200).send(keyRecord);
        } catch (err: any) {
            console.log(err.message) 
            return res.status(400).send(err.message);
        }
    }
}