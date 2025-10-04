import 'highlight.js/styles/github.css';
import './page.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export default function PigContents({ content }) {
  return (
    <div className="PigContent">
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
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
