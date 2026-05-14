import Discussion from "../models/Discussion.js";

// CREATE POST
export const createDiscussion = async (req, res) => {
  try {
    const { userEmail, title, description } = req.body;

    const post = await Discussion.create({
      userEmail,
      title,
      description,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};