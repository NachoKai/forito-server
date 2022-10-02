import express from "express";
import escapeRegExp from "lodash";
import mongoose from "mongoose";

import Post from "../models/post.js";

const router = express.Router();

export const getAllPosts = async (_req, res) => {
	try {
		const posts = await Post.find().sort({ _id: -1 });

		res.status(200).json({
			data: posts,
			count: posts?.length,
		});
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const getPosts = async (req, res) => {
	const { page } = req.query;

	try {
		const POSTS_LIMIT = 6;
		const startIndex = (Number(page) - 1) * POSTS_LIMIT;
		const total = await Post.countDocuments({});
		const posts = await Post.find().sort({ _id: -1 }).limit(POSTS_LIMIT).skip(startIndex);
		const privatePostsQuantity = posts?.filter(
			post => post.privacy === "private"
		)?.length;
		const postsWithPrivate = await Post.find()
			.sort({ _id: -1 })
			.limit(POSTS_LIMIT + privatePostsQuantity)
			.skip(startIndex);

		res.status(200).json({
			data: postsWithPrivate,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / POSTS_LIMIT),
			count: total,
		});
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const getPostsBySearch = async (req, res) => {
	const { searchQuery, tags } = req.query;

	try {
		const safeSearchQuery = escapeRegExp(searchQuery);

		if (!searchQuery && !tags) return;

		const title = new RegExp(safeSearchQuery, "i");
		const posts = await Post.find({
			$or: [{ title }, { tags: { $in: tags.split(",") } }],
		});

		res.status(200).json({ data: posts });
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const getPost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Post.findById(id);

		res.status(200).json(post);
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const createPost = async (req, res) => {
	const post = req.body;
	const creator = req.userId;

	try {
		const newPost = new Post({
			...post,
			creator,
			createdAt: new Date().toISOString(),
		});

		await newPost.save();
		res.status(200).json(newPost);
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const updatePost = async (req, res) => {
	const { id } = req.params;
	const { title, message, creator, name, privacy, selectedFile, tags } = req.body;

	try {
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).send(`No post found.`);

		const updatedPost = {
			creator,
			name,
			privacy,
			title,
			message,
			tags,
			selectedFile,
			_id: id,
		};

		await Post.findByIdAndUpdate(id, updatedPost, { new: true });
		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const deletePost = async (req, res) => {
	const { id } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).send(`No post found.`);
		}

		await Post.findByIdAndRemove(id);
		res.status(200).json({ message: "Post deleted successfully." });
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const likePost = async (req, res) => {
	const { id } = req.params;
	const creator = req.userId;

	try {
		if (!creator) {
			return res.status(401).send("Unauthorized");
		}
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).send(`No post found.`);
		}

		const post = await Post.findById(id);

		if (!post) return res.status(400).send(`Post not found.`);

		const index = post?.likes?.findIndex(id => id === String(creator));

		if (index === -1) {
			post?.likes?.push(creator);
		} else {
			post.likes = post?.likes.filter(id => id !== String(creator));
		}

		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const savePost = async (req, res) => {
	const { id } = req.params;
	const creator = req.userId;

	try {
		if (!creator) {
			return res.status(401).send("Unauthorized");
		}
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).send(`No post found.`);
		}

		const post = await Post.findById(id);

		if (!post) return res.status(400).send(`Post not found.`);
		const index = post?.saves?.findIndex(id => id === String(creator));

		if (index === -1) {
			post?.saves?.push(creator);
		} else {
			post.saves = post?.saves?.filter(id => id !== String(creator));
		}

		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const addComment = async (req, res) => {
	const { id } = req.params;
	const { value } = req.body;

	try {
		const post = await Post.findById(id);

		if (!post) return res.status(404).send(`Post not found.`);

		post?.comments?.push(value);
		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const deleteComment = async (req, res) => {
	const { id, commentId } = req.params;

	try {
		const post = await Post.findById(id);

		if (!post) return res.status(404).send(`Post not found.`);

		post.comments = post?.comments?.filter(comment => comment.commentId !== commentId);

		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const getPostsByCreator = async (req, res) => {
	const { id } = req.query;

	try {
		const posts = await Post.find({ creator: { $eq: id } });

		res.json({ data: posts });
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export const getSavedPosts = async (req, res) => {
	const { id } = req.query;

	try {
		const posts = await Post.find({ saves: { $eq: id } });

		res.json({ data: posts });
	} catch (error) {
		res.status(400).json({ message: error?.message });
		console.error(error);
	}
};

export default router;
