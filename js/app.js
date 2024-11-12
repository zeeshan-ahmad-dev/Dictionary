import languages from './languages.js';

const input = document.querySelector('input');
const wordContainer = document.querySelector('.words-container');
const addBtn = document.querySelector('.add');
const clearBtn = document.querySelector('.clear button');
const fromContainer = document.querySelector('#from');
const toContainer = document.querySelector('#to');

appendOptions(toContainer);
appendOptions(fromContainer);

let wordsHistory = JSON.parse(localStorage.getItem('wordsHistory')) || [];

// Check if there’s any saved data
if (wordsHistory.length > 0) {
    wordsHistory.forEach(word => {
        addWordToContainer(word.word, word.meaning);
    });
}

// ON add button click
addBtn.addEventListener('click', handleNewWord)

// On enter click
input.addEventListener('keypress', async (e) => {
    if (e.key == 'Enter') {
        handleNewWord();
    }
})


clearBtn.addEventListener('click', clearHistroy);

async function fetchMeaning(input) {
    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${input}&langpair=${fromContainer.value}|${toContainer.value}`);
        if (res.ok) {
            const data = await res.json();
            return data.responseData.translatedText;
        } else {
            throw new Error('Failed to fetch meaning');
        }
    } catch (error) {
        console.error(error);
        alert('Error fetching meaning');
        return 'Meaning not found';
    }
}

function addWordToHistory(word, meaning) {
    if (!wordsHistory.some(entry => entry.word == word)) {
        wordsHistory.push({
            word,
            meaning
        })
    }

    localStorage.setItem('wordsHistory', JSON.stringify(wordsHistory));
}

async function handleNewWord() {
    const inputVal = input.value.trim();
    if (!inputVal) {
        alert("Input can't be empty!");
        return;
    };


    const meaning = await fetchMeaning(inputVal);

    addWordToContainer(inputVal, meaning);
    addWordToHistory(inputVal, meaning);

    input.value = '';
}

function addWordToContainer(word, meaning) {
    const div = document.createElement('div');
    div.classList.add('word');
    div.innerHTML = `
    <div class="eng">
    <h4>${word}</h4>
    </div>
    <div class="ud">
    <h4>${meaning}</h4>
    </div>`;
    wordContainer.appendChild(div);
}

function clearHistroy() {
    if (confirm("Are you sure to clear you'r history!")) {
        wordsHistory = [];
        wordContainer.innerHTML = '';
        localStorage.removeItem('wordsHistory')
    }
}

function appendOptions(container) {
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.innerText = lang.language;
        if (container == fromContainer && lang.code == 'en') {
            option.selected = true;
        } else if (container == toContainer && lang.code == 'ur') {
            option.selected = true;
        } else { }
        container.appendChild(option);
    })
}