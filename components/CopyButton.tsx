'use client';

import { useState } from 'react';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CopyButtonProps {
  content: string;
}

export default function CopyButton({ content }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          <span>已复制</span>
        </>
      ) : (
        <>
          <DocumentDuplicateIcon className="w-4 h-4" />
          <span>复制 Prompt</span>
        </>
      )}
    </button>
  );
}
