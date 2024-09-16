import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";
import { getReceiverSocketId, io } from "../scoket/socket.js";
export const addNewPost = async (req, res) => {
     try {
          const { caption } = req.body;
          const image = req.file;
          const authorId = req.id;

          if (!image || !image.buffer) {
               return res.status(400).json({ message: "Image buffer required" });
          }

          // Image optimization with Sharp
          const optimizeImageBuffer = await sharp(image.buffer)
               .resize({ width: 800, height: 800 })
               .toFormat("jpeg", { quality: 80 })
               .toBuffer();

          // Buffer to data URI
          const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString("base64")}`;

          // Uploading image to Cloudinary
          const cloudResponse = await cloudinary.uploader.upload(fileUri);

          // Creating new post in MongoDB
          const post = await Post.create({
               caption,
               image: cloudResponse.secure_url,
               author: authorId,
          });

          // Updating the user's post list
          const user = await User.findById(authorId);
          if (user) {
               user.posts.push(post._id);
               await user.save();
          }

          // Populating author information (excluding password)
          await post.populate({ path: "author", select: "-password" });

          // Returning the response
          return res.status(201).json({
               message: "New Post Added",
               post,
               success: true,
          });
     } catch (err) {
          console.error("MongoDb error: ", err); // Correct logging for errors
          return res.status(500).json({ message: "Server error", success: false });
     }
};


export const getALlPost = async (req, res) => {
     try {
          const posts = await Post.find().sort({ createAt: -1 })
               .populate({
                    path: 'author', select: 'username profilePicture'
               })
               .populate({
                    path: 'comments',
                    sort: { createAt: -1 },
                    populate: {
                         path: 'author',
                         select: 'username profilePicture'
                    }
               })
          return res.status(200).json({
               posts,
               success: true
          })
     } catch (err) {
          console.log("MongoDb error" + err)
     }
}

export const getUserPost = async (req, res) => {
     try {
          const authorId = req.id;
          const posts = await Post.find({ author: authorId }).sort({ createAt: -1 }).populate({
               path: 'author',
               select: 'username,profilePicture'
          }).populate({
               path: 'comments',
               sort: { createAt: -1 },
               populate: {
                    path: 'author',
                    select: 'username, profilePicture'
               }
          })
          return res.status(200).json({
               posts,
               success: true
          })
     } catch (err) {
          console.log("MongoDb err" + err)
     }
}

export const likePost = async (req, res) => {
     try {
          const likeKarneWaleUserKiId = req.id;
          const postId = req.params.id;
          const post = await Post.findById(postId)
          if (!post) return res.status(404).json({ message: "Post not found", success: false })

          await post.updateOne({ $addToSet: { likes: likeKarneWaleUserKiId } });
          await post.save();

          // implement socket io for real time notification

          const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture')
          const postOwnerId = post.author.toString();
          if (postOwnerId !== likeKarneWaleUserKiId) {
               //emit a notificaion event
               const notificaion = {
                    type: 'like',
                    userId: likeKarneWaleUserKiId,
                    userDetails: user,
                    postId,
                    message: 'YOur post liked'
               }
               const postOwenerSocketId = getReceiverSocketId(postOwnerId);
               io.to(postOwenerSocketId).emit('notification', notificaion)
          }


          return res.status(200).json({ message: "Post Liked", success: true })
     } catch (err) {
          console.log("MongoDb err" + err);
     }
}
export const dislikePost = async (req, res) => {
     try {
          const dislikeKarneWaleUserKiId = req.id;
          const postId = req.params.id;
          const post = await Post.findById(postId)
          if (!post) return res.status(404).json({ message: "Post not found", success: false })

          await post.updateOne({ $pull: { likes: dislikeKarneWaleUserKiId } });
          await post.save();

          // implement socket io for real time notification

          const user = await User.findById(dislikeKarneWaleUserKiId).select('username profilePicture')
          const postOwnerId = post.author.toString();
          if (postOwnerId !== dislikeKarneWaleUserKiId) {
               //emit a notificaion event
               const notificaion = {
                    type: 'dislike',
                    userId: dislikeKarneWaleUserKiId,
                    userDetails: user,
                    postId,
                    message: 'Your post disliked'
               }
               const postOwenerSocketId = getReceiverSocketId(postOwnerId);
               io.to(postOwenerSocketId).emit('notification', notificaion)
          }


          return res.status(200).json({ message: "Post Disliked", success: true })
     } catch (err) {
          console.log("MongoDb err" + err);
     }
}

export const addComment = async (req, res) => {
     try {
          const postId = req.params.id;
          const commentKrneWalaUserKiId = req.id;

          const { text } = req.body;

          const post = await Post.findById(postId);

          if (!text) return res.status(400).json({ message: 'text is required', success: false });

          const comment = await Comment.create({
               text,
               author: commentKrneWalaUserKiId,
               post: postId
          })

          await comment.populate({
               path: 'author',
               select: "username profilePicture"
          });

          post.comments.push(comment._id);
          await post.save();

          return res.status(201).json({
               message: 'Comment Added',
               comment,
               success: true
          })

     } catch (error) {
          console.log(error);
     }
};

export const getCommentOfPost = async (req, res) => {
     try {
          const postId = req.params.id;
          const comments = await Comment.find({ post: postId }).populte('author', 'username', 'profilePicture');

          if (!comments) {
               return res.status(404).json({ messaeg: "No comments found for this post", success: false });
          }

          return res.status(200).json({ success: true, comments });
     } catch (error) {
          console.log("mongodb err" + err);
     }
}

export const deletePost = async (req, res) => {
     try {
          const postId = req.params.id;
          const authorId = req.id;

          const post = await Post.findById(postId);
          if (!post) return res.status(404).json({ message: 'Post not found', success: false });

          // check if the logged-in user is the owner of the post
          if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' });

          // delete post
          await Post.findByIdAndDelete(postId);

          // remove the post id from the user's post
          let user = await User.findById(authorId);
          user.posts = user.posts.filter(id => id.toString() !== postId);
          await user.save();

          // delete associated comments
          await Comment.deleteMany({ post: postId });

          return res.status(200).json({
               success: true,
               message: 'Post deleted'
          })

     } catch (error) {
          console.log(error);
     }
}

export const bookMarkPost = async (req, res) => {
     try {
          const postId = req.params.id;
          const authorId = req.id;
          const post = await Post.findById(postId);
          if (!post) return res.status(404).json({ message: "Post not found", success: false })

          const user = await User.findById(authorId);
          if (user.bookmarks.includes(post._id)) {
               // already bookmarked -> remove from the bookmark
               await user.updateOne({ $pull: { bookmarks: post._id } })
               await user.save();
               return res.status(200).json({ type: 'unsaved', message: "Post Bookmark removed from bookmark", success: true })
          } else {
               // Bookmark karna padega

               await user.updateOne({ $push: { bookmarks: post._id } })
               await user.save();
               return res.status(200).json({ type: 'unsaved', message: "Post Bookmark", success: true })
          }
     } catch (err) {
          console.log("Mongodb err" + err);
     }
}