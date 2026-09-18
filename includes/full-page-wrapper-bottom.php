<?php
/**
 * Full standalone page wrapper, closing half. See full-page-wrapper-top.php.
 */
?>
    </div><!-- #content -->

    <!-- Footer -->
    <footer class="bg-brand-dark border-t border-white/[.08] py-8">
        <div class="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
            <!-- Logo + copyright -->
            <div class="flex items-center gap-3">
                <img src="/files/images/bs-logo.svg" alt="Brandon Sanders initials" class="w-9 h-9 rounded-lg object-cover opacity-80">
                <p class="text-white/60 text-xs">&copy; <?php echo date("Y"); ?> Brandon Sanders, CISSP</p>
            </div>
            <!-- Disclaimer -->
            <div class="text-white/60 text-xs italic text-center">
                For use by individuals in the United States only.
            </div>
            <!-- Built-by note -->
            <div class="text-white/60 text-xs text-right">
                Self-hosted website built by Brandon Sanders, CISSP
            </div>
        </div>
        <span class="no-display-keywords">Sportbike Culture, Brandon Sanders, Small Business Owner</span>
    </footer>

    <!-- Hosting modal (custom, no Bootstrap) -->
    <div id="hostingModal" role="dialog" aria-modal="true" aria-labelledby="hostingModalLabel"
         class="fixed inset-0 z-[9999] items-center justify-center px-4"
         style="display:none;">
        <!-- Backdrop -->
        <div id="modalBackdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <!-- Card -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/50">
            <!-- Header -->
            <div class="bg-gradient-to-r from-mint/90 to-mint-muted/60 px-6 py-4 flex items-center justify-between">
                <h5 class="font-bold text-brand text-base" id="hostingModalLabel">Powered by Modern Infrastructure</h5>
                <button id="modalClose" class="text-brand/70 hover:text-brand transition-colors" aria-label="Close">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 text-slate-700 text-sm">
                <p class="mb-4">This website is built, deployed, and maintained by Brandon Sanders.</p>
                <div class="flex flex-col gap-3">
                    <div class="flex items-start gap-3">
                        <i class="fa-solid fa-cubes text-brand mt-0.5 w-4 shrink-0" aria-hidden="true"></i>
                        <span>Runs as a <strong>Kubernetes container</strong> on my home cluster for reliability and fast updates.</span>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="fa-solid fa-shield-halved text-brand mt-0.5 w-4 shrink-0" aria-hidden="true"></i>
                        <span>Traffic is routed through <strong>Cloudflare</strong> for secure delivery, caching, and edge protection.</span>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="fa-brands fa-github text-brand mt-0.5 w-4 shrink-0" aria-hidden="true"></i>
                        <span>The full source is publicly available on GitHub.</span>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <a href="https://github.com/brandonsanders48/ResumePortfolio" target="_blank" rel="noopener"
                       class="inline-flex items-center gap-1.5 text-brand border border-brand/25 rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-brand hover:text-white transition-all">
                        <i class="fa-brands fa-github"></i> View Project on GitHub
                    </a>
                </div>
                <img src="/files/images/cloudflare.png" alt="Kubernetes and Cloudflare" class="w-24 mx-auto mt-4 block opacity-80">
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-slate-100 flex justify-end">
                <button id="modalCloseBtn"
                        class="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2 transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!-- Core scripts -->
    <script>window.__BS_BOOTSTRAP__ = 'existing';</script>
    <script src="/spa.js"></script>
    <script src="/extra.js" defer></script>

</body>
</html>
