 
let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let inp = document.querySelector("input");
let btn = document.querySelector("#search");
let slct = document.querySelector("#element");
let result = document.querySelector("#result");

btn.addEventListener("click", () => {
    let word = inp.value.trim();
    let option = slct.value;

    if (!word || !option) {
        result.innerHTML = "<p class='error'>Please enter a word and select an option</p>";
        return;
    }

    fetchWord(word, option);
});

async function fetchWord(word, option) {
    try {
        result.innerHTML = "<p class='loader'>⏳ Loading...</p>";
        let res = await fetch(url + word);
        if (!res.ok) {
           result.innerHTML = "<p class='error'>Word not found</p>";
           return;
        }
        let data = await res.json();

        if (!Array.isArray(data) || !data[0].meanings) {
            result.innerHTML = "<p class='error'>Word not found</p>";
            return;
        }

        let meanings = data[0].meanings;
        let output = "";

        meanings.forEach((meaning, index) => {
            let def = meaning.definitions[0];

            if (option === "partOfSpeech") {
                output += `
                    <div class="card">
                        <h3>Meaning ${index + 1}</h3>
                        <p>${meaning.partOfSpeech}</p>
                    </div>
                `;
            }

            if (option === "synonyms") {
                let synonyms =
                    meaning.synonyms.length
                       ? meaning.synonyms
                       : def.synonyms;

                output += `
                    <div class="card">
                       <h3>${meaning.partOfSpeech}</h3>
                       <p>${synonyms.length ? synonyms.join(", ") : "No synonyms available"}</p>
                    </div> `;
            }

            if (option === "antonyms") {
               let antonyms =
                    meaning.antonyms && meaning.antonyms.length
                    ? meaning.antonyms
                    : (def.antonyms || []);

                output += `
                    <div class="card">
                    <h3>${meaning.partOfSpeech}</h3>
                    <p>${antonyms.length ? antonyms.join(", ") : "No antonyms available"}</p>
                </div>
                    `;
                }

        });

        result.innerHTML = output;

    } catch (error) {
        console.error(error);
        result.innerHTML = "<p class='error'>Something went wrong</p>";
    }
}

