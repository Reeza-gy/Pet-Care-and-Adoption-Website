/**
 * Paws and Homes Pet Care and Adoption
 * Main script shared by every page of the website.
 *
 * Features
 *  1. Mobile navigation menu, including aria-expanded updates
 *  2. Branded fallback when a remote image cannot be loaded
 *  3. Pet filtering on the Adopt a Pet page, with a live status message
 *  4. Preferred-pet preselection from the URL query string (?pet=Name)
 *  5. Contact form validation, inline errors and success message
 *  6. Current year in the footer
 *
 * Each feature checks that its elements exist before running, so this one
 * file can be loaded safely on every page without causing errors.
 */
(function () {
  'use strict';

  // Tell the stylesheet that JavaScript is available. The mobile menu is only
  // collapsed when JavaScript can open it again.
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  /** Must match the mobile breakpoint used in css/style.css */
  const MOBILE_QUERY = '(max-width: 860px)';

  /** Simple, practical email pattern: something@something.domain */
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ------------------------------------------------------------------------
     1. Mobile navigation menu
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    if (!toggle) {
      return;
    }

    const nav = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!nav) {
      return;
    }

    const mediaQuery = window.matchMedia ? window.matchMedia(MOBILE_QUERY) : null;

    const isOpen = function () {
      return toggle.getAttribute('aria-expanded') === 'true';
    };

    /**
     * Opens or closes the menu and keeps aria-expanded in sync.
     * @param {boolean} open - true to open the menu, false to close it
     * @param {boolean} returnFocus - move focus back to the toggle button
     */
    function setMenu(open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);

      if (!open && returnFocus) {
        toggle.focus();
      }
    }

    // Toggle button works with mouse, touch, Enter and Space
    toggle.addEventListener('click', function () {
      setMenu(!isOpen(), false);
    });

    // Escape closes the menu and returns focus to the toggle button
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setMenu(false, true);
      }
    });

    // Clicking or tapping outside the open menu closes it
    document.addEventListener('click', function (event) {
      if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setMenu(false, false);
      }
    });

    // Close the menu when keyboard focus moves past the last link
    nav.addEventListener('focusout', function (event) {
      const next = event.relatedTarget;
      if (isOpen() && next && !nav.contains(next) && next !== toggle) {
        setMenu(false, false);
      }
    });

    // Reset the menu when the screen becomes wide enough for desktop layout
    if (mediaQuery) {
      const handleBreakpoint = function (event) {
        if (!event.matches) {
          setMenu(false, false);
        }
      };

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleBreakpoint);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleBreakpoint);
      }
    }
  }

  /* ------------------------------------------------------------------------
     2. Image fallback
     If a remote placeholder image fails, the image is made transparent so the
     branded background and "Photo coming soon" label show instead. The alt
     text stays available to screen readers.
     ------------------------------------------------------------------------ */
  function initImageFallbacks() {
    const images = document.querySelectorAll('.media img');

    images.forEach(function (image) {
      const wrapper = image.closest('.media');
      if (!wrapper) {
        return;
      }

      const showFallback = function () {
        wrapper.classList.add('media--fallback');
      };

      // The image may have failed before this script ran
      if (image.complete && image.naturalWidth === 0 && image.getAttribute('src')) {
        showFallback();
      } else {
        image.addEventListener('error', showFallback, { once: true });
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Pet filtering (Adopt a Pet page)
     ------------------------------------------------------------------------ */
  function initPetFilter() {
    const buttons = document.querySelectorAll('.filter-btn[data-filter]');
    const cards = document.querySelectorAll('.pet-card[data-pet-type]');
    const status = document.getElementById('filter-status');

    if (!buttons.length || !cards.length) {
      return;
    }

    // Singular and plural words used in the status message
    const nouns = {
      all: ['pet', 'pets'],
      dog: ['dog', 'dogs'],
      cat: ['cat', 'cats']
    };

    /**
     * Shows only the cards that match the chosen filter.
     * @param {string} filter - "all", "dog" or "cat"
     */
    function applyFilter(filter) {
      let visibleCount = 0;

      cards.forEach(function (card) {
        const matches = filter === 'all' || card.dataset.petType === filter;
        card.hidden = !matches;
        if (matches) {
          visibleCount += 1;
        }
      });

      // Update the active visual state and aria-pressed on every button
      buttons.forEach(function (button) {
        const isActive = button.dataset.filter === filter;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      updateStatus(filter, visibleCount);
    }

    /**
     * Writes a message into the aria-live region. The region is cleared first
     * so that screen readers announce the message even when it is repeated.
     */
    function updateStatus(filter, count) {
      if (!status) {
        return;
      }

      const words = nouns[filter] || nouns.all;
      const noun = count === 1 ? words[0] : words[1];
      const message = filter === 'all'
        ? 'Showing all ' + count + ' ' + noun + '.'
        : 'Showing ' + count + ' ' + noun + '.';

      status.textContent = '';
      window.setTimeout(function () {
        status.textContent = message;
      }, 50);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        applyFilter(button.dataset.filter);
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Preselect a pet from the URL, e.g. contact.html?pet=Bella
     ------------------------------------------------------------------------ */
  function preselectPetFromUrl(select, hint) {
    if (!select || typeof URLSearchParams === 'undefined') {
      return;
    }

    const requested = new URLSearchParams(window.location.search).get('pet');
    if (!requested) {
      return;
    }

    const wanted = requested.trim().toLowerCase();
    const match = Array.prototype.find.call(select.options, function (option) {
      return option.value !== '' && option.value.toLowerCase() === wanted;
    });

    // Ignore unknown names rather than selecting the wrong pet
    if (!match) {
      return;
    }

    select.value = match.value;

    if (hint) {
      hint.textContent = match.value + ' has been selected because you came from their profile. ' +
        'You can choose a different pet if you wish.';
    }
  }

  /* ------------------------------------------------------------------------
     5. Contact and adoption enquiry form
     ------------------------------------------------------------------------ */
  function initEnquiryForm() {
    const form = document.getElementById('enquiry-form');
    if (!form) {
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const summary = document.getElementById('form-error-summary');
    const success = document.getElementById('form-success');
    const successMessage = document.getElementById('success-message');
    const petSelect = form.elements.namedItem('preferredPet');
    const petHint = document.getElementById('pet-hint');

    // The submit button is disabled in the HTML so the form cannot be sent
    // anywhere without JavaScript. Enable it now that validation is ready.
    if (submitButton) {
      submitButton.disabled = false;
    }

    preselectPetFromUrl(petSelect, petHint);

    /**
     * Validation rules. Each rule returns an error message, or an empty
     * string when the field is valid.
     */
    const rules = [
      {
        name: 'fullName',
        validate: function (field) {
          const value = field.value.trim();
          if (value === '') {
            return 'Please enter your full name.';
          }
          if (value.length < 2) {
            return 'Your name must contain at least 2 characters.';
          }
          if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) {
            return 'Please use letters, spaces, hyphens or apostrophes only.';
          }
          return '';
        }
      },
      {
        name: 'email',
        validate: function (field) {
          const value = field.value.trim();
          if (value === '') {
            return 'Please enter your email address.';
          }
          if (!EMAIL_PATTERN.test(value)) {
            return 'Please enter a valid email address, for example name@example.com.';
          }
          return '';
        }
      },
      {
        name: 'phone',
        validate: function (field) {
          const value = field.value.trim();
          if (value === '') {
            return 'Please enter your telephone number.';
          }
          if (!/^\+?[0-9\s()-]+$/.test(value)) {
            return 'Use digits, spaces, brackets, hyphens and an optional leading + sign only.';
          }
          const digits = value.replace(/\D/g, '').length;
          if (digits < 7 || digits > 15) {
            return 'Please enter a telephone number containing 7 to 15 digits.';
          }
          return '';
        }
      },
      {
        name: 'preferredPet',
        validate: function (field) {
          return field.value === ''
            ? 'Please choose the pet you are interested in, or select "Not sure yet".'
            : '';
        }
      },
      {
        name: 'message',
        validate: function (field) {
          const value = field.value.trim();
          if (value === '') {
            return 'Please enter a message.';
          }
          if (value.length < 10) {
            return 'Please write at least 10 characters so we can understand your enquiry.';
          }
          if (value.length > 1000) {
            return 'Please keep your message to 1000 characters or fewer.';
          }
          return '';
        }
      },
      {
        name: 'consent',
        validate: function (field) {
          return field.checked
            ? ''
            : 'Please tick this box to confirm you understand and agree before sending.';
        }
      }
    ];

    function getField(name) {
      return form.elements.namedItem(name);
    }

    function getErrorElement(field) {
      return document.getElementById(field.id + '-error');
    }

    function showError(field, message) {
      const errorElement = getErrorElement(field);
      field.setAttribute('aria-invalid', 'true');
      if (errorElement) {
        errorElement.textContent = message;
      }
    }

    function clearError(field) {
      const errorElement = getErrorElement(field);
      field.removeAttribute('aria-invalid');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    /** Validates one field and returns true when it is valid. */
    function validateRule(rule) {
      const field = getField(rule.name);
      if (!field) {
        return true;
      }

      const message = rule.validate(field);
      if (message) {
        showError(field, message);
        return false;
      }

      clearError(field);
      return true;
    }

    function showSummary(count) {
      if (!summary) {
        return;
      }
      summary.textContent = count === 1
        ? 'There is 1 problem with your enquiry. Please check the highlighted field below.'
        : 'There are ' + count + ' problems with your enquiry. Please check the highlighted fields below.';
      summary.hidden = false;
    }

    function hideSummary() {
      if (summary) {
        summary.textContent = '';
        summary.hidden = true;
      }
    }

    function hideSuccess() {
      if (success) {
        success.hidden = true;
      }
    }

    function showSuccess(fullName, pet) {
      if (!success || !successMessage) {
        return;
      }

      const firstName = fullName.split(/\s+/)[0];
      const subject = pet && pet !== 'Not sure yet'
        ? 'your enquiry about ' + pet
        : 'your general adoption enquiry';

      // textContent is used so visitor input is never treated as HTML
      successMessage.textContent = 'Thank you, ' + firstName + '. ' +
        'All details for ' + subject + ' were completed correctly.';

      success.hidden = false;
      success.focus();
    }

    // Re-check a field as the visitor corrects it, and check completed text
    // fields when the visitor moves on. Empty fields are not flagged early.
    rules.forEach(function (rule) {
      const field = getField(rule.name);
      if (!field) {
        return;
      }

      const liveEvent = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';

      field.addEventListener(liveEvent, function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          validateRule(rule);
        }
      });

      if (field.type !== 'checkbox') {
        field.addEventListener('blur', function () {
          if (field.value.trim() !== '') {
            validateRule(rule);
          }
        });
      }
    });

    // Handle submission entirely in the browser
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      hideSuccess();

      const invalidFields = [];
      rules.forEach(function (rule) {
        if (!validateRule(rule)) {
          invalidFields.push(getField(rule.name));
        }
      });

      if (invalidFields.length > 0) {
        showSummary(invalidFields.length);
        // Focus the first problem so keyboard and screen-reader users hear it
        invalidFields[0].focus();
        return;
      }

      hideSummary();

      const fullName = getField('fullName').value.trim();
      const pet = petSelect ? petSelect.value : '';

      // Show the success message first, then clear the form
      showSuccess(fullName, pet);
      form.reset();
    });

    // Clearing the form (or resetting after success) also clears errors
    form.addEventListener('reset', function () {
      rules.forEach(function (rule) {
        const field = getField(rule.name);
        if (field) {
          clearError(field);
        }
      });
      hideSummary();
      if (petHint) {
        petHint.textContent = '';
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Footer year
     ------------------------------------------------------------------------ */
  function updateFooterYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('[data-current-year]').forEach(function (element) {
      element.textContent = year;
    });
  }

  /* ------------------------------------------------------------------------
     Start everything once the page structure is ready
     ------------------------------------------------------------------------ */
  function init() {
    initMobileNav();
    initImageFallbacks();
    initPetFilter();
    initEnquiryForm();
    updateFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
