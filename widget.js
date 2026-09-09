 (function () {
  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute('data-owner-id');
  const ownerEmail = scriptTag.getAttribute('data-owner-email');

  // Inject CSS styles for the widget
  const style = document.createElement('style');
  style.innerHTML = `
    #instant-lead-container {
      font-family: Arial, sans-serif;
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      background: #0f172a;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      color: #fff;
    }
    #instant-lead-container input, 
    #instant-lead-container textarea {
      width: 100%;
      padding: 12px;
      margin-bottom: 12px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #fff;
      box-sizing: border-box;
    }
    #instant-lead-container button {
      width: 100%;
      padding: 12px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }
    #instant-lead-container button:hover {
      background: #1d4ed8;
    }
    #instant-lead-status {
      margin-top: 10px;
      font-size: 14px;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML form structure
  const container = document.createElement('div');
  container.id = 'instant-lead-container';
  container.innerHTML = `
    <h3 style="margin-top:0; margin-bottom:15px; text-align:center;">Contact Us</h3>
    <form id="instant-lead-form">
      <input type="text" id="il-name" placeholder="Your Name" required />
      <input type="email" id="il-email" placeholder="Your Email Address" required />
      <input type="tel" id="il-phone" placeholder="Phone Number" />
      <textarea id="il-message" rows="4" placeholder="How can we help?"></textarea>
      <button type="submit" id="il-submit">Send Message</button>
    </form>
    <div id="instant-lead-status"></div>
  `;
  
  scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);

  // Handle form submission and dynamic data capture
  document.getElementById('instant-lead-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('il-submit');
    const statusDiv = document.getElementById('instant-lead-status');
    
    const leadName = document.getElementById('il-name').value;
    const leadEmail = document.getElementById('il-email').value;
    const leadPhone = document.getElementById('il-phone').value;
    const message = document.getElementById('il-message').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusDiv.style.color = '#94a3b8';
    statusDiv.textContent = 'Submitting your request...';

    try {
      const supabaseFunctionUrl = 'https://waatnxffylvlfqtlznzv.supabase.co/functions/v1/send-lead-email';

      const response = await fetch(supabaseFunctionUrl, {
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
      statusDiv.textContent = 'Success! We have received your request.';
      document.getElementById('instant-lead-form').reset();
    } catch (error) {
      statusDiv.style.color = '#f87171';
      statusDiv.textContent = 'Error: ' + error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
})();
  
