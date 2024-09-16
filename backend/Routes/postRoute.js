import express from "express"
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Middlewares/multer.js";
import { addComment, addNewPost, bookMarkPost, deletePost, dislikePost, getALlPost, getCommentOfPost, getUserPost, likePost } from "../Controllers/postController.js";

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost)
router.route('/all').get(isAuthenticated, getALlPost)
router.route('/userpost/all').get(isAuthenticated, getUserPost)
router.route('/:id/like').get(isAuthenticated, likePost)
router.route('/:id/dislike').get(isAuthenticated, dislikePost)
router.route('/:id/comment').post(isAuthenticated, addComment)
router.route('/:id/comment/all').post(isAuthenticated, getCommentOfPost)
router.route('/delete/:id').delete(isAuthenticated, deletePost)
router.route('/:id/bookmark').get(isAuthenticated, bookMarkPost)

export default router