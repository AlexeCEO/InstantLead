 (function() {
  // Load Supabase JS SDK dynamically if not already present
  if (!window.supabase) {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = initWidget;
    document.head.appendChild(script);
  } else {
    initWidget();
  }

  function initWidget() {
    const SUPABASE_URL = 'https://waatnxffylvlfqtlznzv.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_WeghbAEB6DM-UBxu9W61tw_rqHWNd-J';
    const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get owner ID attached to current script tag
    const currentScript = document.currentScript || document.querySelector('script[data-owner-id]');
    const ownerId = currentScript ? currentScript.getAttribute('data-owner-id') : null;

    // Inject Floating Button HTML
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .il-float-btn { position: fixed; bottom: 20px; right: 20px; background: #6366f1; color: #fff; border: none; padding: 12px 20px; border-radius: 30px; font-weight: bold; cursor: pointer; z-index: 999999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: sans-serif; }
        .il-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 1000000; font-family: sans-serif; }
        .il-modal-card { background: #121826; color: #fff; padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #1f293d; position: relative; }
        .il-close-btn { position: absolute; top: 10px; right: 14px; background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; }
        .il-form-group { margin-bottom: 12px; }
        .il-label { display: block; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; }
        .il-input { width: 100%; padding: 10px; background: #1a2332; border: 1px solid #2a364f; border-radius: 6px; color: #fff; box-sizing: border-box; }
        .il-submit-btn { width: 100%; padding: 12px; background: #6366f1; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 10px; }
      </style>

      <button id="il-btn" class="il-float-btn">⚡ Request Callback</button>

      <div id="il-modal" class="il-modal-overlay">
        <div class="il-modal-card">
          <button id="il-close" class="il-close-btn">&times;</button>
          <h3 style="margin-top:0;">Request Instant Callback</h3>
          <form id="il-form">
            <div class="il-form-group">
              <label class="il-label">Name</label>
              <input type="text" id="il-name" class="il-input" required>
            </div>
            <div class="il-form-group">
              <label class="il-label">Phone</label>
              <input type="tel" id="il-phone" class="il-input" required>
            </div>
            <div class="il-form-group">
              <label class="il-label">Message</label>
              <input type="text" id="il-msg" class="il-input" placeholder="How can we help?">
            </div>
            <button type="submit" id="il-submit" class="il-submit-btn">Submit Request</button>
          </form>
          <div id="il-status" style="margin-top:10px; font-size:12px; text-align:center;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    const btn = document.getElementById('il-btn');
    const modal = document.getElementById('il-modal');
    const closeBtn = document.getElementById('il-close');
    const form = document.getElementById('il-form');
    const status = document.getElementById('il-status');

    btn.onclick = () => modal.style.display = 'flex';
    closeBtn.onclick = () => modal.style.display = 'none';

    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('il-name').value;
      const phone = document.getElementById('il-phone').value;
      const message = document.getElementById('il-msg').value;
      const submitBtn = document.getElementById('il-submit');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // 1. Insert directly into Supabase table
      if (ownerId) {
        await _supabase.from('leads').insert([
          { user_id: ownerId, name: name, phone: phone, message: message }
        ]);
      }

      // 2. Trigger Make.com Webhook for Email Notification
      try {
        await fetch("https://hook.eu2.make.com/YOUR_MAKE_WEBHOOK_URL", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId, name, phone, message })
        });
      } catch(err) {
        console.log("Webhook sent");
      }

      status.style.color = "#4ade80";
      status.textContent = "Request received! We will call you shortly.";
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Request";
      setTimeout(() => modal.style.display = 'none', 2000);
    };
  }
})();
     
