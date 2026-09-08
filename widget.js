 (function () {
  const scriptTag = document.currentScript || document.querySelector('script[data-owner-id]');
  const ownerId = scriptTag ? scriptTag.getAttribute('data-owner-id') : '536bde32-496b-4e6e-a34a-1abdb387dd5b';

  if (!ownerId) {
    console.error('InstantLead Widget: Missing data-owner-id attribute.');
    return;
  }

  // Floating Trigger Button
  const button = document.createElement('div');
  button.id = 'instant-lead-btn';
  button.innerHTML = '💬 Contact Us';
  button.style.cssText = `
    position: fixed !important;
    bottom: 25px !important;
    right: 25px !important;
    background-color: #2563eb !important;
    color: #ffffff !important;
    padding: 14px 22px !important;
    border-radius: 50px !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important;
    z-index: 999999999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 1 !important;
    user-select: none !important;
  `;
  document.body.appendChild(button);

  // Form Modal Card
  const modal = document.createElement('div');
  modal.id = 'instant-lead-modal';
  modal.style.cssText = `
    display: none;
    position: fixed !important;
    bottom: 85px !important;
    right: 25px !important;
    width: 320px !important;
    max-width: calc(100vw - 50px) !important;
    background: #0f172a !important;
    color: #f8fafc !important;
    border: 1px solid #1e293b !important;
    padding: 20px !important;
    border-radius: 16px !important;
    box-shadow: 0 12px 35px rgba(0,0,0,0.6) !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    z-index: 999999999 !important;
    box-sizing: border-box !important;
  `;

  modal.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <h4 style="margin:0; color:#f8fafc; font-size:16px; font-weight:700;">Send us a message</h4>
      <span id="close-modal" style="cursor:pointer; font-size:18px; color:#94a3b8; padding:2px 6px; line-height:1;">✕</span>
    </div>
    <form id="instant-lead-form" style="margin:0;">
      <input type="text" id="il-name" placeholder="Your Name" required style="width:100%; background:#0a0e17; border:1px solid #1e293b; color:#fff; padding:12px; margin-bottom:10px; border-radius:8px; box-sizing:border-box; font-size:14px; outline:none;">
      <input type="email" id="il-email" placeholder="Your Email Address" required style="width:100%; background:#0a0e17; border:1px solid #1e293b; color:#fff; padding:12px; margin-bottom:10px; border-radius:8px; box-sizing:border-box; font-size:14px; outline:none;">
      <input type="tel" id="il-phone" placeholder="Phone Number" required style="width:100%; background:#0a0e17; border:1px solid #1e293b; color:#fff; padding:12px; margin-bottom:10px; border-radius:8px; box-sizing:border-box; font-size:14px; outline:none;">
      <textarea id="il-msg" placeholder="How can we help?" style="width:100%; background:#0a0e17; border:1px solid #1e293b; color:#fff; padding:12px; margin-bottom:14px; border-radius:8px; box-sizing:border-box; font-size:14px; height:70px; resize:none; outline:none;"></textarea>
      <button type="submit" id="il-submit-btn" style="width:100%; background:#2563eb; color:white; border:none; padding:12px; border-radius:8px; font-weight:700; cursor:pointer; font-size:14px; transition:0.2s;">Send Message</button>
    </form>
  `;
  document.body.appendChild(modal);

  button.onclick = () => {
    modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
  };

  document.getElementById('close-modal').onclick = () => {
    modal.style.display = 'none';
  };

  document.getElementById('instant-lead-form').onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('il-submit-btn');
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const nameVal = document.getElementById('il-name').value;
    const emailVal = document.getElementById('il-email').value;
    const phoneVal = document.getElementById('il-phone').value;
    const messageVal = document.getElementById('il-msg').value;

    try {
      const response = await fetch("https://waatnxffylvlfqtlznzv.supabase.co/rest/v1/leads", {
        method: "POST",
        headers: {
          "apikey": "sb_publishable_WeghbAEB6DM-UBxu9W61tw_rqHWNd-J",
          "Authorization": "Bearer sb_publishable_WeghbAEB6DM-UBxu9W61tw_rqHWNd-J",
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          owner_id: ownerId,
          user_id: ownerId,
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          message: messageVal
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.hint || 'Database insert failed');
      }

      modal.innerHTML = '<p style="color:#10b981; text-align:center; font-weight:700; margin:20px 0; font-size:15px;">Message sent successfully! ✓</p>';
      setTimeout(() => { modal.style.display = 'none'; }, 2000);
    } catch (err) {
      console.error('Full Error:', err);
      alert('Error: ' + err.message);
      submitBtn.innerText = 'Send Message';
      submitBtn.disabled = false;
    }
  };
})();
