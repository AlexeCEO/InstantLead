 (function () {
  // Find the script tag and extract owner ID
  const scriptTag = document.currentScript || document.querySelector('script[data-owner-id]');
  const ownerId = scriptTag ? scriptTag.getAttribute('data-owner-id') : null;

  if (!ownerId) {
    console.error('InstantLead Widget: Missing data-owner-id attribute.');
    return;
  }

  // Create floating widget button
  const button = document.createElement('div');
  button.id = 'instant-lead-btn';
  button.innerHTML = '💬 Contact Us';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #2563eb;
    color: white;
    padding: 12px 20px;
    border-radius: 30px;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    z-index: 999999;
  `;
  document.body.appendChild(button);

  // Create popup modal
  const modal = document.createElement('div');
  modal.id = 'instant-lead-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    font-family: sans-serif;
    z-index: 999999;
  `;

  modal.innerHTML = `
    <div style="display:flex; justify-between; align-items:center; margin-bottom:12px;">
      <h4 style="margin:0; color:#1e293b; font-size:16px;">Send us a message</h4>
      <span id="close-modal" style="cursor:pointer; font-weight:bold; color:#64748b;">✕</span>
    </div>
    <form id="instant-lead-form">
      <input type="text" id="lead-name" placeholder="Your Name" required style="width:100%; padding:8px; margin-bottom:8px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;">
      <input type="tel" id="lead-phone" placeholder="Phone Number" required style="width:100%; padding:8px; margin-bottom:8px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;">
      <textarea id="lead-msg" placeholder="How can we help?" style="width:100%; padding:8px; margin-bottom:8px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box; height:60px;"></textarea>
      <button type="submit" id="lead-submit-btn" style="width:100%; background:#2563eb; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Send Message</button>
    </form>
  `;
  document.body.appendChild(modal);

  // Toggle modal display
  button.onclick = () => {
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
  };

  document.getElementById('close-modal').onclick = () => {
    modal.style.display = 'none';
  };

  // Handle Form Submission
  document.getElementById('instant-lead-form').onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('lead-submit-btn');
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const name = document.getElementById('lead-name').value;
    const phone = document.getElementById('lead-phone').value;
    const message = document.getElementById('lead-msg').value;

    const payload = {
      owner_id: ownerId,
      name: name,
      phone: phone,
      message: message
    };

    try {
      // Send data to Pipedream Webhook
      const response = await fetch('https://eolw5rybnknsl67.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        modal.innerHTML = '<p style="color:#10b981; text-align:center; font-weight:bold;">Message sent successfully!</p>';
        setTimeout(() => { modal.style.display = 'none'; }, 2000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      alert('Error sending message. Please try again.');
      submitBtn.innerText = 'Send Message';
      submitBtn.disabled = false;
    }
  };
})();
     
