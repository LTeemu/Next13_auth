'use client'
import { useSession, signIn, signOut, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function Home() {
  const { data: session } = useSession()
  const [providers, setProviders] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
    getPosts()
  }, []);

  const getPosts = async () => {
    const response = await fetch('/api/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    setPosts([...data.posts])
  }

  useEffect(() => {
    console.log(posts)
  }, [posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        userImage: session.user.image,
        userName: session.user.name,
        title,
        content
      }),
    });
    if (response.ok) {
      getPosts()
    } else {
      alert('Something went wrong');
    }
  };

  //LOGGED IN VIEW
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        {JSON.stringify(session)}
        <Image src={session.user.image} width={100} height={100} alt="Profile image" />
        <button onClick={() => signOut()}>Sign out</button>
        <div className="px-4 mt-4">
          <h1>Create a new post</h1>
          <form onSubmit={handleSubmit} className='grid text-black'>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="content">Content</label>
            <textarea
              className="p-1"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button className="bg-blue-600" type="submit">Submit</button>
          </form>
        </div>
        <div className="grid gap-y-4">
          {posts.length > 0 && posts.map((post) => (
            <div className="bg-zinc-800">
              <p>{post.userImage}</p>
              <p>{post.title}</p>
              <p>{post.content}</p>
            </div>
          )
          )}
        </div>
      </>
    )
  }

  //NOT LOGGED VIEW
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in (ALL)</button>
      {providers &&
        Object.values(providers).map((provider) => (
          <button
            type='button'
            key={provider.name}
            onClick={() => {
              signIn(provider.id);
            }}
          >
            Sign in {provider.name}
          </button>
        ))}
      <div className="grid gap-y-4">
        {posts.length > 0 && posts.map((post) => (
          <div className="bg-zinc-800">
            <p>{post.userName}</p>
            <Image src={post.userImage} width={50} height={50} alt={post.title} />
            <p>{post.title}</p>
            <p>{post.content}</p>
          </div>
        )
        )}
      </div>
    </>
  )
}
