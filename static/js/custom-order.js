/**
 * Custom order form — submit to backend API and show success/error.
 */
(function () {
  var form = document.getElementById('customOrderForm');
  var formContainer = document.getElementById('formContainer');
  var thankYou = document.getElementById('thankYouMessage');
  var formMessage = document.getElementById('formMessage');
  var submitBtn = document.getElementById('submitBtn');
  var gotcha = document.getElementById('gotcha');

  if (!form) return;

  function showMessage(text, isError) {
    formMessage.textContent = text;
    formMessage.hidden = false;
    formMessage.className = 'form-message ' + (isError ? 'form-message-error' : 'form-message-success');
  }

  function hideMessage() {
    formMessage.hidden = true;
    formMessage.textContent = '';
  }

  function setSubmitting(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Sending…' : 'Send order request';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideMessage();

    var selectedItems = [];
    var itemInputs = form.querySelectorAll('input[name="selected_items"]:checked');
    for (var i = 0; i < itemInputs.length; i++) {
      selectedItems.push(itemInputs[i].value.trim());
    }

    var payload = {
      first_name: (form.fname || form.querySelector('#fname')).value.trim(),
      last_name: (form.lname || form.querySelector('#lname')).value.trim(),
      email: (form.email || form.querySelector('#email')).value.trim(),
      order: (form.order || form.querySelector('#order')).value.trim(),
      selected_items: selectedItems,
      _gotcha: gotcha ? gotcha.value : ''
    };

    setSubmitting(true);

    fetch('/api/custom-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          var isSuccess = res.ok && (data.ok !== false) && !(data.errors && data.errors.length);
          if (isSuccess) {
            if (formContainer) formContainer.hidden = true;
            if (thankYou) {
              thankYou.hidden = false;
              thankYou.focus({ preventScroll: true });
            }
            return;
          }
          var errMsg = data.error || (data.errors && data.errors[0] && data.errors[0].message) || 'Something went wrong. Please try again.';
          showMessage(errMsg, true);
        });
      })
      .catch(function () {
        showMessage('Could not send your request. Check your connection or email us at bcn.shop24@gmail.com.', true);
      })
      .finally(function () {
        setSubmitting(false);
      });
  });
})();
