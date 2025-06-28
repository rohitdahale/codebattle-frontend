import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  language?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '400px',
  readOnly = false,
  language = 'javascript',
  className = '',
}) => {
  // Language extension mapping
  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return [javascript()];
      case 'python':
        return [python()];
      case 'java':
        return [java()];
      case 'cpp':
        return [cpp()];
      default:
        return [javascript()];
    }
  };

  const extensions = getLanguageExtension(language);

  return (
    <div className={className} style={{ height }}>
      <CodeMirror
        value={value}
        onChange={onChange}
        height={height}
        readOnly={readOnly}
        theme={oneDark}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
          searchKeymap: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;