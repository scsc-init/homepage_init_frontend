"use client";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  imagePlugin,
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  InsertImage,
  Separator,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";

export default function InitializedMDXEditor(props) {
  const { editorRef = null, markdown = "", onChange = () => {} } = props;

  return (
    <MDXEditor
      ref={editorRef}
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
              <BoldItalicUnderlineToggles
                options={["Bold", "Italic", "Underline"]}
              />
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
}
