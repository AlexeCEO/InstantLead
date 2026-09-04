 (function () {
  // Inject CSS styles for the floating button & popup modal
  const style = document.createElement('style');
  style.innerHTML = `
    .il-widget-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #6366f1;
      color: #ffffff;
      border: none;
      border-radius: 50px;
      padding: 14px 22px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s, background-color 0.2s;
    }
    .il-widget-btn:hover {
      background-color: #4f46e5;
      transform: translateY(-2px);
    }
    .il-modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000000;
      padding: 16px;
    }
    .il-modal-card {
      background-color: #121826;
      border: 1px solid #1f293d;
      border-radius: 12px;
      padding: 24px;
      width: 100%;
      max-width: 400px;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      position: relative;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .il-close-btn {
      position: absolute;
      top: 14px;
      right: 16px;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 20px;
      cursor: pointer;
    }
    .il-modal-card h3 { margin: 0 0 8px 0; font-size: 18px; }
    .il-modal-card p { margin: 0 0 16px 0; color: #94a3b8; font-size: 13px; line-height: 1.4; }
    .il-form-group { margin-bottom: 12px; }
    .il-form-group label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
    .il-form-group input, .il-form-group textarea {
      width: 100%; padding: 10px; background-color: #1a2332; border: 1px solid #2a364f;
      border-radius: 6px; color: #ffffff; font-size: 13px; box-sizing: border-box;
    }
    .il-submit-btn {
      width: 100%; padding: 12px; background-color: #6366f1; color: white;
      border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 6px;
    }
    .il-status { margin-top: 10px; font-size: 13px; text-align: center; }
  `;
  document.head.appendChild(style);

  // Inject HTML Markup
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = `
    <button class="il-widget-btn" id="il-trigger-btn">
      ⚡ Request Callback
    </button>
    <div class="il-modal-overlay" id="il-modal">
      <div class="il-modal-card">
        <button class="il-close-btn" id="il-close-modal">&times;</button>
        <h3>Request Immediate Callback</h3>
        <p>Leave your details and an available agent will call you within 15 minutes.</p>
        <form id="il-widget-form">
          <div class="il-form-group">
            <label>Your Name</label>
            <input type="text" id="il-name" placeholder="John Doe" required>
          </div>
          <div class="il-form-group">
            <label>Phone Number</label>
            <input type="tel" id="il-phone" placeholder="+234 800 000 0000" required>
          </div>
          <div class="il-form-group">
            <label>Message</label>
            <textarea id="il-message" rows="2" placeholder="Brief details..."></textarea>
          </div>
          <button type="submit" class="il-submit-btn" id="il-submit-btn">Submit Request</button>
        </form>
        <div class="il-status" id="il-status-msg"></div>
      </div>
    </div>
  `;
  document.body.appendChild(widgetContainer);

  // Event Listeners for opening/closing
  const modal = document.getElementById('il-modal');
  document.getElementById('il-trigger-btn').onclick = () => modal.style.display = 'flex';
  document.getElementById('il-close-modal').onclick = () => modal.style.display = 'none';

  // Handle Form Submission to Supabase
  document.getElementById('il-widget-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('il-submit-btn');
    const status = document.getElementById('il-status-msg');
    
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const payload = {
      name: document.getElementById('il-name').value,
      phone: document.getElementById('il-phone').value,
      message: document.getElementById('il-message').value
    };

    try {
      const response = await fetch('https://waatnxffylvlfqtlznzv.supabase.co/rest/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_WeghbAEB6DM-UBxu9W61tw_rqHWNd-J',
          'Authorization': 'Bearer sb_publishable_WeghbAEB6DM-UBxu9W61tw_rqHWNd-J',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        status.style.color = '#4ade80';
        status.textContent = 'Submitted! We will call you back shortly.';
        document.getElementById('il-widget-form').reset();
        setTimeout(() => { modal.style.display = 'none'; status.textContent = ''; }, 2500);
      } else {
        throw new Error();
      }
    } catch (err) {
      status.style.color = '#ef4444';
      status.textContent = 'Error submitting request. Try again.';
    }

    btn.textContent = 'Submit Request';
    btn.disabled = false;
  });
})();
  
