// import Post from "../models/Post.js";

// export const createPost = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     // req.user comes from your protect middleware
//     const post = await Post.create({
//       user: req.user._id, 
//       title,
//       description,
//     });
    
//     // Fetch it back to populate the user name before sending to frontend
//     const populatedPost = await Post.findById(post._id).populate("user", "name");
//     res.status(201).json(populatedPost);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("user", "name") // Gets post author's name
//       .populate("replies.user", "name") // Gets reply authors' names
//       .sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const toggleLike = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const post = await Post.findById(req.params.id);

//     if (!post) return res.status(404).json({ message: "Post not found" });

//     // Check if user already liked it
//     if (post.likes.includes(userId)) {
//       post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
//     } else {
//       post.likes.push(userId);
//     }

//     await post.save();
//     res.json({ message: "Like toggled successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const addReply = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const post = await Post.findById(req.params.id);

//     if (!post) return res.status(404).json({ message: "Post not found" });

//     post.replies.push({ user: req.user._id, text });
//     await post.save();

//     res.json({ message: "Reply added successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Get the Cloudinary URL if a file was uploaded
    const imageUrl = req.file ? req.file.path : null;

    const postData = {
      user: req.user._id, 
      title,
      description,
    };

    if (imageUrl) {
      postData.images = [imageUrl];
    }

    const post = await Post.create(postData);
    const populatedPost = await Post.findById(post._id).populate("user", "name");
    
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .populate("replies.user", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: "Like toggled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.replies.push({ user: req.user._id, text });
    await post.save();

    res.json({ message: "Reply added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};