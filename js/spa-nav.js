/**
 * spa-nav.js
 *
 * Lightweight AJAX navigation between the "Numeralia" dashboard pages so the
 * header and left sidebar stay mounted and only the dashboard content swaps.
 *
 * How it works:
 *  - A delegated click handler on the document intercepts clicks on <a> tags
 *    whose href resolves to one of the 9 registered dashboard pages.
 *  - navigateTo() fetches the target page's HTML, destroys existing Chart.js
 *    instances (to avoid canvas-reuse errors), swaps the page-specific
 *    <style>, the sidebar indicators nav, and the main content container,
 *    updates <title>, re-executes the page's trailing inline <script>, and
 *    pushes a history entry.
 *  - popstate re-runs navigateTo() without pushing a new history entry.
 */
(function () {
    'use strict';

    // The 9 navigable Numeralia dashboard pages.
    var PAGES = [
        'poblacion-escolar.html',
        'personal-academico.html',
        'investigacion.html',
        'cultura.html',
        'presupuesto.html',
        'bibliotecas.html',
        'apoyo.html',
        'internacionalizacion.html',
        'infraestructura.html'
    ];

    var isNavigating = false;

    function pageFileName(href) {
        try {
            var url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return null;
            var fileName = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
            return fileName;
        } catch (e) {
            return null;
        }
    }

    function isRegisteredPage(href) {
        var fileName = pageFileName(href);
        return !!fileName && PAGES.indexOf(fileName) !== -1;
    }

    function destroyCharts(root) {
        if (typeof Chart === 'undefined' || !root) return;
        var canvases = root.querySelectorAll('canvas');
        canvases.forEach(function (canvas) {
            var chart = Chart.getChart(canvas);
            if (chart) {
                try { chart.destroy(); } catch (e) { /* ignore */ }
            }
        });
    }

    function scrollToTop() {
        try {
            window.scrollTo(0, 0);
            var main = document.getElementById('top');
            if (main) main.scrollTop = 0;
            var mcc = document.getElementById('main-content-container');
            if (mcc) mcc.scrollTop = 0;
        } catch (e) { /* ignore */ }
    }

    async function navigateTo(url, options) {
        options = options || {};
        var push = options.push !== false;

        var targetFileName = pageFileName(url);
        if (!targetFileName || PAGES.indexOf(targetFileName) === -1) {
            // Not a registered page; fall back to a normal navigation.
            window.location.href = url;
            return;
        }

        var currentFileName = pageFileName(window.location.href);
        if (isNavigating) return;
        if (push && currentFileName === targetFileName) return;

        isNavigating = true;

        try {
            var response = await fetch(url);
            if (!response.ok) throw new Error('Fetch failed: ' + response.status);
            var html = await response.text();
            var doc = new DOMParser().parseFromString(html, 'text/html');

            var currentMcc = document.getElementById('main-content-container');
            destroyCharts(currentMcc);

            var newTitleEl = doc.querySelector('title');
            if (newTitleEl) document.title = newTitleEl.textContent;

            var currentPageStyle = document.getElementById('page-style');
            var newPageStyle = doc.getElementById('page-style');
            if (currentPageStyle && newPageStyle) {
                currentPageStyle.innerHTML = newPageStyle.innerHTML;
            }

            var currentSidebarIndicators = document.getElementById('sidebar-indicators');
            var newSidebarIndicators = doc.getElementById('sidebar-indicators');
            if (currentSidebarIndicators && newSidebarIndicators) {
                currentSidebarIndicators.innerHTML = newSidebarIndicators.innerHTML;
            }

            var newMcc = doc.getElementById('main-content-container');
            if (currentMcc && newMcc) {
                currentMcc.innerHTML = newMcc.innerHTML;
            }

            var oldPageScript = document.getElementById('page-script');
            var newPageScriptSrc = doc.getElementById('page-script');
            if (newPageScriptSrc) {
                var scriptEl = document.createElement('script');
                scriptEl.id = 'page-script';
                scriptEl.textContent = newPageScriptSrc.textContent;
                if (oldPageScript && oldPageScript.parentNode) {
                    oldPageScript.parentNode.removeChild(oldPageScript);
                }
                document.body.appendChild(scriptEl);
            }

            if (push) {
                history.pushState({ spaNav: true, url: url }, '', url);
            }

            scrollToTop();
        } catch (err) {
            // If anything goes wrong, fall back to a full page navigation
            // so the user is never left on a broken page.
            window.location.href = url;
            return;
        } finally {
            isNavigating = false;
        }
    }

    function onDocumentClick(event) {
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        var anchor = event.target.closest ? event.target.closest('a') : null;
        if (!anchor) return;

        var href = anchor.getAttribute('href');
        if (!href) return;
        if (anchor.target && anchor.target !== '' && anchor.target !== '_self') return;
        if (anchor.hasAttribute('download')) return;

        if (!isRegisteredPage(href)) return;

        event.preventDefault();
        navigateTo(anchor.href, { push: true });
    }

    window.addEventListener('popstate', function (event) {
        var state = event.state;
        if (state && state.spaNav) {
            navigateTo(state.url || window.location.href, { push: false });
        } else if (isRegisteredPage(window.location.pathname)) {
            navigateTo(window.location.href, { push: false });
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', onDocumentClick);
    });

    // Expose for debugging / manual invocation if ever needed.
    window.__spaNav = { navigateTo: navigateTo, PAGES: PAGES };
})();
