let question = document.querySelector("#qust")
let score = document.querySelector("#score")
let main = document.querySelector(".main")
let option = document.querySelectorAll(".option")
let next = document.querySelector("#next")
let sport = document.querySelector("#sports")
let film = document.querySelector("#films")
let games = document.querySelector("#games")
let general = document.querySelector("#gen")
let current = []
let rand_o;

// handle fetchdata and retry for 429 Error
async function fetchdata(id) {
    question.innerHTML = "Loading ...";
    main.classList.remove('d-none')
    let data = await fetch(`https://opentdb.com/api.php?amount=50&category=${id}&difficulty=medium&type=multiple`)
    // if too many requests wait 2 sec and try again (Recursion)
    if (data.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return fetchdata(id)
    }

    let res = await data.json()
    current = res.results
}
// get random question from API
async function showQuestion(lis) {
    if (lis.length > 0) {
        let rand = Math.floor(Math.random() * lis.length)
        question.innerHTML = lis[rand].question
        rand_o = Math.floor(Math.random() * 4)
        // handle option buttons by edit class list when start the game
        for (let i = 0; i < option.length; i++) {
            option[i].classList="btn btn-info mb-4 text-start w-100 option"
            option[i].style.cursor = "pointer"
            option[i].disabled = false;
        }
        // handle random options
        let wrong = 0
        for (let i = 0; i < option.length; i++) {
            if (i == rand_o) {
                option[i].innerHTML = lis[rand].correct_answer
            } else {
                option[i].innerHTML = lis[rand].incorrect_answers[wrong]
                wrong++
            }
        }
        lis.splice(rand, 1)
    } else {
        question.innerHTML = "questions end. go to another category!";
        next.classList.add('d-none');
    }
}
// handle the true and false options after answer
for (let i = 0; i < option.length; i++) {
    option[i].addEventListener('click', function() {
        for (let btn of option) {
            btn.disabled = true;
            btn.style.cursor = "default";
        }
        if (i === rand_o) {
            option[i].classList.add("btn-success")
            option[i].classList.remove("btn-info")
            next.classList.remove('d-none')
            score.innerHTML++
        } else {
            option[i].classList.add("btn-danger")
            option[i].classList.remove("btn-info")
            option[rand_o].classList.add("btn-success")
            option[rand_o].classList.remove("btn-info")
            next.classList.remove('d-none')
        }
    })
}

next.addEventListener('click', function() {
    next.classList.add('d-none')
    showQuestion(current)
})
// handle get categories from api by id
ids = [
    {cat: sport,id: 21},
    {cat: film,id: 11},
    {cat: games,id: 15},
    {cat: general,id: 9}
]
ids.forEach(ele => {
    ele.cat.addEventListener('click', async function() {
        ids.forEach(item => item.cat.style.pointerEvents = "none");
        question.innerHTML = "Loading ...";
        option.forEach(btn => btn.classList.add("d-none"));
        score.classList.add("d-none")
        await fetchdata(ele.id)
        score.innerHTML = 0;
        score.classList.remove("d-none")
        option.forEach(btn => btn.classList.remove("d-none"));
        next.classList.add('d-none')
        showQuestion(current)
        ids.forEach(item => item.cat.style.pointerEvents = "auto");
    })

});
