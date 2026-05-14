import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import { IoImageOutline, IoCloseCircle } from "react-icons/io5";

export default function PostPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [replyTexts, setReplyTexts] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch posts failed:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const createPost = async () => {
    if (!title || !description) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setDescription("");
      removeImage();
      fetchPosts(); 
    } catch (err) {
      console.error("Create post failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const likePost = async (id) => {
    try {
      await api.put(`/posts/${id}/like`);
      fetchPosts();
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const addReply = async (id) => {
    if (!replyTexts[id]) return;
    try {
      await api.post(`/posts/${id}/reply`, { text: replyTexts[id] });
      setReplyTexts({ ...replyTexts, [id]: "" });
      fetchPosts();
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Community Feed</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Share knowledge, updates, and images.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
            placeholder="Write your thoughts here..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {imagePreview && (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-48 w-auto rounded-xl object-cover shadow-sm" />
              <button 
                onClick={removeImage} 
                className="absolute -right-2 -top-2 rounded-full bg-white text-rose-500 shadow-md transition hover:scale-110 dark:bg-slate-800"
              >
                <IoCloseCircle className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <IoImageOutline className="h-5 w-5" />
                Add Image
              </button>
            </div>

            <Button onClick={createPost} disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Share Post"}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {posts.map((post) => {
          const isLiked = post.likes.includes(user?.id);

          return (
            <motion.div key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {post.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{post.user?.name || "Unknown User"}</p>
                  <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{post.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{post.description}</p>

              {/* 👇 THE IMAGE DISPLAY 👇 */}
              {post.images && post.images.length > 0 && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <img src={post.images[0]} alt="Post content" className="w-full object-cover" />
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => likePost(post._id)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isLiked 
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {isLiked ? "❤️ Liked" : "🤍 Like"} ({post.likes.length})
                </button>
              </div>

              {post.replies.length > 0 && (
                <div className="mt-6 space-y-3 rounded-2xl bg-slate-50/50 p-4 dark:bg-slate-900/30">
                  {post.replies.map((reply, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {reply.user?.name?.split(" ")[0]}:
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300">{reply.text}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                  placeholder="Write a reply..."
                  value={replyTexts[post._id] || ""}
                  onChange={(e) => setReplyTexts({ ...replyTexts, [post._id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addReply(post._id)}
                />
                <Button variant="secondary" className="!py-2" onClick={() => addReply(post._id)}>Reply</Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}