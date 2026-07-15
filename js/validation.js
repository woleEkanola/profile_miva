// Contact form validation

var form = document.getElementById('contact-form');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phone');
var messageInput = document.getElementById('message');
var successMsg = document.getElementById('success-msg');

if (!form) {
  // not on contact page
} else {
  setUpValidation();
}

function setUpValidation() {
  var validators = {
    name: function (value) {
      if (!value || value.trim().length === 0) {
        return 'Name is required.';
      }
      if (value.trim().length < 2) {
        return 'Name must be at least 2 characters.';
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
      }
      return '';
    },

    email: function (value) {
      if (!value || value.trim().length === 0) {
        return 'Email is required.';
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        return 'Please enter a valid email address (e.g. name@example.com).';
      }
      return '';
    },

    phone: function (value) {
      if (!value || value.trim().length === 0) {
        return 'Phone number is required.';
      }
      var cleaned = value.replace(/[\s\-()]/g, '');
      if (!/^\d+$/.test(cleaned)) {
        return 'Phone number must contain only digits.';
      }
      if (cleaned.length < 7 || cleaned.length > 15) {
        return 'Phone number must be 7 to 15 digits.';
      }
      return '';
    },

    message: function (value) {
      if (!value || value.trim().length === 0) {
        return 'Message is required.';
      }
      if (value.trim().length < 10) {
        return 'Message must be at least 10 characters long.';
      }
      if (value.trim().length > 1000) {
        return 'Message must be less than 1000 characters.';
      }
      return '';
    }
  };

  function setFieldError(input, message) {
    var errorEl = document.getElementById(input.id + '-error');
    if (message) {
      input.classList.add('invalid');
      input.classList.remove('valid');
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  function validateField(input) {
    var validator = validators[input.name];
    if (!validator) return true;
    var error = validator(input.value);
    setFieldError(input, error);
    return error === '';
  }

  function validateForm() {
    var isValid = true;
    var inputs = [nameInput, emailInput, phoneInput, messageInput];
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i] && !validateField(inputs[i])) {
        isValid = false;
      }
    }
    return isValid;
  }

  var touched = {};

  var inputs = [nameInput, emailInput, phoneInput, messageInput];
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (!input) continue;

    input.addEventListener('blur', function () {
      touched[this.name] = true;
      validateField(this);
    });

    input.addEventListener('input', function () {
      if (touched[this.name]) {
        validateField(this);
      }
    });
  }

  // Restrict phone input to digits only
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      var filtered = e.target.value.replace(/\D/g, '');
      if (filtered !== e.target.value) {
        e.target.value = filtered;
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i]) touched[inputs[i].name] = true;
    }

    if (!validateForm()) {
      var firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      message: messageInput.value.trim()
    };

    if (successMsg) {
      successMsg.textContent = 'Thank you, ' + formData.name + '! Your message has been received.';
      successMsg.classList.add('show');
      setTimeout(function () {
        successMsg.classList.remove('show');
      }, 5000);
    }

    form.reset();
    for (var j = 0; j < inputs.length; j++) {
      if (inputs[j]) {
        inputs[j].classList.remove('valid', 'invalid');
        var errorEl = document.getElementById(inputs[j].id + '-error');
        if (errorEl) errorEl.textContent = '';
      }
    }
    touched = {};
  });
}
