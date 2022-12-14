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
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
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
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
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
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const getPost = async (req, res) => {
	const { id } = req.params;

	try {
		let post;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			post = await Post.findById(id);
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
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
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const updatePost = async (req, res) => {
	const { id } = req.params;
	const {
		title,
		message,
		creator,
		name,
		privacy,
		selectedFile,
		tags,
		alt,
		likes,
		saves,
		comments,
		createdAt,
	} = req.body;

	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).send(`No post found.`);
		}

		if (
			typeof title !== "string" ||
			typeof message !== "string" ||
			typeof creator !== "string" ||
			typeof name !== "string" ||
			typeof privacy !== "string" ||
			!Array.isArray(tags) ||
			typeof alt !== "string" ||
			!Array.isArray(likes) ||
			!Array.isArray(saves) ||
			!Array.isArray(comments) ||
			typeof createdAt !== "string" ||
			typeof selectedFile !== "object"
		) {
			return res.status(400).send(`Invalid post data.`);
		}

		const updatedPost = {
			_id: id,
			name: name.trim(),
			creator: creator.trim(),
			title: title.trim(),
			message: message.trim(),
			tags: tags.map(tag => tag.trim()),
			selectedFile,
			alt: alt.trim(),
			privacy,
			likes,
			saves,
			comments,
			createdAt,
			updatedAt: new Date().toISOString(),
		};

		await Post.findByIdAndUpdate(id, updatedPost, { new: true });
		res.status(200).json(updatedPost);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
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
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
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

		let post;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			post = await Post.findById(id);
		}

		if (!post) return res.status(400).send(`Post not found.`);

		const index = post?.likes?.findIndex(id => id === String(creator));

		if (index === -1) {
			post?.likes?.push(creator);
		} else {
			post.likes = post?.likes.filter(id => id !== String(creator));
		}

		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
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

		let post;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			post = await Post.findById(id);
		}

		if (!post) return res.status(400).send(`Post not found.`);
		const index = post?.saves?.findIndex(id => id === String(creator));

		if (index === -1) {
			post?.saves?.push(creator);
		} else {
			post.saves = post?.saves?.filter(id => id !== String(creator));
		}

		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const addComment = async (req, res) => {
	const { id } = req.params;
	const { value } = req.body;

	try {
		let post;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			post = await Post.findById(id);
		}

		if (!post) return res.status(404).send(`Post not found.`);

		post?.comments?.push(value);
		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const deleteComment = async (req, res) => {
	const { id, commentId } = req.params;

	try {
		let post;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			post = await Post.findById(id);
		}

		if (!post) return res.status(404).send(`Post not found.`);

		post.comments = post?.comments?.filter(comment => comment.commentId !== commentId);

		const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(updatedPost);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const getPostsByCreator = async (req, res) => {
	const { id } = req.query;

	try {
		const posts = await Post.find({ creator: { $eq: id } });

		res.json({ data: posts });
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const getSavedPosts = async (req, res) => {
	const { id } = req.query;

	try {
		const posts = await Post.find({ saves: { $eq: id } });

		res.json({ data: posts, count: posts?.length });
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export default router;
