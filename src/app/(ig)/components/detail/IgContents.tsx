import 'highlight.js/styles/github.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from './IgDetail.module.css';
import type { IgKind } from './types';

export default function IgContents({ kind, content }: { kind: IgKind; content: string }) {
  const altPrefix = kind === 'small-group' ? '소모임' : kind.toUpperCase();

  return (
    <div className={styles.content}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ node: _node, ...props }) => <h1 className="mdx-h1" {...props} />,
          h2: ({ node: _node, ...props }) => <h2 className="mdx-h2" {...props} />,
          p: ({ node: _node, ...props }) => <p className="mdx-p" {...props} />,
          li: ({ node: _node, ...props }) => <li className="mdx-li" {...props} />,
          code: ({ node: _node, ...props }) => <code className="mdx-inline-code" {...props} />,
          pre: ({ node: _node, ...props }) => <pre className="mdx-pre" {...props} />,
          img: ({ node: _node, alt, ...props }) => (
            <img className="mdx-img" {...props} alt={alt || `${altPrefix} content image`} />
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
