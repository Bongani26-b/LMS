'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  MessagesSquare,
  MessageSquare,
  Search,
  Send,
  Heart,
  HelpCircle,
  Sparkles,
  BookOpen,
  Hash,
  Users,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Tag,
  ShieldAlert,
  Flame,
  PlusCircle,
  Calculator,
  Atom,
  Dna,
  FlaskConical,
  BookMarked,
  Landmark,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { CommunityChannel, CommunityMessage, Subject } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Icon mapping helper
function getChannelIcon(iconName: string) {
  switch (iconName) {
    case 'Calculator':
      return Calculator;
    case 'Atom':
      return Atom;
    case 'Dna':
      return Dna;
    case 'FlaskConical':
      return FlaskConical;
    case 'BookMarked':
      return BookMarked;
    case 'Landmark':
      return Landmark;
    default:
      return MessageSquare;
  }
}

function formatRelativeTime(dateString: string): string {
  try {
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diffSeconds = Math.floor((now - then) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    const days = Math.floor(diffSeconds / 86400);
    return `${days}d ago`;
  } catch {
    return 'Recently';
  }
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<CommunityChannel[]>(() => AppStore.getCommunityChannels());
  const [activeChannelId, setActiveChannelId] = useState<string>('mathematics');
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [channelSearch, setChannelSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'help_only'>('all');

  // New message form states
  const [inputText, setInputText] = useState('');
  const [isHelpRequest, setIsHelpRequest] = useState(false);
  const [topicTag, setTopicTag] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubjects(AppStore.getSubjects());
    loadMessages(activeChannelId);
  }, [activeChannelId]);

  const loadMessages = (channelId: string) => {
    const msgs = AppStore.getCommunityMessages(channelId);
    setMessages(msgs);
  };

  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    loadMessages(channelId);
  };

  const activeChannel = useMemo(() => {
    return (
      channels.find((c) => c.id === activeChannelId) ||
      channels[0] || {
        id: 'general',
        name: 'General Student Lounge',
        description: 'Connect with secondary students, share study tips, motivation, and school life discussions.',
        iconName: 'MessageSquare',
        category: 'general',
        memberCount: 1420,
      }
    );
  }, [channels, activeChannelId]);

  const activeSubject = useMemo(() => {
    if (!activeChannel?.subjectCode) return null;
    return subjects.find((s) => s.code.toLowerCase() === activeChannel.subjectCode?.toLowerCase());
  }, [subjects, activeChannel]);

  const filteredChannels = useMemo(() => {
    if (!channelSearch.trim()) return channels;
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(channelSearch.toLowerCase()) ||
        (c.subjectCode && c.subjectCode.toLowerCase().includes(channelSearch.toLowerCase()))
    );
  }, [channels, channelSearch]);

  const filteredMessages = useMemo(() => {
    let result = messages;
    if (filterType === 'help_only') {
      result = result.filter((m) => m.isHelpRequest);
    }
    if (messageSearch.trim()) {
      const q = messageSearch.toLowerCase();
      result = result.filter(
        (m) =>
          m.content.toLowerCase().includes(q) ||
          m.authorName.toLowerCase().includes(q) ||
          (m.topicTag && m.topicTag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [messages, filterType, messageSearch]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const authorName = user?.full_name || 'Thabo Nkosi';
    const authorGrade = user?.grade_name || 'Grade 10';
    const authorId = user?.id || 'usr-learner-001';

    const newMsg = AppStore.sendCommunityMessage({
      channelId: activeChannelId,
      authorId,
      authorName,
      authorGrade,
      content: inputText.trim(),
      isHelpRequest,
      topicTag: topicTag.trim() || undefined,
    });

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTopicTag('');
    setIsHelpRequest(false);

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleToggleLike = (msgId: string) => {
    const userId = user?.id || 'usr-learner-001';
    const updated = AppStore.toggleCommunityMessageLike(msgId, userId);
    if (updated) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, likes: updated.likes, likedBy: updated.likedBy } : m))
      );
    }
  };

  const handleQuickMathSymbol = (sym: string) => {
    setInputText((prev) => prev + sym);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e8f5ec] text-[#1b382b] rounded-full text-xs font-semibold mb-2">
            <MessagesSquare className="w-3.5 h-3.5 text-[#246043]" />
            <span>Learner Study Community & Peer Help</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Student Community
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Ask questions, chat with peers, and get homework help across all your secondary school subjects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#e8f5ec] text-[#1b382b] text-xs font-bold px-3 py-1.5 gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#246043]" />
            <span>{channels.reduce((acc, c) => acc + c.memberCount, 0).toLocaleString()} Secondary Learners</span>
          </Badge>
        </div>
      </div>

      {/* Main 2-Column Community Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Channels & Subject Rooms (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#246043]" />
                <span>Subject Communities</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {channels.length} Channels
              </span>
            </div>

            {/* Channel Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                placeholder="Filter subjects..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-2xl bg-[#f8faf9] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white transition-colors"
              />
            </div>

            {/* Channels List */}
            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredChannels.map((c) => {
                const IconComponent = getChannelIcon(c.iconName);
                const isActive = c.id === activeChannelId;

                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectChannel(c.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 group ${
                      isActive
                        ? 'bg-[#1b382b] text-white shadow-sm ring-1 ring-[#1b382b]'
                        : 'bg-white hover:bg-[#f1f5f2] text-slate-700 border border-slate-100'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${
                        isActive
                          ? 'bg-[#2b5441] text-[#facc15]'
                          : 'bg-[#e8f5ec] text-[#246043] group-hover:bg-[#d8eedf]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-black truncate ${
                            isActive ? 'text-white' : 'text-slate-900 group-hover:text-[#1b382b]'
                          }`}
                        >
                          {c.name}
                        </span>
                        {c.subjectCode && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${
                              isActive
                                ? 'bg-[#2b5441] text-[#facc15]'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {c.subjectCode}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isActive ? 'text-emerald-100/80' : 'text-slate-400'
                        }`}
                      >
                        {c.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Guidelines Box */}
          <Card className="p-4 border-slate-100 bg-[#f8faf9] text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldAlert className="w-4 h-4 text-[#246043]" />
              <span>Community Guidelines</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Be supportive, encourage peer learning, and ask specific questions when you get stuck. No sharing of formal examination leakages.
            </p>
          </Card>
        </div>

        {/* Right Column: Chat Feed & Message Composer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Channel Header */}
          <Card className="p-5 border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f5ec] text-[#1b382b] flex items-center justify-center font-bold">
                {React.createElement(getChannelIcon(activeChannel.iconName), {
                  className: 'w-6 h-6 text-[#246043]',
                })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">{activeChannel.name}</h2>
                  {activeChannel.subjectCode && (
                    <Badge variant="secondary" className="bg-[#e8f5ec] text-[#1b382b] text-[10px] font-bold">
                      {activeChannel.subjectCode}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xl">{activeChannel.description}</p>
              </div>
            </div>

            {/* Direct links to Textbooks and AI for this subject */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/reader">
                <Button variant="outline" className="rounded-full text-xs h-9 px-3.5 gap-1.5 border-slate-200">
                  <BookOpen className="w-3.5 h-3.5 text-[#1b382b]" />
                  <span>Textbook</span>
                </Button>
              </Link>
              <Link href={`/ai-tutor?subject=${activeSubject?.id || ''}`}>
                <Button className="rounded-full bg-[#1b382b] hover:bg-[#142a20] text-white text-xs h-9 px-3.5 gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Ask AI Tutor</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Chat Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  filterType === 'all'
                    ? 'bg-[#1b382b] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Messages ({messages.length})
              </button>
              <button
                onClick={() => setFilterType('help_only')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  filterType === 'help_only'
                    ? 'bg-[#1b382b] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-3 h-3 text-amber-500" />
                <span>Help Requests Only</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search messages in this channel..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
              />
            </div>
          </div>

          {/* Messages Feed */}
          <Card className="p-4 sm:p-6 border-slate-100 shadow-xs flex flex-col h-[520px] overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                  <div className="w-14 h-14 rounded-3xl bg-[#e8f5ec] text-[#1b382b] flex items-center justify-center">
                    <MessagesSquare className="w-7 h-7 text-[#246043]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">
                      {filterType === 'help_only'
                        ? 'No active help requests in this channel'
                        : `Start the conversation in #${activeChannel.name}`}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Be the first to ask a homework question, share a problem you are stuck on, or post a study tip!
                    </p>
                  </div>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const currentUserId = user?.id || 'usr-learner-001';
                  const isLikedByMe = (msg.likedBy || []).includes(currentUserId);
                  const isMyMessage = msg.authorId === currentUserId;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-3xl border transition-all ${
                        isMyMessage
                          ? 'bg-[#f1f5f2] border-emerald-200/80 shadow-2xs'
                          : 'bg-white border-slate-100 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-[#1b382b] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {msg.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900">{msg.authorName}</span>
                              <Badge
                                variant="secondary"
                                className="bg-[#e8f5ec] text-[#1b382b] text-[10px] font-bold px-1.5 py-0"
                              >
                                {msg.authorGrade}
                              </Badge>
                              {isMyMessage && (
                                <span className="text-[10px] font-bold text-emerald-600">(You)</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {formatRelativeTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Badges on right */}
                        <div className="flex items-center gap-1.5">
                          {msg.isHelpRequest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              <HelpCircle className="w-3 h-3 text-amber-600" />
                              Help Needed
                            </span>
                          )}
                          {msg.topicTag && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              <Tag className="w-2.5 h-2.5 text-slate-400" />
                              {msg.topicTag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-11">
                        {msg.content}
                      </p>

                      {/* Message Footer / Likes & Quick Actions */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between pl-11">
                        <button
                          onClick={() => handleToggleLike(msg.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                            isLikedByMe
                              ? 'bg-rose-50 text-rose-600'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isLikedByMe ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                            }`}
                          />
                          <span>{msg.likes || 0}</span>
                        </button>

                        <button
                          onClick={() => {
                            setInputText(`@${msg.authorName}: `);
                          }}
                          className="text-[11px] font-bold text-[#246043] hover:text-[#1b382b] hover:underline"
                        >
                          Reply in chat
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Composer */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* Quick Math / Science Symbols Helper */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-500">
                <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick Symbols:</span>
                {['x²', 'x³', '√', '±', 'Δ', 'θ', 'π', '→', '≤', '≥', 'CO₂', 'H₂O'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleQuickMathSymbol(sym)}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#e8f5ec] hover:text-[#1b382b] text-slate-700 font-mono text-[11px] font-bold transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Send a message in #${activeChannel.name}... (Press Enter to send, Shift+Enter for new line)`}
                      rows={2}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white resize-none transition-colors"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="rounded-2xl bg-[#1b382b] hover:bg-[#142a20] text-white text-xs font-bold px-6 h-auto py-3 gap-2 shadow-xs shrink-0 disabled:opacity-40"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Additional controls: Help request toggle & topic tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsHelpRequest(!isHelpRequest)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        isHelpRequest
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <HelpCircle className={`w-3.5 h-3.5 ${isHelpRequest ? 'text-amber-700' : 'text-slate-400'}`} />
                      <span>{isHelpRequest ? 'Marked as Question / Need Help' : 'Mark as Need Help'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <input
                        type="text"
                        value={topicTag}
                        onChange={(e) => setTopicTag(e.target.value)}
                        placeholder="Topic tag (e.g. Algebra)"
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#1b382b]"
                      />
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    Posting as <span className="font-bold text-slate-700">{user?.full_name || 'Thabo Nkosi'}</span> ({user?.grade_name || 'Grade 10'})
                  </span>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
