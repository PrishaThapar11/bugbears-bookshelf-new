import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkBreaks]} // a single Enter becomes a line break
      components={{
        // the post title is already the page's h1
        h1: ({ node, ...props }) => <h2 {...props} />,
        a: ({ node, href, children: kids }) => {
          const external = /^https?:\/\//i.test(href ?? '');
          return (
            <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {kids}
            </a>
          );
        },
      }}
    >
      {String(children ?? '')}
    </ReactMarkdown>
  );
}