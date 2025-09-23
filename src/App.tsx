import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';

import { client } from './utils/fetchClient';
import { useCallback, useEffect, useState } from 'react';
import { User } from './types/User';
import { Post } from './types/Post';
import { Comment } from './types/Comment';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [postsLoadingError, setPostsLoadingError] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsLoadingError, setCommentsLoadingError] = useState(false);

  useEffect(() => {
    client
      .get<User[]>('/users')
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    setIsPostsLoading(true);
    setPostsLoadingError(false);
    setPosts([]);

    client
      .get<Post[]>(`/posts?userId=${selectedUser.id}`)
      .then(setPosts)
      .catch(() => {
        setPostsLoadingError(true);
      })
      .finally(() => {
        setIsPostsLoading(false);
      });
  }, [selectedUser]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedPost(null);
  };

  const togglePostSelect = (postId: Post | null) => {
    setSelectedPost(postId === selectedPost ? null : postId);
  };

  const loadComments = useCallback(() => {
    if (!selectedPost) {
      return;
    }

    setIsCommentsLoading(true);
    setCommentsLoadingError(false);
    setComments([]);

    client
      .get<Comment[]>(`/comments?postId=${selectedPost.id}`)
      .then(setComments)
      .catch(() => setCommentsLoadingError(true))
      .finally(() => setIsCommentsLoading(false));
  }, [selectedPost]);

  const addComment = (newComment: Omit<Comment, 'id'>) => {
    return client
      .post<Comment>('/comments', newComment)
      .then(comment => {
        setComments(prevComments => [...prevComments, comment]);

        return comment;
      })
      .catch(error => {
        throw error;
      });
  };

  const deleteComment = (commentId: number) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId),
    );

    client
      .delete(`/comments/${commentId}`)
      .then(() =>
        setComments(prevComments =>
          prevComments.filter(comment => comment.id !== commentId),
        ),
      );
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  setUser={handleUserSelect}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {isPostsLoading && <Loader />}

                {postsLoadingError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {selectedUser &&
                  !isPostsLoading &&
                  !postsLoadingError &&
                  (posts.length > 0 ? (
                    <PostsList
                      posts={posts}
                      setPost={togglePostSelect}
                      selectedPost={selectedPost}
                    />
                  ) : (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': selectedPost !== null },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails
                  post={selectedPost}
                  comments={comments}
                  loadComments={loadComments}
                  isCommentsLoading={isCommentsLoading}
                  commentsLoadingError={commentsLoadingError}
                  deleteComment={deleteComment}
                  addComment={addComment}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
