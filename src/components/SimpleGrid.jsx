'use client';

function generateStyle(rows, cols) {
  const styles = {
    display: 'grid',
  };

  if (typeof rows === 'number') {
    styles['gridTemplateRows'] = '1fr '.repeat(rows);
  }

  if (typeof cols === 'number') {
    styles['gridTemplateColumns'] = '1fr '.repeat(cols);
  }

  return styles;
}

export default function SimpleGrid({ rows, cols, children, ...props }) {
  return (
    <div className="simpleGridContainer" style={generateStyle(rows, cols)} {...props}>
      {children}
    </div>
  );
}
