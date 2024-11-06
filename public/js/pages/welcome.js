(function () {
    function updateWelcomeTexts() {
        document.getElementById('welcomeTitle').textContent = i18n.t('welcome.title');
        document.getElementById('welcomeSubtitle').textContent = i18n.t('welcome.subtitle');

        document.getElementById('feature1Title').textContent = i18n.t('welcome.features.1.title');
        document.getElementById('feature1Text').textContent = i18n.t('welcome.features.1.text');
        document.getElementById('feature2Title').textContent = i18n.t('welcome.features.2.title');
        document.getElementById('feature2Text').textContent = i18n.t('welcome.features.2.text');
        document.getElementById('feature3Title').textContent = i18n.t('welcome.features.3.title');
        document.getElementById('feature3Text').textContent = i18n.t('welcome.features.3.text');
    }

    PageLifecycle.register('welcome', {
        mount: () => {
            window.addEventListener('textsUpdated', updateWelcomeTexts);
            updateWelcomeTexts();
        },
        unmount: () => {
            window.removeEventListener('textsUpdated', updateWelcomeTexts);
        }
    });
})();