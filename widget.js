(function () {
  const scriptTag = document.currentScript;
  const ownerId = scriptTag ? scriptTag.getAttribute('data-owner-id') : '';
  const ownerEmail = scriptTag ? scriptTag.getAttribute('data-owner-email') : '';

  // Inject styles for the floating button and popup modal
  const style = document.createElement('style');
  style.innerHTML = `
    #il-float-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 14px 22px;
      font-family: Arial, sans-serif;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 999999;
      transition: transform 0.2s ease;
    }
    #il-float-btn:hover {
      transform: scale(1.05);
    }
    #il-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(3px);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000000;
      font-family: Arial, sans-serif;
    }
    #il-modal-card {
      background: #0f172a;
      width: 90%;
      max-width: 400px;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      color: #fff;
      position: relative;
      box-sizing: border-box;
    }
    #il-close-btn {
      position: absolute;
      top: 15px;
      right: 18px;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 22px;
      cursor: pointer;
    }
    #il-modal-card input, 
    #il-modal-card textarea {
      width: 100%;
      padding: 12px;
      margin-bottom: 12px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #fff;
      box-sizing: border-box;
      font-size: 14px;
    }
    #il-submit-btn {
      width: 100%;
      padding: 12px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 15px;
      cursor: pointer;
    }
    #il-submit-btn:hover {
      background: #1d4ed8;
    }
    #il-form-status {
      margin-top: 10px;
      font-size: 13px;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  // Create Floating Button
  const floatBtn = document.createElement('button');
  floatBtn.id = 'il-float-btn';
  floatBtn.innerHTML = '💬 Contact Us';
  document.body.appendChild(floatBtn);

  // Create Modal Overlay & Form Container
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'il-modal-overlay';
  modalOverlay.innerHTML = `
    <div id="il-modal-card">
      <button id="il-close-btn">&times;</button>
      <h3 style="margin-top:0; margin-bottom:15px; text-align:center;">Send Us a Message</h3>
      <form id="il-actual-form">
        <input type="text" id="il-name" placeholder="Your Name" required />
        <input type="email" id="il-email" placeholder="Your Email Address" required />
        <input type="tel" id="il-phone" placeholder="Phone Number" />
        <textarea id="il-message" rows="4" placeholder="How can we help?"></textarea>
        <button type="submit" id="il-submit-btn">Send Message</button>
      </form>
      <div id="il-form-status"></div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  // Toggle Modal Open/Close
  floatBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
  });

  document.getElementById('il-close-btn').addEventListener('click', () => {
    modalOverlay.style.display = 'none';
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  });

  // Handle Form Submission
  document.getElementById('il-actual-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('il-submit-btn');
    const statusDiv = document.getElementById('il-form-status');

    const leadName = document.getElementById('il-name').value;
    const leadEmail = document.getElementById('il-email').value;
    const leadPhone = document.getElementById('il-phone').value;
    const message = document.getElementById('il-message').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusDiv.style.color = '#94a3b8';
    statusDiv.textContent = 'Sending your message...';

    try {
      const response = await fetch('https://waatnxffylvlfqtlznzv.supabase.co/functions/v1/send-lead-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId,
          ownerEmail,
          leadName,
          leadEmail,
          leadPhone,
          message
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit lead.');
      }

      statusDiv.style.color = '#4ade80';
      statusDiv.textContent = 'Success! Message sent.';
      document.getElementById('il-actual-form').reset();

      setTimeout(() => {
        modalOverlay.style.display = 'none';
        statusDiv.textContent = '';
      }, 2000);
    } catch (error) {
      statusDiv.style.color = '#f87171';
      statusDiv.textContent = 'Error: ' + error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
})();
   
