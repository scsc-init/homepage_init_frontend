// components/sig/MDXEditor.jsx
'use client';

import React, { forwardRef } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  InsertImage,
  Separator,
} from '@mdxeditor/editor';
import styles from './editor.module.css';

import '@mdxeditor/editor/style.css';

const InitializedMDXEditor = forwardRef(function InitializedMDXEditor(
  { markdown = '', onChange = () => {} },
  ref,
) {
  return (
    <MDXEditor
      className={styles.mdxeditor}
      ref={ref}
      markdown={markdown}
      onChange={onChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        imagePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles options={['Bold', 'Italic', 'Underline']} />
              <CodeToggle />
              <Separator />
              <InsertImage />
              <Separator />
              <UndoRedo />
            </>
          ),
        }),
      ]}
    />
  );
});

export default InitializedMDXEditor;
