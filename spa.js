// Shared SPA navigation logic.
//
// Two entry modes, selected by setting window.__BS_BOOTSTRAP__ before this
// script runs:
//   - unset / "fetch-home": this is the site shell (root index.php). On load,
//     fetch the page matching the current URL into #content.
//   - "existing": this document was served as a full standalone page (a
//     visitor opened /Projects/index.php directly, a crawler indexed it,
//     etc.) and #content already has real markup. Just wire up navigation
//     and animations against what's already on the page.
//
// In both modes, subsequent in-page navigation (nav links, buttons) updates
// the URL via pushState so links are shareable/bookmarkable, and back/forward
// is handled via popstate.
(function () {
  var HOME_FILE = '/Portfolio/index.php';

  function displayUrlFor(fetchUrl) {
    return fetchUrl === HOME_FILE ? '/' : fetchUrl;
  }

  function fetchUrlFor(displayUrl) {
    if (displayUrl === '/' || displayUrl === '') return HOME_FILE;
    return displayUrl;
  }

  function runPageScripts(scrollToId) {
    // Typing animation cursor removal
    var nameEl = document.getElementById('name');
    if (nameEl) {
      var typingDuration = 3000;
      setTimeout(function () {
        nameEl.style.borderRight = 'none';
      }, typingDuration + 1000);
    }

    // Slide-up animations
    var elements = document.querySelectorAll('.slide-up');
    if (!scrollToId) {
      elements.forEach(function (el, index) {
        setTimeout(function () { el.classList.add('show'); }, 500 + index * 300);
      });
    } else {
      elements.forEach(function (el) { el.classList.add('show'); });
    }

    // data-load-page buttons
    var buttons = document.querySelectorAll('[data-load-page]');
    buttons.forEach(function (btn) {
      var page = btn.getAttribute('data-load-page');
      var targetId = btn.getAttribute('data-scroll') || null;
      btn.addEventListener('click', function (e) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        var navMenu = document.getElementById('nav-menu');
        if (navMenu) navMenu.classList.add('hidden');
        loadPage(page, targetId, true);
      });
    });

    // Mobile nav toggle
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
      var newToggle = navToggle.cloneNode(true);
      navToggle.parentNode.replaceChild(newToggle, navToggle);
      newToggle.addEventListener('click', function () {
        navMenu.classList.toggle('hidden');
      });
    }
  }

  function loadPage(url, scrollToId, pushState) {
    var spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'flex';
    fetch(url + '?t=' + Date.now(), {
      headers: { "X-Requested-With": "fetch" }
    })
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var content = document.getElementById('content');
        if (content) content.innerHTML = html;
        runPageScripts(scrollToId);
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (scrollToId) {
          var target = document.getElementById(scrollToId);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
        if (pushState) {
          var display = displayUrlFor(url);
          if (location.pathname !== display) {
            history.pushState({ url: url }, '', display);
          }
        }
      })
      .finally(function () {
        var spinnerAfter = document.getElementById('spinner');
        if (spinnerAfter) spinnerAfter.style.display = 'none';
      })
      .catch(function (err) { console.error('Error loading page:', err); });
  }

  window.addEventListener('popstate', function (e) {
    var url = (e.state && e.state.url) || fetchUrlFor(location.pathname);
    loadPage(url, null, false);
  });

  document.addEventListener('DOMContentLoaded', function () {
    if (window.__BS_BOOTSTRAP__ === 'existing') {
      // Content already rendered server-side for a direct page load.
      history.replaceState({ url: fetchUrlFor(location.pathname) }, '', location.pathname);
      runPageScripts();
    } else {
      // Site shell: fetch whichever page matches the current URL.
      var target = fetchUrlFor(location.pathname);
      history.replaceState({ url: target }, '', displayUrlFor(target));
      loadPage(target, null, false);
    }
  });
})();
