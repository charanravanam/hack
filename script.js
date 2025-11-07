// Chat element references
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// Ensure html is loaded first
document.addEventListener("DOMContentLoaded", function() {
    // Focus input for instant typing
    chatInput.focus();
});

// Utility: Escape HTML for safe display (security against XSS)
function escapeHtml(s){
  return s.replace(/&/g,"&amp;")
          .replace(/</g,"&lt;")
          .replace(/>/g,"&gt;");
}

// Add a bubble to chat
function addBubble(text, who="bot"){
  const el = document.createElement("div");
  el.className = "msg " + (who === "user" ? "user" : "bot");
  el.innerHTML = `<div>${escapeHtml(text)}</div>
                  <div class="timestamp">${who === 'user' ? 'You':'Cyber Bot'} • ${new Date().toLocaleTimeString()}</div>`;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show animated typing dots
function showTyping(){
  const typing = document.createElement("div");
  typing.className = "msg bot";
  typing.innerHTML =
    `<div class="typing">
      <span class="dot-typing"></span>
      <span class="dot-typing"></span>
      <span class="dot-typing"></span>
    </div>`;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typing;
}

// Send logic
chatForm.onsubmit = async function(e) {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (!msg) return;
  addBubble(msg,"user");         // user message
  chatInput.value = "";
  const typing = showTyping();   // bot is typing...

  // Fetch reply from Gemini backend (adapt endpoint as needed)
  try {
    const res = await fetch('/.netlify/functions/cyber-bot', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    typing.remove();              // remove typing
    addBubble(data.reply || "Bot error: no reply.");
  } catch (err) {
    typing.remove();
    addBubble("Bot error: API unreachable.");
  }
};

// Optionally, allow Send button to work via explicit click (redundant, as form submit is covered)
document.getElementById('send-btn').addEventListener('click', function(e){
  // No need for extra handler if .onsubmit above, but good for redundancy
  chatForm.requestSubmit();
});

// Optionally, handle pressing Enter in input (redundant if using <form>)
chatInput.addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    e.preventDefault();
    chatForm.requestSubmit();
  }
});
