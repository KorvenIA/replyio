'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Renders a markdown string into React elements.
 * Supports: **bold**, `inline code`, numbered lists, bullet lists, paragraphs.
 */
function renderMarkdown(text: string): ReactNode {
  // Split into blocks by double newline (paragraphs / list groups)
  const blocks = text.split(/\n{2,}/);

  return blocks.map((block, bIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Detect ordered list block (lines starting with "1." "2." etc.)
    const orderedListMatch = trimmed.match(/^(\d+)\./m);
    const isOrderedList = orderedListMatch && trimmed.split('\n').every(l => /^\d+\.\s/.test(l.trim()) || l.trim() === '');
    if (isOrderedList) {
      const items = trimmed.split('\n').filter(l => /^\d+\.\s/.test(l.trim()));
      return (
        <ol key={bIdx} style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'decimal' }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>{renderInline(item.replace(/^\d+\.\s*/, ''))}</li>
          ))}
        </ol>
      );
    }

    // Detect unordered list block (lines starting with "- " or "• ")
    const isUnorderedList = trimmed.split('\n').every(l => /^[-•*]\s/.test(l.trim()) || l.trim() === '');
    if (isUnorderedList) {
      const items = trimmed.split('\n').filter(l => /^[-•*]\s/.test(l.trim()));
      return (
        <ul key={bIdx} style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>{renderInline(item.replace(/^[-•*]\s*/, ''))}</li>
          ))}
        </ul>
      );
    }

    // Regular paragraph — may contain single newlines within
    const lines = trimmed.split('\n');
    return (
      <p key={bIdx} style={{ margin: '6px 0' }}>
        {lines.map((line, lIdx) => (
          <span key={lIdx}>
            {lIdx > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </p>
    );
  });
}

/** Renders inline markdown: **bold**, `code` */
function renderInline(text: string): ReactNode {
  // Split on **bold** and `code` patterns
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{
          background: '#E5E7EB',
          padding: '1px 5px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'ui-monospace, monospace',
        }}>{part.slice(1, -1)}</code>
      );
    }
    return part;
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! How can I help you today with the academy courses?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageContent = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessageContent } as Message];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageContent,
          context: 'This is a test session for Replyio customer support assistant. The academy offers courses on web development, programming, and software engineering.',
        }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Sorry, I encountered an error.' }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Could not connect to the assistant server.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#FFFFFF', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1A1A1A'
    }}>
      {/* Top Header */}
      <header style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #E5E5E5', 
        display: 'flex', 
        justifyContent: 'between', 
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{ 
            fontSize: '12px', 
            color: '#888888', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ← Back to Dashboard
          </Link>
          <span style={{ width: '1px', height: '12px', background: '#E5E5E5' }}></span>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>AI Assistant Sandbox</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
          <span style={{ fontSize: '11px', color: '#666666', fontWeight: '500' }}>Online</span>
        </div>
      </header>

      {/* Messages Chat Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '32px 24px', 
        maxWidth: '640px', 
        width: '100%', 
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: isUser ? 'flex-end' : 'flex-start' 
            }}>
              <div style={{ 
                maxWidth: '80%', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                lineHeight: '1.6',
                border: '1px solid',
                backgroundColor: isUser ? '#EFF6FF' : '#F7F7F7',
                color: isUser ? '#1E40AF' : '#1A1A1A',
                borderColor: isUser ? '#BFDBFE' : '#E5E5E5',
              }}>
                {isUser ? msg.content : renderMarkdown(msg.content)}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              backgroundColor: '#F7F7F7',
              color: '#888888',
              border: '1px solid #E5E5E5',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box at the Bottom */}
      <footer style={{ 
        borderTop: '1px solid #E5E5E5', 
        padding: '20px 24px',
        background: '#FFFFFF'
      }}>
        <form onSubmit={handleSend} style={{ 
          maxWidth: '640px', 
          margin: '0 auto', 
          display: 'flex', 
          gap: '12px' 
        }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '10px 14px', 
              border: '1px solid #E5E5E5', 
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ 
              padding: '10px 18px', 
              background: '#2563EB', 
              color: '#FFFFFF', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              opacity: (loading || !input.trim()) ? 0.6 : 1
            }}
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
