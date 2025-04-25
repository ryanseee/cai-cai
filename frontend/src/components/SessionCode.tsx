import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { Copy, Check } from 'lucide-react';

interface SessionCodeProps {
  code: string;
}

const SessionCode: React.FC<SessionCodeProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="bg-indigo-50 border border-indigo-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-indigo-800">Session Code</h3>
          <p className="text-2xl font-bold tracking-wide text-indigo-700 mt-1">
            {code}
          </p>
          <p className="text-xs text-indigo-600 mt-1">
            Share this code with participants to join
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          icon={copied ? <Check size={16} /> : <Copy size={16} />}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>
    </Card>
  );
};

export default SessionCode;