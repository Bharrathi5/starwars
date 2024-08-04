const planetCard = document.getElementById("main");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const pageNumber = document.getElementById("page-number");
let currenturl = 'https://swapi.dev/api/planets';
let currentPage = 1;

async function fetchPlanet(url){
    let results= await fetch(url);
    const data = await results.json();
    let planetsData = data.results;
    

    displayPlanets(planetsData);
    updatepage(data.previous, data.next);

    prevButton.onclick = () => {
        if (data.previous) {
            currentPage--;
            fetchPlanet(data.previous);
        }
    };

    nextButton.onclick = () => {
        if (data.next) {
            currentPage++;
            fetchPlanet(data.next);
        }
    };
    pageNumber.textContent = `${currentPage}` 
}

function displayPlanets(planetsData){
    let output='';
    planetsData.forEach(planet => {
        output += `<div class="planet-card" id="planet">
                        <h3 class='name'>${planet.name}</h3>
                        <p class="climate">Climate: ${planet.climate}</p>
                        <p class="population">Population: ${planet.population}</p>
                        <p class='terrain'>Terrain: ${planet.terrain}</p>
                        <p class="rotation">Rotation period: ${planet.rotation_period}</p>
                        <button class='res-btn' data-residents='${JSON.stringify(planet.residents)}'>Residents
                        </button>
                        <div class='residents-list'></div>
                    </div>`
    });
    planetCard.innerHTML = output;

    
    document.querySelectorAll('.res-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const residents = JSON.parse(this.dataset.residents);
            const planetCard = this.parentElement;
            if (residents.length === 0) {
                planetCard.innerHTML = `<p class="error">No residents found for this planet.</p>
                                        <button class='back-btn'>Back</button>`;
                planetCard.querySelector('.back-btn').addEventListener('click', () => {
                    displayPlanets(planetsData);
                });
            } else {
                await fetchResidents(residents, planetCard, planetsData);
            }
        });
    });
}

async function fetchResidents(residents, residentCard, planetsData) {
        let residentsDisplay = '<ul>';
        for (let resident of residents) {
            let result = await fetch(resident);
            let data = await result.json();
            residentsDisplay += `<li>
                                <strong>Name:</strong> ${data.name}<br>
                                <strong>Height:</strong> ${data.height} cm<br>
                                <strong>Mass:</strong> ${data.mass} kg<br>
                                <strong>Gender:</strong> ${data.gender}
                              </li>`;
        }
        residentsDisplay += '</ul>';
        residentsDisplay += `<button class='back-btn'>Back</button>`;
        residentCard.innerHTML = residentsDisplay;
        planetCard.querySelector('.back-btn').addEventListener('click', () => {
            displayPlanets(planetsData);
        });
    } 

function updatepage(previous, next) {
    prevButton.classList.toggle('disabled', !previous);
    nextButton.classList.toggle('disabled', !next);

}

fetchPlanet(currenturl);


  