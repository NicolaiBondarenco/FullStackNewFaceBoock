import Post from '../models/Post.js'
import User from '../models/User.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body
    const user = await User.findById(req.userId)
    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name
      const _dirname = dirname(fileURLToPath(import.meta.url))
      req.files.image.mv(path.join(_dirname, '..', 'uploads', fileName))

      const newPostWithImg = new Post({
        username: user.username,
        title,
        text,
        imageURL: fileName,
        author: req.userId,
      })
      await newPostWithImg.save()
      await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { posts: newPostWithImg },
        },
      )
      return res.json({ newPostWithImg })
    }
    const newPostWithoutImg = new Post({
      username: user.username,
      title,
      text,
      imageURL: '',
      author: req.userId,
    })
    await newPostWithoutImg.save()
    await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $push: { posts: newPostWithoutImg },
      },
    )
    return res.json(newPostWithoutImg)
  } catch (error) {
    res.json({ message: 'Что-то пошло не так!' })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort('-createdAt')
    const popularPosts = await Post.find().limit(5).sort('-views')
    if (!posts) res.json({ message: 'Постов нет!' })
    res.json({ posts, popularPosts })
  } catch (error) {
    res.json({ message: 'Нет доступа!' })
  }
}

export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    })
    res.json(post)
  } catch (error) {
    res.json({ message: 'Нет доступа!' })
  }
}

export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const posts = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id)
      }),
    )
    res.json(posts)
  } catch (error) {
    console.error(error)
    res.json({ message: 'Ошибка при получении постов!' })
  }
}

export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.json({ message: 'Такого поста не существует!' })

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    })

    res.json({ message: 'Пост был удален!' })
  } catch (error) {
    console.error(error)
    res.json({ message: 'Ошибка при получении постов!' })
  }
}

export const updatePost = async (req, res) => {
  try {
    const { title, id, text } = req.body
    const post = await Post.findById(id)

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name
      const _dirname = dirname(fileURLToPath(import.meta.url))
      req.files.image.mv(path.join(_dirname, '..', 'uploads', fileName))
      post.imageURL = fileName || ''
    }
    post.title = title
    post.text = text

    await post.save()

    res.json(post)
  } catch (error) {
    console.error(error)
    res.json({ message: 'Ошибка при получении постов!' })
  }
}
