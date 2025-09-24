import React from 'react';
import classNames from 'classnames';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

type Props = {
  addComment: (newComment: Omit<Comment, 'id'>) => Promise<Comment>;
  post: Post;
};

export const NewCommentForm: React.FC<Props> = ({ addComment, post }) => {
  const [name, setName] = React.useState('');
  const [isNameError, setIsNameError] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [isEmailError, setIsEmailError] = React.useState(false);
  const [body, setBody] = React.useState('');
  const [isBodyError, setIsBodyError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNameError(false);
    setSubmitError(null);
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEmailError(false);
    setSubmitError(null);
    setEmail(e.target.value);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsBodyError(false);
    setSubmitError(null);
    setBody(e.target.value);
  };

  const validateForm = () => {
    let isValid = true;

    if (name.trim() === '') {
      setIsNameError(true);
      isValid = false;
    }

    if (email.trim() === '') {
      setIsEmailError(true);
      isValid = false;
    }

    if (body.trim() === '') {
      setIsBodyError(true);
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    addComment({
      postId: post.id,
      name,
      email,
      body,
    })
      .then(() => {
        setBody('');
      })
      .catch(() => {
        setSubmitError('Failed to add comment. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setBody('');
    setIsNameError(false);
    setIsEmailError(false);
    setIsBodyError(false);
    setSubmitError(null);
  };

  const handleClearButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    clearForm();
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={handleFormSubmit}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            value={name}
            onChange={handleNameChange}
            className={classNames('input', { 'is-danger': isNameError })}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {isNameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {isNameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            value={email}
            onChange={handleEmailChange}
            className={classNames('input', { 'is-danger': isEmailError })}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {isEmailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {isEmailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            value={body}
            onChange={handleBodyChange}
            className={classNames('textarea', { 'is-danger': isBodyError })}
          />
        </div>

        {isBodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      {submitError && (
        <div className="notification is-danger" data-cy="SubmitError">
          {submitError}
        </div>
      )}

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', {
              'is-loading': isLoading,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={handleClearButtonClick}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
