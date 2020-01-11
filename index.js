let listGrab = document.querySelectorAll("ul");
let inputGrab = document.querySelectorAll("input");
let buttonGrab = document.querySelectorAll("button");
let urls = [
  "http://star-cors.herokuapp.com/people",
  "http://star-cors.herokuapp.com/films",
  "http://star-cors.herokuapp.com/starships",
  "http://star-cors.herokuapp.com/vehicles"
];
let countsArray = [];

function parseJSON(response) {
  return response.json();
}

function updateCount() {
  listGrab.forEach(function(list) {
    let count = list.children.length - 2;
    //console.log(list.children[1].children[0].innerHTML);
    list.children[1].children[0].innerHTML = count;
  });
}
Promise.all(urls.map(url => fetch(url).then(parseJSON))).then(data => {
  //console.log(data);
  data.forEach(function(count) {
    let stat = document.createElement("h8");
    stat.innerHTML = `| viewing <b>${count.results.length}</b> of ${count.count}`;
    listGrab[data.indexOf(count)].appendChild(stat);
    //console.log(data.indexOf(count));
    countsArray.push(count.count);
  });

  data[0].results.forEach(function(result) {
    let character = document.createElement("li");
    character.innerHTML = `<b>${result.name}</b> born on ${result.birth_year}`;
    listGrab[0].appendChild(character);
  });

  data[1].results.forEach(function(result) {
    let film = document.createElement("li");
    film.innerHTML = `<b>${result.title}</b> released on ${result.release_date}`;
    listGrab[1].appendChild(film);
  });

  data[2].results.forEach(function(result) {
    let starship = document.createElement("li");
    starship.innerHTML = `<b>${result.name}</b> built by ${result.manufacturer}`;
    listGrab[2].appendChild(starship);
  });

  data[3].results.forEach(function(result) {
    let vehicle = document.createElement("li");
    vehicle.innerHTML = `<b>${result.name}</b> passenger capacity ${result.passengers}`;
    listGrab[3].appendChild(vehicle);
  });
});

inputGrab.forEach(function(input) {
  input.addEventListener("change", handleInput);
});

function handleInput(event) {
  let listIndex = Number(event.srcElement.name);
  let search = event.srcElement.value;
  let dataArray = listGrab[listIndex].children;
  //console.log(listIndex);
  //console.log(search);
  //console.log(dataArray);
  for (let i = 2; i < dataArray.length; i++) {
    //console.log(dataArray[i].innerHTML);
    if (!dataArray[i].innerHTML.toLowerCase().includes(search.toLowerCase())) {
      //console.log(dataArray[i].innerHTML);
      //console.log(listGrab[listIndex].children[i]);
      listGrab[listIndex].children[i].style.display = "none";
    } else {
      listGrab[listIndex].children[i].style.display = "block";
    }
  }
  updateCount();
}

buttonGrab.forEach(function(button) {
  button.addEventListener("click", updateList);
});

async function updateList(event) {
  //console.log(Number(event.target.id));
  buttonIndex = Number(event.target.id);
  let next = String(listGrab[buttonIndex].children.length + 8)[0];
  let newUrl = urls[buttonIndex] + "/?page=" + next;
  //console.log(Number(String(listGrab[buttonIndex].children.length + 8)[0]));
  //console.log(urls[buttonIndex] + "/?page=" + next);
  if (
    Number(listGrab[buttonIndex].children[1].children[0].innerHTML) <
    countsArray[buttonIndex]
  ) {
    await fetch(newUrl).then(response =>
      response.json().then(data =>
        data.results.forEach(function(person) {
          //console.log(person.name);
          let character = document.createElement("li");
          character.innerHTML = `<b>${person.name}</b> born on ${person.birth_year}`;
          listGrab[buttonIndex].appendChild(character);
        })
      )
    );
  }
  updateCount();
  //console.log(listGrab[buttonIndex].children[1].children[0].innerHTML);
}
