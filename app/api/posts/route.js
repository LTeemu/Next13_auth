import { connectToMongoDB } from '@utils/mongodb';
import Post from '@models/post';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { userId, userImage, userName, title, content } = await request.json()
    await connectToMongoDB();
    const post = new Post({
      _id: new ObjectId(),
      userId,
      userImage,
      userName,
      title,
      content,
      updatedOn: Date.now()
    });
    await post.save();
    return NextResponse.json({ message: 'Post created successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    await connectToMongoDB();
    const posts = await Post.find()
    return posts.length > 0
      ? NextResponse.json({ posts }, { status: 200 })
      : NextResponse.next({ status: 204 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}