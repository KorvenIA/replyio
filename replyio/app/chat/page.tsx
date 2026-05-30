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

function BotMessage({ content, ticketId }: { content: string, ticketId?: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitted(true);
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          ticketId,
          ratingType: 'bot_response'
        })
      });
    } catch (e) {
      console.error('Error submitting rating');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ 
        maxWidth: '100%', 
        padding: '10px 14px', 
        borderRadius: '8px', 
        fontSize: '13px', 
        lineHeight: '1.6',
        border: '1px solid #E5E5E5',
        backgroundColor: '#F7F7F7',
        color: '#1A1A1A',
      }}>
        {renderMarkdown(content)}
      </div>

      {!submitted ? (
        <div style={{ marginTop: '8px', padding: '10px', background: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: '8px', width: '100%', maxWidth: '320px', boxSizing: 'border-box' }}>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: '500' }}>Rate this response:</p>
          <div style={{ display: 'flex', gap: '4px', cursor: 'pointer', marginBottom: showCommentInput ? '8px' : '0' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => { setRating(star); setShowCommentInput(true); }}
                style={{ fontSize: '20px', color: star <= (hoverRating || rating) ? '#F59E0B' : '#E5E7EB', lineHeight: '1' }}
              >
                ★
              </span>
            ))}
          </div>
          {showCommentInput && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text"
                placeholder="Add a comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #E5E5E5', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }}
              />
              <button 
                onClick={handleSubmit}
                style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '11px', background: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
              >
                Submit Rating
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#10B981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Thanks for your feedback!
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [ticketCreatedMessage, setTicketCreatedMessage] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | undefined>();
  const [creatingTicket, setCreatingTicket] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! How can I help you today with the academy courses?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim() && studentEmail.trim()) {
      setHasStarted(true);
    }
  };

  const handleCreateTicket = async () => {
    if (!studentName || !studentEmail) return;
    setCreatingTicket(true);
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentEmail,
          subject: 'Support request from chat',
          conversationHistory: messages
        })
      });
      const data = await response.json();
      if (response.ok) {
        setCreatedTicketId(data.ticket.ticket_number);
        setTicketCreatedMessage(`Ticket [${data.ticket.ticket_number}] created successfully. The academy will contact you at ${studentEmail}`);
      } else {
        alert('Failed to create ticket: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating ticket');
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || ticketCreatedMessage) return;

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
          context: `Student Name: ${studentName}. Student Email: ${studentEmail}. This is a test session for Replyio customer support assistant. The academy offers courses on web development, programming, and software engineering.`,
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
        justifyContent: 'space-between', 
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

      {!hasStarted ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#F7F7F7', padding: '40px', borderRadius: '8px', border: '1px solid #E5E5E5', width: '360px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>Welcome to Support</h2>
            <p style={{ fontSize: '13px', color: '#666666', marginBottom: '24px', textAlign: 'center' }}>Please enter your details to start the chat.</p>
            <form onSubmit={handleStartChat} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888', marginBottom: '6px' }}>Name</label>
                <input 
                  required
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888', marginBottom: '6px' }}>Email</label>
                <input 
                  required
                  type="email" 
                  value={studentEmail} 
                  onChange={(e) => setStudentEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} 
                  placeholder="john@example.com" 
                />
              </div>
              <button 
                type="submit" 
                style={{ marginTop: '8px', padding: '10px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
              >
                Start Chat
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
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
            gap: '24px' // increased gap for rating boxes
          }}>
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}>
                  {isUser ? (
                    <div style={{ 
                      maxWidth: '80%', 
                      padding: '10px 14px', 
                      borderRadius: '8px', 
                      fontSize: '13px', 
                      lineHeight: '1.6',
                      border: '1px solid #BFDBFE',
                      backgroundColor: '#EFF6FF',
                      color: '#1E40AF',
                    }}>
                      {msg.content}
                    </div>
                  ) : (
                    <div style={{ maxWidth: '80%' }}>
                      <BotMessage content={msg.content} ticketId={createdTicketId} />
                      
                      {/* Create Ticket Button below bot messages, only on last message if no ticket yet */}
                      {index === messages.length - 1 && !ticketCreatedMessage && (
                        <button 
                          onClick={handleCreateTicket}
                          disabled={creatingTicket}
                          style={{
                            marginTop: '12px',
                            background: 'none',
                            border: '1px solid #E5E5E5',
                            color: '#2563EB',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {creatingTicket ? 'Creating...' : 'I still need help → Create Ticket'}
                        </button>
                      )}
                    </div>
                  )}
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
            
            {ticketCreatedMessage && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <div style={{ 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  textAlign: 'center'
                }}>
                  {ticketCreatedMessage}
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
                disabled={loading || !!ticketCreatedMessage}
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
                disabled={loading || !input.trim() || !!ticketCreatedMessage}
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
                  opacity: (loading || !input.trim() || !!ticketCreatedMessage) ? 0.6 : 1
                }}
              >
                Send
              </button>
            </form>
          </footer>
        </>
      )}
    </div>
  );
}
