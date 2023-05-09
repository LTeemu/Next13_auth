import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
  userId: { type: String, required: true }, // logged user's id
  userImage: { type: String }, // user's image url
  userName: { type: String, required: true }, // user's name
  title: { type: String, required: true, unique: true, minlength: 5, maxlength: 30 }, // post title text
  content: { type: String, required: true, minlength: 10, maxlength: 100 }, // post content text
  updatedOn: { type: Date, default: Date.now } // timestamp
});

const Post = models.Post || model("Post", PostSchema);
export default Post;