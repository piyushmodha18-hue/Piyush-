/**
 * chat.js — AI Chat Assistant Frontend
 * Floating chat bubble + voice support
 */

// ===== CHAT STATE =====
const ChatState = {
  open: false,
  messages: [],
  listening: false,
};

// ===== CHAT API =====
async function chatSend(query) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    return { text: '⚠️ કનેક્શન ભૂલ. ફરી પ્રયાસ કરો.', action: null };
  }
}

// ===== CHAT UI =====
function injectChatCSS() {
  if (document.getElementById('chat-css')) return;
  const css = document.createElement('style');
  css.id = 'chat-css';
  css.textContent = `
    /* Floating Chat Bubble */
    .chat-fab {
      position: fixed; bottom: 20px; right: 20px; z-index: 500;
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--primary); color: #000;
      border: none; font-size: 24px; cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,255,255,0.4);
      transition: all .3s; touch-action: manipulation;
      display: flex; align-items: center; justify-content: center;
    }
    .chat-fab:hover { transform: scale(1.1); box-shadow: 0 4px 25px rgba(0,255,255,0.6); }
    .chat-fab.active { background: #a0f; box-shadow: 0 4px 15px rgba(170,0,255,0.4); }

    /* Chat Panel */
    .chat-panel {
      position: fixed; bottom: 84px; right: 20px; z-index: 500;
      width: 360px; max-width: calc(100vw - 32px);
      height: 480px; max-height: calc(100vh - 120px);
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      display: none; flex-direction: column;
      overflow: hidden;
      animation: chatIn .3s ease;
    }
    .chat-panel.open { display: flex; }
    @keyframes chatIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .chat-header {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px;
      background: rgba(0,255,255,0.1);
      border-bottom: 1px solid var(--border);
      cursor: pointer;
    }
    .chat-header h3 { font-size: 14px; margin: 0; color: var(--primary); flex: 1; }
    .chat-header .close-btn {
      background: none; border: none; color: var(--text-muted);
      font-size: 18px; cursor: pointer; padding: 4px;
      touch-action: manipulation;
    }

    .chat-messages {
      flex: 1; overflow-y: auto; padding: 12px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .chat-msg {
      max-width: 85%; padding: 10px 14px;
      border-radius: 12px; font-size: 13px; line-height: 1.5;
      animation: msgIn .2s ease;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .chat-msg.bot {
      align-self: flex-start;
      background: rgba(0,255,255,0.08);
      border: 1px solid rgba(0,255,255,0.15);
      color: var(--text);
      border-bottom-left-radius: 4px;
    }
    .chat-msg.user {
      align-self: flex-end;
      background: var(--primary);
      color: #000;
      border-bottom-right-radius: 4px;
    }
    .chat-msg.typing {
      align-self: flex-start;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-style: italic;
    }
    @keyframes msgIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .chat-input-area {
      display: flex; gap: 6px; padding: 10px 12px;
      border-top: 1px solid var(--border);
      background: rgba(0,0,0,0.2);
    }
    .chat-input-area input {
      flex: 1; padding: 10px 14px; min-height: 44px;
      border: 1px solid var(--border); border-radius: 10px;
      background: rgba(10,20,35,0.6); color: var(--text);
      font-size: 14px; outline: none;
    }
    .chat-input-area input:focus { border-color: var(--primary); }
    .chat-input-area input::placeholder { color: var(--text-dim); }
    .chat-input-area .chat-btn {
      padding: 8px 12px; min-height: 44px; min-width: 44px;
      border: 1px solid var(--border); border-radius: 10px;
      background: transparent; color: var(--text-muted);
      cursor: pointer; font-size: 16px; transition: all .2s;
      touch-action: manipulation;
    }
    .chat-input-area .chat-btn:hover { background: var(--primary-light); color: var(--primary); }
    .chat-input-area .chat-btn.send { background: var(--primary); color: #000; border-color: var(--primary); }
    .chat-input-area .chat-btn.send:hover { box-shadow: 0 0 12px rgba(0,255,255,0.4); }
    .chat-input-area .chat-btn.voice { }
    .chat-input-area .chat-btn.voice.listening { background: #f44; color: #fff; border-color: #f44; animation: pulse .8s infinite; }

    .chat-typing-dots { display: inline-flex; gap: 3px; }
    .chat-typing-dots span {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--text-muted); animation: dotPulse 1.2s infinite;
    }
    .chat-typing-dots span:nth-child(2) { animation-delay: .2s; }
    .chat-typing-dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes dotPulse { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }

    @media (max-width: 480px) {
      .chat-panel {
        right: 8px; left: 8px;
        width: auto; max-width: none;
        height: 420px; max-height: calc(100vh - 140px);
        bottom: 76px;
      }
      .chat-fab { bottom: 12px; right: 12px; width: 50px; height: 50px; font-size: 20px; }
      .chat-msg { font-size: 12px; padding: 8px 12px; }
    }
  `;
  document.head.appendChild(css);
}

function createChatHTML() {
  // Remove existing
  const old = document.getElementById('chat-root');
  if (old) old.remove();

  const root = document.createElement('div');
  root.id = 'chat-root';

  // FAB button
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.id = 'chatFab';
  fab.innerHTML = '🤖';
  fab.onclick = toggleChat;
  fab.setAttribute('aria-label', 'AI Chat');

  // Panel
  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.id = 'chatPanel';

  panel.innerHTML = `
    <div class="chat-header">
      <span>🤖</span>
      <h3>AI Assistant</h3>
      <span style="font-size:10px;color:var(--text-dim);flex:1">ગુજરાતી | English</span>
      <button class="close-btn" onclick="toggleChat()">✕</button>
    </div>
    <div class="chat-messages" id="chatMessages">
      <div class="chat-msg bot">${getChatGreeting()}</div>
    </div>
    <div class="chat-input-area">
      <input type="text" id="chatInput" placeholder="તમારો સવાલ પૂછો..." 
             onkeydown="if(event.key==='Enter') chatSubmit()">
      <button class="chat-btn voice" id="voiceBtn" onclick="toggleVoice()" title="વૉઇસ">
        🎙️
      </button>
      <button class="chat-btn send" onclick="chatSubmit()">➤</button>
    </div>
  `;

  root.appendChild(fab);
  root.appendChild(panel);
  document.body.appendChild(root);
}

function getChatGreeting() {
  const hour = new Date().getHours();
  let timeGreet = hour < 12 ? 'સુપ્રભાત' : hour < 17 ? 'નમસ્તે' : 'શુભ સાંજ';
  return `${timeGreet}! 🙏 હું AI આસિસ્ટન્ટ છું. ટાઇમટેબલ વિશે કંઈ પૂછો.`;
}

// ===== CHAT FUNCTIONS =====
function toggleChat() {
  ChatState.open = !ChatState.open;
  document.getElementById('chatPanel').classList.toggle('open', ChatState.open);
  document.getElementById('chatFab').classList.toggle('active', ChatState.open);
  if (ChatState.open) {
    setTimeout(() => {
      document.getElementById('chatInput').focus();
      scrollChat();
    }, 300);
  }
}

async function chatSubmit() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addMessage(text, 'user');
  showTyping();

  const result = await chatSend(text);
  hideTyping();

  // Handle action
  if (result.action === 'generate') {
    addMessage(result.text || '⏳ Generating...', 'bot');
    // Trigger generate
    const genBtn = document.querySelector('.btn-success');
    if (genBtn) genBtn.click();
    setTimeout(() => {
      addMessage('✅ Generation triggered! Check the timetable page.', 'bot');
    }, 1000);
    return;
  }

  addMessage(result.text, 'bot');
}

function addMessage(text, type) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.textContent = text;
  msgs.appendChild(div);
  scrollChat();
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg typing';
  div.id = 'typingIndicator';
  div.innerHTML = '<div class="chat-typing-dots"><span></span><span></span><span></span></div>';
  msgs.appendChild(div);
  scrollChat();
}

function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollChat() {
  const msgs = document.getElementById('chatMessages');
  msgs.scrollTop = msgs.scrollHeight;
}

// ===== VOICE SUPPORT =====
function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    addMessage('⚠️ વૉઇસ સપોર્ટ નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.', 'bot');
    return;
  }

  if (ChatState.listening) {
    stopListening();
    return;
  }

  startListening();
}

let recognition = null;

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'gu-IN';
  recognition.continuous = false;
  recognition.interimResults = true;

  const btn = document.getElementById('voiceBtn');
  btn.classList.add('listening');
  ChatState.listening = true;
  addMessage('🎙️ સાંભળી રહ્યું છે... બોલો!', 'bot');

  recognition.onresult = function(event) {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += transcript;
      else interim += transcript;
    }
    
    if (final) {
      document.getElementById('chatInput').value = final;
      stopListening();
      chatSubmit();
    }
  };

  recognition.onerror = function(event) {
    stopListening();
    addMessage(`⚠️ સાંભળવામાં ભૂલ: ${event.error}`, 'bot');
  };

  recognition.onend = function() {
    stopListening();
  };

  recognition.start();
}

function stopListening() {
  if (recognition) {
    try { recognition.stop(); } catch(e) {}
    recognition = null;
  }
  ChatState.listening = false;
  const btn = document.getElementById('voiceBtn');
  if (btn) btn.classList.remove('listening');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  injectChatCSS();
  createChatHTML();
});
