import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isListNode } from '@lexical/list';

const Toolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [activeBlockType, setActiveBlockType] = useState<string>('');

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const formats = new Set<string>();
          if (selection.hasFormat('bold')) formats.add('bold');
          if (selection.hasFormat('italic')) formats.add('italic');
          if (selection.hasFormat('strikethrough')) formats.add('strikethrough');
          if (selection.hasFormat('underline')) formats.add('underline');
          if (selection.hasFormat('code')) formats.add('code');
          setActiveFormats(formats);

          const anchorNode = selection.anchor.getNode();
          let element =
            anchorNode.getKey() === 'root'
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();
          const elementKey = element.getKey();
          const elementDOM = editor.getElementByKey(elementKey);

          if (elementDOM !== null) {
            const nodeType = element.getType();
            if ($isHeadingNode(element)) {
              setActiveBlockType(`heading${element.getTag().slice(1)}`);
            } else if ($isQuoteNode(element)) {
              setActiveBlockType('quote');
            } else if ($isListNode(element)) {
              setActiveBlockType('list');
            } else {
              setActiveBlockType(nodeType);
            }
          }
        }
      });
    });
  }, [editor]);

  const handleFormat = (format: 'bold' | 'italic' | 'strikethrough' | 'code') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleBlockType = (blockType: 'paragraph' | 'heading1' | 'heading2' | 'quote') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        switch (blockType) {
          case 'paragraph':
            selection.insertNodes([$createParagraphNode()]);
            break;
          case 'heading1':
            selection.insertNodes([$createHeadingNode('h1')]);
            break;
          case 'heading2':
            selection.insertNodes([$createHeadingNode('h2')]);
            break;
          case 'quote':
            selection.insertNodes([$createQuoteNode()]);
            break;
        }
      }
    });
  };

  return (
    <div className="toolbar">
      <button className={activeFormats.has('bold') ? 'active' : ''} onClick={() => handleFormat('bold')}>Bold</button>
      <button className={activeFormats.has('italic') ? 'active' : ''} onClick={() => handleFormat('italic')}>Italic</button>
      {/* <button className={activeFormats.has('strikethrough') ? 'active' : ''} onClick={() => handleFormat('strikethrough')}>Strikethrough</button> */}
      {/* <button className={activeFormats.has('code') ? 'active' : ''} onClick={() => handleFormat('code')}>Code</button> */}
      {/* <button className={activeBlockType === 'paragraph' ? 'active' : ''} onClick={() => handleBlockType('paragraph')}>Paragraph</button> */}
      <button className={activeBlockType === 'heading1' ? 'active' : ''} onClick={() => handleBlockType('heading1')}>H1</button>
      <button className={activeBlockType === 'heading2' ? 'active' : ''} onClick={() => handleBlockType('heading2')}>H2</button>
      {/* <button className={activeBlockType === 'quote' ? 'active' : ''} onClick={() => handleBlockType('quote')}>Quote</button> */}
      <button className={activeBlockType === 'list' ? 'active' : ''} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>Bullet List</button>
      <button className={activeBlockType === 'list' ? 'active' : ''} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>Numbered List</button>
      <button onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>Remove List</button>
    </div>
  );
};

export default Toolbar;
