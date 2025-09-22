import 'highlight.js/styles/github.css';
import './page.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export default function SigContents({ content }) {
  return (
    <div className="SigContent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => <h1 className="mdx-h1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mdx-h2" {...props} />,
          p: ({ node, ...props }) => <p className="mdx-p" {...props} />,
          li: ({ node, ...props }) => <li className="mdx-li" {...props} />,
          code: ({ node, ...props }) => <code className="mdx-inline-code" {...props} />,
          pre: ({ node, ...props }) => <pre className="mdx-pre" {...props} />,
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
