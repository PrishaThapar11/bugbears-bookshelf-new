import PostForm from '../../../components/PostForm';
import { createPost } from '../actions';

export const metadata = { title: 'New post' };

export default function NewPostPage({ searchParams }) {
  return (
    <>
      <h1 className="admin__title">New post</h1>
      <PostForm action={createPost} error={searchParams.error} submitLabel="Save post" />
    </>
  );
}