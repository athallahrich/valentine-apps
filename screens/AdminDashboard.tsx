import React, { useState, useRef, useEffect } from 'react';
import { useAppData } from '../context/DataContext';
import { X, Save, RotateCcw, Plus, Trash2, Settings, List, Image as ImageIcon, FileText, Music } from 'lucide-react';

interface AdminDashboardProps {
    onClose: () => void;
}

const MusicTabContent: React.FC<{ localData: any, setLocalData: any }> = ({ localData, setLocalData }) => {
    const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
    const testAudioRef = useRef<HTMLAudioElement | null>(null);

    const handleTest = () => {
        if (testStatus === 'playing') {
            testAudioRef.current?.pause();
            setTestStatus('idle');
            return;
        }

        if (!localData.musicUrl) return alert('Input link MP3 dulu ya!');

        setTestStatus('loading');
        if (testAudioRef.current) {
            testAudioRef.current.pause();
            testAudioRef.current = null;
        }

        const audio = new Audio(localData.musicUrl);
        testAudioRef.current = audio;

        audio.oncanplaythrough = () => {
            audio.play();
            setTestStatus('playing');
        };

        audio.onerror = () => {
            setTestStatus('error');
            alert('Link MP3 tidak valid atau terblokir!');
        };
    };

    useEffect(() => {
        return () => {
            testAudioRef.current?.pause();
        };
    }, []);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 mb-8">
                <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                    <Music size={20} /> Background Music Options
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                    Pilih cara musik diputar di aplikasi kamu. Gunakan MP3 untuk putar otomatis, atau Spotify Redirect untuk memutar lagu di aplikasi Spotify.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                <button
                    onClick={() => setLocalData({ ...localData, musicType: 'mp3' })}
                    className={`p-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 border-2 ${localData.musicType === 'mp3' ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                    <span className="text-xl">🎵</span>
                    <span>DIRECT MP3</span>
                    <span className="text-[10px] font-normal opacity-70">Auto-play & Full Song</span>
                </button>
                <button
                    onClick={() => setLocalData({ ...localData, musicType: 'spotify-embed' })}
                    className={`p-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 border-2 ${localData.musicType === 'spotify-embed' ? 'bg-[#1DB954]/5 border-[#1DB954] text-[#1DB954] shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                    <span className="text-xl">📻</span>
                    <span>SPOTIFY EMBED</span>
                    <span className="text-[10px] font-normal opacity-70">Mini Player Widget</span>
                </button>
                <button
                    onClick={() => setLocalData({ ...localData, musicType: 'spotify-redirect' })}
                    className={`p-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 border-2 ${localData.musicType === 'spotify-redirect' ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                    <span className="text-xl">🚀</span>
                    <span>SPOTIFY APP</span>
                    <span className="text-[10px] font-normal opacity-70">Open External App</span>
                </button>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    {localData.musicType === 'mp3' ? 'Music URL (Direct MP3)' : localData.musicType === 'spotify-embed' ? 'Spotify Link / Embed Code' : 'Spotify Song Link'}
                </label>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={localData.musicUrl}
                        onChange={e => {
                            let value = e.target.value;
                            // 1. Auto-parse Spotify Iframe
                            if (value.includes('<iframe') && value.includes('src="')) {
                                const match = value.match(/src="([^"]+)"/);
                                if (match && match[1]) value = match[1];
                            }

                            // 2. Handle Spotify links to ensure /embed/ format
                            if ((localData.musicType === 'spotify-embed' || localData.musicType === 'spotify-redirect') && value.includes('open.spotify.com/')) {
                                // Remove international prefix if present (e.g., intl-id/)
                                value = value.replace(/intl-[a-z]+\//, '');

                                if (localData.musicType === 'spotify-embed' && !value.includes('/embed/')) {
                                    value = value.replace('open.spotify.com/', 'open.spotify.com/embed/');
                                } else if (localData.musicType === 'spotify-redirect' && value.includes('/embed/')) {
                                    value = value.replace('/embed/', '/');
                                }
                                // Remove query params for a clean URL
                                value = value.split('?')[0];
                            }
                            setLocalData({ ...localData, musicUrl: value });
                        }}
                        className="flex-grow p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm font-mono text-xs"
                        placeholder={
                            localData.musicType === 'mp3' ? "Paste .mp3 URL here..." :
                                "Paste Link or Embed Code here..."
                        }
                    />
                    {localData.musicType === 'mp3' && (
                        <button
                            onClick={handleTest}
                            className={`px-6 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${testStatus === 'playing' ? 'bg-red-500 text-white' :
                                    testStatus === 'loading' ? 'bg-gray-100 text-gray-400 animate-pulse' :
                                        'bg-gray-900 text-white hover:bg-black'
                                }`}
                        >
                            {testStatus === 'playing' ? (
                                <><div className="w-2 h-2 bg-white rounded-full animate-ping" /> STOP TEST</>
                            ) : testStatus === 'loading' ? (
                                'TESTING...'
                            ) : (
                                'TEST LINK'
                            )}
                        </button>
                    )}
                </div>

                {/* Real-time Preview */}
                {localData.musicType === 'spotify-embed' && localData.musicUrl && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Live Preview:</p>
                        <div className="bg-white p-2 rounded-2xl border-2 border-dashed border-gray-200">
                            <iframe
                                style={{ borderRadius: '12px' }}
                                src={localData.musicUrl}
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}

                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Song Title / Label</label>
                <input
                    type="text"
                    value={localData.musicTitle}
                    onChange={e => setLocalData({ ...localData, musicTitle: e.target.value })}
                    className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm mb-4"
                    placeholder="e.g. Bernadya - Kita Buat Menyenangkan"
                />

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold mb-1 opacity-60">Help & Tips</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        {localData.musicType === 'mp3' && "Gunakan link langsung (akhiran .mp3) agar musik bisa otomatis berputar."}
                        {localData.musicType === 'spotify-embed' && "Langsung paste kode Share > Embed Spotify di sini. Kami akan merapikan linknya secara otomatis agar tidak error!"}
                        {localData.musicType === 'spotify-redirect' && "Klik Share > Copy Song Link. Aplikasi akan membuka aplikasi Spotify pasanganmu untuk memutar lagu secara full."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const { data, updateData, resetToDefaults } = useAppData();
    const [activeTab, setActiveTab] = useState<'general' | 'timeline' | 'polaroids' | 'letter' | 'music'>('general');
    const [localData, setLocalData] = useState(data);

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'timeline', label: 'Timeline', icon: List },
        { id: 'polaroids', label: 'Polaroids', icon: ImageIcon },
        { id: 'letter', label: 'Letter', icon: FileText },
        { id: 'music', label: 'Music', icon: Music },
    ] as const;

    const handleSave = () => {
        updateData(localData);
        alert('Settings saved successfully!');
        onClose();
    };

    const handleReset = () => {
        if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
            resetToDefaults();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-2 md:p-4">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-900">
                {/* Header */}
                <div className="flex-shrink-0 p-4 md:p-6 border-b flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h2>
                        <p className="text-xs md:text-sm text-gray-500">Configure your Valentine app content</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0 flex border-b overflow-x-auto bg-white no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-8 py-5 text-sm font-bold border-b-4 transition-all whitespace-nowrap min-w-[140px] justify-center ${activeTab === tab.id
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span className="uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-gray-50/50">
                    {activeTab === 'general' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">App Title</label>
                                <input
                                    type="text"
                                    value={localData.appTitle}
                                    onChange={e => setLocalData({ ...localData, appTitle: e.target.value })}
                                    className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                                    placeholder="e.g. Our Story"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Passcode (PIN)</label>
                                <input
                                    type="text"
                                    value={localData.pin}
                                    onChange={e => setLocalData({ ...localData, pin: e.target.value })}
                                    className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                                    placeholder="e.g. 250922"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">WhatsApp Numbers (comma separated)</label>
                                <input
                                    type="text"
                                    value={localData.waNumbers.join(', ')}
                                    onChange={e => setLocalData({ ...localData, waNumbers: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                                    className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                                    placeholder="e.g. 62853..., 62857..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'music' && (
                        <MusicTabContent
                            localData={localData}
                            setLocalData={setLocalData}
                        />
                    )}

                    {activeTab === 'timeline' && (
                        <div className="space-y-8 max-w-4xl mx-auto">
                            {localData.timeline.map((item, idx) => (
                                <div key={item.id} className="p-6 border-2 border-white bg-white rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow">
                                    <button
                                        onClick={() => {
                                            const newTimeline = localData.timeline.filter((_, i) => i !== idx);
                                            setLocalData({ ...localData, timeline: newTimeline });
                                        }}
                                        className="absolute top-4 right-4 p-2 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memory Title</label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={e => {
                                                    const newTimeline = [...localData.timeline];
                                                    newTimeline[idx].title = e.target.value;
                                                    setLocalData({ ...localData, timeline: newTimeline });
                                                }}
                                                className="w-full bg-transparent border-b-2 border-gray-100 py-2 outline-none focus:border-primary text-lg font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date / Occasion</label>
                                            <input
                                                type="text"
                                                value={item.date}
                                                onChange={e => {
                                                    const newTimeline = [...localData.timeline];
                                                    newTimeline[idx].date = e.target.value;
                                                    setLocalData({ ...localData, timeline: newTimeline });
                                                }}
                                                className="w-full border-b border-gray-100 py-1 outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                                            <input
                                                type="text"
                                                value={item.image}
                                                onChange={e => {
                                                    const newTimeline = [...localData.timeline];
                                                    newTimeline[idx].image = e.target.value;
                                                    setLocalData({ ...localData, timeline: newTimeline });
                                                }}
                                                className="w-full border-b border-gray-100 py-1 outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Story Description</label>
                                            <textarea
                                                value={item.description}
                                                onChange={e => {
                                                    const newTimeline = [...localData.timeline];
                                                    newTimeline[idx].description = e.target.value;
                                                    setLocalData({ ...localData, timeline: newTimeline });
                                                }}
                                                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none mt-2 focus:bg-white focus:border-primary transition-all"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setLocalData({
                                        ...localData,
                                        timeline: [...localData.timeline, {
                                            id: Date.now().toString(),
                                            date: 'New Date',
                                            title: 'New Memory',
                                            description: 'Add description...',
                                            image: 'https://picsum.photos/id/10/800/800',
                                            rotation: 0,
                                            type: localData.timeline.length % 2 === 0 ? 'left' : 'right'
                                        }]
                                    });
                                }}
                                className="w-full py-6 border-4 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-primary hover:border-primary hover:bg-white transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Plus size={24} /> ADD NEW MEMORY
                            </button>
                        </div>
                    )}

                    {activeTab === 'polaroids' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                            {localData.polaroids.map((photo, idx) => (
                                <div key={photo.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow relative group">
                                    <button
                                        onClick={() => {
                                            const newPhotos = localData.polaroids.filter((_, i) => i !== idx);
                                            setLocalData({ ...localData, polaroids: newPhotos });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={photo.src} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Caption</label>
                                            <input
                                                type="text"
                                                value={photo.caption}
                                                onChange={e => {
                                                    const newPhotos = [...localData.polaroids];
                                                    newPhotos[idx].caption = e.target.value;
                                                    setLocalData({ ...localData, polaroids: newPhotos });
                                                }}
                                                className="w-full text-sm border-b py-1 outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Date</label>
                                            <input
                                                type="text"
                                                value={photo.date || ''}
                                                onChange={e => {
                                                    const newPhotos = [...localData.polaroids];
                                                    newPhotos[idx].date = e.target.value;
                                                    setLocalData({ ...localData, polaroids: newPhotos });
                                                }}
                                                className="w-full text-xs border-b py-0.5 outline-none focus:border-primary"
                                                placeholder="Optional (e.g. Sept 2022)"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL</label>
                                            <input
                                                type="text"
                                                value={photo.src}
                                                onChange={e => {
                                                    const newPhotos = [...localData.polaroids];
                                                    newPhotos[idx].src = e.target.value;
                                                    setLocalData({ ...localData, polaroids: newPhotos });
                                                }}
                                                className="w-full text-[10px] text-gray-400 border-b py-0.5 outline-none focus:border-primary truncate"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setLocalData({
                                        ...localData,
                                        polaroids: [...localData.polaroids, {
                                            id: 'p' + (localData.polaroids.length + 1) + '-' + Date.now(),
                                            src: 'https://picsum.photos/id/1/800/800',
                                            caption: 'New Photo',
                                            date: '',
                                            rotation: 0,
                                            top: 50,
                                            left: 50,
                                            zIndex: localData.polaroids.length + 1
                                        }]
                                    });
                                }}
                                className="py-12 border-4 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-primary hover:border-primary hover:bg-white transition-all flex flex-col items-center justify-center gap-2 font-bold"
                            >
                                <Plus size={32} /> ADD NEW PHOTO
                            </button>
                        </div>
                    )}

                    {activeTab === 'letter' && (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Letter Content</label>
                                <textarea
                                    value={localData.letterContent}
                                    onChange={e => setLocalData({ ...localData, letterContent: e.target.value })}
                                    className="w-full p-6 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-mono text-base h-80 leading-relaxed shadow-inner bg-paper-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Signature (at Bottom)</label>
                                <input
                                    type="text"
                                    value={localData.letterSignature}
                                    onChange={e => setLocalData({ ...localData, letterSignature: e.target.value })}
                                    className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm font-hand text-2xl"
                                    placeholder="e.g. Hubyy"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 md:p-8 border-t bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
                    >
                        <RotateCcw size={20} /> RESET ALL TO DEFAULTS
                    </button>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 md:flex-none px-8 py-3 text-gray-500 hover:bg-gray-200 rounded-xl transition-all text-sm font-bold"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-3 bg-primary text-white rounded-xl hover:bg-primary/95 hover:shadow-lg active:scale-95 transition-all text-sm font-bold"
                        >
                            <Save size={20} /> SAVE CHANGES
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
