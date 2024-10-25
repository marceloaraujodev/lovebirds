import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  headline: {
    type: String,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  id: {
    type: Number,
    required: [true, 'Please provide a id']
  },
  image: {
    type: String,
    required: [true, 'Please provide a image url string']
  },
  cost: {
    type: Number,
  },
 

}, { timestamps: true });

const Post = mongoose.models?.Post || mongoose.model('Post', PostSchema);

export default Post;