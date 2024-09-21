import { ethers } from 'ethers';
import mongoose from 'mongoose';

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
            if (signerAddr.toLocaleLowerCase() != address) {
                return res.status(401).send({
                    message: "Invalid signature"
                });
            }

            let now = new Date();
            let post = await Post.create({
                address,
                content,
                timeout: now.setMinutes(now.getMinutes() + 15),
                isRewarded: false,
            })

            return res.status(200).send({
                data: post
            });
        } catch (err: any) {
            console.log(err.message) 
            return res.status(400).send({
                message: err.message
            });
        }
    },

    doEditPost: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const content = req.body.content
            const signature = req.body.signature
            const message = req.body.message
            const postId = req.body.postId
            
            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr.toLocaleLowerCase() != address) {
                return res.status(401).send({
                    message: "Invalid signature"
                });
            }

            let postRecord = await Post.findOne({
                postId
            }).exec()

            if (address !== postRecord.address) {
                return res.status(400).send({
                    message: "Not post creator"
                });
            }

            await Post.findByIdAndUpdate(postId, {
                content
            })

            return res.status(200).send({
                data: address
            });
        } catch (err: any) {
            return res.status(400).send({
                message: err.message
            });
        }
    },

    doReward: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const signature = req.body.signature
            const message = req.body.message
            const postId = req.body.postId
            console.log(address);
            
            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr.toLocaleLowerCase() !== address) {
                return res.status(401).send({
                    message: "Invalid signature"
                });
            }
            let postRecord = await Post.findById(postId);
            if (address !== postRecord.address) {
                return res.status(400).send({
                    message: "Not post creator"
                });
            }
            if (postRecord.isRewarded == true) {
                return res.status(400).send({
                    message: "Post already rewarded"
                });
            }

            await Post.findByIdAndUpdate(postId, {
                isRewarded: true,
            })
            
            return res.status(200).send({
                data: {isRewarded: true}
            });
        } catch (err: any) {
            return res.status(400).send({
                message: err.message
            });
        }
    },

    doTakeRewardBack: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const signature = req.body.signature
            const message = req.body.message
            const postId = req.body.postId

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr.toLocaleLowerCase() != address) {
                return res.status(401).send({
                    message: "Invalid signature"
                });
            }

            let postRecord = await Post.findById(postId);
            if (address !== postRecord.address) {
                return res.status(400).send({
                    message: "Not post creator"
                });
            }
            if (postRecord.isRewarded == true) {
                return res.status(400).send({
                    message: "Already take back"
                });
            }
            let now = new Date()
            if (postRecord.timeout > now.getTime()) {
                return res.status(400).send({
                    message: "Post has not expired yet"
                });
            }

            await Post.findOneAndUpdate({postId}, {
                isRewarded: true,
            })
            
            return res.status(200).send({
                data: {isRewarded: true}
            });
        } catch (err: any) {
            return res.status(400).send({
                message: err.message
            });
        }
    },

    doSaveComment: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const content = req.body.content
            const postId = req.body.postId
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr.toLocaleLowerCase() != address) {
                return res.status(401).send({
                    message: "Invalid signature"
                });
            }

            let comment = await Comment.create({
                postId,
                address,
                content
            })

            return res.status(200).send({
                data: comment
            });
        } catch (err: any) {
            return res.status(400).send({
                message: err.message
            });
        }
    },

    doEditComment: async (req: any, res: any, next: any) => {
        try {
            const address = req.body.address
            const content = req.body.content
            const commentId = req.body.commentId
            const signature = req.body.signature
            const message = req.body.message

            const signerAddr = ethers.utils.verifyMessage(message, signature);
            if (signerAddr.toLocaleLowerCase() != address) {
                return res.status(401).send({
                    message: "Invalid signature"
                });
            }

            let commentRecord = await Comment.findOne({
                commentId
            }).exec()

            if (address !== commentRecord.address) {
                return res.status(400).send({
                    message: "Not comment creator"
                });
            }

            await Comment.findByIdAndUpdate(commentId, {
                content
            })

            return res.status(200).send({
                data: address
            });
        } catch (err: any) {
            return res.status(400).send({
                message: err.message
            });
        }
    },

    doGetPosts: async (req: any, res: any, next: any) => {
        try {
            let postRecords = await Post.find()
            return res.status(200).send({
                data: postRecords
            });
        } catch (err: any) {
            return res.status(400).send({
                message: err.message
            });
        }
    },

    doGetCommentsinPosts: async (req: any, res: any, next: any) => {
        try {
            let commentRecords = await Comment.find({
                postId: req.query.postId
            })
            return res.status(200).send({
                data: commentRecords
            });
        } catch (err: any) {
            return res.status(400).send({
                message: err.message
            });
        }
    }
}