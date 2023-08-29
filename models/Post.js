import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    username: { type: String },
    title: { type: String, require: true },
    text: { type: String, require: true },
    imageURL: { type: String, default: '' },
    views: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
  },
  { timestamps: true },
)
export default mongoose.model('Post', PostSchema)
