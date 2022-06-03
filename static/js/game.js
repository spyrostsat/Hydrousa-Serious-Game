import * as THREE from '../node_modules/three/build/three.module.js'
// import * as lil from '../node_modules/lil-gui/dist/lil-gui.esm.js'
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js'
import * as CHART from '../node_modules/chart.js/dist/chart.esm.js'

CHART.Chart.register.apply(null, Object.values(CHART).filter((chartClass) => (chartClass.id)));
CHART.Chart.defaults.font.size = 16;
CHART.Chart.defaults.font.family = 'Arial';


class Game {
     constructor() {
          this.pageLoaded = false
          this.simulationRuns = 0 // counter of simulations
          this.clicksEnabled = false

          this.timeCountingStarted = false
          this.previousTimeElapsed = 0
          this.differenceTimeElapsed = 0

          // First of all we will create a secondary scene and camera which will be rendered until our actual page is loaded
          this.loadingScene = new THREE.Scene()
          this.loadingCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100)
          this.loadingCamera.position.set(1, 1, 2)

          // Get control of our canvas html element
          this.canvas = document.getElementById('webgl')

          // Get control of our menus html elements

          this.hydrousaLogo = document.getElementById('hydrousa-logo-container')
          this.ntuaLogo = document.getElementById('ntua-logo-container')
          this.uwmhLogo = document.getElementById('uwmh-logo-container')
          this.copyright = document.getElementById('copyright-text')

          this.playButton = document.querySelector('.play')

          this.cityMenu = document.querySelector('.city-menu')
          this.waterTowerMenu = document.querySelector('.water-tower-menu')
          this.cropMenu = document.querySelector('.crop-menu')

          this.simulationButton = document.querySelector('.simulation-button')
          this.simulationButton.disabled = true

          this.budgetTag = document.querySelector('.budget')
          this.soundControl = document.querySelector('.sound-control')
          this.timeTag = document.querySelector('.time')
          this.irrigationHouseholdInfoTag = document.querySelector('.irrigation-household-info')

          this.results = document.querySelector('.results')
          this.resultsText = document.querySelector('.results-text')
          this.resultsOK = document.getElementById('results-ok')

          this.infoText = document.querySelector('.info-text')

          // GRAPHS SECTION

          this.daysCounter = Array.from(Array(366),(x, i) => i) // array representing the days from day 0 to day 365
          this.daysCounter2 = Array.from(Array(365),(x, i) => i) // array representing the days from day 0 to day 364

          // TANK 1 STORAGE
          this.imgTank1 = document.getElementById('tank1-img')

          this.graphTank1Container = document.querySelector('.graph-tank1-container')

          this.graphTank1Tag = document.getElementById('graph-tank1-canvas').getContext("2d")

          this.imgTank1.onmouseover = () => {
               this.cityMenu.classList.remove('visible')
               this.waterTowerMenu.classList.remove('visible')
               this.cropMenu.classList.remove('visible')
               this.graphTank1Container.style.opacity = 1
               this.graphTank1Container.style.zIndex = "1";
          }

          this.imgTank1.onmouseout = () => {
               this.graphTank1Container.style.opacity = 0
               this.graphTank1Container.style.zIndex = "-1";
          }

          // TANK 2 STORAGE
          this.imgTank2 = document.getElementById('tank2-img2')

          this.graphTank2Container = document.querySelector('.graph-tank2-container')

          this.graphTank2Tag = document.getElementById('graph-tank2-canvas').getContext("2d")

          this.imgTank2.onmouseover = () => {
               this.cityMenu.classList.remove('visible')
               this.waterTowerMenu.classList.remove('visible')
               this.cropMenu.classList.remove('visible')
               this.graphTank2Container.style.opacity = 1
               this.graphTank2Container.style.zIndex = "1";
          }

          this.imgTank2.onmouseout = () => {
               this.graphTank2Container.style.opacity = 0
               this.graphTank2Container.style.zIndex = "-1";
          }

          // TANK 3 STORAGE
          this.imgTank3 = document.getElementById('tank3-img')

          this.graphTank3Container = document.querySelector('.graph-tank3-container')

          this.graphTank3Tag = document.getElementById('graph-tank3-canvas').getContext("2d")

          this.imgTank3.onmouseover = () => {
               this.cityMenu.classList.remove('visible')
               this.waterTowerMenu.classList.remove('visible')
               this.cropMenu.classList.remove('visible')
               this.graphTank3Container.style.opacity = 1
               this.graphTank3Container.style.zIndex = "1";
          }

          this.imgTank3.onmouseout = () => {
               this.graphTank3Container.style.opacity = 0
               this.graphTank3Container.style.zIndex = "-1";
          }

          // AQUIFER STORAGE
          this.imgTank4 = document.getElementById('tank4-img')

          this.graphTank4Container = document.querySelector('.graph-tank4-container')

          this.graphTank4Tag = document.getElementById('graph-tank4-canvas').getContext("2d")

          this.imgTank4.onmouseover = () => {
               this.cityMenu.classList.remove('visible')
               this.waterTowerMenu.classList.remove('visible')
               this.cropMenu.classList.remove('visible')
               this.graphTank4Container.style.opacity = 1
               this.graphTank4Container.style.zIndex = "1";
          }

          this.imgTank4.onmouseout = () => {
               this.graphTank4Container.style.opacity = 0
               this.graphTank4Container.style.zIndex = "-1";
          }

          // IRRIGATION DEFICIT
          this.imgIrrigation = document.getElementById('irrigation-img')

          this.graphIrrigationContainer = document.querySelector('.graph-irrigation-container')

          this.graphIrrigationTag = document.getElementById('graph-irrigation-canvas').getContext("2d")

          this.imgIrrigation.onmouseover = () => {
               this.cityMenu.classList.remove('visible')
               this.waterTowerMenu.classList.remove('visible')
               this.cropMenu.classList.remove('visible')
               this.graphIrrigationContainer.style.opacity = 1
               this.graphIrrigationContainer.style.zIndex = "1";
          }

          this.imgIrrigation.onmouseout = () => {
               this.graphIrrigationContainer.style.opacity = 0
               this.graphIrrigationContainer.style.zIndex = "-1";
          }

          // HOUSEHOLD DEFICIT
          this.imgHousehold = document.getElementById('household-img')

          this.graphHouseholdContainer = document.querySelector('.graph-household-container')

          this.graphHouseholdTag = document.getElementById('graph-household-canvas').getContext("2d")

          this.imgHousehold.onmouseover = () => {
               this.cityMenu.classList.remove('visible')
               this.waterTowerMenu.classList.remove('visible')
               this.cropMenu.classList.remove('visible')
               this.graphHouseholdContainer.style.opacity = 1
               this.graphHouseholdContainer.style.zIndex = "1";
          }

          this.imgHousehold.onmouseout = () => {
               this.graphHouseholdContainer.style.opacity = 0
               this.graphHouseholdContainer.style.zIndex = "-1";
          }

          // NEW GAME LOGIC
          this.newGameButton = document.getElementById('new-game')

          this.newGameButton.onclick = () => {
               this.tank1Chart.destroy()
               this.tank2Chart.destroy()
               this.tank3Chart.destroy()
               this.tank4Chart.destroy()
               this.irrigationChart.destroy()
               this.householdChart.destroy()

               this.irrigationTimeseries = Array.from({length: 365}, () => 350 + Math.random() * 25)

               this.rainfallTimeseries = [4.20, 0.60, 2.70, 21.3, 0.00, 4.20, 12.9, 0.90, 0.00, 1.50, 0.30, 8.40, 5.70, 1.50, 11.7, 0.60, 6.60, 0.90, 0.60, 0.00, 0.60, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3.30, 3.30, 3.60, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10.8, 7.80, 9.90, 17.1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 1.50, 0.90, 5.10, 2.10, 0.00, 0.00, 0.00, 0.30, 30.6, 17.4, 0.00, 0.00, 21.6, 14.7, 0.00, 0.00, 0.00, 0.00, 2.40, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3.00, 0.00, 1.80, 0.30, 3.30, 0.00, 0.00, 0.00, 2.70, 0.30, 0.00, 0.30, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 2.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 3.30, 0.30, 1.80, 0.00, 3.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 2.40, 0.00, 0.00, 0.00, 0.00, 14.7, 21.6, 0.00, 0.00, 17.4, 30.6, 0.30, 0.00, 0.00, 0.00, 2.10, 5.10, 0.90, 1.50, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 17.1, 9.90, 7.80, 10.8, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]

               this.timeTag.style.color = "#ffffff"
               this.gltfCharacter.scene.position.x = - 0.5 + Math.random() * 3
               this.gltfCharacter.scene.position.z = -110 + Math.random() * 50

               this.resultsOK.hidden = false
               this.gameEnded = false
               this.simulationButton.disabled = true

               this.imgTank1.hidden = true
               this.imgTank2.hidden = true
               this.imgTank3.hidden = true
               this.imgTank4.hidden = true
               this.imgIrrigation.hidden = true
               this.imgHousehold.hidden = true

               this.results.classList.remove('visible')
               this.newGameButton.hidden = true
               this.newGameButton.disabled = true
               this.gameDifficulty.classList.add('visible')
               this.difficultyChosen = false
               this.budgetTag.classList.remove('visible')
               this.timeTag.classList.remove('visible')
               roofsTag.value = roofsArray[Math.floor(Math.random() * roofsArray.length)]
               previousRoofsValue = parseFloat(roofsTag.value)
               differenceRoofsValue = 0
               this.roofsArea = parseFloat(roofsTag.value)
               roofsValue.innerHTML = `${this.roofsArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`

               roofsCoeffTag.value = roofsCoeffArray[Math.floor(Math.random() * roofsCoeffArray.length)]
               previousRoofsCoeffValue = parseFloat(roofsCoeffTag.value)
               differenceRoofsCoeffValue = 0
               this.roofsCoeff = parseFloat(roofsCoeffTag.value)
               roofsCoeffValue.innerHTML = this.roofsCoeff

               yardsTag.value = yardsArray[Math.floor(Math.random() * yardsArray.length)]
               previousYardsValue = parseFloat(yardsTag.value)
               differenceYardsValue = 0
               this.yardsArea = parseFloat(yardsTag.value)
               yardsValue.innerHTML = `${this.yardsArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`

               yardsCoeffTag.value = yardsCoeffArray[Math.floor(Math.random() * yardsCoeffArray.length)]
               previousYardsCoeffValue = parseFloat(yardsCoeffTag.value)
               differenceYardsCoeffValue = 0
               this.yardsCoeff = parseFloat(yardsCoeffTag.value)
               yardsCoeffValue.innerHTML = this.yardsCoeff

               openTankVolumeTag.value = openTankArray[Math.floor(Math.random() * openTankArray.length)]
               previousOpenTankValue = parseFloat(openTankVolumeTag.value)
               differenceOpenTankValue = 0
               this.openTankMaxVol = parseFloat(openTankVolumeTag.value)
               openTankVolumeValue.innerHTML = `${this.openTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

               roofsTankVolumeTag.value = roofsTankArray[Math.floor(Math.random() * roofsTankArray.length)]
               previousRoofsTankValue = parseFloat(roofsTankVolumeTag.value)
               differenceRoofsTankValue = 0
               this.roofsTankMaxVol = parseFloat(roofsTankVolumeTag.value)
               roofsTankVolumeValue.innerHTML = `${this.roofsTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

               tank2VolumeTag.value = tank2Array[Math.floor(Math.random() * tank2Array.length)]
               previousTank2Value = parseFloat(tank2VolumeTag.value)
               differenceTank2Value = 0
               this.tank2MaxVol = parseFloat(tank2VolumeTag.value)
               tank2VolumeValue.innerHTML = `${this.tank2MaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

               subsurfaceTankVolumeTag.value = subsurfaceTankArray[Math.floor(Math.random() * subsurfaceTankArray.length)]
               previousSubsurfaceTankValue = parseFloat(subsurfaceTankVolumeTag.value)
               differenceSubsurfaceTankValue = 0
               this.subsurfaceTankMaxVol = parseFloat(subsurfaceTankVolumeTag.value)
               subsurfaceTankVolumeValue.innerHTML = `${this.subsurfaceTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

               tank2MinVolPercentageTag.value = tank2VolArray[Math.floor(Math.random() * tank2VolArray.length)]
               previousTank2MinVolPerValue = parseFloat(tank2MinVolPercentageTag.value)
               differenceTank2MinVolPerValue = 0
               this.tank2MinVolPercentage = parseFloat(tank2MinVolPercentageTag.value)
               tank2MinVolPercentageValue.innerHTML = `${(this.tank2MinVolPercentage * 100).toFixed(0)} %`

               subsurfaceTankMaxVolPercentageTag.value = subsurfaceTankVolArray[Math.floor(Math.random() * subsurfaceTankVolArray.length)]
               previousSubsurfaceTankMaxVolPerValue = parseFloat(subsurfaceTankMaxVolPercentageTag.value)
               differenceSubsurfaceTankMaxVolPerValue = 0
               this.subsurfaceTankMaxVolPercentage = parseFloat(subsurfaceTankMaxVolPercentageTag.value)
               subsurfaceTankMaxVolPercentageValue.innerHTML = `${(this.subsurfaceTankMaxVolPercentage * 100).toFixed(0)} %`

               stormwaterAreaTag.value = stormwaterAreaArray[Math.floor(Math.random() * stormwaterAreaArray.length)]
               previousStormwaterValue = parseFloat(stormwaterAreaTag.value)
               differenceStormwaterValue = 0
               this.stormwaterArea = parseFloat(stormwaterAreaTag.value)
               stormwaterAreaValue.innerHTML = `${this.stormwaterArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`

               stormwaterCoeffTag.value = stormwaterCoeffArray[Math.floor(Math.random() * stormwaterCoeffArray.length)]
               previousStormwaterCoeffValue = parseFloat(stormwaterCoeffTag.value)
               differenceStormwaterCoeffValue = 0
               this.stormwaterCoeff = parseFloat(stormwaterCoeffTag.value)
               stormwaterCoeffValue.innerHTML = this.stormwaterCoeff

               bioswaleInfiltrationRateTag.value = infiltrationArray[Math.floor(Math.random() * infiltrationArray.length)]
               previousBioswaleInfilValue = parseFloat(bioswaleInfiltrationRateTag.value)
               differenceBioswaleInfilValue = 0
               this.BioswaleInfiltrationRate = parseFloat(bioswaleInfiltrationRateTag.value)
               bioswaleInfiltrationRateValue.innerHTML = `${(this.BioswaleInfiltrationRate * 100).toFixed(0)} %`

               bioswaleQmaxTag.value = bioswaleQmaxArray[Math.floor(Math.random() * bioswaleQmaxArray.length)]
               previousBioswaleQmaxValue = parseFloat(bioswaleQmaxTag.value)
               differenceBioswaleQmaxValue = 0
               this.BioswaleQmax = parseFloat(bioswaleQmaxTag.value)
               bioswaleQmaxValue.innerHTML = `${this.BioswaleQmax} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>/day`

               this.simulationRuns = 0
               this.newSimulationRun = false
          }

          this.gameEnded = false
          // Method to run the simulation
          this.simulationButton.onclick = () => {
               this.gameEnded = true
               this.runSimulation()
          }

          // Handle the 4 OK menu buttons in order for them to close the corresponding menus
          const cityOk = document.getElementById("city-ok")
          cityOk.onclick = () => {
               this.cityMenu.classList.remove('visible')
          }
          const waterTowerOk = document.getElementById("water-tower-ok")
          waterTowerOk.onclick = () => {
               this.waterTowerMenu.classList.remove('visible')
          }
          const cropOk = document.getElementById("crop-ok")
          cropOk.onclick = () => {
               this.cropMenu.classList.remove('visible')
          }

          // CONTROLS IMAGES
          this.housesImg = document.getElementById('houses-img')
          this.cropsImg = document.getElementById('crops-img')
          this.waterTowerImg = document.getElementById('water-tower-img')


          // INTRODUCTION MENU
          this.introductionMenu = document.querySelector('.introduction-menu')
          this.introductionMenuText = document.getElementById('introduction-menu-text')
          this.introductionMenuButton = document.getElementById('introduction-menu-button')
          this.introductionMenu.classList.add('visible')


          // THEORY MENU
          this.theoryMenu = document.querySelector('.theory-menu')
          this.theoryMenuText = document.getElementById('theory-menu-text')
          this.theoryMenuButton = document.getElementById('theory-menu-button')


          // CONTROLS MENU
          this.controlsMenu = document.querySelector('.controls-menu')
          this.controlsMenuText = document.getElementById('controls-menu-text')
          this.controlsMenuButton = document.getElementById('controls-menu-button')


          this.introductionMenuButton.onclick = () => {
               this.introductionMenu.classList.remove('visible')
               this.theoryMenu.classList.add('visible')
          }

          this.theoryMenuButton.onclick = () => {
               this.theoryMenu.classList.remove('visible')
               this.controlsMenu.classList.add('visible')
          }

          this.controlsMenuButton.onclick = () => {
               this.controlsMenu.classList.remove('visible')
               this.playButton.hidden = false
          }

          // GAME DIFFICUTLY
          this.finalDifficulty = null
          this.difficultyChosen = false
          this.gameDifficulty = document.querySelector('.game-difficulty')
          this.easyDifficulty = document.getElementById('easy-button')
          this.mediumDifficulty = document.getElementById('medium-button')
          this.hardDifficulty = document.getElementById('hard-button')

          this.easyDifficulty.onclick = () => {
               this.finalDifficulty = "easy"
               this.gameDifficulty.classList.remove('visible')
               // The 4 game settings that depend on the game's difficulty
               this.population = 5000 // higher the difficulty higher the population (to increase household demand)
               this.remainingBudget = 200000 // higher the difficulty lower the budget
               this.remainingTime = 600 // available time in seconds
               this.rainfallMultiplyIndex = 1 + Math.random() // higher the difficulty lower the index (to reduce total rainfall)
               this.irrigationMultiplyIndex = 0.4 + Math.random() * 0.5 // higher the difficulty higher the index (to increase total irrigation demand)
               this.rainfallTimeseries = this.rainfallTimeseries.map((num) => {return num * this.rainfallMultiplyIndex})
               this.irrigationTimeseries = this.irrigationTimeseries.map((num) => {return num * this.irrigationMultiplyIndex})

               // each person is considered to need 4L/day, emerging from rainwater harvesting (this water is collected via the houses roofs areas and the corresponding Roofs Tank), for non-potable domestic uses (e.g. shower, laundry, washing machine)
               this.totalNonPotableHouseholdDemand = this.population * 0.02 // in m3/day
               this.difficultyChosen = true
               // this method takes care of everything refering to the left or right mouse click

               window.addEventListener("mousedown", this.handleCharacterAnimationAndMenus)

               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.budgetTag.classList.add('visible')

               this.timeTag.innerHTML = `Remaining Time: ${this.toHHMMSS(this.remainingTime)}`;
               this.timeTag.classList.add('visible')

               this.runSimulation()
          }

          this.mediumDifficulty.onclick = () => {
               this.finalDifficulty = "medium"
               this.gameDifficulty.classList.remove('visible')
               // The 4 game settings that depend on the game's difficulty
               this.population = 7000 // higher the difficulty higher the population (to increase household demand)
               this.remainingBudget = 150000 // higher the difficulty lower the budget
               this.remainingTime = 300 // available time in seconds
               this.rainfallMultiplyIndex = 0.8 + Math.random() * 0.4 // higher the difficulty lower the index (to reduce total rainfall)
               this.irrigationMultiplyIndex = 0.6 + Math.random() * 0.5 // higher the difficulty higher the index (to increase total irrigation demand)
               this.rainfallTimeseries = this.rainfallTimeseries.map((num) => {return num * this.rainfallMultiplyIndex})
               this.irrigationTimeseries = this.irrigationTimeseries.map((num) => {return num * this.irrigationMultiplyIndex})

               // each person is considered to need 4.5L/day, emerging from rainwater harvesting (this water is collected via the houses roofs areas and the corresponding Roofs Tank), for non-potable domestic uses (e.g. shower, laundry, washing machine)
               this.totalNonPotableHouseholdDemand = this.population * 0.02 // in m3/day
               this.difficultyChosen = true
               // this method takes care of everything refering to the left or right mouse click

               window.addEventListener("mousedown", this.handleCharacterAnimationAndMenus)

               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.budgetTag.classList.add('visible')

               this.timeTag.innerHTML = `Remaining Time: ${this.toHHMMSS(this.remainingTime)}`;
               this.timeTag.classList.add('visible')

               this.runSimulation()
          }

          this.hardDifficulty.onclick = () => {
               this.finalDifficulty = "hard"
               this.gameDifficulty.classList.remove('visible')
               // The 4 game settings that depend on the game's difficulty
               this.population = 8200 // higher the difficulty higher the population (to increase household demand)
               this.remainingBudget = 100000 // higher the difficulty lower the budget
               this.remainingTime = 180 // available time in seconds
               this.rainfallMultiplyIndex = 0.7 + Math.random() * 0.3 // higher the difficulty lower the index (to reduce total rainfall)
               this.irrigationMultiplyIndex = 1 + Math.random() * 0.35 // higher the difficulty higher the index (to increase total irrigation demand)
               this.rainfallTimeseries = this.rainfallTimeseries.map((num) => {return num * this.rainfallMultiplyIndex})
               this.irrigationTimeseries = this.irrigationTimeseries.map((num) => {return num * this.irrigationMultiplyIndex})

               // each person is considered to need 5L/day, emerging from rainwater harvesting (this water is collected via the houses roofs areas and the corresponding Roofs Tank), for non-potable domestic uses (e.g. shower, laundry, washing machine)
               this.totalNonPotableHouseholdDemand = this.population * 0.02 // in m3/day
               this.difficultyChosen = true
               // this method takes care of everything refering to the left or right mouse click

               window.addEventListener("mousedown", this.handleCharacterAnimationAndMenus)

               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.budgetTag.classList.add('visible')

               this.timeTag.innerHTML = `Remaining Time: ${this.toHHMMSS(this.remainingTime)}`;
               this.timeTag.classList.add('visible')

               this.runSimulation()
          }

          this.easyImage = document.getElementById('easy-img')
          this.easyImage.onmouseover = () => {
               this.infoText.innerHTML = `Time: 10 Min<br><br>Budget: 200.000 \u20AC<br><br>Help Info: Available<br><br>Population: 5.000 Inhabitants<br><br>Rainfall: High<br><br>Irrigation Demand: Low`
               // this.infoText.style.lineHeight = "1.8"
               // this.infoText.style.top = "30%"
               // this.infoText.style.height = "240px"
               // this.infoText.style.width = "310px"
               this.infoText.classList.add('visible')
          }
          this.easyImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }

          this.mediumImage = document.getElementById('medium-img')
          this.mediumImage.onmouseover = () => {
               this.infoText.innerHTML = `Time: 5 Min<br><br>Budget: 150.000 \u20AC<br><br>Help Info: Available<br><br>Population: 10.000 Inhabitants<br><br>Rainfall: Moderate<br><br>Irrigation Demand: Moderate`
               // this.infoText.style.lineHeight = "1.8"
               // this.infoText.style.top = "30%"
               // this.infoText.style.height = "240px"
               // this.infoText.style.width = "310px"
               this.infoText.classList.add('visible')
          }
          this.mediumImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }

          this.hardImage = document.getElementById('hard-img')
          this.hardImage.onmouseover = () => {
               this.infoText.innerHTML = `Time: 3 Min<br><br>Budget: 100.000 \u20AC<br><br>Help Info: Not Available<br><br>Population: 15.000 Inhabitants<br><br>Rainfall: Low<br><br>Irrigation Demand: High`
               // this.infoText.style.lineHeight = "1.8"
               // this.infoText.style.top = "30%"
               // this.infoText.style.height = "240px"
               // this.infoText.style.width = "310px"
               this.infoText.classList.add('visible')
          }
          this.hardImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }

          // First lets take care of our sound slider
          const soundTag = document.getElementById('sound-mixer')
          soundTag.onchange = () => {
               let vol = parseFloat(soundTag.value)
               this.sound.setVolume(vol)
               this.sound2.setVolume(vol)
          }

          // A simulation will be running on the background automatically when the player changes the menu sliders
          // in order to know whether he's reaching an adequate system design or not ONLY on EASY difficulty
          this.newSimulationRun = false

          // Get control of all input tags

          const roofsTag = document.getElementById('roofs')
          const roofsValue = document.getElementById('roofsValue')
          const roofsArray = this.range(0, 100, 100)
          roofsTag.value = roofsArray[Math.floor(Math.random() * roofsArray.length)]
          var previousRoofsValue = parseFloat(roofsTag.value)
          var differenceRoofsValue = 0
          this.roofsArea = parseFloat(roofsTag.value)
          roofsValue.innerHTML = `${this.roofsArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`

          this.roofsAreaUnitCost = 0.09 // in Euros/m2 - needs calibration
          roofsTag.onchange = () => {
               this.roofsArea = parseFloat(roofsTag.value)
               roofsValue.innerHTML = `${this.roofsArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`
               differenceRoofsValue = this.roofsArea - previousRoofsValue
               previousRoofsValue = this.roofsArea
               this.remainingBudget -= differenceRoofsValue * this.roofsAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.roofsImage = document.getElementById('roofs-area-img')
          this.roofsImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that will be collected from the roofs and will be stored in Tanks No1.`
               this.infoText.style.top = "40%"
               this.infoText.style.height = "80px"
               this.infoText.style.width = "320px"
               this.infoText.classList.add('visible')
          }
          this.roofsImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const roofsCoeffTag = document.getElementById('roofsCoeff')
          const roofsCoeffValue = document.getElementById('roofsCoeffValue')
          const roofsCoeffArray = this.range(0.5, 0.51, 0.01)
          roofsCoeffTag.value = roofsCoeffArray[Math.floor(Math.random() * roofsCoeffArray.length)]

          var previousRoofsCoeffValue = parseFloat(roofsCoeffTag.value)
          var differenceRoofsCoeffValue = 0
          this.roofsCoeff = parseFloat(roofsCoeffTag.value)
          roofsCoeffValue.innerHTML = this.roofsCoeff

          this.roofsCoeffUnitCost = 15000 // in Euros/m2 - needs calibration
          roofsCoeffTag.onchange = () => {
               this.roofsCoeff = parseFloat(roofsCoeffTag.value)
               roofsCoeffValue.innerHTML = this.roofsCoeff
               differenceRoofsCoeffValue = this.roofsCoeff - previousRoofsCoeffValue
               previousRoofsCoeffValue = this.roofsCoeff
               this.remainingBudget -= differenceRoofsCoeffValue * this.roofsCoeffUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.roofsCoeffImage = document.getElementById('roofs-coeff-img')
          this.roofsCoeffImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that won't get lost during its trasfer from the roofs to Tanks No1.`
               this.infoText.style.top = "40%"
               this.infoText.style.height = "80px"
               this.infoText.style.width = "320px"
               this.infoText.classList.add('visible')
          }
          this.roofsCoeffImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const yardsTag = document.getElementById('yards')
          const yardsValue = document.getElementById('yardsValue')
          const yardsArray = this.range(0, 100, 100)
          yardsTag.value = yardsArray[Math.floor(Math.random() * yardsArray.length)]

          var previousYardsValue = parseFloat(yardsTag.value)
          var differenceYardsValue = 0
          this.yardsArea = parseFloat(yardsTag.value)
          yardsValue.innerHTML = `${this.yardsArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`

          this.yardsAreaUnitCost = 0.09 // in Euros/m2 - needs calibration
          yardsTag.onchange = () => {
               this.yardsArea = parseFloat(yardsTag.value)
               yardsValue.innerHTML = `${this.yardsArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`
               differenceYardsValue = this.yardsArea - previousYardsValue
               previousYardsValue = this.yardsArea
               this.remainingBudget -= differenceYardsValue * this.yardsAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.yardsImage = document.getElementById('yards-area-img')
          this.yardsImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that will be collected from the impermeable surfaces and will be stored in Tanks No2.`
               this.infoText.style.top = "40%"
               this.infoText.style.height = "100px"
               this.infoText.style.width = "320px"
               this.infoText.classList.add('visible')
          }
          this.yardsImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const yardsCoeffTag = document.getElementById('yardsCoeff')
          const yardsCoeffValue = document.getElementById('yardsCoeffValue')
          const yardsCoeffArray = this.range(0.5, 0.51, 0.01)
          yardsCoeffTag.value = yardsCoeffArray[Math.floor(Math.random() * yardsCoeffArray.length)]

          var previousYardsCoeffValue = parseFloat(yardsCoeffTag.value)
          var differenceYardsCoeffValue = 0
          this.yardsCoeff = parseFloat(yardsCoeffTag.value)
          yardsCoeffValue.innerHTML = this.yardsCoeff

          this.yardsCoeffUnitCost = 15000 // in Euros/m2 - needs calibration
          yardsCoeffTag.onchange = () => {
               this.yardsCoeff = parseFloat(yardsCoeffTag.value)
               yardsCoeffValue.innerHTML = this.yardsCoeff
               differenceYardsCoeffValue = this.yardsCoeff - previousYardsCoeffValue
               previousYardsCoeffValue = this.yardsCoeff
               this.remainingBudget -= differenceYardsCoeffValue * this.yardsCoeffUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.yardsCoeffImage = document.getElementById('yards-coeff-img')
          this.yardsCoeffImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that won't get lost during its trasfer from the impermeable surfaces to Tanks No2.`
               this.infoText.style.top = "40%"
               this.infoText.style.height = "100px"
               this.infoText.style.width = "320px"
               this.infoText.classList.add('visible')
          }
          this.yardsCoeffImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const openTankVolumeTag = document.getElementById('openTankVolume')
          const openTankVolumeValue = document.getElementById('openTankVolumeValue')
          const openTankArray = this.range(0, 2, 1)
          openTankVolumeTag.value = openTankArray[Math.floor(Math.random() * openTankArray.length)]

          var previousOpenTankValue = parseFloat(openTankVolumeTag.value)
          var differenceOpenTankValue = 0
          this.openTankMaxVol = parseFloat(openTankVolumeTag.value)
          openTankVolumeValue.innerHTML = `${this.openTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

          this.openTankVolumeUnitCost = 0.5 // in Euros/m2 - needs calibration
          openTankVolumeTag.onchange = () => {
               this.openTankMaxVol = parseFloat(openTankVolumeTag.value)
               openTankVolumeValue.innerHTML = `${this.openTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`
               differenceOpenTankValue = this.openTankMaxVol - previousOpenTankValue
               previousOpenTankValue = this.openTankMaxVol
               this.remainingBudget -= differenceOpenTankValue * this.openTankVolumeUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.openTankImage = document.getElementById('open-tank-img')
          this.openTankImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the total capacity of Tanks No3, the water of which is exclusively used for irrigation. Probable overflows will be stored in the subsurface through artificial recharge.`
               this.infoText.style.top = "32%"
               this.infoText.style.height = "21%"
               this.infoText.style.width = "280px"
               this.infoText.classList.add('visible')
          }
          this.openTankImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const roofsTankVolumeTag = document.getElementById('roofsTankVolume')
          const roofsTankVolumeValue = document.getElementById('roofsTankVolumeValue')
          const roofsTankArray = this.range(0, 2, 1)
          roofsTankVolumeTag.value = roofsTankArray[Math.floor(Math.random() * roofsTankArray.length)]

          var previousRoofsTankValue = parseFloat(roofsTankVolumeTag.value)
          var differenceRoofsTankValue = 0
          this.roofsTankMaxVol = parseFloat(roofsTankVolumeTag.value)
          roofsTankVolumeValue.innerHTML = `${this.roofsTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

          this.roofsTankVolumeUnitCost = 0.5 // in Euros/m2 - needs calibration
          roofsTankVolumeTag.onchange = () => {
               this.roofsTankMaxVol = parseFloat(roofsTankVolumeTag.value)
               roofsTankVolumeValue.innerHTML = `${this.roofsTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`
               differenceRoofsTankValue = this.roofsTankMaxVol - previousRoofsTankValue
               previousRoofsTankValue = this.roofsTankMaxVol
               this.remainingBudget -= differenceRoofsTankValue * this.roofsTankVolumeUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.roofsTankImage = document.getElementById('roofs-tank-img')
          this.roofsTankImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the total capacity of Tanks No1, the water of which is primarily used for non potable household uses. Probable overflows head to Tanks No2.`
               this.infoText.style.top = "38%"
               this.infoText.style.height = "18%"
               this.infoText.style.width = "280px"
               this.infoText.classList.add('visible')
          }
          this.roofsTankImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const tank2VolumeTag = document.getElementById('tank2Volume')
          const tank2VolumeValue = document.getElementById('tank2VolumeValue')
          const tank2Array = this.range(0, 2, 1)
          tank2VolumeTag.value = tank2Array[Math.floor(Math.random() * tank2Array.length)]

          var previousTank2Value = parseFloat(tank2VolumeTag.value)
          var differenceTank2Value = 0
          this.tank2MaxVol = parseFloat(tank2VolumeTag.value)
          tank2VolumeValue.innerHTML = `${this.tank2MaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

          this.tank2VolumeUnitCost = 0.5 // in Euros/m2 - needs calibration
          tank2VolumeTag.onchange = () => {
               this.tank2MaxVol = parseFloat(tank2VolumeTag.value)
               tank2VolumeValue.innerHTML = `${this.tank2MaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`
               differenceTank2Value = this.tank2MaxVol - previousTank2Value
               previousTank2Value = this.tank2MaxVol
               this.remainingBudget -= differenceTank2Value * this.tank2VolumeUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.tank2Image = document.getElementById('tank2-img')
          this.tank2Image.onmouseover = () => {
               this.infoText.innerHTML = `Determines the total capacity of Tanks No2, the water of which is exclusively used for irrigation. You can decide to send the water leftovers to the subsurface through artificial recharge.`
               this.infoText.style.top = "32%"
               this.infoText.style.height = "24%"
               this.infoText.style.width = "280px"
               this.infoText.classList.add('visible')
          }
          this.tank2Image.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const subsurfaceTankVolumeTag = document.getElementById('subsurfaceTankVolume')
          const subsurfaceTankVolumeValue = document.getElementById('subsurfaceTankVolumeValue')
          const subsurfaceTankArray = this.range(0, 20, 10)
          subsurfaceTankVolumeTag.value = subsurfaceTankArray[Math.floor(Math.random() * subsurfaceTankArray.length)]

          var previousSubsurfaceTankValue = parseFloat(subsurfaceTankVolumeTag.value)
          var differenceSubsurfaceTankValue = 0
          this.subsurfaceTankMaxVol = parseFloat(subsurfaceTankVolumeTag.value)
          subsurfaceTankVolumeValue.innerHTML = `${this.subsurfaceTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`

          this.subsurfaceTankVolumeUnitCost = 0.4 // in Euros/m2 - needs calibration
          subsurfaceTankVolumeTag.onchange = () => {
               this.subsurfaceTankMaxVol = parseFloat(subsurfaceTankVolumeTag.value)
               subsurfaceTankVolumeValue.innerHTML = `${this.subsurfaceTankMaxVol} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>`
               differenceSubsurfaceTankValue = this.subsurfaceTankMaxVol - previousSubsurfaceTankValue
               previousSubsurfaceTankValue = this.subsurfaceTankMaxVol
               this.remainingBudget -= differenceSubsurfaceTankValue * this.subsurfaceTankVolumeUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.subsurfaceTankImage = document.getElementById('subsurface-tank-img')
          this.subsurfaceTankImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the total capacity of the town's subsurface (Aquifer). The Aquifer can be used to transfer water back to Tanks No2 when needed (especially during summertime) to aid the irrigation.`
               this.infoText.style.top = "32%"
               this.infoText.style.height = "24%"
               this.infoText.style.width = "280px"
               this.infoText.classList.add('visible')
          }
          this.subsurfaceTankImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const tank2MinVolPercentageTag = document.getElementById('tank2MinVolPercentage')
          const tank2MinVolPercentageValue = document.getElementById('tank2MinVolPercentageValue')
          const tank2VolArray = this.range(0.98, 0.99, 0.01)
          tank2MinVolPercentageTag.value = tank2VolArray[Math.floor(Math.random() * tank2VolArray.length)]

          var previousTank2MinVolPerValue = parseFloat(tank2MinVolPercentageTag.value)
          var differenceTank2MinVolPerValue = 0
          this.tank2MinVolPercentage = parseFloat(tank2MinVolPercentageTag.value) // we don't ever want to let the water level of Tank2 go BELOW 20%
          tank2MinVolPercentageValue.innerHTML = `${(this.tank2MinVolPercentage * 100).toFixed(0)} %`

          this.tank2MinVolPercentageUnitCost = 0 // this is parametrical, no cost needed
          tank2MinVolPercentageTag.onchange = () => {
               this.tank2MinVolPercentage = parseFloat(tank2MinVolPercentageTag.value)
               tank2MinVolPercentageValue.innerHTML = `${(this.tank2MinVolPercentage * 100).toFixed(0)} %`
               differenceTank2MinVolPerValue = this.tank2MinVolPercentage - previousTank2MinVolPerValue
               previousTank2MinVolPerValue = this.tank2MinVolPercentage
               this.remainingBudget -= differenceTank2MinVolPerValue * this.tank2MinVolPercentageUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.tank2MinVolPerImage = document.getElementById('tank2-min-vol-per')
          this.tank2MinVolPerImage.onmouseover = () => {
               this.infoText.innerHTML = `The lower this parameter is set to, the more water leftovers will head from Tanks No2 to the town's subsurface.`
               this.infoText.style.top = "40%"
               this.infoText.style.height = "13%"
               this.infoText.style.width = "280px"
               this.infoText.classList.add('visible')
          }
          this.tank2MinVolPerImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const subsurfaceTankMaxVolPercentageTag = document.getElementById('subsurfaceTankMaxVolPercentage')
          const subsurfaceTankMaxVolPercentageValue = document.getElementById('subsurfaceTankMaxVolPercentageValue')
          const subsurfaceTankVolArray = this.range(0.98, 0.99, 0.01)
          subsurfaceTankMaxVolPercentageTag.value = subsurfaceTankVolArray[Math.floor(Math.random() * subsurfaceTankVolArray.length)]

          var previousSubsurfaceTankMaxVolPerValue = parseFloat(subsurfaceTankMaxVolPercentageTag.value)
          var differenceSubsurfaceTankMaxVolPerValue = 0
          this.subsurfaceTankMaxVolPercentage = parseFloat(subsurfaceTankMaxVolPercentageTag.value) // we don't ever want to let the water level of SubsurfaceTank go ABOVE 80%
          subsurfaceTankMaxVolPercentageValue.innerHTML = `${(this.subsurfaceTankMaxVolPercentage * 100).toFixed(0)} %`

          this.subsurfaceTankMaxVolPercentageUnitCost = 0 // this is parametrical, no cost needed
          subsurfaceTankMaxVolPercentageTag.onchange = () => {
               this.subsurfaceTankMaxVolPercentage = parseFloat(subsurfaceTankMaxVolPercentageTag.value)
               subsurfaceTankMaxVolPercentageValue.innerHTML = `${(this.subsurfaceTankMaxVolPercentage * 100).toFixed(0)} %`
               differenceSubsurfaceTankMaxVolPerValue = this.subsurfaceTankMaxVolPercentage - previousSubsurfaceTankMaxVolPerValue
               previousSubsurfaceTankMaxVolPerValue = this.subsurfaceTankMaxVolPercentage
               this.remainingBudget -= differenceSubsurfaceTankMaxVolPerValue * this.subsurfaceTankMaxVolPercentageUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.subsurfaceTankMaxVolPerImage = document.getElementById('sub-tank-max-vol-per')
          this.subsurfaceTankMaxVolPerImage.onmouseover = () => {
               this.infoText.innerHTML = `The higher this parameter is set to, the less water will head from the Aquifer back to Tanks No2.`
               this.infoText.style.top = "40%"
               this.infoText.style.height = "13%"
               this.infoText.style.width = "280px"
               this.infoText.classList.add('visible')
          }
          this.subsurfaceTankMaxVolPerImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }



          const stormwaterAreaTag = document.getElementById('stormwaterArea')
          const stormwaterAreaValue = document.getElementById('stormwaterAreaValue')
          const stormwaterAreaArray = this.range(0, 100, 100)
          stormwaterAreaTag.value = stormwaterAreaArray[Math.floor(Math.random() * stormwaterAreaArray.length)]

          var previousStormwaterValue = parseFloat(stormwaterAreaTag.value)
          var differenceStormwaterValue = 0
          this.stormwaterArea = parseFloat(stormwaterAreaTag.value)
          stormwaterAreaValue.innerHTML = `${this.stormwaterArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`

          this.stormwaterAreaUnitCost = 0.09 // in Euros/m2 - needs calibration
          stormwaterAreaTag.onchange = () => {
               this.stormwaterArea = parseFloat(stormwaterAreaTag.value)
               stormwaterAreaValue.innerHTML = `${this.stormwaterArea} m<span style="position: relative; bottom: 5px; right: 1px;">2</span>`
               differenceStormwaterValue = this.stormwaterArea - previousStormwaterValue
               previousStormwaterValue = this.stormwaterArea
               this.remainingBudget -= differenceStormwaterValue * this.stormwaterAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.stormwaterImage = document.getElementById('storm-area-img')
          this.stormwaterImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that will be collected from the field via Bioswale systems and will be stored in Tanks No3.`
               this.infoText.style.top = "36%"
               this.infoText.style.height = "14%"
               this.infoText.style.width = "300px"
               this.infoText.classList.add('visible')
          }
          this.stormwaterImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const stormwaterCoeffTag = document.getElementById('stormwaterCoeff')
          const stormwaterCoeffValue = document.getElementById('stormwaterCoeffValue')
          const stormwaterCoeffArray = this.range(0.5, 0.51, 0.01)
          stormwaterCoeffTag.value = stormwaterCoeffArray[Math.floor(Math.random() * stormwaterCoeffArray.length)]

          var previousStormwaterCoeffValue = parseFloat(stormwaterCoeffTag.value)
          var differenceStormwaterCoeffValue = 0
          this.stormwaterCoeff = parseFloat(stormwaterCoeffTag.value)
          stormwaterCoeffValue.innerHTML = this.stormwaterCoeff

          this.stormwaterCoeffUnitCost = 15000 // in Euros/m2 - needs calibration
          stormwaterCoeffTag.onchange = () => {
               this.stormwaterCoeff = parseFloat(stormwaterCoeffTag.value)
               stormwaterCoeffValue.innerHTML = this.stormwaterCoeff
               differenceStormwaterCoeffValue = this.stormwaterCoeff - previousStormwaterCoeffValue
               previousStormwaterCoeffValue = this.stormwaterCoeff
               this.remainingBudget -= differenceStormwaterCoeffValue * this.stormwaterCoeffUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.stormwaterCoeffImage = document.getElementById('storm-coeff-img')
          this.stormwaterCoeffImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that won't get lost during its trasfer from the field to Tanks No3.`
               this.infoText.style.top = "38%"
               this.infoText.style.height = "11%"
               this.infoText.style.width = "300px"
               this.infoText.classList.add('visible')
          }
          this.stormwaterCoeffImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const bioswaleInfiltrationRateTag = document.getElementById('BioswaleInfiltrationRate')
          const bioswaleInfiltrationRateValue = document.getElementById('BioswaleInfiltrationRateValue')
          const infiltrationArray = this.range(0.3, 0.31, 0.01)
          bioswaleInfiltrationRateTag.value = infiltrationArray[Math.floor(Math.random() * infiltrationArray.length)]

          var previousBioswaleInfilValue = parseFloat(bioswaleInfiltrationRateTag.value)
          var differenceBioswaleInfilValue = 0
          this.BioswaleInfiltrationRate = parseFloat(bioswaleInfiltrationRateTag.value)
          bioswaleInfiltrationRateValue.innerHTML = `${(this.BioswaleInfiltrationRate * 100).toFixed(0)} %`

          this.BioswaleInfiltrationRateUnitCost = 13000 // in Euros/m2 - needs calibration
          bioswaleInfiltrationRateTag.onchange = () => {
               this.BioswaleInfiltrationRate = parseFloat(bioswaleInfiltrationRateTag.value)
               bioswaleInfiltrationRateValue.innerHTML = `${(this.BioswaleInfiltrationRate * 100).toFixed(0)} %`
               differenceBioswaleInfilValue = this.BioswaleInfiltrationRate - previousBioswaleInfilValue
               previousBioswaleInfilValue = this.BioswaleInfiltrationRate
               this.remainingBudget -= differenceBioswaleInfilValue * this.BioswaleInfiltrationRateUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.bioswaleInfilImage = document.getElementById('bios-infil-img')
          this.bioswaleInfilImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that won't get lost during its trasfer from the field to the Bioswale systems.`
               this.infoText.style.top = "36%"
               this.infoText.style.height = "14%"
               this.infoText.style.width = "300px"
               this.infoText.classList.add('visible')
          }
          this.bioswaleInfilImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          const bioswaleQmaxTag = document.getElementById('bioswaleQmax')
          const bioswaleQmaxValue = document.getElementById('bioswaleQmaxValue')
          const bioswaleQmaxArray = this.range(10, 50, 10)
          bioswaleQmaxTag.value = bioswaleQmaxArray[Math.floor(Math.random() * bioswaleQmaxArray.length)]

          var previousBioswaleQmaxValue = parseFloat(bioswaleQmaxTag.value)
          var differenceBioswaleQmaxValue = 0
          this.BioswaleQmax = parseFloat(bioswaleQmaxTag.value)
          bioswaleQmaxValue.innerHTML = `${this.BioswaleQmax} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>/day`

          this.BioswaleQmaxUnitCost = 1
          bioswaleQmaxTag.onchange = () => {
               this.BioswaleQmax = parseFloat(bioswaleQmaxTag.value)
               bioswaleQmaxValue.innerHTML = `${this.BioswaleQmax} m<span style="position: relative; bottom: 5px; right: 1px;">3</span>/day`
               differenceBioswaleQmaxValue = this.BioswaleQmax - previousBioswaleQmaxValue
               previousBioswaleQmaxValue = this.BioswaleQmax
               this.remainingBudget -= differenceBioswaleQmaxValue * this.BioswaleQmaxUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.newSimulationRun = true
          }

          this.bioswaleQmaxImage = document.getElementById('bios-qmax-img')
          this.bioswaleQmaxImage.onmouseover = () => {
               this.infoText.innerHTML = `Determines the amount of rainwater that might be lost during its transfer from the field to the Bioswale systems.`
               this.infoText.style.top = "36%"
               this.infoText.style.height = "14%"
               this.infoText.style.width = "300px"
               this.infoText.classList.add('visible')
          }
          this.bioswaleQmaxImage.onmouseout = () => {
               this.infoText.classList.remove('visible')
          }


          // Get control of our loading-bar html element
          this.loadingBar = document.getElementById('loading-bar')

          // This disables the default browser action when pressing RIGHT CLICK with the mouse, on the canvas element
          this.canvas.oncontextmenu = (e) => {
               e.preventDefault()
               e.stopPropagation()
          }

          // Create our scene
          this.scene = new THREE.Scene()

          // Create our axesHelper just for visual help
          this.axesHelper = new THREE.AxesHelper(5)
          this.axesHelper.visible = false

          // Put the axesHelper in the scene
          this.scene.add(this.axesHelper)

          // Create a GUI for controlling/debugging reasons
          // this.gui = new lil.GUI()

          // sizes js object to define our camera/renderer width and height
          this.sizes = {
               width: window.innerWidth,
               height: window.innerHeight
          }

          // Create our PerspectiveCamera
          let fov = 75 // vertical field of view of our camera
          let aspectRatio = this.sizes.width / this.sizes.height
          let near = 0.01
          let far = 90
          this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)

          this.camera.position.set(0, 5, -9)

          this.cameraDistanceToPlayer = 8
          this.cameraCounter = 0
          this.previousBodyRotationY = 0
          this.currentBodyRotationY = 0

          // Put our camera in our scene
          this.scene.add(this.camera)

          // // Add OrbitControls
          // // https://discourse.threejs.org/t/cant-get-perspectivecamera-lookat-to-look-down-at-a-point/18094
          // this.orbitControls = new OrbitControls(this.camera, this.canvas)
          // this.orbitControls.enableDamping = true // adding some smoothness to the controls

          // Add our Renderer
          this.renderer = new THREE.WebGLRenderer({
               canvas: this.canvas,
               antialias: true
          })
          this.renderer.setSize(this.sizes.width, this.sizes.height)
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          this.renderer.setClearColor("#00aaff") // ετσι αλλαζει το background χρωμα


          // Add our clock
          this.clock = new THREE.Clock()
          this.elapsedTime = 0
          this.previousTime = 0

          // Class properties regarding the loading-bar of the webpage
          this.previousProgressRatio = null
          this.progressRatio = null

          // Loaders
          this.loadingManager = new THREE.LoadingManager(
               // When everything loaded callback function
               () => {
                    window.setTimeout(() => {
                         this.playButton.classList.add('visible')

                         this.playButton.onclick = () => {
                              this.pageLoaded = true
                              this.hydrousaLogo.hidden = true
                              this.ntuaLogo.hidden = true
                              this.uwmhLogo.hidden = true
                              this.loadingBar.style.transform = `scaleX(0)`
                              this.simulationButton.classList.add('visible')
                              this.playButton.classList.remove('visible')
                              this.introductionMenu.classList.remove('visible')
                              this.copyright.hidden = true
                              // this.gameDifficulty.classList.add('visible')
                              this.soundControl.classList.add('visible')
                              this.gameDifficulty.classList.add('visible')

                              // this.irrigationTimeseries = Array.from({length: 100}, () => 0.5 + Math.random() * 3)
                              this.irrigationTimeseries = Array.from({length: 365}, () => 350 + Math.random() * 25)

                              this.rainfallTimeseries = [4.20, 0.60, 2.70, 21.3, 0.00, 4.20, 12.9, 0.90, 0.00, 1.50, 0.30, 8.40, 5.70, 1.50, 11.7, 0.60, 6.60, 0.90, 0.60, 0.00, 0.60, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3.30, 3.30, 3.60, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10.8, 7.80, 9.90, 17.1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 1.50, 0.90, 5.10, 2.10, 0.00, 0.00, 0.00, 0.30, 30.6, 17.4, 0.00, 0.00, 21.6, 14.7, 0.00, 0.00, 0.00, 0.00, 2.40, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3.00, 0.00, 1.80, 0.30, 3.30, 0.00, 0.00, 0.00, 2.70, 0.30, 0.00, 0.30, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.70, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 0.00, 0.00, 2.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.30, 2.70, 0.00, 0.00, 0.00, 3.30, 0.30, 1.80, 0.00, 3.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 2.40, 0.00, 0.00, 0.00, 0.00, 14.7, 21.6, 0.00, 0.00, 17.4, 30.6, 0.30, 0.00, 0.00, 0.00, 2.10, 5.10, 0.90, 1.50, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 17.1, 9.90, 7.80, 10.8, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]
                         }
                    }, 300)
               },
               // Progress callback function
               (itemUrl, itemsLoaded, itemsTotal) => {
                    this.progressRatio = itemsLoaded / itemsTotal
                    if (!this.previousProgressRatio) {
                         this.loadingBar.style.transform = `scaleX(${this.progressRatio})`
                         this.previousProgressRatio = this.progressRatio
                    }
                    else {
                         this.loadingBar.style.transform = `scaleX(${Math.max(this.progressRatio, this.previousProgressRatio)})`
                         this.previousProgressRatio = Math.max(this.progressRatio, this.previousProgressRatio)
                    }
               }
          )

          // Instantiate our Loaders
          this.gltfLoader = new GLTFLoader(this.loadingManager)
          this.textureLoader = new THREE.TextureLoader(this.loadingManager)
          this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)
          this.audioLoader = new THREE.AudioLoader(this.loadingManager)


          // Take care of SOUND
          this.listener = new THREE.AudioListener()
          this.camera.add(this.listener)
          this.sound = new THREE.Audio(this.listener) // rain
          this.sound2 = new THREE.Audio(this.listener) // background music
          this.sound3 = new THREE.Audio(this.listener) // win sound
          this.sound4 = new THREE.Audio(this.listener) // lose sound

          this.audioLoader.load("/static/models/rain.ogg",
          (buffer) => {
               this.sound.setBuffer(buffer)
               this.sound.setLoop(true)
               this.sound.setVolume(parseFloat(soundTag.value))
          })

          // audio files: https://www.chosic.com/
          const background_choices = ["/static/models/have_you_ever_seen_the_rain.mp3"]
          this.audioLoader.load(background_choices[Math.floor(Math.random() * background_choices.length)],
          (buffer) => {
               this.sound2.setBuffer(buffer)
               this.sound2.setLoop(true)
               this.sound2.setVolume(parseFloat(soundTag.value))
          })

          this.audioLoader.load("/static/models/win.mp3",
          (buffer) => {
               this.sound3.setBuffer(buffer)
               this.sound3.setLoop(false)
               this.sound3.setVolume(0.09)
          })

          this.audioLoader.load("/static/models/lose.mp3",
          (buffer) => {
               this.sound4.setBuffer(buffer)
               this.sound4.setLoop(false)
               this.sound4.setVolume(0.09)
          })

          // // Lets write some 3D TEXT 'Hydrousa' in the first scene/camera while the page is loading
          // this.fontLoader = new FontLoader(this.loadingManager)
          // this.textLoaded = false
          // this.fontLoader.load("/static/models/fonts/helvetiker_regular.typeface.json", (font) => {
          //      const secondTextureLoader = new THREE.TextureLoader()
          //      const matcapTexture = secondTextureLoader.load("/static/models/matcaps/10.png")
          //      this.textGeometry = new TextGeometry('Hydrousa', {
          //           font: font,
          //           size: 0.8,
          //           height: 0.4,
          //           curveSegments: 6,
          //           bevelEnabled: true,
          //           bevelThickness: 0.03,
          //           bevelSize: 0.02,
          //           bevelOffset: 0,
          //           bevelSegments: 4
          //      })
          //      this.textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
          //      this.text = new THREE.Mesh(this.textGeometry, this.textMaterial)
          //
          //      this.text.position.set(-5, 1.2, 0)
          //      this.text.scale.set(0.5, 0.5, 0.5)
          //      this.loadingScene.add(this.text)
          //      this.textLoaded = true
          // })

          // Create an AnimationMixer property
          this.characterMixer = null

          // A boolean property controlling whether the player is currently moving or not
          this.movementState = false
          this.rotationState = false

          // Character movement speed
          this.movementSpeed = 0.5 // 0.5 is the right value

          // Property to handle character body rotation when he is moving
          this.currentCharacterAngle = 0

          // Create a Raycaster property to handle character animation and more
          this.raycaster = new THREE.Raycaster()

          // Create a mouse property to emulate the mouse
          this.mouse = new THREE.Vector2()

          this.handleWindowResizing()

          // this.handleFullScreen()

          this.townLoaded = false
          this.characterLoaded = false
          this.addSimulationTown()

          this.addEnvironmentMap()

          this.rainAdded = false
          this.rainVelocity = 0.7
          this.rainShowingCounter = 0 // a counter to control when the raindrops are visible or not
          this.addRain()

          this.addSea()

          this.updateAllMaterials()

          this.animate()
     }


     addSimulationTown() { // TODO: I should go to blender and join the town meshes in order to reduce its size
          this.gltfLoader.load("/static/models/Simulation_Town.gltf",
          (gltf) =>
          {
               this.simulationTown = gltf.scene
               this.scene.add(this.simulationTown)
               this.townLoaded = true

               this.walking_field = this.simulationTown.children.find((child) => {return child.name === "Savanna"})

               this.city = this.simulationTown.children.find((child) => {return child.name === "extra-road"})
               this.cityMaxDistance = 85
               this.waterTower = this.simulationTown.children.find((child) => {return child.name === "water_tower"})

               this.waterTowerMaxDistance = 32
               this.waterTower.position.x = 20
               this.waterTower.position.z = 23
               this.waterTower.position.y = 6

               this.crop = this.simulationTown.children.find((child) => {return child.name === "old-grass-houses"})
               this.cropMaxDistance = 56
               this.crop.position.z = -11.5
               this.crop.position.y = -0.4

               this.addCharacter()
          }
     )
     }


     addCharacter() {
          this.gltfLoader.load("/static/models/character.glb",
          (gltf) => {
               this.gltfCharacter = gltf
               // this.gltfCharacter.scene.scale.set(1.1, 1.1, 1.1)
               this.gltfCharacter.scene.position.y = 0.3
               this.gltfCharacter.scene.position.x = - 0.5 + Math.random() * 3
               this.gltfCharacter.scene.position.z = -110 + Math.random() * 50

               this.gltfCharacter.scene.rotation.y = 0

               this.characterMixer = new THREE.AnimationMixer(this.gltfCharacter.scene)
               this.scene.add(this.gltfCharacter.scene)
               this.characterIdling = this.characterMixer.clipAction(this.gltfCharacter.animations[0])
               this.characterRunning = this.characterMixer.clipAction(this.gltfCharacter.animations[1])
               this.characterRunning.timeScale = 1.5
               this.characterIdling.timeScale = 1.6
               this.characterIdling.play()
               this.characterRunning.play()
               this.characterRunning.enabled = false
               this.characterLoaded = true
               this.characterLookingDirection = "sw"
               // this.gltfCharacter.scene.position.x = - 0.5 + Math.random() * 3
               // this.gltfCharacter.scene.position.z = -110 + Math.random() * 100
               this.updateAllMaterials()
          }
     )
     }

     // Im currently using the envMapIntensity for lighting effect, the method addLights() is NOT being used
     addLights() {
          this.ambientLight = new THREE.AmbientLight("#ffffff", 1)
          this.scene.add(this.ambientLight)

          this.directionalLight = new THREE.DirectionalLight("#ffffff", 1)
          this.scene.add(this.directionalLight)
     }


     addEnvironmentMap() {
          this.environmentMap = this.cubeTextureLoader.load([
               "/static/models/envMap/1/px.jpg",
               "/static/models/envMap/1/nx.jpg",
               "/static/models/envMap/1/py.jpg",
               "/static/models/envMap/1/ny.jpg",
               "/static/models/envMap/1/pz.jpg",
               "/static/models/envMap/1/nz.jpg"
          ])
          this.environmentMap.encoding = THREE.sRGBEncoding
          this.scene.background = this.environmentMap
          this.scene.environment = this.environmentMap
     }


     updateAllMaterials() {
          if (this.townLoaded && this.characterLoaded) {
               this.scene.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                         child.material.needsUpdate = true
                         child.material.envMapIntensity = 10
                    }
               })
          }
     }


     addRain() {
          this.rainDropsCount = 20000 // maybe less raindrops in the future to reduce the computational burden
          const rainGeometry = new THREE.BufferGeometry()
          const positions = new Float32Array(this.rainDropsCount * 3)
          for (let i = 0; i < this.rainDropsCount; i++) {
               const i3 = 3 * i
               positions[i3] = Math.random() * 250 - 50
               positions[i3 + 1] = Math.max(Math.random() * 50 - 20, 1) // y axis
               positions[i3 + 2] = -Math.random() * 250 + 50
          }
          rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

          const rainMaterial = new THREE.PointsMaterial({
               color: "#9999FF",
               alphaMap: this.textureLoader.load("/static/models/circle_05.png"),
               transparent: true,
               size: 0.15,
               depthWrite: false,
               blending: THREE.AdditiveBlending
          })
          this.raindrops = new THREE.Points(rainGeometry, rainMaterial)
          this.scene.add(this.raindrops)
          this.rainAdded = true
          this.raindrops.visible = false
     }


     addSea() {
          this.seaGeometry = new THREE.PlaneGeometry(200, 200, 512, 512)
          this.seaMaterial = new THREE.RawShaderMaterial({
               vertexShader:
               `
                    uniform mat4 modelMatrix;
                    uniform mat4 viewMatrix;
                    uniform mat4 projectionMatrix;
                    uniform float uBigWavesElevation;
                    uniform vec2 uBigWavesFrequency;
                    uniform float uTime;
                    uniform float uBigWavesSpeed;
                    uniform float uSmallWavesElevation;
                    uniform float uSmallWavesFrequency;
                    uniform float uSmallWavesSpeed;

                    attribute vec3 position;
                    attribute vec2 uv;

                    varying float vElevation;


                    // Classic Perlin 3D Noise
                    // by Stefan Gustavson
                    //

                    vec4 permute(vec4 x)
                    {
                        return mod(((x*34.0)+1.0)*x, 289.0);
                    }

                    vec4 taylorInvSqrt(vec4 r)
                    {
                        return 1.79284291400159 - 0.85373472095314 * r;
                    }

                    vec3 fade(vec3 t)
                    {
                        return t*t*t*(t*(t*6.0-15.0)+10.0);
                    }

                    float cnoise(vec3 P)
                    {
                        vec3 Pi0 = floor(P); // Integer part for indexing
                        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
                        Pi0 = mod(Pi0, 289.0);
                        Pi1 = mod(Pi1, 289.0);
                        vec3 Pf0 = fract(P); // Fractional part for interpolation
                        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
                        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
                        vec4 iy = vec4(Pi0.yy, Pi1.yy);
                        vec4 iz0 = Pi0.zzzz;
                        vec4 iz1 = Pi1.zzzz;

                        vec4 ixy = permute(permute(ix) + iy);
                        vec4 ixy0 = permute(ixy + iz0);
                        vec4 ixy1 = permute(ixy + iz1);

                        vec4 gx0 = ixy0 / 7.0;
                        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
                        gx0 = fract(gx0);
                        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
                        vec4 sz0 = step(gz0, vec4(0.0));
                        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
                        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

                        vec4 gx1 = ixy1 / 7.0;
                        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
                        gx1 = fract(gx1);
                        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
                        vec4 sz1 = step(gz1, vec4(0.0));
                        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
                        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

                        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
                        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
                        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
                        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
                        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
                        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
                        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
                        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

                        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
                        g000 *= norm0.x;
                        g010 *= norm0.y;
                        g100 *= norm0.z;
                        g110 *= norm0.w;
                        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
                        g001 *= norm1.x;
                        g011 *= norm1.y;
                        g101 *= norm1.z;
                        g111 *= norm1.w;

                        float n000 = dot(g000, Pf0);
                        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
                        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
                        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
                        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
                        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
                        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
                        float n111 = dot(g111, Pf1);

                        vec3 fade_xyz = fade(Pf0);
                        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
                        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
                        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
                        return 2.2 * n_xyz;
                    }


                    void main()
                    {
                      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

                      float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                                        sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;

                      for (float i = 0.0; i < 4.0; i++)
                      {
                        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) *
                                     uSmallWavesElevation  / (i + 1.0));
                      }

                      vElevation = elevation;
                      modelPosition.y += elevation;

                      gl_Position = projectionMatrix * viewMatrix * modelPosition;
                    }
               `,
               fragmentShader:
               `
                    precision mediump float;

                    uniform vec3 uDepthColor; // Στελνω τα χρωματα στους shaders σαν THREE.Color() και τα παραλαμβανω σαν vec3
                    uniform vec3 uSurfaceColor;
                    uniform float uColorOffset;
                    uniform float uColorMultiplier;

                    varying float vElevation;

                    void main()
                    {
                      // vec3 mixedColor = mix(uDepthColor, uSurfaceColor, (vElevation + 0.2) * 2.5);
                      vec3 mixedColor = mix(uDepthColor, uSurfaceColor, (vElevation + uColorOffset) * uColorMultiplier);

                      gl_FragColor = vec4(mixedColor, 1.0);
                    }
               `,
               transparent: true,
               uniforms: {
               uTime: { value: 0 },

               uBigWavesElevation: { value: 0.2 },
               uBigWavesFrequency: { value: new THREE.Vector2(0.65, 0.1) },
               uBigWavesSpeed: { value: 0.75 },

               uDepthColor: { value: new THREE.Color('#186691') },
               uSurfaceColor: { value: new THREE.Color('#9bd8ff') },

               uColorOffset: { value: 0.08 },
               uColorMultiplier: { value: 3 },

               uSmallWavesElevation: { value: 0.15 },
               uSmallWavesFrequency: { value: 0.24 },
               uSmallWavesSpeed: { value: 0.2 },
               }
          })
          this.sea = new THREE.Mesh(this.seaGeometry, this.seaMaterial)
          this.sea.rotation.x = - Math.PI / 2
          this.sea.position.set(-5.4, 0, -216.5)
          this.scene.add(this.sea)
     }


     handleWindowResizing() {
          window.addEventListener('resize', () => {

               // Update sizes
               this.sizes.width = window.innerWidth
               this.sizes.height = window.innerHeight

               // Update camera
               this.camera.aspect = this.sizes.width / this.sizes.height
               this.camera.updateProjectionMatrix()

               // Update Renderer
               this.renderer.setSize(this.sizes.width, this.sizes.height)
               this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          })
     }

     handleFullScreen() {
          // Enable entering or exiting fullscreen mode
          window.addEventListener('dblclick', () => {
               if (!document.fullscreenElement) {
                    this.canvas.requestFullscreen()
               }
               else {
                    document.exitFullscreen()
               }
          })
     }


     handleCharacterAnimationAndMenus(event) {
          const _this = this.tsat // here 'this' refers to the window object (because the method gets triggered from an addEventListener) so I change it manually to refer to the Game object
          if (_this.pageLoaded && _this.clicksEnabled) {
               _this.mouse.x = ((event.clientX / _this.sizes.width) * 2) - 1 // three.js needs the mouse to take values from -1 to +1 on both x and y axis
               _this.mouse.y = -((event.clientY / _this.sizes.height) * 2) + 1
               _this.raycaster.setFromCamera(_this.mouse, _this.camera)

               if (event.which == 3) { // RIGHT_CLICK triggers character to move
                    const intersect = _this.raycaster.intersectObjects([_this.walking_field])
                    if (intersect.length) {
                         _this.destinationPoint = intersect[0].point // A vector3 representing the movement destination point
                         _this.movementState = true
                         _this.rotationState = true
                    }
               }
               else if (event.which == 1) { // LEFT CLICK TAKES CARE OF THE GAME MENUS
                    const city_intersect = _this.raycaster.intersectObjects([_this.city])
                    const waterTower_intersect = _this.raycaster.intersectObjects([_this.waterTower])
                    const crop_intersect = _this.raycaster.intersectObjects([_this.crop])

                    if (!_this.cityMenu.classList.contains('visible') && !_this.waterTowerMenu.classList.contains('visible') && !_this.cropMenu.classList.contains('visible'))
                    {
                         if (city_intersect.length && _this.gltfCharacter.scene.position.distanceTo(_this.city.position) < _this.cityMaxDistance) {
                              _this.cityMenu.classList.add('visible')
                         }
                         else if (waterTower_intersect.length && _this.gltfCharacter.scene.position.distanceTo(_this.waterTower.position) < _this.waterTowerMaxDistance) {
                              _this.waterTowerMenu.classList.add('visible')
                         }
                         else if (crop_intersect.length && _this.gltfCharacter.scene.position.distanceTo(_this.crop.position) < _this.cropMaxDistance) {
                              _this.cropMenu.classList.add('visible')
                         }
                    }

               }
          }
     }


     moveCharacter() {
          // Character can only move on the X and Z axes i.e. only horizontial movement is available

          // Current character position
          let currentPosX = this.gltfCharacter.scene.position.x
          let currentPosZ = this.gltfCharacter.scene.position.z

          // Desired character position
          let finalPosX = this.destinationPoint.x
          let finalPosZ = this.destinationPoint.z

          // We set a multiplier just in case we need negative values
          let multiplierX = 1
          let multiplierZ = 1

          // Detect the distance between the current position and the desired one.
          let distanceX = Math.abs(currentPosX - finalPosX)
          let distanceZ = Math.abs(currentPosZ - finalPosZ)
          let distance = Math.sqrt(distanceX ** 2 + distanceZ ** 2)

          // Use negative multipliers if necessary.
          if (currentPosX > finalPosX) {
               multiplierX = -1;
          }

          if (currentPosZ > finalPosZ) {
               multiplierZ = -1;
          }

          // Update character body rotation
          if (this.rotationState) {
               this.previousBodyRotationY = this.currentBodyRotationY

               if (finalPosX != currentPosX && finalPosZ != currentPosZ) {
                    if (finalPosX > currentPosX && finalPosZ > currentPosZ) { // 0 < φ < π/2
                         this.gltfCharacter.scene.rotation.y = Math.atan((finalPosX - currentPosX) / (finalPosZ - currentPosZ))
                         this.characterLookingDirection = "nw"
                    }
                    else if (finalPosX > currentPosX && finalPosZ < currentPosZ) { // π/2 < φ < π
                         this.gltfCharacter.scene.rotation.y = (Math.PI / 2) + Math.abs(Math.atan((finalPosZ - currentPosZ) / (finalPosX - currentPosX)))
                         this.characterLookingDirection = "sw"
                    }
                    else if (finalPosX < currentPosX && finalPosZ < currentPosZ) { // π < φ < 3π/2
                         this.gltfCharacter.scene.rotation.y = Math.PI + Math.abs(Math.atan((finalPosX - currentPosX) / (finalPosZ - currentPosZ)))
                         this.characterLookingDirection = "se"
                    }
                    else if (finalPosX < currentPosX && finalPosZ > currentPosZ) { // 3π/2 < φ < 2π
                         this.gltfCharacter.scene.rotation.y = (3 * Math.PI / 2) + Math.abs(Math.atan((finalPosZ - currentPosZ) / (finalPosX - currentPosX)))
                         this.characterLookingDirection = "ne"
                    }
               }
               this.currentBodyRotationY = this.gltfCharacter.scene.rotation.y
               this.rotationState = false
          }

          // Update character position
          this.gltfCharacter.scene.position.x += (this.movementSpeed * (distanceX / (distance + 0.1))) * multiplierX
          this.gltfCharacter.scene.position.z += (this.movementSpeed * (distanceZ / (distance + 0.1))) * multiplierZ

          // If the position is close we can call the movement complete.
          if (( Math.floor( this.gltfCharacter.scene.position.x ) <= Math.floor( finalPosX ) + 0.0002 &&
          Math.floor( this.gltfCharacter.scene.position.x ) >= Math.floor( finalPosX ) - 0.0002 ) &&
          ( Math.floor( this.gltfCharacter.scene.position.z ) <= Math.floor( finalPosZ ) + 0.0002 &&
          Math.floor( this.gltfCharacter.scene.position.z ) >= Math.floor( finalPosZ ) - 0.0002 ))
          {
               this.movementState = false
               this.characterIdling.enabled = true
               this.characterRunning.enabled = false
          }
     }

     runSimulation() {
          this.simulationRuns++

          // total rainfall in mm
          this.rainfall = this.rainfallTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          // total irrigation demand in mm
          this.irrigation = this.irrigationTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          this.stormwaterTimeseries = this.rainfallTimeseries.map((num) => {return Math.min(num * this.stormwaterCoeff * this.stormwaterArea / 1000, this.BioswaleQmax) * this.BioswaleInfiltrationRate})
          this.yardsTimeseries = this.rainfallTimeseries.map((num) => {return num * this.yardsCoeff * this.yardsArea / 1000})
          this.roofsTimeseries = this.rainfallTimeseries.map((num) => {return num * this.roofsCoeff * this.roofsArea / 1000})

          this.timeseriesLength = this.rainfallTimeseries.length

          this.openTankStorage = new Float32Array(this.timeseriesLength + 1) // TANK 3
          this.openTankStorage.fill(0)

          this.roofsTankStorage = new Float32Array(this.timeseriesLength + 1) // TANK 1
          this.roofsTankStorage.fill(0)

          this.tank2Storage = new Float32Array(this.timeseriesLength + 1) // TANK 2
          this.tank2Storage.fill(0)

          this.subsurfaceTankStorage = new Float32Array(this.timeseriesLength + 1) // TANK 4 - AQUIFER
          this.subsurfaceTankStorage.fill(0)

          this.subsurfaceTankRecoveryToTank2 = new Float32Array(this.timeseriesLength)
          this.subsurfaceTankRecoveryToTank2.fill(0)

          this.subsurfaceTankArtificialRecharge = new Float32Array(this.timeseriesLength)
          this.subsurfaceTankArtificialRecharge.fill(0)

          this.openTankSpillTimeseries = new Float32Array(this.timeseriesLength)
          this.openTankSpillTimeseries.fill(0)

          // this is my addition, trying to implement the idea that the collected water from the roofs
          // will be saved in the roofsTank and be FIRST used to satisfy the household non-potable needs
          // and if there is spilling from the roofsTank, only the spilling will go to Tank2
          this.roofsTankSpillTimeseries = new Float32Array(this.timeseriesLength)
          this.roofsTankSpillTimeseries.fill(0)

          this.tank2SpillTimeseries = new Float32Array(this.timeseriesLength)
          this.tank2SpillTimeseries.fill(0)

          this.subsurfaceTankSpillTimeseries = new Float32Array(this.timeseriesLength)
          this.subsurfaceTankSpillTimeseries.fill(0)

          this.irrigationDeficitTimeseries = new Float32Array(this.timeseriesLength)
          this.irrigationDeficitTimeseries.fill(0)

          // This is again my addition
          this.householdDeficitTimeseries = new Float32Array(this.timeseriesLength)
          this.householdDeficitTimeseries.fill(0)

          this.irrigationAbstractFromOpenTank = new Float32Array(this.timeseriesLength)
          this.irrigationAbstractFromOpenTank.fill(0)

          this.householdAbstractFromRoofsTank = new Float32Array(this.timeseriesLength)
          this.householdAbstractFromRoofsTank.fill(0)

          this.irrigationAbstractFromTank2 = new Float32Array(this.timeseriesLength)
          this.irrigationAbstractFromTank2.fill(0)

          this.availableWaterFromTank2ToSubsurfaceTank = new Float32Array(this.timeseriesLength)
          this.availableWaterFromTank2ToSubsurfaceTank.fill(0)

          this.realWaterFromTank2ToSubsurfaceTank = new Float32Array(this.timeseriesLength)
          this.realWaterFromTank2ToSubsurfaceTank.fill(0)

          this.totalInput = this.stormwaterTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0) + this.yardsTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0) + this.roofsTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)
          this.totalStorage = 0
          this.totalOutput = 0

          for (let i = 0;i < this.timeseriesLength; i++)
          {
               this.openTankStorage[i+1] = Math.min(this.openTankMaxVol, this.openTankStorage[i] + this.stormwaterTimeseries[i])
               this.openTankSpillTimeseries[i] = Math.max(0, this.openTankStorage[i] + this.stormwaterTimeseries[i] - this.openTankMaxVol)
               this.irrigationAbstractFromOpenTank[i] = Math.min(this.openTankStorage[i+1], this.irrigationTimeseries[i])
               this.openTankStorage[i+1] -= this.irrigationAbstractFromOpenTank[i]

               // this.roofsTankStorage[i+1] = Math.min(this.roofsTankMaxVol, this.roofsTankStorage[i] + this.roofsTimeseries[i])
               this.roofsTankStorage[i+1] = this.roofsTankStorage[i] + this.roofsTimeseries[i]

               // this.roofsTankSpillTimeseries[i] = Math.max(0, this.roofsTankStorage[i] + this.roofsTimeseries[i] - this.roofsTankMaxVol)

               this.householdAbstractFromRoofsTank[i] =  Math.min(this.roofsTankStorage[i+1], this.totalNonPotableHouseholdDemand)

               this.roofsTankStorage[i+1] -= this.householdAbstractFromRoofsTank[i]
               this.householdDeficitTimeseries[i] = this.totalNonPotableHouseholdDemand - this.householdAbstractFromRoofsTank[i]

               this.roofsTankSpillTimeseries[i] = Math.max(0, this.roofsTankStorage[i+1] - this.roofsTankMaxVol)
               this.roofsTankStorage[i+1] -= this.roofsTankSpillTimeseries[i]

               this.tank2Storage[i+1] = Math.min(this.tank2MaxVol, this.tank2Storage[i] + this.yardsTimeseries[i] + this.roofsTankSpillTimeseries[i])
               this.tank2SpillTimeseries[i] = Math.max(0, this.tank2Storage[i] + this.yardsTimeseries[i] + this.roofsTankSpillTimeseries[i] - this.tank2MaxVol)
               this.irrigationDeficitTimeseries[i] = this.irrigationTimeseries[i] - this.irrigationAbstractFromOpenTank[i]
               this.irrigationAbstractFromTank2[i] = Math.min(this.irrigationDeficitTimeseries[i], this.tank2Storage[i+1])
               this.irrigationDeficitTimeseries[i] -= this.irrigationAbstractFromTank2[i]
               this.tank2Storage[i+1] -= this.irrigationAbstractFromTank2[i]
               this.availableWaterFromTank2ToSubsurfaceTank[i] = Math.max(0, this.tank2Storage[i+1] - this.tank2MaxVol * this.tank2MinVolPercentage)
               this.subsurfaceTankStorage[i+1] = Math.min(this.subsurfaceTankStorage[i] + this.openTankSpillTimeseries[i], this.subsurfaceTankMaxVol)
               this.subsurfaceTankSpillTimeseries[i] = Math.max(0, this.subsurfaceTankStorage[i] + this.openTankSpillTimeseries[i] - this.subsurfaceTankMaxVol)

               this.realWaterFromTank2ToSubsurfaceTank[i] = Math.min(this.availableWaterFromTank2ToSubsurfaceTank[i], Math.max(0, this.subsurfaceTankMaxVol * this.subsurfaceTankMaxVolPercentage - this.subsurfaceTankStorage[i+1]))
               this.tank2Storage[i+1] -= this.realWaterFromTank2ToSubsurfaceTank[i]
               this.subsurfaceTankArtificialRecharge[i] = this.openTankSpillTimeseries[i] + this.realWaterFromTank2ToSubsurfaceTank[i]
               this.subsurfaceTankStorage[i+1] += this.realWaterFromTank2ToSubsurfaceTank[i]
               this.subsurfaceTankRecoveryToTank2[i] = Math.max(0, this.subsurfaceTankStorage[i+1] - this.subsurfaceTankMaxVol * this.subsurfaceTankMaxVolPercentage)
               this.subsurfaceTankStorage[i+1] -= this.subsurfaceTankRecoveryToTank2[i]
               this.tank2SpillTimeseries[i] += Math.max(0, this.tank2Storage[i+1] + this.subsurfaceTankRecoveryToTank2[i] - this.tank2MaxVol)
               this.tank2Storage[i+1] = Math.min(this.tank2Storage[i+1] + this.subsurfaceTankRecoveryToTank2[i], this.tank2MaxVol)
               this.totalOutput += this.irrigationAbstractFromOpenTank[i] + this.householdAbstractFromRoofsTank[i] + this.irrigationAbstractFromTank2[i] + this.tank2SpillTimeseries[i] + this.subsurfaceTankSpillTimeseries[i]
          }

          this.totalStorage = this.openTankStorage[this.openTankStorage.length - 1] + this.roofsTankStorage[this.roofsTankStorage.length - 1] + this.tank2Storage[this.tank2Storage.length - 1] + this.subsurfaceTankStorage[this.subsurfaceTankStorage.length - 1]

          this.equilibriumVerification = this.totalInput - this.totalStorage - this.totalOutput // this should always be equal to 0

          this.totalIrrigationDeficit = this.irrigationDeficitTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          this.totalHouseholdDeficit = this.householdDeficitTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          if (this.simulationRuns != 1) {
               this.tank1Chart.destroy() // destroy the old chart before creating the new one
               this.tank2Chart.destroy()
               this.tank3Chart.destroy()
               this.tank4Chart.destroy()
               this.irrigationChart.destroy()
               this.householdChart.destroy()

          }
          let gradient1 = this.graphTank1Tag.createLinearGradient(0, 0, 0, 400)
          gradient1.addColorStop(0, "rgba(58, 123, 213, 1)")
          gradient1.addColorStop(1, "rgba(0, 210, 255, 0.3)")
          this.tank1Chart = new CHART.Chart(this.graphTank1Tag, {
               type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
               data: {
                    labels: this.daysCounter,
                    datasets: [
                         { // i can have more than one datasets, i put each dataset in a different js object inside this array
                         label: 'Tank 1 Storage',
                         data: this.roofsTankStorage,
                         backgroundColor: gradient1,
                         borderColor: "rgba(58, 123, 213, 1)",
                         // pointBackgroundColor: "#ffffff",
                         fill: true,
                         tension: 0.4,
                         borderWidth: 1.5
                         }
                    ]
               },
               options: {
                    layout: {
                        padding: {
                            top: 25,
                            bottom: 25,
                            left: 25,
                            right: 25
                         }
                    },
                    plugins: {
                        legend: {
                            display: false,
                       },
                       title: {
                            display: true,
                            text: "Tank 1 Storage",
                            font: {size: 26}
                       }
                    },
                    radius: 0,
                    responsive: true,
                    scales: {
                         y: {
                              beginAtZero: true,
                              grid: {display: false},
                              ticks: {
                                   callback: (value) => {return `${value}`}
                              },
                              title: {
                                   display: true,
                                   text: "Storage in m^3",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              },
                         },
                         x: {
                              grid: {display: false},
                              title: {
                                   display: true,
                                   text: "Days",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         }
                    }
               }
          })
          let gradient2 = this.graphTank2Tag.createLinearGradient(0, 0, 0, 400)
          gradient2.addColorStop(0, "rgba(58, 123, 213, 1)")
          gradient2.addColorStop(1, "rgba(0, 210, 255, 0.3)")
          this.tank2Chart = new CHART.Chart(this.graphTank2Tag, {
               type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
               data: {
                    labels: this.daysCounter,
                    datasets: [{ // i can have more than one datasets, i put each dataset in a different js object inside this array
                         label: 'Tank 2 Storage',
                         data: this.tank2Storage,
                         backgroundColor: gradient2,
                         borderColor: "rgba(58, 123, 213, 1)",
                         // pointBackgroundColor: "#ffffff",
                         fill: true,
                         tension: 0.4,
                         borderWidth: 1.5
                    }]
               },
               options: {
                    layout: {
                        padding: {
                            top: 25,
                            bottom: 25,
                            left: 25,
                            right: 25
                         }
                    },
                    plugins: {
                        legend: {
                            display: false,
                       },
                       title: {
                            display: true,
                            text: "Tank 2 Storage",
                            font: {size: 26}
                       }
                    },
                    radius: 0,
                    responsive: true,
                    scales: {
                         y: {
                              beginAtZero: true,
                              grid: {display: false},
                              ticks: {
                                   callback: (value) => {return `${value}`}
                              },
                              title: {
                                   display: true,
                                   text: "Storage in m^3",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         },
                         x: {
                              grid: {display: false},
                              title: {
                                   display: true,
                                   text: "Days",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         }
                    }
               }
          })
          let gradient3 = this.graphTank3Tag.createLinearGradient(0, 0, 0, 400)
          gradient3.addColorStop(0, "rgba(58, 123, 213, 1)")
          gradient3.addColorStop(1, "rgba(0, 210, 255, 0.3)")
          this.tank3Chart = new CHART.Chart(this.graphTank3Tag, {
               type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
               data: {
                    labels: this.daysCounter,
                    datasets: [{ // i can have more than one datasets, i put each dataset in a different js object inside this array
                         label: 'Tank 3 Storage',
                         data: this.openTankStorage,
                         backgroundColor: gradient3,
                         borderColor: "rgba(58, 123, 213, 1)",
                         // pointBackgroundColor: "#ffffff",
                         fill: true,
                         tension: 0.4,
                         borderWidth: 1.5
                    }]
               },
               options: {
                    layout: {
                        padding: {
                            top: 25,
                            bottom: 25,
                            left: 25,
                            right: 25
                         }
                    },
                    plugins: {
                        legend: {
                            display: false,
                       },
                       title: {
                            display: true,
                            text: "Tank 3 Storage",
                            font: {size: 26}
                       }
                    },
                    radius: 0,
                    responsive: true,
                    scales: {
                         y: {
                              beginAtZero: true,
                              grid: {display: false},
                              ticks: {
                                   callback: (value) => {return `${value}`}
                              },
                              title: {
                                   display: true,
                                   text: "Storage in m^3",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         },
                         x: {
                              grid: {display: false},
                              title: {
                                   display: true,
                                   text: "Days",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         }
                    }
               }
          })
          let gradient4 = this.graphTank4Tag.createLinearGradient(0, 0, 0, 400)
          gradient4.addColorStop(0, "rgba(58, 123, 213, 1)")
          gradient4.addColorStop(1, "rgba(0, 210, 255, 0.3)")
          this.tank4Chart = new CHART.Chart(this.graphTank4Tag, {
               type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
               data: {
                    labels: this.daysCounter,
                    datasets: [{ // i can have more than one datasets, i put each dataset in a different js object inside this array
                         label: 'Aquifer Storage',
                         data: this.subsurfaceTankStorage,
                         backgroundColor: gradient4,
                         borderColor: "rgba(58, 123, 213, 1)",
                         // pointBackgroundColor: "#ffffff",
                         fill: true,
                         tension: 0.4,
                         borderWidth: 1.5
                    }]
               },
               options: {
                    layout: {
                        padding: {
                            top: 25,
                            bottom: 25,
                            left: 25,
                            right: 25
                         }
                    },
                    plugins: {
                        legend: {
                            display: false,
                       },
                       title: {
                            display: true,
                            text: "Aquifer Storage",
                            font: {size: 26}
                       }
                    },
                    radius: 0,
                    responsive: true,
                    scales: {
                         y: {
                              beginAtZero: true,
                              grid: {display: false},
                              ticks: {
                                   callback: (value) => {return `${value}`}
                              },
                              title: {
                                   display: true,
                                   text: "Storage in m^3",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         },
                         x: {
                              grid: {display: false},
                              title: {
                                   display: true,
                                   text: "Days",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         }
                    }
               }
          })
          let gradient5 = this.graphIrrigationTag.createLinearGradient(0, 0, 0, 400)
          gradient5.addColorStop(0, "rgba(58, 123, 213, 1)")
          gradient5.addColorStop(1, "rgba(0, 210, 255, 0.3)")
          this.irrigationChart = new CHART.Chart(this.graphIrrigationTag, {
               type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
               data: {
                    labels: this.daysCounter2,
                    datasets: [{ // i can have more than one datasets, i put each dataset in a different js object inside this array
                         label: 'Irrigation Deficit',
                         data: this.irrigationDeficitTimeseries,
                         backgroundColor: gradient5,
                         borderColor: "rgba(58, 123, 213, 1)",
                         // pointBackgroundColor: "#ffffff",
                         fill: true,
                         tension: 0.4,
                         borderWidth: 1.5
                    }]
               },
               options: {
                    layout: {
                        padding: {
                            top: 25,
                            bottom: 25,
                            left: 25,
                            right: 25
                         }
                    },
                    plugins: {
                        legend: {
                            display: false,
                       },
                       title: {
                            display: true,
                            text: "Irrigation Deficit",
                            font: {size: 26}
                       }
                    },
                    radius: 0,
                    responsive: true,
                    scales: {
                         y: {
                              beginAtZero: true,
                              grid: {display: false},
                              ticks: {
                                   callback: (value) => {return `${value}`}
                              },
                              title: {
                                   display: true,
                                   text: "Deficit in m^3",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         },
                         x: {
                              grid: {display: false},
                              title: {
                                   display: true,
                                   text: "Days",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         }
                    }
               }
          })
          let gradient6 = this.graphHouseholdTag.createLinearGradient(0, 0, 0, 400)
          gradient6.addColorStop(0, "rgba(58, 123, 213, 1)")
          gradient6.addColorStop(1, "rgba(0, 210, 255, 0.3)")
          this.householdChart = new CHART.Chart(this.graphHouseholdTag, {
               type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
               data: {
                    labels: this.daysCounter2,
                    datasets: [{ // i can have more than one datasets, i put each dataset in a different js object inside this array
                         label: 'Non Potable Household Deficit',
                         data: this.householdDeficitTimeseries,
                         backgroundColor: gradient6,
                         borderColor: "rgba(58, 123, 213, 1)",
                         // pointBackgroundColor: "#ffffff",
                         fill: true,
                         tension: 0.4,
                         borderWidth: 1.5
                    }]
               },
               options: {
                    layout: {
                        padding: {
                            top: 25,
                            bottom: 25,
                            left: 25,
                            right: 25
                         }
                    },
                    plugins: {
                        legend: {
                            display: false,
                       },
                       title: {
                            display: true,
                            text: "Non Potable Household Deficit",
                            font: {size: 26}
                       }
                    },
                    radius: 0,
                    responsive: true,
                    scales: {
                         y: {
                              beginAtZero: true,
                              grid: {display: false},
                              ticks: {
                                   callback: (value) => {return `${value}`}
                              },
                              title: {
                                   display: true,
                                   text: "Deficit in m^3",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         },
                         x: {
                              grid: {display: false},
                              title: {
                                   display: true,
                                   text: "Days",
                                   font: {
                                        size: 18,
                                        weight: "bold"
                                   }
                              }
                         }
                    }
               }
          })

          if (this.simulationRuns == 1) {
               this.cityMenu.classList.remove('visible')
               this.waterTowerMenu.classList.remove('visible')
               this.cropMenu.classList.remove('visible')
               this.results.classList.add('visible')
               this.timeCountingStarted = true
               this.previousTimeElapsed = Date.now()
               this.resultsText.innerHTML = `Irrigation Deficit: ${this.totalIrrigationDeficit.toFixed(2)} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Non Potable Household Deficit: ${this.totalHouseholdDeficit.toFixed(2)} m<span style="position: relative; bottom: 5px; right: 1px;">3<br><br>Try to find an adequate system design and meet the demands!</span>`
               this.resultsOK.onclick = () => {
                    if (this.simulationRuns < 3) { // this needs debugging - i dont know whats happening
                         this.simulationButton.disabled = false
                         this.results.classList.remove('visible')
                         this.clicksEnabled = true
                         if (this.finalDifficulty !== "hard") {
                              this.imgTank1.hidden = false
                              this.imgTank2.hidden = false
                              this.imgTank3.hidden = false
                              this.imgTank4.hidden = false
                              this.imgIrrigation.hidden = false
                              this.imgHousehold.hidden = false
                              this.irrigationHouseholdInfoTag.classList.add('visible')
                              this.irrigationHouseholdInfoTag.innerHTML = `Irrigation Deficit: ${Math.abs(this.totalIrrigationDeficit.toFixed(2))} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Non Potable Household Deficit: ${Math.abs(this.totalHouseholdDeficit.toFixed(2))} m<span style="position: relative; bottom: 5px; right: 1px;">3`
                         }
                    }
               }
          }
          else {
               if (this.gameEnded) {
                    if (this.finalDifficulty === "hard") {
                         this.imgTank1.hidden = false
                         this.imgTank2.hidden = false
                         this.imgTank3.hidden = false
                         this.imgTank4.hidden = false
                         this.imgIrrigation.hidden = false
                         this.imgHousehold.hidden = false
                    }
                    this.irrigationHouseholdInfoTag.classList.remove('visible')
                    this.cityMenu.classList.remove('visible')
                    this.waterTowerMenu.classList.remove('visible')
                    this.cropMenu.classList.remove('visible')
                    this.results.classList.add('visible')
                    this.timeCountingStarted = false
                    this.simulationButton.disabled = true
                    this.clicksEnabled = false
                    this.resultsOK.hidden = true
                    this.newGameButton.hidden = false
                    this.newGameButton.disabled = false

                    // this.tank1Chart.destroy()
                    // this.imgTank1.hidden = true
                    // this.tank2Chart.destroy()
                    // this.imgTank2.hidden = true
                    // this.tank3Chart.destroy()
                    // this.imgTank3.hidden = true
                    // this.tank4Chart.destroy()
                    // this.imgTank4.hidden = true
                    // this.irrigationChart.destroy()
                    // this.imgIrrigation.hidden = true
                    // this.householdChart.destroy()
                    // this.imgHousehold.hidden = true

                    // this.sound.setVolume(0.30)
                    // this.sound2.setVolume(0.30)
                    if (this.totalIrrigationDeficit <= 0 && this.totalHouseholdDeficit <= 0 && this.remainingBudget >= 0) {
                         this.resultsText.innerHTML = `Congratulations! The irrigation and non-potable household demands are being satisfied!<br>Nice Work!`
                         this.sound3.play()
                    }
                    else if (this.totalIrrigationDeficit <= 0 && this.totalHouseholdDeficit <= 0 && this.remainingBudget < 0) {
                         this.resultsText.innerHTML = `Oops! This is not a cost-effective design!<br>Irrigation Deficit Remaining: ${Math.abs(this.totalIrrigationDeficit.toFixed(2))} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Non-Potable Household Deficit Remaining: ${Math.abs(this.totalHouseholdDeficit.toFixed(2))} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`
                         this.sound4.play()
                    }
                    else {
                         this.resultsText.innerHTML = `Oops! The demands are not being satisfied!<br>Irrigation Deficit Remaining: ${Math.abs(this.totalIrrigationDeficit.toFixed(2))} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Non-Potable Household Deficit Remaining: ${this.totalHouseholdDeficit.toFixed(2)} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`
                         this.sound4.play()
                    }
               }
               else {
                    if (this.finalDifficulty !== "hard") {
                         this.irrigationHouseholdInfoTag.classList.add('visible')
                         this.irrigationHouseholdInfoTag.innerHTML = `Irrigation Deficit: ${Math.abs(this.totalIrrigationDeficit.toFixed(2))} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Non-Potable Household Deficit: ${Math.abs(this.totalHouseholdDeficit.toFixed(2))} m<span style="position: relative; bottom: 5px; right: 1px;">3`
                    }
               }
          }
     }


     range(start, stop, step) {
          return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))
     }


     toHHMMSS(value) {
          const sec = parseInt(value, 10); // convert value to number if it's string
          let hours   = Math.floor(sec / 3600); // get hours
          let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
          let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
          // add 0 if value < 10; Example: 2 => 02
          if (hours   < 10) {hours   = "0"+hours;}
          if (minutes < 10) {minutes = "0"+minutes;}
          if (seconds < 10) {seconds = "0"+seconds;}
          return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
     }


     animate() {
          this.elapsedTime = this.clock.getElapsedTime()
          this.deltaTime = this.elapsedTime - this.previousTime
           // this.deltaTime should take values around 0.025 - 0.027 for the game to be played nicely (the player to be moving at normal
           // speeds etc.). However at the MSI laptop it takes values around 0.006 - 0.007 and this makes everything moving too fast
           // that is why i adjust the this.movementSpeed property to arrange these issues
          this.previousTime = this.elapsedTime

          if (!this.pageLoaded) {
               // if (this.textLoaded) {
               //      this.text.position.x += (this.deltaTime / 10) * 3
               //      if (this.text.position.x > 4.9) {
               //           this.text.position.set(-5.4, 1.2, 0)
               //      }
               // }
               this.renderer.render(this.loadingScene, this.loadingCamera)
               window.requestAnimationFrame(() => {this.animate()})
          }
          else {
               if (this.timeCountingStarted) {
                    this.differenceTimeElapsed = Date.now() - this.previousTimeElapsed
                    this.previousTimeElapsed = Date.now()
                    this.remainingTime -= this.differenceTimeElapsed / 1000
                    if (this.remainingTime < 60) {
                         this.timeTag.style.color = "#ff0000"
                    }
                    this.timeTag.innerHTML = `Remaining Time: ${this.toHHMMSS(this.remainingTime)}`;
                    if (this.remainingTime <= 0) {
                         this.timeCountingStarted = false
                         this.timeTag.innerHTML = `Remaining Time: 00:00:00 `;
                         this.gameEnded = true
                         this.runSimulation()
                    }
               }
               // TAKE CARE OF DIFFERENT FRAME RATES (FPS). If a computer has i high frame rate i reduce the rain and movement speed whereas
               // if it has a low one , i increase it
               if (this.deltaTime < 0.009) {
                    this.movementSpeed = 0.166
                    this.rainVelocity = 0.233
               }
               else if (this.deltaTime > 0.039) {
                    this.movementSpeed = 0.83
                    this.rainVelocity = 1.16
               }

               // Update AnimationMixer
               if (this.characterMixer != null) {
                    this.characterMixer.update(this.deltaTime)
               }

               if (this.movementState) {
                    this.characterIdling.enabled = false
                    this.characterRunning.enabled = true
                    this.moveCharacter()
               }

               this.camera.lookAt(this.gltfCharacter.scene.position.x, this.gltfCharacter.scene.position.y, this.gltfCharacter.scene.position.z)

               // Move the rain
               if (this.rainAdded) {
                    this.rainShowingCounter++;
                    if (this.rainShowingCounter == 5) { // just to make sure everything is loaded and to avoid the browser's warning message: Audio is already playing.
                         // this.sound.play()
                         this.sound2.play()
                    }
                    for (let n = 0; n < this.rainDropsCount; n++) {
                         const n3 = n * 3
                         this.raindrops.geometry.attributes.position.array[n3 + 1] -= Math.random() * this.rainVelocity
                         if (this.raindrops.geometry.attributes.position.array[n3 + 1] < 0) {
                              this.raindrops.geometry.attributes.position.array[n3 + 1] = Math.max(Math.random() * 70 - 20, 30)
                         }
                    }
                    this.raindrops.geometry.attributes.position.needsUpdate = true

                    // Activating - Deactivating raindrops and corresponding sounds
                    if (this.rainShowingCounter % 1000 == 0) {
                         const change_possibility = Math.random()
                         if (!this.raindrops.visible) {
                              if (change_possibility < 0.5) {
                                   this.raindrops.visible = true
                                   this.sound.play()
                                   // this.sound2.setVolume(0.5)
                              }
                         }
                         else {
                              if (change_possibility < 0.5) {
                                   this.raindrops.visible = false
                                   // this.sound2.setVolume(0.6)
                                   this.sound.pause()
                              }
                         }
                    }
               }

               // Automatically closing the game menus when the character moves away from the corresponding city components
               if (this.gltfCharacter.scene.position.distanceTo(this.city.position) >= this.cityMaxDistance) {
                    this.cityMenu.classList.remove('visible')
               }
               if (this.gltfCharacter.scene.position.distanceTo(this.waterTower.position) >= this.waterTowerMaxDistance) {
                    this.waterTowerMenu.classList.remove('visible')
               }

               if (this.gltfCharacter.scene.position.distanceTo(this.crop.position) >= this.cropMaxDistance) {
                    this.cropMenu.classList.remove('visible')
               }

               // Handle color of the remaining budget (white when positive and red when negative)
               if (this.remainingBudget > 0) {
                    this.budgetTag.style.color = "#ffffff"
               } else {
                    this.budgetTag.style.color = "#ff0000"
               }

               // Animate sea
               this.seaMaterial.uniforms.uTime.value = this.elapsedTime

               // Update OrbitControls
               // this.orbitControls.update()

               // Rotate the camera smoothly around the player
               if (!(this.previousBodyRotationY < 1.5 && this.currentBodyRotationY > 5.0) && ((this.currentBodyRotationY > this.previousBodyRotationY) || (this.previousBodyRotationY > 5 && this.currentBodyRotationY < 1.5))) {
                    if (Math.abs(this.cameraCounter - this.gltfCharacter.scene.rotation.y) > 0.06) {
                         this.cameraCounter += 0.05
                         this.camera.position.x = Math.sin(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.x
                         this.camera.position.z = Math.cos(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.z
                    }
                    else {
                         this.camera.position.x = Math.sin(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.x
                         this.camera.position.z = Math.cos(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.z
                    }
               }
               else {
                    if (Math.abs(Math.abs(this.cameraCounter) - this.gltfCharacter.scene.rotation.y) > 0.06)
                    {
                         this.cameraCounter -= 0.05
                         this.camera.position.x = Math.sin(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.x
                         this.camera.position.z = Math.cos(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.z
                    }
                    else {
                         this.camera.position.x = Math.sin(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.x
                         this.camera.position.z = Math.cos(this.cameraCounter + Math.PI) * this.cameraDistanceToPlayer + this.gltfCharacter.scene.position.z
                    }
               }

               if (this.cameraCounter > Math.PI * 2) {
                    this.cameraCounter = 0
               }
               if (this.cameraCounter < 0) {
                    this.cameraCounter = Math.PI * 2
               }

               // Let's run a simulation whenever the player changes a menu slider on the EASY difficulty
               if (this.finalDifficulty !== "hard" && this.newSimulationRun === true) {
                    this.runSimulation()
                    this.newSimulationRun = false
               }
               // Render our scene
               this.renderer.render(this.scene, this.camera)

               // Re-running the animate method on every next frame
               window.requestAnimationFrame(() => {this.animate()})
          }
     }
}

export { Game }
