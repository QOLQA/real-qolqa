import { store } from "../app/store"
import { addQuery } from "./diagrama/diagramaSlice"

export function initializeQueryPopup(params) {
  
  const queryPopup = document.getElementById('query-popup')
  const stepper = document.getElementById('stepper')
  const openPopupButton = document.getElementById('open-popup-button')
  const closePopupButton = document.getElementById('close-popup-button')
  
  const stepOneForm = document.getElementById('step-one-form')
  const stepTwoForm = document.getElementById('step-two-form')
  const stepTwoContainer = document.getElementById('step-two-container')
  const cancelQueryButton = document.getElementById('cancel-button')
  const backToStepOneButton = document.getElementById('back-button')
  
  const fullQueryInput = document.getElementById('query')
  const wordsButtons = document.getElementById('words-buttons')
  
  const queryList = document.getElementById('query-list')
  
  cancelQueryButton.addEventListener('click', closePopup)
  
  backToStepOneButton.addEventListener('click', resetStepper)
  
  stepOneForm.addEventListener('submit', (event) => {
    event.preventDefault()
    stepOneForm.classList.replace('block', 'hidden')
    stepTwoContainer.classList.replace('hidden', 'block')
    const fullQuery = fullQueryInput.value
    const words = getWords(fullQuery)
    for (let word of words) {
      let wordButton = createWordButton(word)
      wordsButtons.appendChild(wordButton)
    }
  })
  
  function getWords(sentence) {
    const words = sentence.split(/\s+/)
    return words.filter(p => p !== '')
  }
  
  openPopupButton.addEventListener('click', () => {
    queryPopup.classList.replace('hidden', 'flex')
    queryPopup.classList.add('items-center', 'justify-center')
  })
  
  closePopupButton.addEventListener('click', closePopup)
  
  function resetStepper() {
    stepTwoContainer.classList.replace('block', 'hidden')
    stepOneForm.classList.replace('hidden', 'block')
    fullQueryInput.value = ''
  }
  
  function closePopup() {
    queryPopup.classList.replace('flex', 'hidden')
    queryPopup.classList.remove('items-center', 'justify-center')
    resetStepper()
  }
  
  
  function createWordButton(word) {
    let wordButton = document.createElement('button')
    wordButton.classList.add('p-2', 'text-white', 'bg-green-500')
    wordButton.textContent = word
    wordButton.addEventListener('click', () => {
      toggleSelectedWord(wordButton, word)
    })
    return wordButton
  }
  
  const selectedWords = []
  const selectedWordsInput = document.getElementById('selected-words')
  
  function toggleSelectedWord(button, word) {
    const index = selectedWords.indexOf(word)
    if (index === -1) {
      selectedWords.push(word)
      button.classList.replace('bg-green-500', 'bg-purple-500')
    } else {
      selectedWords.splice(index, 1)
      button.classList.replace('bg-purple-500', 'bg-green-500')
    }
    updateSelectedWordsInput()
  }
  
  function updateSelectedWordsInput() {
    selectedWordsInput.value = selectedWords.join(',')
  }
  
  stepTwoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const collectionNames = selectedWordsInput.value.split(',')
    wordsButtons.innerHTML = ''
    selectedWords.splice(0, selectedWords.length)
    store.dispatch(addQuery({
      full_query: fullQueryInput.value,
      collections: collectionNames,
    }));
    closePopup()
  })
}