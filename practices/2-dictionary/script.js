console.log("Script loaded")

const BASE_URL = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json"
const API_KEY = "Your API key here" // Replace with your actual API key

let word = "happy"
const URL = `${BASE_URL}/${word}?key=${API_KEY}`

//DOM selectors
const wordTitle = document.getElementById("word")
const type = document.getElementById("wordType")
const explanation = document.getElementById("explanation")

wordTitle.innerText = word

const fetchWord = () => {
  // Write logic to fetch word data from the API and display it on the page
}

fetchWord()
