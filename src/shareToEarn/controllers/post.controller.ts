import { time } from 'console';
import { ethers } from 'ethers';

const Post = require('../models/post.model')
const Comment = require('../models/comment.model')

export const onManagePost = {
    doSavePost: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const content = req.body.content
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            let now = new Date();
            let nextYear = new Date(now.getFullYear()+1, now.getMonth(), 1)
            let post = await Post.create({
                address,
                content,
                timeout: nextYear.getTime(),
                isRewarded: false,
            })

            res.status(200).send(post);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doEditPost: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const content = req.body.content
            const signature = req.body.signature
            const message = req.body.message
            const postId = req.body.postId

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            let postRecord = await Post.findOne({
                postId
            }).exec()

            if (address !== postRecord.address) {
                res.status(400).send("Not post creator");
            }

            await Post.findByIdAndUpdate(postId, {
                content
            })

            res.status(200).send(address);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doReward: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const signature = req.body.signature
            const message = req.body.message
            const postId = req.body.postId

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }
            let postRecord = await Post.findOne({
                postId
            }).exec()

            if (address !== postRecord.address) {
                res.status(400).send("Not post creator");
            }

            await Post.findOneAndUpdate({postId}, {
                isRewarded: true,
            })
            
            res.status(200).send({isRewarded: true});
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doTakeRewardBack: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const signature = req.body.signature
            const message = req.body.message
            const postId = req.body.postId

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            let postRecord = await Post.findOne({
                postId
            }).exec()

            if (address !== postRecord.address) {
                res.status(400).send("Not post creator");
            }
            let now = new Date()
            if (postRecord.timeout > now.getTime()) {
                res.status(400).send("Can not be withdrawn yet");
            }

            await Post.findOneAndUpdate({postId}, {
                isRewarded: true,
            })
            
            res.status(200).send({isRewarded: true});
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doSaveComment: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const content = req.body.content
            const postId = req.body.postId
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            let comment = await Comment.create({
                postId,
                address,
                content
            })

            res.status(200).send(comment);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doEditComment: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const content = req.body.content
            const commentId = req.body.commentId
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr !== address) {
                res.status(401).send("Invalid signature");
            }

            let commentRecord = await Comment.findOne({
                commentId
            }).exec()

            if (address !== commentRecord.address) {
                res.status(400).send("Not comment creator");
            }

            await Comment.findByIdAndUpdate(commentId, {
                content
            })

            res.status(200).send(address);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doGetPosts: async (req: any, res: any, next: any) => {
        try {
            let postRecords = await Post.find()
            res.status(200).send(postRecords);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    },

    doGetCommentsinPosts: async (req: any, res: any, next: any) => {
        try {
            let commentRecords = await Comment.find({
                postId: req.params.postId
            })
            res.status(200).send(commentRecords);
        } catch (err: any) {
            console.log(err.message) 
            res.status(400).send(err.message);
        }
        // no route matched
        res.status(405).end();
    }
}