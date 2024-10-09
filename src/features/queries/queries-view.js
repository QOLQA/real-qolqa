export const renderQueryForm = () => {
    // render function for query form
    const queryForm = selectQueryForm(store.getState());
    if (queryForm.open) {
        // show query popup
        queryPopup.classList.replace('hidden', 'flex');
        queryPopup.classList.add('items-center', 'justify-center');
        // stepper one with fullQuery
        if (queryForm.step === 1) {
            stepTwoContainer.classList.replace('block', 'hidden');
            stepOneForm.classList.replace('hidden', 'block');
            fullQueryInput.value = queryForm.fullQuery;
        } else if (queryForm.step === 2) {
            // show form for step two
            stepOneForm.classList.replace('block', 'hidden');
            stepTwoContainer.classList.replace('hidden', 'block');
            const words = getw
        }
    } else {
        // hide query popup
        queryPopup.classList.replace('flex', 'hidden');
        queryPopup.classList.remove('items-center', 'justify-center');
    }
}

export const initializerQueryForm = () => {
    // init query functionality
    const queryPopup = document.getElementById('query-popup');
    const openPopupButton = document.getElementById('open-popup-button');
    const closePopupButton = document.getElementById('close-popup-button');
    const stepOneForm = document.getElementById('step-one-form');
    const stepTwoForm = document.getElementById('step-two-form');
    const stepTwoContainer = document.getElementById('step-two-container');
    const backToStepOneButton = document.getElementById('back-button');
    const cancelQueryButton = document.getElementById('cancel-button');
    const fullQueryInput = document.getElementById('query');
    const wordsButtons = document.getElementById('words-buttons');

    openPopupButton.addEventListener('click', () => {
        store.dispatch(toggleVisibility());
    });
    closePopupButton.addEventListener('click', () => {
        store.dispatch(toggleVisibility());
    });
    stepOneForm.addEventListener('submit', (event) => {
        event.preventDefault();
        store.dispatch(changeStep({
            otherStep: 2,
            query: fullQueryInput.value,
        }));
    });
    cancelQueryButton.addEventListener('click', () => {
        store.dispatch(toggleVisibility());
    });
    backToStepOneButton.addEventListener('click', () => {
        store.dispatch(changeStep({
            otherStep: 1,
        }))
    })
}

