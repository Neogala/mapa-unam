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

    // Different pages load different external libraries (Chart.js, D3,
    // three.js) via <script src> tags in <head>. navigateTo() only
    // re-executes each page's own inline <script id="page-script">, so if a
    // page whose library isn't loaded yet navigates to one that needs it
    // (e.g. poblacion-escolar.html, which loads no chart library, to any
    // other page), that page's script throws "X is not defined" on its
    // first line and the rest of the script — including "Ver detalle" modal
    // bindings — never runs. Track already-loaded scripts by filename (so
    // the same library served from two different CDNs, as Chart.js is,
    // isn't reloaded) and inject/await any missing ones before the new
    // page's script runs.
    var loadedScriptKeys = {};
    Array.prototype.forEach.call(document.querySelectorAll('script[src]'), function (s) {
        loadedScriptKeys[scriptKey(s.src)] = true;
    });

    function scriptKey(src) {
        try {
            return new URL(src, window.location.href).pathname.split('/').pop();
        } catch (e) {
            return src;
        }
    }

    function ensureHeadScripts(doc) {
        var needed = Array.prototype.filter.call(doc.querySelectorAll('script[src]'), function (s) {
            return !loadedScriptKeys[scriptKey(s.src)];
        });
        if (!needed.length) return Promise.resolve();
        return Promise.all(needed.map(function (s) {
            return new Promise(function (resolve) {
                var el = document.createElement('script');
                el.src = s.src;
                el.onload = function () { loadedScriptKeys[scriptKey(s.src)] = true; resolve(); };
                el.onerror = function () { resolve(); };
                document.head.appendChild(el);
            });
        }));
    }

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

    // Each page defines its own "Ver detalle" modals (.modal-overlay) as
    // direct children of <body>, living OUTSIDE #main-content-container so
    // they can use position:fixed to cover the whole viewport. Because
    // navigateTo() only swaps #main-content-container's innerHTML, those
    // modals were never being replaced on AJAX navigation: after navigating
    // to a new page, its "Ver detalle" buttons pointed at modal IDs that
    // simply weren't in the live DOM (the old page's modals, if any, were
    // still there instead), so clicking them silently did nothing. Swap
    // these page-level modals explicitly, the same way page-style and
    // sidebar-indicators are swapped.
    function swapPageLevelModals(doc) {
        document.querySelectorAll('body > .modal-overlay').forEach(function (el) {
            el.parentNode.removeChild(el);
        });
        var pageScript = document.getElementById('page-script');
        Array.prototype.forEach.call(doc.querySelectorAll('body > .modal-overlay'), function (el) {
            document.body.insertBefore(document.importNode(el, true), pageScript);
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

            swapPageLevelModals(doc);

            await ensureHeadScripts(doc);

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
