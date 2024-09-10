import axios from 'axios';
import {
  FETCH_REDDIT_POSTS_REQUEST,
  FETCH_REDDIT_POSTS_SUCCESS,
  FETCH_REDDIT_POSTS_FAILURE
} from './types';

// Action to fetch Reddit posts
export const fetchRedditPosts = () => async (dispatch) => {
  dispatch({ type: FETCH_REDDIT_POSTS_REQUEST });

  try {
    const response = await axios.get('https://www.reddit.com/r/HumansBeingBros.json');
    const posts = response.data.data.children.map(child => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      selftext: child.data.selftext,
      ups: child.data.ups,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      permalink: child.data.permalink,
      thumbnail: child.data.thumbnail,    // Thumbnail for images
      url: child.data.url,                // URL for external links or media
      post_hint: child.data.post_hint,    // Hint for post type (image, link, etc.)
      media: child.data.media,            // Media for videos or other types
    }));

    dispatch({
      type: FETCH_REDDIT_POSTS_SUCCESS,
      payload: posts,
    });
  } catch (error) {
    dispatch({
      type: FETCH_REDDIT_POSTS_FAILURE,
      payload: error.message,
    });
  }
};
