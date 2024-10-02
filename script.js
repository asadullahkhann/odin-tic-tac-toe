const bodyEl = document.querySelector('body');
const dialog = document.querySelector('dialog');
const chooseOpponentRadioBtns = Array.from(document.querySelectorAll('.opponents input'));
const hiddenDivs = Array.from(document.querySelectorAll('.hidden'));
const hiddenInputs = Array.from(document.querySelectorAll('.hidden input'));
const hiddenSubmitBtn = document.querySelector('.submit');

const handleClose = () => {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', `./game.js`);
    bodyEl.appendChild(scriptEl);
    dialog.removeEventListener('close', handleClose);
};

window.addEventListener('load', () => {
    dialog.showModal();
});

dialog.addEventListener('close', handleClose);

chooseOpponentRadioBtns.forEach(chooseOpponentRadioBtn => {
    chooseOpponentRadioBtn.addEventListener('change', (e) => {
        switch(e.target.value) {
            case 'human':
                hiddenDivs[1].setAttribute('class', 'hidden');
                hiddenDivs[0].setAttribute('class', 'shown');
                break;
        
            case 'computer':
                hiddenDivs[0].setAttribute('class', 'hidden');
                hiddenDivs[1].setAttribute('class', 'shown');
        }
        if(hiddenSubmitBtn.classList.contains('hidden')) {
            hiddenSubmitBtn.classList.remove('hidden');
        }
    });
})