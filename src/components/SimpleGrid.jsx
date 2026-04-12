'use client';

import React from 'react';

function gcd(m, n) {
  if (n === 0) return m;
  return gcd(n, m % n);
}

function lcm(m, n) {
  return (m * n) / gcd(m, n);
}

function generateStyle(rows, cols, childrenCount) {
  const styles = {
    display: 'grid',
  };

  if (typeof rows === 'number') {
    styles['gridTemplateRows'] = 'minmax(0, 1fr) '.repeat(rows);
  }

  if (typeof cols === 'number') {
    styles['gridTemplateColumns'] = 'minmax(0, 1fr) '.repeat(lcm(cols, childrenCount % cols));
  }

  return styles;
}

export default function SimpleGrid({ rows, cols, children, ...props }) {
  const childrenCount = React.Children.count(children);
  const leftOversCount = childrenCount % cols;
  const LCM = lcm(cols, leftOversCount);

  return (
    <div
      className="simpleGridContainer"
      style={generateStyle(rows, cols, childrenCount)}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (index < childrenCount - leftOversCount) {
          return (
            <span
              key={child.key || `paired-${index}`}
              style={{
                minWidth: '0',
                gridColumn: `${((index % cols) * LCM) / cols + 1} / span ${LCM / cols}`,
              }}
            >
              {child}
            </span>
          );
        } else {
          const i = index - childrenCount + leftOversCount;
          return (
            <span
              key={child.key || `unpaired-${i}`}
              style={{
                minWidth: '0',
                gridColumn: `${(i * LCM) / leftOversCount + 1} / span ${LCM / leftOversCount}`,
              }}
            >
              {child}
            </span>
          );
        }
      })}
    </div>
  );
}
