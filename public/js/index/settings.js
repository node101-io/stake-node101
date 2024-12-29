window.addEventListener('load', () => {

    document.addEventListener('click', event => {

        if (event.target.closest('.content-wrapper-lang-popup')) {
            const langPopupMenu = event.target.closest('.content-wrapper-lang-popup').querySelector('.content-wrapper-lang-popup-list');
            langPopupMenu.classList.toggle('display-none');
        }

    });
});