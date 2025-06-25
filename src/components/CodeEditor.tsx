import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '400px',
  readOnly = false,
}) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[javascript()]}
        onChange={onChange}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;