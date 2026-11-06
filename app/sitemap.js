import { getAllPosts } from '../lib/posts';
import { SITE_URL } from '../lib/site';

export const revalidate = 3600; // rebuild at most once an hour

export default async function sitemap() {
  const posts = await getAllPosts();

  const pages = ['', '/blog', '/about', '/contact'].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '' || path === '/blog' ? 'weekly' : 'yearly',
    priority: path === '' ? 1 : 0.7,
  }));

  const postPages = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.published_on,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...pages, ...postPages];
}