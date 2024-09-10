import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postResponse = await axios.get(`https://www.reddit.com/comments/${id}.json`);
        const postData = postResponse.data[0].data.children[0].data;
        const commentData = postResponse.data[1].data.children.map((child) => child.data);
        setPost(postData);
        setComments(commentData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post details:', error);
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  const renderMediaContent = (post) => {
    if (post.post_hint === 'image') {
      return <img src={post.url} alt={post.title} className="post-media-detail" />;
    }

    if (post.media && post.media.reddit_video) {
      return (
        <video controls className="post-media-detail">
          <source src={post.media.reddit_video.fallback_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (post.url) {
      return (
        <a href={post.url} target="_blank" rel="noopener noreferrer">
          View Content
        </a>
      );
    }

    return <p>No media available.</p>;
  };

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      <p>Posted by u/{post.author}</p>
      {post.selftext && <p>{post.selftext}</p>}

      {/* Render media content */}
      {renderMediaContent(post)}

      <h3>Comments</h3>
      <div className="comments-section">
        <ul>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id}>
                <p><strong>u/{comment.author}</strong></p>
                <p>{comment.body}</p>
              </li>
            ))
          ) : (
            <p>No comments available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PostDetailPage;
