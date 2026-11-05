import { notFound } from 'next/navigation';
import { requireAdmin } from '../../../lib/auth';
import PostForm from '../../../components/PostForm';
import { updatePost } from '../actions';

export const metadata = { title: 'Edit post' };
export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params, searchParams }) {
  const { supabase } = await requireAdmin();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <>
      <h1 className="admin__title">Edit post</h1>
      <PostForm
        action={updatePost.bind(null, post.id)}
        post={post}
        error={searchParams.error}
        submitLabel="Save changes"
      />
    </>
  );
}