import 'highlight.js/styles/github.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from './IgDetail.module.css';

export default function IgContents({ kind, content }) {
  const altPrefix = kind === 'sig' ? 'SIG' : 'PIG';

  return (
    <div className={styles.content}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ _node, ...props }) => <h1 className="mdx-h1" {...props} />,
          h2: ({ _node, ...props }) => <h2 className="mdx-h2" {...props} />,
          p: ({ _node, ...props }) => <p className="mdx-p" {...props} />,
          li: ({ _node, ...props }) => <li className="mdx-li" {...props} />,
          code: ({ _node, ...props }) => <code className="mdx-inline-code" {...props} />,
          pre: ({ _node, ...props }) => <pre className="mdx-pre" {...props} />,
          img: ({ _node, alt, ...props }) => (
            <img className="mdx-img" {...props} alt={alt || `${altPrefix} content image`} />
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
