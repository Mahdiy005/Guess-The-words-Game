// Setting Game Option
let numOfTries = 4;
let numOfLetters = 6;
let currentTry = 1;
let numOfHints = 3;

document.querySelector(".hint span").innerHTML = numOfHints;

// manage words
const words = [
  "Banana",
  "Orange",
  "Cherry",
  "Grapes",
  "Tomato",
  "Pepper",
  "Mango",
  "Potato",
  "Pepper",
  "Melons",
];
let wordToGuess =
  words[
    Math.round(
      Math.random() * words.length === 10
        ? Math.round(Math.random() * words.length - 1)
        : Math.round(Math.random() * words.length)
    )
  ].toLocaleLowerCase();
let messageArea = document.querySelector(".message");

window.onload = function () {
  // generat inputs feilds
  generateTries();
  // move among feilds right and left and when enter character
  traversInInputs();
  // handle the logic of the game
  let btn = document.querySelector(".check");
  btn.addEventListener("click", function () {
    handleLogic();
  });
  // handle hint button
  let btnHint = document.querySelector(".hint");
  btnHint.addEventListener("click", function () {
    handleHint();
  });
};

function generateTries() {
  const inputsContainer = document.querySelector(".inputs");
  for (let i = 1; i <= numOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `Try <span>${i}</span>`;
    // disablled al classes except currentTry
    if (i !== currentTry) tryDiv.classList.add("disabled-inputs");
    // add inputs
    for (let j = 1; j <= numOfLetters; j++) {
      let inp = document.createElement("input");
      inp.type = "text";
      inp.id = `guess-${i}-letter-${j}`;
      inp.setAttribute("maxlength", 1);
      inp.style.width = "50px";
      inp.style.outline = "none";
      inp.style.textTransform = "uppercase";
      tryDiv.append(inp);
    }
    inputsContainer.append(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();
}

function traversInInputs() {
  let inp = document.querySelectorAll("input");
  inp.forEach((item) => {
    item.addEventListener("input", function (e) {
      if (e.currentTarget.nextSibling !== null) {
        e.currentTarget.nextSibling.focus();
      }
    });

    item.addEventListener("keydown", function (e) {
      console.log();
      if (e.currentTarget.nextSibling !== null && e.key === "ArrowRight") {
        e.currentTarget.nextSibling.focus();
      }
    });

    item.addEventListener("keydown", function (e) {
      if (e.currentTarget.previousSibling !== null && e.key === "ArrowLeft") {
        e.currentTarget.previousSibling.focus();
      }
    });

    item.addEventListener("keydown", function (e) {
      // console.log(e.key);
      if (e.currentTarget.previousSibling !== null && e.key === "Backspace") {
        let inputs = document.querySelectorAll(`.try-${currentTry} input`);
        let currentIndex = Array.from(inputs).indexOf(document.activeElement)
        // console.log(currentIndex);
        if(currentIndex > 0) {
          let currentInput = inputs[currentIndex];
          let prevInput = inputs[currentIndex -1];
          prevInput.value = "";
          prevInput.focus()
          if(currentInput.value) {
            currentInput.value = ""
            prevInput.value = "";
          prevInput.focus()
          }
        }
      }
    });
  });
}

function handleLogic() {
  let sucessGuess = true;
  for (let i = 1; i <= numOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    // console.log(inputField.value);
    // console.log(wordToGuess[i - 1]);
    if (inputField.value === wordToGuess[i - 1]) {
      inputField.classList.add("in-place");
    } else if (wordToGuess.includes(inputField.value)) {
      inputField.classList.add("not-in-place");
      sucessGuess = false;
    } else {
      inputField.classList.add("wrong");
      sucessGuess = false;
    }
  }

  // Manage succes and Failure
  if (sucessGuess) {
    messageArea.innerHTML = `You Win !! The Word is <span>${wordToGuess}</span>`;
    // make all divs in inputs disaled after you win
    let allDivs = document.querySelectorAll(".inputs > div");
    allDivs.forEach((div) => div.classList.add("disabled-inputs"));
    // make the button also disabled
    let btn = document.querySelector(".check");
    btn.disabled = true;
    document.querySelector(".hint").disabled = true;
  } else {
    if (currentTry < numOfTries) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.add("disabled-inputs");
      currentTry++;
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      document.querySelector(`.try-${currentTry}`).children[1].focus();
    } else {
      let btn = document.querySelector(".check");
      btn.disabled = true;
      messageArea.innerHTML = `Game Over The word is <span>${wordToGuess}</span>`;
    }
    document.querySelector(".hint").disabled = true;
    // console.log(document.querySelector(`.try-${currentTry}`));
  }
}

function handleHint() {
  if (numOfHints > 0) {
    let spanHint = document.querySelector(".hint span");
    let inputs = document.querySelectorAll(`.try-${currentTry} > input`); // [, , , , ,]
    let withValue = Array.from(inputs).filter((inp) => inp.value === "");
    let index = Math.floor(Math.random() * numOfLetters);
    console.log(numOfHints);
    if (!inputs[index].value) {
      inputs[index].value = wordToGuess[index];
      numOfHints--;
      spanHint.innerHTML = numOfHints;
    } else {
      // application with recursion
      if (withValue.length !== 0) handleHint();
    }
    if (numOfHints === 0) {
      document.querySelector(".hint").disabled = true;
    }
  }
}
