/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Plus,
  MessageCircle,
  Heart,
  User,
  Tv,
  Clapperboard,
  Sparkles,
  X,
  Send,
  Loader2,
  LogOut,
  Chrome,
  Wand2,
  Hash,
  ShieldAlert,
  BrainCircuit,
  Lightbulb,
  Flame,
  Dna,
  Shuffle,
  ExternalLink,
  FileVideo,
  Volume2,
  VolumeX,
  Compass,
  Search as SearchIcon,
  Home,
  ThumbsUp,
  ThumbsDown,
  Film,
  Smile,
  Quote,
  PenTool,
  Zap,
  Ghost,
  Droplets,
  Lock,
  AlertCircle,
  Cloud,
  MoreHorizontal,
  Link as LinkIcon,
  Share2,
  ArrowLeft,
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Trash2,
  Grid,
  Tag,
  Users,
  Settings,
  Edit3,
  Camera,
} from "lucide-react";

// Firebase Imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  where,
  setDoc,
  getDoc,
} from "firebase/firestore";

// --- CLOUDINARY CONFIG ---
const CLOUDINARY_CLOUD_NAME = "dfwzcxfjt";
const CLOUDINARY_UPLOAD_PRESET = "Clipps_upload";

// --- Configuration ---
let firebaseConfig;
if (typeof __firebase_config !== "undefined") {
  try {
    firebaseConfig = JSON.parse(__firebase_config);
  } catch (e) {
    firebaseConfig = {};
  }
} else {
  firebaseConfig = {
    apiKey: "AIzaSyCFwUvwfYRDtxwgZuK6_KpylHL54rDPfzI",
    authDomain: "movietalk-282ad.firebaseapp.com",
    projectId: "movietalk-282ad",
    storageBucket: "movietalk-282ad.firebasestorage.app",
    messagingSenderId: "392639064000",
    appId: "1:392639064000:web:26a75eb69725dd51174a25",
    measurementId: "G-QVRF0FXJ22",
  };
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const VIDEOS_COLLECTION = collection(db, "videos");
const USERS_COLLECTION = collection(db, "users");
const FOLLOWS_COLLECTION = collection(db, "follows");
const apiKey = "AIzaSyAr3p_ELqh5NTLhkPmRZjLZGxP9BcT-960";

// --- Helpers ---
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2]?.length === 11 ? match[2] : null;
};

const getRandomColor = (id) => {
  const colors = ["#d946ef", "#8b5cf6", "#06b6d4", "#3b82f6", "#f43f5e"];
  let hash = 0;
  if (id)
    for (let i = 0; i < id.length; i++)
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const callGemini = async (prompt) => {
  if (!apiKey) {
    return null;
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    return null;
  }
};

// --- Components ---

const ClippsLogo = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M 30 20 L 70 20 A 15 15 0 0 1 85 35 L 85 60 A 25 25 0 0 1 35 60 L 35 40 A 10 10 0 0 1 55 40 L 55 55"
      stroke="url(#neonGrad)"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#glow)"
    />
    <path
      d="M 25 80 L 75 30"
      stroke="url(#neonGrad)"
      strokeWidth="8"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const Navbar = ({ activeTab, setActiveTab, onOpenAuth, user }) => {
  const handleTabClick = (tab) => {
    if (activeTab === tab && tab === "feed") {
      setActiveTab("feed_refresh");
      setTimeout(() => setActiveTab("feed"), 50);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#020617",
        borderTop: "1px solid #1e293b",
        zIndex: 50,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: "0.75rem",
        paddingBottom: "1.5rem",
      }}
    >
      <NavButton
        icon={<Home size={24} />}
        label="Clipps"
        isActive={activeTab === "feed"}
        onClick={() => handleTabClick("feed")}
      />
      <NavButton
        icon={<Compass size={24} />}
        label="Explore"
        isActive={activeTab === "explore"}
        onClick={() => handleTabClick("explore")}
      />
      <NavButton
        icon={<Plus size={24} />}
        label="Create"
        isActive={activeTab === "studio"}
        onClick={() => handleTabClick("studio")}
      />
      <NavButton
        icon={<MessageCircle size={24} />}
        label="Chat"
        isActive={activeTab === "chat"}
        onClick={() => handleTabClick("chat")}
      />
      <NavButton
        icon={<User size={24} />}
        label="Profile"
        isActive={activeTab === "profile"}
        onClick={() => handleTabClick("profile")}
      />
    </nav>
  );
};

const NavButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.25rem",
      color: isActive ? "#22d3ee" : "#94a3b8",
      background: "none",
      border: "none",
      cursor: "pointer",
    }}
  >
    {icon}
    <span style={{ fontSize: "0.7rem", fontWeight: "500" }}>{label}</span>
  </button>
);

const ActionButton = ({ icon, label, onClick }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.25rem",
    }}
  >
    <button
      onClick={onClick}
      style={{
        padding: "0.6rem",
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.4)",
        border: "none",
        cursor: "pointer",
        color: "white",
        backdropFilter: "blur(4px)",
      }}
    >
      {icon}
    </button>
    {label && (
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: "600",
          color: "white",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {label}
      </span>
    )}
  </div>
);

const ClipCard = ({
  video,
  isActive,
  onOpenComments,
  onShare,
  onOpenProfile,
  onRequireAuth,
  user,
  isGlobalMuted,
  toggleGlobalMute,
}) => {
  const ytId = getYoutubeId(video.url);
  const likeKey = `liked_${video.id}`;
  const [hasLiked, setHasLiked] = useState(
    localStorage.getItem(likeKey) === "true"
  );
  const [isPlaying, setIsPlaying] = useState(isActive);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const pressTimer = useRef(null);

  useEffect(() => {
    if (isActive) setIsPlaying(true);
    else setIsPlaying(false);
  }, [isActive]);

  useEffect(() => {
    if (ytId && iframeRef.current) {
      const command = isPlaying ? "playVideo" : "pauseVideo";
      try {
        const muteCmd = isGlobalMuted ? "mute" : "unMute";
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: muteCmd, args: [] }),
          "*"
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: command, args: [] }),
          "*"
        );
      } catch (e) {}
    }
    if (!ytId && videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
      if (isPlaying) {
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.catch((e) => {
            if (!isGlobalMuted) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }
      } else videoRef.current.pause();
    }
  }, [isPlaying, ytId, video.url, isGlobalMuted]);

  useEffect(() => {
    if (ytId && iframeRef.current) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: isGlobalMuted ? "mute" : "unMute",
            args: [],
          }),
          "*"
        );
      } catch (e) {}
    }
    if (!ytId && videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
    }
  }, [isGlobalMuted, ytId]);

  const handleTouchStart = (e) => {
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const { innerWidth, innerHeight } = window;
    const isTop = clientY < innerHeight / 6;
    const isBottom = clientY > innerHeight * (5 / 6);
    const isRight = clientX > innerWidth * 0.75;
    if (isTop || isBottom || isRight) return;
    pressTimer.current = setTimeout(() => setIsPlaying(false), 300);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
    if (isActive) setIsPlaying(true);
  };

  const handleClick = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const isTop = clientY < innerHeight / 6;
    const isBottom = clientY > innerHeight * (5 / 6);
    const isRight = clientX > innerWidth * 0.75;
    if (isTop || isBottom || isRight) return;
    toggleGlobalMute();
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user || user.isAnonymous) {
      onRequireAuth();
      return;
    }
    const newStatus = !hasLiked;
    setHasLiked(newStatus);
    if (newStatus) localStorage.setItem(likeKey, "true");
    else localStorage.removeItem(likeKey);
    try {
      await updateDoc(doc(db, "videos", video.id), {
        likes: increment(newStatus ? 1 : -1),
      });
    } catch (e) {
      setHasLiked(!newStatus);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this clip?")) {
      try {
        await deleteDoc(doc(db, "videos", video.id));
      } catch (e) {}
    }
  };

  return (
    <div
      className="clip-card"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onClick={handleClick}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        scrollSnapAlign: "start",
      }}
    >
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "#0f172a" }}
      >
        {!ytId ? (
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isGlobalMuted}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=1&mute=${
              isGlobalMuted ? 1 : 0
            }&controls=0&loop=1&playlist=${ytId}&modestbranding=1&showinfo=0&origin=${
              window.location.origin
            }`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.9) 100%)",
          pointerEvents: "none",
        }}
      />
      {isGlobalMuted && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: "99px",
            pointerEvents: "none",
          }}
        >
          <VolumeX size={24} color="white" />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          right: "0.75rem",
          bottom: "8rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          alignItems: "center",
          zIndex: 40,
          pointerEvents: "auto",
        }}
      >
        {user && user.uid === video.userId && (
          <button
            onClick={handleDelete}
            style={{
              padding: "0.6rem",
              borderRadius: "50%",
              background: "rgba(239,68,68,0.2)",
              border: "none",
              color: "#ef4444",
            }}
          >
            <Trash2 size={20} />
          </button>
        )}
        <ActionButton
          icon={
            <Heart
              fill={hasLiked ? "#ef4444" : "none"}
              color={hasLiked ? "#ef4444" : "white"}
            />
          }
          label={video.likes || 0}
          onClick={handleLike}
        />
        <ActionButton
          icon={<MessageCircle />}
          label="Chat"
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments(video);
          }}
        />
        <ActionButton
          icon={<Share2 />}
          label="Share"
          onClick={(e) => {
            e.stopPropagation();
            onShare(video);
          }}
        />
        <ActionButton
          icon={
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: getRandomColor(video.userId),
                }}
              >
                {video.username?.[0]}
              </div>
            </div>
          }
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile(video.userId);
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "5rem",
          left: "1rem",
          right: "5rem",
          zIndex: 20,
          pointerEvents: "auto",
          textAlign: "left",
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile(video.userId);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            cursor: "pointer",
          }}
        >
          <span
            style={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
          >
            @{video.username}
          </span>
          <span
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              fontSize: "0.7rem",
              padding: "0.1rem 0.4rem",
              borderRadius: "4px",
              color: "white",
            }}
          >
            Follow
          </span>
        </div>
        <h3
          style={{
            color: "white",
            fontSize: "1rem",
            marginBottom: "0.5rem",
            lineHeight: "1.3",
          }}
        >
          {video.title}
        </h3>
        {video.watchLink && (
          <a
            href={video.watchLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              fontSize: "0.8rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={14} /> Watch Movie
          </a>
        )}
      </div>
    </div>
  );
};

const ShareModal = ({ video, onClose, onShareToChat }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
    onClose();
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "28rem",
          background: "#0f172a",
          borderRadius: "1.5rem 1.5rem 0 0",
          padding: "1.5rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Share to
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => {
              onShareToChat(video);
              onClose();
            }}
            style={{
              background: "none",
              border: "none",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                background: "#3b82f6",
                padding: "1rem",
                borderRadius: "50%",
              }}
            >
              <MessageCircle />
            </div>
            <span style={{ fontSize: "0.7rem" }}>Chat</span>
          </button>
          <button
            onClick={copyLink}
            style={{
              background: "none",
              border: "none",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                background: "#22c55e",
                padding: "1rem",
                borderRadius: "50%",
              }}
            >
              <LinkIcon />
            </div>
            <span style={{ fontSize: "0.7rem" }}>Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatSystem = ({ user, onClose, initialShareVideo }) => {
  const [view, setView] = useState("list");
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const startChat = (id, name) => {
    setActiveChatId([user.uid, id].sort().join("_"));
    setActiveChatUser({ id, name });
    setView("room");
  };
  if (view === "list")
    return (
      <div
        style={{
          height: "100%",
          background: "#020617",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <h2 style={{ color: "white", marginBottom: "1rem" }}>Messages</h2>
        <div
          onClick={() => startChat("global", "Community")}
          style={{
            padding: "1rem",
            background: "#1e293b",
            borderRadius: "0.5rem",
            color: "white",
            cursor: "pointer",
          }}
        >
          Community Chat
        </div>
      </div>
    );
  return (
    <ChatRoom
      user={user}
      chatId={activeChatId}
      otherUser={activeChatUser}
      onBack={() => setView("list")}
      shareVideo={initialShareVideo}
    />
  );
};

const ChatRoom = ({ user, chatId, otherUser, onBack, shareVideo }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [inCall, setInCall] = useState(false);
  useEffect(() => {
    const msgsRef = collection(db, "chats", chatId, "messages");
    if (shareVideo) {
      addDoc(msgsRef, {
        text: `Shared clip: ${shareVideo.title}`,
        videoUrl: shareVideo.url,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });
    }
    const q = query(msgsRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (s) =>
      setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [chatId]);
  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: input,
      senderId: user.uid,
      createdAt: serverTimestamp(),
    });
    setInput("");
  };
  if (inCall) return <VideoCallRoom onEnd={() => setInCall(false)} />;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "#020617",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none" }}
          >
            <ArrowLeft color="white" />
          </button>
          <h2 style={{ color: "white", fontSize: "1.2rem" }}>
            {otherUser.name}
          </h2>
        </div>
        <button
          onClick={() => setInCall(true)}
          style={{ background: "none", border: "none" }}
        >
          <Video color="#22c55e" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.senderId === user.uid ? "flex-end" : "flex-start",
              background: m.senderId === user.uid ? "#06b6d4" : "#1e293b",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              marginBottom: "0.5rem",
              color: "white",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={send}
        style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, borderRadius: "99px", padding: "0.5rem" }}
        />
        <button style={{ background: "none", border: "none" }}>
          <Send color="#06b6d4" />
        </button>
      </form>
    </div>
  );
};

const VideoCallRoom = ({ onEnd }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 70,
      background: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <button
      onClick={onEnd}
      style={{
        padding: "1rem",
        background: "#ef4444",
        borderRadius: "50%",
        border: "none",
      }}
    >
      <PhoneOff color="white" />
    </button>
  </div>
);

const UserListModal = ({ type, userId, onClose }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // Simplified query for demo - real app would need a dedicated 'follows' collection link
    const q = query(
      FOLLOWS_COLLECTION,
      where(type === "followers" ? "followedId" : "followerId", "==", userId)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [type, userId]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          height: "70vh",
          background: "#0f172a",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              color: "white",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {type}
          </h3>
          <button
            onClick={onClose}
            style={{ color: "white", background: "none", border: "none" }}
          >
            <X />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {users.length === 0 ? (
            <div
              style={{
                color: "#64748b",
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
              No {type} found
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  background: "#1e293b",
                }}
              >
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    background: getRandomColor(u.id),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {u.userName?.[0] || "U"}
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>
                  {u.userName || "User"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const EditProfileModal = ({ user, onClose }) => {
  const [name, setName] = useState(user.displayName || "");
  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(user, { displayName: name });
    onClose();
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0f172a",
          padding: "2rem",
          borderRadius: "1rem",
          width: "90%",
          maxWidth: "24rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "white", marginBottom: "1rem" }}>Edit Profile</h2>
        <form onSubmit={handleSave}>
          <label style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              background: "#1e293b",
              border: "1px solid #334155",
              color: "white",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
            }}
          />
          <button
            style={{
              width: "100%",
              background: "#06b6d4",
              color: "white",
              padding: "0.7rem",
              borderRadius: "0.5rem",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfileMode = ({ user, onOpenAuth, onViewVideo }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [activeModal, setActiveModal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("grid"); // grid, reels, tagged

  useEffect(() => {
    if (!user || user.isAnonymous) return;

    const qVideos = query(VIDEOS_COLLECTION, where("userId", "==", user.uid));
    const unsubVideos = onSnapshot(qVideos, (s) => {
      setVideos(s.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Mock Stats for now - real implementation requires dedicated collections
    setStats({ followers: 142, following: 56 });

    return () => {
      unsubVideos();
    };
  }, [user]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied!");
  };

  if (!user || user.isAnonymous)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Lock size={64} color="#334155" style={{ marginBottom: "1rem" }} />
        <h2
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
          }}
        >
          Profile Locked
        </h2>
        <p style={{ color: "#64748b", marginBottom: "2rem" }}>
          Sign in to view your profile.
        </p>
        <button
          onClick={onOpenAuth}
          style={{
            background: "#06b6d4",
            color: "white",
            padding: "0.8rem 2rem",
            borderRadius: "99px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </div>
    );

  return (
    <div
      style={{
        paddingBottom: "6rem",
        minHeight: "100vh",
        background: "#020617",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1rem 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
          {user.email.split("@")[0]}
        </h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Plus color="white" />
          <Settings color="white" onClick={() => signOut(auth)} />
        </div>
      </div>

      {/* Bio Section */}
      <div
        style={{
          padding: "1.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            width: "5.5rem",
            height: "5.5rem",
            borderRadius: "50%",
            background:
              "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            padding: "3px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            {user.email[0].toUpperCase()}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-around",
            color: "white",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {videos.length}
            </div>
            <div style={{ fontSize: "0.8rem" }}>Posts</div>
          </div>
          <div
            onClick={() => setActiveModal("followers")}
            style={{ cursor: "pointer" }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {stats.followers}
            </div>
            <div style={{ fontSize: "0.8rem" }}>Followers</div>
          </div>
          <div
            onClick={() => setActiveModal("following")}
            style={{ cursor: "pointer" }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {stats.following}
            </div>
            <div style={{ fontSize: "0.8rem" }}>Following</div>
          </div>
        </div>
      </div>

      {/* Bio Text */}
      <div style={{ padding: "0 1rem 1rem", color: "white" }}>
        <div style={{ fontWeight: "bold" }}>
          {user.displayName || "Movie Fan"}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
          🎬 Creating cinematic moments
          <br />✨ Powered by Clipps AI
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: "0 1rem 1.5rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            flex: 1,
            background: "#1e293b",
            color: "white",
            border: "none",
            padding: "0.6rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
        <button
          onClick={copyProfileLink}
          style={{
            flex: 1,
            background: "#1e293b",
            color: "white",
            border: "none",
            padding: "0.6rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Share Profile
        </button>
      </div>

      {/* Stories Bar (Placeholder) */}
      <div
        style={{
          padding: "0 1rem 1.5rem",
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
        }}
        className="no-scrollbar"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              minWidth: "4rem",
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "#334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #020617",
              }}
            >
              <Plus color="#94a3b8" />
            </div>
            <span style={{ fontSize: "0.7rem", color: "white" }}>New</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #1e293b",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div
          onClick={() => setActiveTab("grid")}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "0.8rem",
            borderBottom: activeTab === "grid" ? "2px solid white" : "none",
            cursor: "pointer",
          }}
        >
          <Grid color={activeTab === "grid" ? "white" : "#64748b"} size={24} />
        </div>
        <div
          onClick={() => setActiveTab("reels")}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "0.8rem",
            borderBottom: activeTab === "reels" ? "2px solid white" : "none",
            cursor: "pointer",
          }}
        >
          <Clapperboard
            color={activeTab === "reels" ? "white" : "#64748b"}
            size={24}
          />
        </div>
        <div
          onClick={() => setActiveTab("tagged")}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "0.8rem",
            borderBottom: activeTab === "tagged" ? "2px solid white" : "none",
            cursor: "pointer",
          }}
        >
          <Tag color={activeTab === "tagged" ? "white" : "#64748b"} size={24} />
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2px",
        }}
      >
        {loading ? (
          <div style={{ color: "white", padding: "2rem" }}>Loading...</div>
        ) : (
          videos.map((v) => (
            <div
              key={v.id}
              onClick={() => onViewVideo(v)}
              style={{
                aspectRatio: "3/4",
                background: "#1e293b",
                position: "relative",
                cursor: "pointer",
              }}
            >
              {v.url.includes("youtube") ? (
                <img
                  src={`https://img.youtube.com/vi/${getYoutubeId(
                    v.url
                  )}/hqdefault.jpg`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <video
                  src={v.url + "#t=0.1"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  color: "white",
                  fontSize: "0.7rem",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                <Play size={10} fill="white" /> {v.likes || 0}
              </div>
            </div>
          ))
        )}
      </div>

      {activeModal && (
        <UserListModal
          type={activeModal}
          userId={user.uid}
          onClose={() => setActiveModal(null)}
        />
      )}
      {isEditing && (
        <EditProfileModal user={user} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
};

const PublicProfile = ({ targetUserId, onBack, currentUser }) => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const q = query(VIDEOS_COLLECTION, where("userId", "==", targetUserId));
    return onSnapshot(q, (s) =>
      setVideos(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [targetUserId]);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 55,
        background: "#020617",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button onClick={onBack} style={{ background: "none", border: "none" }}>
          <ArrowLeft color="white" />
        </button>
        <h3 style={{ color: "white" }}>Profile</h3>
      </div>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div
          style={{
            width: "5rem",
            height: "5rem",
            background: "#d946ef",
            borderRadius: "50%",
            margin: "0 auto 1rem",
          }}
        ></div>
        <h2 style={{ color: "white" }}>User</h2>
        <div style={{ color: "white", fontWeight: "bold" }}>
          {videos.length} Clips
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "2px",
        }}
      >
        {videos.map((v) => (
          <div key={v.id} style={{ aspectRatio: "3/4", background: "#1e293b" }}>
            <video
              src={v.url}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthModal = ({ onClose }) => {
  const [isLogin, sL] = useState(true);
  const [e, sE] = useState("");
  const [p, sP] = useState("");
  const [err, sErr] = useState("");
  const h = async (ev) => {
    ev.preventDefault();
    sErr("");
    try {
      let userCred;
      if (isLogin) userCred = await signInWithEmailAndPassword(auth, e, p);
      else {
        userCred = await createUserWithEmailAndPassword(auth, e, p);
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: userCred.user.email,
          createdAt: serverTimestamp(),
          uid: userCred.user.uid,
        });
      }
      onClose();
    } catch (err) {
      sErr(err.message);
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.8)",
      }}
    >
      <div
        style={{
          background: "#0f172a",
          padding: "2rem",
          borderRadius: "1rem",
          width: "90%",
          maxWidth: "24rem",
        }}
      >
        <h2 style={{ color: "white", marginBottom: "1rem" }}>
          {isLogin ? "Login" : "Signup"}
        </h2>
        {err && <div style={{ color: "red", marginBottom: "1rem" }}>{err}</div>}
        <form
          onSubmit={h}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            value={e}
            onChange={(x) => sE(x.target.value)}
            placeholder="Email"
            style={{ padding: "0.5rem" }}
          />
          <input
            type="password"
            value={p}
            onChange={(x) => sP(x.target.value)}
            placeholder="Password"
            style={{ padding: "0.5rem" }}
          />
          <button
            style={{ padding: "0.5rem", background: "#06b6d4", color: "white" }}
          >
            Submit
          </button>
        </form>
        <button
          onClick={() => sL(!isLogin)}
          style={{
            color: "#94a3b8",
            marginTop: "1rem",
            background: "none",
            border: "none",
          }}
        >
          {isLogin ? "Create account" : "Login"}
        </button>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            color: "white",
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

const CommentsSheet = ({ video, onClose, user }) => {
  const [c, sC] = useState([]);
  const [n, sN] = useState("");
  useEffect(() => {
    if (!video) return;
    const ref = collection(db, "videos", video.id, "comments");
    const u = onSnapshot(ref, (s) =>
      sC(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => u();
  }, [video?.id]);
  const h = async (e) => {
    e.preventDefault();
    if (!n.trim() || !user) return;
    const ref = collection(db, "videos", video.id, "comments");
    await addDoc(ref, {
      text: n,
      userId: user.uid,
      username: user.email?.split("@")[0],
      createdAt: serverTimestamp(),
    });
    sN("");
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "28rem",
          background: "#0f172a",
          height: "60vh",
          borderRadius: "1.5rem 1.5rem 0 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ color: "white" }}>Comments</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "white" }}
          >
            X
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {c.map((x) => (
            <div key={x.id} style={{ color: "white", marginBottom: "0.5rem" }}>
              <b>{x.username}: </b>
              {x.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={h}
          style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}
        >
          <input
            value={n}
            onChange={(e) => sN(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "99px" }}
          />
          <button
            style={{
              padding: "0.5rem",
              borderRadius: "99px",
              background: "#06b6d4",
              border: "none",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
const StudioMode = ({ user, setActiveTab, onRequireAuth }) => {
  const [u, sU] = useState("");
  const [t, sT] = useState("");
  const [d, sD] = useState("");
  const [f, sF] = useState(null);
  const h = async (e) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    let fin = u;
    if (f) {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const r = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: fd }
      );
      const j = await r.json();
      fin = j.secure_url;
    }
    await addDoc(VIDEOS_COLLECTION, {
      url: fin,
      isLocal: false,
      title: t,
      description: d,
      userId: user.uid,
      username: user.email?.split("@")[0] || "Director",
      likes: 0,
      createdAt: serverTimestamp(),
    });
    setActiveTab("feed");
  };
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1 style={{ marginBottom: "2rem" }}>Upload</h1>
      <form
        onSubmit={h}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input type="file" onChange={(e) => sF(e.target.files[0])} />
        <input
          placeholder="Or YouTube URL"
          value={u}
          onChange={(e) => sU(e.target.value)}
          style={{ padding: "0.5rem", color: "black" }}
        />
        <input
          placeholder="Title"
          value={t}
          onChange={(e) => sT(e.target.value)}
          style={{ padding: "0.5rem", color: "black" }}
        />
        <textarea
          placeholder="Desc"
          value={d}
          onChange={(e) => sD(e.target.value)}
          style={{ padding: "0.5rem", color: "black" }}
        />
        <button
          style={{
            padding: "1rem",
            background: "#06b6d4",
            border: "none",
            color: "white",
          }}
        >
          Publish
        </button>
      </form>
    </div>
  );
};
const ExploreMode = ({ setActiveTab }) => {
  const [v, sV] = useState([]);
  useEffect(() => {
    const u = onSnapshot(collection(db, "videos"), (s) =>
      sV(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => u();
  }, []);
  return (
    <div style={{ padding: "1rem", color: "white" }}>
      <h2>Explore</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "2px",
        }}
      >
        {v.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveTab("feed")}
            style={{ aspectRatio: "3/4", background: "#1e293b" }}
          >
            {video.url.includes("youtube") ? (
              <img
                src={`https://img.youtube.com/vi/${getYoutubeId(
                  video.url
                )}/hqdefault.jpg`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <video
                src={video.url + "#t=0.1"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [videos, setVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);

  const [showAuth, setShowAuth] = useState(false);
  const [commentVideo, setCommentVideo] = useState(null);
  const [shareVideo, setShareVideo] = useState(null);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const feedRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const pullStart = useRef(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {}
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const q = VIDEOS_COLLECTION;
    const unsubscribe = onSnapshot(q, (s) => {
      const fetchedVideos = s.docs.map((d) => ({ id: d.id, ...d.data() }));
      fetchedVideos.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      setVideos(fetchedVideos);
    });
    return () => unsubscribe();
  }, []);

  const handleTouchStart = (e) => {
    if (feedRef.current && feedRef.current.scrollTop === 0)
      pullStart.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    if (pullStart.current > 0 && e.touches[0].clientY - pullStart.current > 100)
      setRefreshing(true);
  };
  const handleTouchEnd = () => {
    if (refreshing) {
      setActiveTab("feed_refresh");
      setTimeout(() => {
        setActiveTab("feed");
        setRefreshing(false);
        pullStart.current = 0;
      }, 500);
    } else {
      pullStart.current = 0;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVideoId(entry.target.dataset.id);
          }
        });
      },
      { threshold: 0.6 }
    );
    const elements = document.querySelectorAll(".clip-container");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videos, activeTab]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#f1f5f9",
        fontFamily: "sans-serif",
      }}
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setShowAuth(true)}
        user={user}
      />
      <main
        style={{
          flex: 1,
          marginLeft: 0,
          width: "100%",
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {(activeTab === "feed" || activeTab === "feed_refresh") && (
          <div
            ref={feedRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              height: "100%",
              width: "100%",
              overflowY: "scroll",
              scrollSnapType: "y mandatory",
              scrollBehavior: "smooth",
            }}
            className="no-scrollbar"
          >
            {refreshing && (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#06b6d4",
                }}
              >
                <Loader2 className="animate-spin mx-auto" />
                Refreshing...
              </div>
            )}

            {activeTab === "feed_refresh" ? (
              <div />
            ) : (
              videos.map((video) => (
                <div
                  key={video.id}
                  data-id={video.id}
                  className="clip-container"
                  style={{
                    height: "100%",
                    width: "100%",
                    scrollSnapAlign: "start",
                  }}
                >
                  <ClipCard
                    video={video}
                    isActive={activeVideoId === video.id}
                    onOpenComments={setCommentVideo}
                    onShare={setShareVideo}
                    onOpenProfile={setActiveProfileId}
                    onRequireAuth={() => setShowAuth(true)}
                    user={user}
                    isGlobalMuted={isGlobalMuted}
                    toggleGlobalMute={() => setIsGlobalMuted(!isGlobalMuted)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "explore" && <ExploreMode setActiveTab={setActiveTab} />}
        {activeTab === "studio" && (
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              backgroundColor: "#020617",
            }}
          >
            <StudioMode
              user={user}
              setActiveTab={setActiveTab}
              onRequireAuth={() => setShowAuth(true)}
            />
          </div>
        )}
        {activeTab === "profile" && (
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              backgroundColor: "#020617",
            }}
          >
            <ProfileMode
              user={user}
              onOpenAuth={() => setShowAuth(true)}
              onViewVideo={(v) => {
                /* Logic to open specific video could go here, simple alert for now */ alert(
                  "Opening: " + v.title
                );
              }}
            />
          </div>
        )}
        {activeTab === "chat" && (
          <ChatSystem
            user={user}
            onClose={() => setActiveTab("feed")}
            initialShareVideo={null}
          />
        )}

        {/* Modals */}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        {commentVideo && (
          <CommentsSheet
            video={commentVideo}
            onClose={() => setCommentVideo(null)}
            user={user}
          />
        )}
        {shareVideo && (
          <ShareModal
            video={shareVideo}
            onClose={() => setShareVideo(null)}
            onShareToChat={(v) => {
              setActiveTab("chat");
            }}
          />
        )}
        {activeProfileId && (
          <PublicProfile
            targetUserId={activeProfileId}
            currentUser={user}
            onBack={() => setActiveProfileId(null)}
          />
        )}
      </main>
    </div>
  );
}
