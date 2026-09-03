(function() {
  // Create Floating Action Button
  const button = document.createElement('div');
  button.innerHTML = '💬 Request Callback';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.backgroundColor = '#6366f1';
  button.style.color = '#ffffff';
  button.style.padding = '12px 20px';
  button.style.borderRadius = '30px';
  button.style.fontWeight = 'bold';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  button.style.zIndex = '999999';

  document.body.appendChild(button);

  // Redirect to lead form on click
  button.addEventListener('click', function() {
    window.open('https://alexeceo.github.io/InstantLead/', '_blank');
  });
})();
 
