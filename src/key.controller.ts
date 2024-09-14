import mongoose from 'mongoose';
import ethers from 'ethers'

const Key = require('./key.model')

export const onManageKey = {
    doSaveKey: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const key = req.body.key
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            await Key.create({
                address: address,
                key: key,
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
        try {
            const address = req.query.address
            let keyRecord = await Key.findOne({
                address: address
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