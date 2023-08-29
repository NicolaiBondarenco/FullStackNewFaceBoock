import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body
    if (!comment) return

    const newComment = new Comment({ comment })
    await newComment.save()

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comment: newComment._id },
      })
    } catch (error) {
      console.log(error)
    }
    res.json(newComment)
  } catch (error) {
    return res.json({ message: 'Что-то пошло не так!' })
  }
}
