import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ForumChannel, ForumMessage } from '../../types';
import {
  MessageSquare,
  Sparkles,
  Bot,
  Send,
  Plus,
  Search,
  ThumbsUp,
  Lightbulb,
  Flame,
  Rocket,
  Heart,
  CheckCircle2,
  HelpCircle,
  Megaphone,
  Coffee,
  CheckSquare,
  TrendingUp,
  Share2,
  ChevronRight,
  Shield,
  Zap,
  Users,
  Smile,
  ArrowRight,
  Filter,
  Check,
  RefreshCw,
  X,
  FileText,
} from 'lucide-react';

export const ForumChatView: React.FC = () => {
  const {
    forumChannels,
    forumMessages,
    activeChannelId,
    setActiveChannelId,
    aiCopilotEnabled,
    setAiCopilotEnabled,
    isAiResponding,
    addForumMessage,
    toggleMessageReaction,
    voteForumIdea,
    convertIdeaToTask,
    createForumChannel,
    triggerAiBrainstormInChannel,
    currentUser,
    employees,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ForumMessage | null>(null);
  const [selectedAiWorkerTag, setSelectedAiWorkerTag] = useState<string | null>(null);

  // New Channel Form State
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelTopic, setNewChannelTopic] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelCategory, setNewChannelCategory] = useState<'ide' | 'pengumuman' | 'proyek' | 'santai' | 'tanya_jawab'>('ide');

  // New Idea Card Form State
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('Inovasi Tim');
  const [ideaSummary, setIdeaSummary] = useState('');
  const [ideaPoints, setIdeaPoints] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = forumChannels.find((c) => c.id === activeChannelId) || forumChannels[0];
  const channelMessages = forumMessages.filter((m) => m.channelId === activeChannelId);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length, isAiResponding]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = selectedAiWorkerTag
      ? `@${selectedAiWorkerTag} ${inputMessage}`
      : inputMessage;

    const askedRole = selectedAiWorkerTag === 'AI HR'
      ? 'ai_hr'
      : selectedAiWorkerTag === 'AI Finance'
      ? 'ai_finance'
      : selectedAiWorkerTag === 'AI Tax'
      ? 'ai_tax'
      : 'ai_office';

    setInputMessage('');
    setSelectedAiWorkerTag(null);
    const replyContext = replyingTo;
    setReplyingTo(null);

    await addForumMessage(messageText, {
      replyToId: replyContext?.id,
      replyToSnippet: replyContext?.content.slice(0, 60),
      requestedAiRole: askedRole,
    });
  };

  const handlePostIdeaCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaSummary.trim()) return;

    const pointsList = ideaPoints
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    await addForumMessage(`💡 **Mengajukan Gagasan Baru:** ${ideaTitle}\n\n${ideaSummary}`, {
      ideaCard: {
        title: ideaTitle,
        category: ideaCategory,
        summary: ideaSummary,
        keyPoints: pointsList.length > 0 ? pointsList : ['Diusulkan untuk evaluasi bersama', 'Menunggu umpan balik rekan kerja'],
        votes: 1,
        votedUserIds: [currentUser.id],
        status: 'draft',
      },
      askAiNow: aiCopilotEnabled,
      generateIdeaCard: false,
    });

    // Reset form
    setIdeaTitle('');
    setIdeaSummary('');
    setIdeaPoints('');
    setShowIdeaModal(false);
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const slug = newChannelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    createForumChannel({
      name: slug,
      topic: newChannelTopic.trim() || 'Diskusi saluran kerja',
      description: newChannelDesc.trim() || 'Ruang kolaborasi tim KaryawanMu.',
      category: newChannelCategory,
      icon: newChannelCategory === 'ide' ? 'Lightbulb' : newChannelCategory === 'pengumuman' ? 'Megaphone' : 'MessageSquare',
      isAiEnabledDefault: true,
    });

    setNewChannelName('');
    setNewChannelTopic('');
    setNewChannelDesc('');
    setShowCreateChannelModal(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ide':
        return <Lightbulb className="h-4 w-4 text-amber-400" />;
      case 'pengumuman':
        return <Megaphone className="h-4 w-4 text-rose-400" />;
      case 'proyek':
        return <Rocket className="h-4 w-4 text-indigo-400" />;
      case 'tanya_jawab':
        return <HelpCircle className="h-4 w-4 text-teal-400" />;
      case 'santai':
        return <Coffee className="h-4 w-4 text-emerald-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-slate-400" />;
    }
  };

  const filteredChannels = forumChannels.filter((c) =>
    c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
    c.topic.toLowerCase().includes(channelSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <MessageSquare className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Forum & Diskusi Kantor</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-500/20">
              <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
              Human + AI Collaboration
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Wadah interaksi seluruh staf dan pimpinan untuk bertukar gagasan, pengumuman, dan brainstorming langsung bersama AI Copilot.
          </p>
        </div>

        {/* Global AI Copilot Toggle & Quick Actions */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <div className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all ${
            aiCopilotEnabled
              ? 'bg-indigo-950/40 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${aiCopilotEnabled ? 'bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse' : 'bg-slate-500'}`} />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">
                  AI Copilot: {aiCopilotEnabled ? 'Aktif' : 'Nonaktif'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {aiCopilotEnabled ? 'Siap memberi ide & asistensi' : 'Hanya merespon saat di-tag (@)'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAiCopilotEnabled(!aiCopilotEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                aiCopilotEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  aiCopilotEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => setShowIdeaModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3.5 py-2 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span>Usulkan Gagasan</span>
          </button>
        </div>
      </div>

      {/* Main Forum Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Column: Channels Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
          {/* Channel Header & Search */}
          <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saluran Diskusi</span>
              <button
                onClick={() => setShowCreateChannelModal(true)}
                className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Saluran Baru</span>
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari saluran atau topik..."
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Channel List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredChannels.map((channel) => {
              const isActive = channel.id === activeChannelId;
              const msgCount = forumMessages.filter((m) => m.channelId === channel.id).length;
              const hasIdeas = forumMessages.some((m) => m.channelId === channel.id && m.ideaCard);

              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 border border-indigo-500/40 shadow-sm text-white'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 rounded-lg p-1.5 bg-slate-800/80 border border-slate-700/50">
                    {getCategoryIcon(channel.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-300 font-bold' : 'text-slate-200'}`}>
                        #{channel.name}
                      </p>
                      {hasIdeas && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">
                          <Lightbulb className="h-2.5 w-2.5" /> Ide
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{channel.topic}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                      <span>{msgCount} pesan</span>
                      <span>•</span>
                      <span className="capitalize">{channel.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick AI Brainstorm Prompts Widget */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                Inspirasi Cepat AI
              </span>
              <span className="text-[10px] text-slate-500">1-Klik Tanya</span>
            </div>
            <div className="space-y-1">
              {[
                { label: '💡 Brainstorm Ide Inovasi Baru', prompt: 'Bisa berikan 3 ide inovasi produk atau peningkatan efisiensi kantor untuk tim kita bulan ini?' },
                { label: '⚡ Usul Program Kerja Fleksibel', prompt: 'Bagaimana ide implementasi sistem kerja fleksibel terstruktur yang tetap menjaga output tinggi?' },
                { label: '🎯 Ide Employee Wellness & Games', prompt: 'Usulkan 3 ide program engagement tim dan apresiasi staf yang seru dan minim budget!' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerAiBrainstormInChannel(item.prompt, 'ai_office', true)}
                  className="w-full text-left text-[11px] text-slate-300 hover:text-indigo-300 bg-slate-900/80 hover:bg-indigo-950/40 p-2 rounded-lg border border-slate-800 hover:border-indigo-500/30 transition-all truncate"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chat Thread & Messages (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
          {/* Active Channel Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                {getCategoryIcon(activeChannel.category)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">#{activeChannel.name}</h2>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                    {employees.length} anggota tim
                  </span>
                </div>
                <p className="text-xs text-slate-400">{activeChannel.topic}</p>
              </div>
            </div>

            {/* Quick Channel Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerAiBrainstormInChannel(
                  `Tolong buatkan rangkuman dan intisari dari poin-poin diskusi di saluran #${activeChannel.name} ini.`,
                  'ai_office',
                  false
                )}
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                title="Minta AI merangkum diskusi saluran ini"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Rangkum AI</span>
              </button>
              <button
                onClick={() => setShowIdeaModal(true)}
                className="flex items-center gap-1 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition-colors font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ide</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[520px]">
            {/* Channel Info Card Welcome Banner */}
            <div className="rounded-xl bg-slate-950/40 border border-slate-800/80 p-4 text-center space-y-1.5 my-2">
              <div className="inline-flex p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">Selamat datang di #{activeChannel.name}!</h3>
              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                {activeChannel.description} Seluruh Owner, HR, Manager, dan Karyawan dapat berdiskusi bebas di sini.
              </p>
            </div>

            {/* Messages Stream */}
            {channelMessages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUser.id;
              const isAi = msg.isAi;

              return (
                <div
                  key={msg.id}
                  className={`group relative flex gap-3 transition-colors rounded-xl p-3 ${
                    isAi
                      ? 'bg-indigo-950/20 border border-indigo-500/25 shadow-sm'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className={`h-9 w-9 rounded-xl object-cover ${
                        isAi
                          ? 'border-2 border-indigo-400 ring-2 ring-indigo-500/20'
                          : 'border border-slate-700'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {isAi && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white text-[9px] shadow">
                        <Bot className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header: Name, Role, Timestamp */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${isAi ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {msg.senderName}
                      </span>

                      {/* Role Badge */}
                      {isAi ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.2 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                          <Sparkles className="h-2.5 w-2.5" />
                          Digital Worker
                        </span>
                      ) : (
                        <span className={`rounded-full px-2 py-0.2 text-[10px] font-semibold uppercase ${
                          msg.senderRole === 'owner'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : msg.senderRole === 'hr'
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            : msg.senderRole === 'manager'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : msg.senderRole === 'finance'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {msg.senderRole}
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500">{msg.senderJobTitle}</span>
                      <span className="text-[10px] text-slate-600 ml-auto">{msg.timestamp}</span>
                    </div>

                    {/* Reply to Snippet */}
                    {msg.replyToSnippet && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/40 border-l-2 border-indigo-500 px-2 py-1 rounded">
                        <span className="text-slate-500">Membalas:</span>
                        <span className="truncate italic">"{msg.replyToSnippet}"</span>
                      </div>
                    )}

                    {/* Text Body */}
                    <div className="mt-1.5 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Interactive Idea Card Attachment */}
                    {msg.ideaCard && (
                      <div className="mt-3 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-amber-500/30 p-4 shadow-md space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Lightbulb className="h-4 w-4" />
                            </span>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                                {msg.ideaCard.category}
                              </span>
                              <h4 className="text-xs font-bold text-white">{msg.ideaCard.title}</h4>
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            msg.ideaCard.status === 'accepted'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}>
                            {msg.ideaCard.status === 'accepted' ? '✓ Diterima Menjadi Tugas' : '💡 Dalam Evaluasi'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-normal">{msg.ideaCard.summary}</p>

                        {/* Key Points */}
                        {msg.ideaCard.keyPoints && msg.ideaCard.keyPoints.length > 0 && (
                          <div className="space-y-1 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                            <p className="font-semibold text-slate-400 text-[10px] uppercase">Rekomendasi Poin Kunci:</p>
                            <ul className="space-y-1 list-disc list-inside">
                              {msg.ideaCard.keyPoints.map((point, pidx) => (
                                <li key={pidx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Idea Card Actions: Vote & Convert */}
                        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                          {/* Upvote Button */}
                          <button
                            onClick={() => voteForumIdea(msg.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              msg.ideaCard.votedUserIds.includes(currentUser.id)
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/20'
                                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/20'
                            }`}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>Dukung Gagasan ({msg.ideaCard.votes})</span>
                          </button>

                          {/* Convert to Task Button (Owner/Manager/HR) */}
                          {['owner', 'manager', 'hr'].includes(currentUser.role) && (
                            <button
                              onClick={() => convertIdeaToTask(msg.id)}
                              disabled={msg.ideaCard.status === 'accepted'}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                msg.ideaCard.status === 'accepted'
                                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-sm'
                              }`}
                            >
                              <CheckSquare className="h-3.5 w-3.5" />
                              <span>{msg.ideaCard.status === 'accepted' ? 'Sudah Jadi Tugas' : 'Jadikan Tugas Kantor'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reactions Bar */}
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      {msg.reactions.map((rx) => {
                        const hasVoted = rx.userIds.includes(currentUser.id);
                        return (
                          <button
                            key={rx.emoji}
                            onClick={() => toggleMessageReaction(msg.id, rx.emoji)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                              hasVoted
                                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
                            }`}
                          >
                            <span>{rx.emoji}</span>
                            <span className="text-[10px] font-bold">{rx.count}</span>
                          </button>
                        );
                      })}

                      {/* Quick Emoji Pickers */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-800/90 rounded-full px-1.5 py-0.5 border border-slate-700">
                        {['👍', '💡', '🔥', '🚀', '❤️'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => toggleMessageReaction(msg.id, emoji)}
                            className="hover:scale-125 transition-transform text-xs p-0.5"
                          >
                            {emoji}
                          </button>
                        ))}
                        <button
                          onClick={() => setReplyingTo(msg)}
                          className="text-[10px] text-slate-400 hover:text-white px-1.5 font-medium"
                        >
                          Balas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isAiResponding && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/25 animate-pulse">
                <div className="h-8 w-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-300">
                    AI Copilot sedang berpikir & merumuskan gagasan...
                  </p>
                  <p className="text-[10px] text-slate-400">Menyusun analisis komprehensif untuk tim</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Reply Context Banner */}
          {replyingTo && (
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <span className="text-indigo-400 font-semibold">Membalas {replyingTo.senderName}:</span>
                <span className="truncate italic text-slate-400">"{replyingTo.content.slice(0, 70)}"</span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Tagged AI Worker Badge */}
          {selectedAiWorkerTag && (
            <div className="flex items-center justify-between px-4 py-1.5 bg-indigo-950/60 border-t border-indigo-500/20 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                <Bot className="h-3.5 w-3.5" />
                Pesan ini akan langsung dijawab oleh: <strong>@{selectedAiWorkerTag}</strong>
              </span>
              <button
                onClick={() => setSelectedAiWorkerTag(null)}
                className="text-indigo-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Chat Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 focus-within:border-indigo-500/50 transition-colors">
                <textarea
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Kirim pesan ke #${activeChannel.name}... (Gunakan @AI untuk bertanya ide atau gagasan)`}
                  className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                />

                {/* Sub-bar inside input */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
                  {/* Tag AI Worker Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500">Tanya AI:</span>
                    {[
                      { label: '@AI Office', tag: 'AI Office Assistant' },
                      { label: '@AI HR', tag: 'AI HR' },
                      { label: '@AI Finance', tag: 'AI Finance' },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => setSelectedAiWorkerTag(btn.tag)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          selectedAiWorkerTag === btn.tag
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowIdeaModal(true)}
                      className="p-1.5 rounded-lg text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Buat Kartu Ide"
                    >
                      <Lightbulb className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isAiResponding}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md transition-all shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL 1: Buat Usulan Gagasan Baru */}
      {showIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Usulkan Gagasan / Ide Kantor</h3>
                  <p className="text-xs text-slate-400">Bagikan ide inovasi ke saluran #{activeChannel.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowIdeaModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePostIdeaCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Gagasan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Penerapan Fleksibilitas Jam Istirahat & Ruang Kolaborasi"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Inisiatif</label>
                <select
                  value={ideaCategory}
                  onChange={(e) => setIdeaCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Kultur & Produktivitas">Kultur & Produktivitas</option>
                  <option value="Inovasi Produk & AI">Inovasi Produk & AI</option>
                  <option value="Efisiensi Biaya & Kas">Efisiensi Biaya & Kas</option>
                  <option value="Fasilitas Kantor & Kesehatan">Fasilitas Kantor & Kesehatan</option>
                  <option value="Peningkatan Skill Tim">Peningkatan Skill Tim</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ringkasan Konsep</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan latar belakang masalah dan manfaat gagasan ini bagi kantor..."
                  value={ideaSummary}
                  onChange={(e) => setIdeaSummary(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Poin Kunci / Langkah Awal <span className="text-slate-500">(1 baris per poin)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={`- Survey preferensi staf\n- Uji coba pilot 2 minggu\n- Evaluasi hasil dengan HR`}
                  value={ideaPoints}
                  onChange={(e) => setIdeaPoints(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowIdeaModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 text-xs font-bold transition-all shadow-md"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Kirim Gagasan ke Forum</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah Saluran Baru */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Buat Saluran Diskusi Baru</h3>
              <button
                onClick={() => setShowCreateChannelModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Saluran</label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white">
                  <span className="text-slate-500 mr-1">#</span>
                  <input
                    type="text"
                    required
                    placeholder="misal: ide-inovasi-q4"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                <select
                  value={newChannelCategory}
                  onChange={(e) => setNewChannelCategory(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ide">💡 Ide & Gagasan</option>
                  <option value="proyek">🚀 Diskusi Proyek</option>
                  <option value="pengumuman">📢 Pengumuman</option>
                  <option value="tanya_jawab">❓ Tanya Jawab</option>
                  <option value="santai">☕ Ruang Santai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topik Utama</label>
                <input
                  type="text"
                  placeholder="Ringkasan 1 kalimat topik saluran ini"
                  value={newChannelTopic}
                  onChange={(e) => setNewChannelTopic(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Pedoman atau tujuan ruang diskusi..."
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Buat Saluran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
