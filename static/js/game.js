import * as THREE from '../node_modules/three/build/three.module.js'
// import * as lil from '../node_modules/lil-gui/dist/lil-gui.esm.js'
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js'


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

          this.playButton = document.querySelector('.play')

          this.cityMenu = document.querySelector('.city-menu')
          this.waterTowerMenu = document.querySelector('.water-tower-menu')
          this.cropMenu = document.querySelector('.crop-menu')

          this.simulationButton = document.querySelector('.simulation-button')
          this.simulationButton.disabled = true

          this.budgetTag = document.querySelector('.budget')
          this.soundControl = document.querySelector('.sound-control')
          this.timeTag = document.querySelector('.time')

          this.results = document.querySelector('.results')
          this.resultsText = document.querySelector('.results-text')
          this.resultsOK = document.getElementById('results-ok')

          // Method to run the simulation
          this.simulationButton.onclick = () => {
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

          // INTRODUCTION MENU
          this.introductionMenu = document.querySelector('.introduction-menu')
          this.introductionMenuText = document.getElementById('introduction-menu-text')
          this.introductionMenuButton = document.getElementById('introduction-menu-button')

          let currentNumberOfParagraphs = 1
          this.introductionMenuButton.onclick = () => {
               currentNumberOfParagraphs++
               if (currentNumberOfParagraphs == 2) {
                    this.introductionMenuText.style.fontSize = "25px"
                    this.introductionMenuText.style.position = "absolute"
                    this.introductionMenuText.style.top = "15%"
                    this.introductionMenuText.style.left = "8%"
                    this.introductionMenuText.innerHTML = "The game is designed in a way, so that stakeholders can consider alternative methods for resolving their town's water management issues, referring to the satisfactory coverage of:<br /><br />1) irrigation demands and 2) non-potable household uses."
               }
               else if (currentNumberOfParagraphs == 3) {
                    this.introductionMenuText.style.fontSize = "25px"
                    this.introductionMenuText.style.position = "absolute"
                    this.introductionMenuText.style.top = "3%"
                    this.introductionMenuText.style.left = "5%"
                    this.introductionMenuText.innerHTML = "These methods take advantage of the aquifer (i.e., it fills with water during the winter and provides water to the town in the summer).<br />The water falling to the houses' roofs (Roofs Area) and the town's paving (Residential Yards Area) is collected and exploited. The somewhat 'cleaner' roofs water is primarily used for household uses (it is stored in the Roofs Tank) and the probable overflows head to Tank 2, where they meet the water collected from the paving."
               }
               else if (currentNumberOfParagraphs == 4) {
                    this.introductionMenuText.style.fontSize = "25px"
                    this.introductionMenuText.style.position = "absolute"
                    this.introductionMenuText.style.top = "3%"
                    this.introductionMenuText.style.left = "5%"
                    this.introductionMenuText.innerHTML = "The Tank 2 water is exclusively used for irrigation coverage. The player can decide to send water from Tank 2 to the aquifer to prevent probable overflows in the future, by specifying the Tank 2 Minimum Volume Percentage (minimum water remaining in Tank 2 and not heading to the aquifer)."
               }
               else if (currentNumberOfParagraphs == 5) {
                    this.introductionMenuText.style.fontSize = "25px"
                    this.introductionMenuText.style.position = "absolute"
                    this.introductionMenuText.style.top = "8%"
                    this.introductionMenuText.style.left = "5%"
                    this.introductionMenuText.innerHTML = "There is additional water being collected from the crops (Stormwater Area), by taking advantage of a Bioswale System. This water is saved in the Open Tank and is also used for irrigation coverage. The probable overflows head to the aquifer. The aquifer sends water back to Tank 2, to support the irrigation coverage, by specifying the Subsurface Tank Maximum Volume Percentage (threshold above which the water is sent to Tank 2)."
               }
               else if (currentNumberOfParagraphs == 6) {
                    this.introductionMenuText.style.fontSize = "25px"
                    this.introductionMenuText.style.position = "absolute"
                    this.introductionMenuText.style.top = "5%"
                    this.introductionMenuText.style.left = "5%"
                    this.introductionMenuText.innerHTML = "Goal of the game is finding an adequate system design, that fulfils the corresponding irrigation and non-potable household demands, within the given budget and time.<br /><br />There are 3 Difficulty Levels, which configure multiple game settings (i.e., rainfall, irrigation demand, town population, available budget and time)."
               }
               else if (currentNumberOfParagraphs == 7) {
                    this.introductionMenuText.style.fontSize = "25px"
                    this.introductionMenuText.style.position = "absolute"
                    this.introductionMenuText.style.top = "5%"
                    this.introductionMenuText.style.left = "5%"
                    this.introductionMenuText.innerHTML = "Use your right mouse click to move and left click to open the 3 hidden town menus.<br /><br /><br />The menus can open only when the player approaches the corresponding city components.<br /><br /><br />&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspGood Luck!"
               }
               else if (currentNumberOfParagraphs == 8) {
                    this.introductionMenu.classList.remove('visible')
                    this.gameDifficulty.classList.add('visible')
               }
          }

          // GAME DIFFICUTLY
          this.difficultyChosen = false
          this.gameDifficulty = document.querySelector('.game-difficulty')
          this.easyDifficulty = document.getElementById('easy-button')
          this.mediumDifficulty = document.getElementById('medium-button')
          this.hardDifficulty = document.getElementById('hard-button')

          this.easyDifficulty.onclick = () => {
               this.gameDifficulty.classList.remove('visible')
               // The 4 game settings that depend on the game's difficulty
               this.population = 5000 // higher the difficulty higher the population (to increase household demand)
               this.remainingBudget = 100000 // higher the difficulty lower the budget
               this.remainingTime = 600 // available time in seconds
               this.rainfallMultiplyIndex = 1 + Math.random() // higher the difficulty lower the index (to reduce total rainfall)
               this.irrigationMultiplyIndex = 0.5 + Math.random() * 0.5 // higher the difficulty higher the index (to increase total irrigation demand)
               this.rainfallTimeseries = this.rainfallTimeseries.map((num) => {return num * this.rainfallMultiplyIndex})
               this.irrigationTimeseries = this.irrigationTimeseries.map((num) => {return num * this.irrigationMultiplyIndex})

               // each person is considered to need 5L/day, emerging from rainwater harvesting (this water is collected via the houses roofs areas and the corresponding Roofs Tank), for non-potable domestic uses (e.g. shower, laundry, washing machine)
               this.totalNonPotableHouseholdDemand = this.population * 0.005 // in m3/day
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
               this.gameDifficulty.classList.remove('visible')
               // The 4 game settings that depend on the game's difficulty
               this.population = 7500 // higher the difficulty higher the population (to increase household demand)
               this.remainingBudget = 80000 // higher the difficulty lower the budget
               this.remainingTime = 300 // available time in seconds
               this.rainfallMultiplyIndex = 0.8 + Math.random() * 0.4 // higher the difficulty lower the index (to reduce total rainfall)
               this.irrigationMultiplyIndex = 0.8 + Math.random() * 0.4 // higher the difficulty higher the index (to increase total irrigation demand)
               this.rainfallTimeseries = this.rainfallTimeseries.map((num) => {return num * this.rainfallMultiplyIndex})
               this.irrigationTimeseries = this.irrigationTimeseries.map((num) => {return num * this.irrigationMultiplyIndex})

               // each person is considered to need 5L/day, emerging from rainwater harvesting (this water is collected via the houses roofs areas and the corresponding Roofs Tank), for non-potable domestic uses (e.g. shower, laundry, washing machine)
               this.totalNonPotableHouseholdDemand = this.population * 0.005 // in m3/day
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
               this.gameDifficulty.classList.remove('visible')
               // The 4 game settings that depend on the game's difficulty
               this.population = 10000 // higher the difficulty higher the population (to increase household demand)
               this.remainingBudget = 70000 // higher the difficulty lower the budget
               this.remainingTime = 180 // available time in seconds
               this.rainfallMultiplyIndex = 0.7 + Math.random() * 0.3 // higher the difficulty lower the index (to reduce total rainfall)
               this.irrigationMultiplyIndex = 1 + Math.random() * 0.3 // higher the difficulty higher the index (to increase total irrigation demand)
               this.rainfallTimeseries = this.rainfallTimeseries.map((num) => {return num * this.rainfallMultiplyIndex})
               this.irrigationTimeseries = this.irrigationTimeseries.map((num) => {return num * this.irrigationMultiplyIndex})

               // each person is considered to need 5L/day, emerging from rainwater harvesting (this water is collected via the houses roofs areas and the corresponding Roofs Tank), for non-potable domestic uses (e.g. shower, laundry, washing machine)
               this.totalNonPotableHouseholdDemand = this.population * 0.005 // in m3/day
               this.difficultyChosen = true
               // this method takes care of everything refering to the left or right mouse click

               window.addEventListener("mousedown", this.handleCharacterAnimationAndMenus)

               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
               this.budgetTag.classList.add('visible')

               this.timeTag.innerHTML = `Remaining Time: ${this.toHHMMSS(this.remainingTime)}`;
               this.timeTag.classList.add('visible')

               this.runSimulation()
          }

          // First lets take care of our sound slider
          const soundTag = document.getElementById('sound-mixer')
          soundTag.onchange = () => {
               let vol = parseFloat(soundTag.value)
               this.sound.setVolume(vol)
               this.sound2.setVolume(vol)
          }

          // Get control of all input tags

          const roofsTag = document.getElementById('roofs')
          const roofsValue = document.getElementById('roofsValue')
          const roofsArray = this.range(100000, 350000, 10000)
          roofsTag.value = roofsArray[Math.floor(Math.random() * roofsArray.length)]
          let previousRoofsValue = parseFloat(roofsTag.value)
          let differenceRoofsValue = 0
          this.roofsArea = parseFloat(roofsTag.value)
          roofsValue.innerHTML = this.roofsArea

          this.roofsAreaUnitCost = 0.05 // in Euros/m2 - needs calibration
          roofsTag.onchange = () => {
               this.roofsArea = parseFloat(roofsTag.value)
               roofsValue.innerHTML = this.roofsArea
               differenceRoofsValue = this.roofsArea - previousRoofsValue
               previousRoofsValue = this.roofsArea
               this.remainingBudget -= differenceRoofsValue * this.roofsAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const roofsCoeffTag = document.getElementById('roofsCoeff')
          const roofsCoeffValue = document.getElementById('roofsCoeffValue')
          const roofsCoeffArray = this.range(0.4, 0.7, 0.05)
          roofsCoeffTag.value = roofsCoeffArray[Math.floor(Math.random() * roofsCoeffArray.length)]

          let previousRoofsCoeffValue = parseFloat(roofsCoeffTag.value)
          let differenceRoofsCoeffValue = 0
          this.roofsCoeff = parseFloat(roofsCoeffTag.value)
          roofsCoeffValue.innerHTML = this.roofsCoeff

          this.roofsCoeffUnitCost = 13000 // in Euros/m2 - needs calibration
          roofsCoeffTag.onchange = () => {
               this.roofsCoeff = parseFloat(roofsCoeffTag.value)
               roofsCoeffValue.innerHTML = this.roofsCoeff
               differenceRoofsCoeffValue = this.roofsCoeff - previousRoofsCoeffValue
               previousRoofsCoeffValue = this.roofsCoeff
               this.remainingBudget -= differenceRoofsCoeffValue * this.roofsCoeffUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const yardsTag = document.getElementById('yards')
          const yardsValue = document.getElementById('yardsValue')
          const yardsArray = this.range(10000, 60000, 5000)
          yardsTag.value = yardsArray[Math.floor(Math.random() * yardsArray.length)]

          let previousYardsValue = parseFloat(yardsTag.value)
          let differenceYardsValue = 0
          this.yardsArea = parseFloat(yardsTag.value)
          yardsValue.innerHTML = this.yardsArea

          this.yardsAreaUnitCost = 0.2 // in Euros/m2 - needs calibration
          yardsTag.onchange = () => {
               this.yardsArea = parseFloat(yardsTag.value)
               yardsValue.innerHTML = this.yardsArea
               differenceYardsValue = this.yardsArea - previousYardsValue
               previousYardsValue = this.yardsArea
               this.remainingBudget -= differenceYardsValue * this.yardsAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const yardsCoeffTag = document.getElementById('yardsCoeff')
          const yardsCoeffValue = document.getElementById('yardsCoeffValue')
          const yardsCoeffArray = this.range(0.4, 0.7, 0.05)
          yardsCoeffTag.value = yardsCoeffArray[Math.floor(Math.random() * yardsCoeffArray.length)]

          let previousYardsCoeffValue = parseFloat(yardsCoeffTag.value)
          let differenceYardsCoeffValue = 0
          this.yardsCoeff = parseFloat(yardsCoeffTag.value)
          yardsCoeffValue.innerHTML = this.yardsCoeff

          this.yardsCoeffUnitCost = 13000 // in Euros/m2 - needs calibration
          yardsCoeffTag.onchange = () => {
               this.yardsCoeff = parseFloat(yardsCoeffTag.value)
               yardsCoeffValue.innerHTML = this.yardsCoeff
               differenceYardsCoeffValue = this.yardsCoeff - previousYardsCoeffValue
               previousYardsCoeffValue = this.yardsCoeff
               this.remainingBudget -= differenceYardsCoeffValue * this.yardsCoeffUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const openTankAreaTag = document.getElementById('openTankArea')
          const openTankAreaValue = document.getElementById('openTankAreaValue')
          const openTankArray = this.range(10, 30, 1)
          openTankAreaTag.value = openTankArray[Math.floor(Math.random() * openTankArray.length)]

          let previousOpenTankValue = parseFloat(openTankAreaTag.value)
          let differenceOpenTankValue = 0
          this.openTankArea = parseFloat(openTankAreaTag.value)
          openTankAreaValue.innerHTML = this.openTankArea

          this.openTankAreaUnitCost = 350 // in Euros/m2 - needs calibration
          openTankAreaTag.onchange = () => {
               this.openTankArea = parseFloat(openTankAreaTag.value)
               openTankAreaValue.innerHTML = this.openTankArea
               differenceOpenTankValue = this.openTankArea - previousOpenTankValue
               previousOpenTankValue = this.openTankArea
               this.remainingBudget -= differenceOpenTankValue * this.openTankAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const openTankSpillTag = document.getElementById('openTankSpill')
          const openTankSpillValue = document.getElementById('openTankSpillValue')
          const openTankSpillArray = this.range(2, 4, 0.1)
          openTankSpillTag.value = openTankSpillArray[Math.floor(Math.random() * openTankSpillArray.length)]

          let previousOpenTankSpillValue = parseFloat(openTankSpillTag.value)
          let differenceOpenTankSpillValue = 0
          this.openTankSpill = parseFloat(openTankSpillTag.value)
          openTankSpillValue.innerHTML = this.openTankSpill

          this.openTankSpillUnitCost = 1500 // in Euros/m2 - needs calibration
          openTankSpillTag.onchange = () => {
               this.openTankSpill = parseFloat(openTankSpillTag.value)
               openTankSpillValue.innerHTML = this.openTankSpill
               differenceOpenTankSpillValue = this.openTankSpill - previousOpenTankSpillValue
               previousOpenTankSpillValue = this.openTankSpill
               this.remainingBudget -= differenceOpenTankSpillValue * this.openTankSpillUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const roofsTankAreaTag = document.getElementById('roofsTankArea')
          const roofsTankAreaValue = document.getElementById('roofsTankAreaValue')
          const roofsTankArray = this.range(10, 60, 1)
          roofsTankAreaTag.value = roofsTankArray[Math.floor(Math.random() * roofsTankArray.length)]

          let previousRoofsTankValue = parseFloat(roofsTankAreaTag.value)
          let differenceRoofsTankValue = 0
          this.roofsTankArea = parseFloat(roofsTankAreaTag.value)
          roofsTankAreaValue.innerHTML = this.roofsTankArea

          this.roofsTankAreaUnitCost = 250 // in Euros/m2 - needs calibration
          roofsTankAreaTag.onchange = () => {
               this.roofsTankArea = parseFloat(roofsTankAreaTag.value)
               roofsTankAreaValue.innerHTML = this.roofsTankArea
               differenceRoofsTankValue = this.roofsTankArea - previousRoofsTankValue
               previousRoofsTankValue = this.roofsTankArea
               this.remainingBudget -= differenceRoofsTankValue * this.roofsTankAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const roofsTankSpillTag = document.getElementById('roofsTankSpill')
          const roofsTankSpillValue = document.getElementById('roofsTankSpillValue')
          const roofsTankSpillArray = this.range(4, 6.5, 0.2)
          roofsTankSpillTag.value = roofsTankSpillArray[Math.floor(Math.random() * roofsTankSpillArray.length)]

          let previousRoofsTankSpillValue = parseFloat(roofsTankSpillTag.value)
          let differenceRoofsTankSpillValue = 0
          this.roofsTankSpill = parseFloat(roofsTankSpillTag.value)
          roofsTankSpillValue.innerHTML = this.roofsTankSpill

          this.roofsTankSpillUnitCost = 800 // in Euros/m2 - needs calibration
          roofsTankSpillTag.onchange = () => {
               this.roofsTankSpill = parseFloat(roofsTankSpillTag.value)
               roofsTankSpillValue.innerHTML = this.roofsTankSpill
               differenceRoofsTankSpillValue = this.roofsTankSpill - previousRoofsTankSpillValue
               previousRoofsTankSpillValue = this.roofsTankSpill
               this.remainingBudget -= differenceRoofsTankSpillValue * this.roofsTankSpillUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const tank2AreaTag = document.getElementById('tank2Area')
          const tank2AreaValue = document.getElementById('tank2AreaValue')
          const tank2Array = this.range(10, 30, 1)
          tank2AreaTag.value = tank2Array[Math.floor(Math.random() * tank2Array.length)]

          let previousTank2Value = parseFloat(tank2AreaTag.value)
          let differenceTank2Value = 0
          this.tank2Area = parseFloat(tank2AreaTag.value)
          tank2AreaValue.innerHTML = this.tank2Area

          this.tank2AreaUnitCost = 330 // in Euros/m2 - needs calibration
          tank2AreaTag.onchange = () => {
               this.tank2Area = parseFloat(tank2AreaTag.value)
               tank2AreaValue.innerHTML = this.tank2Area
               differenceTank2Value = this.tank2Area - previousTank2Value
               previousTank2Value = this.tank2Area
               this.remainingBudget -= differenceTank2Value * this.tank2AreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const tank2SpillTag = document.getElementById('tank2Spill')
          const tank2SpillValue = document.getElementById('tank2SpillValue')
          const tank2SpillArray = this.range(2, 4, 0.1)
          tank2SpillTag.value = tank2SpillArray[Math.floor(Math.random() * tank2SpillArray.length)]

          let previousTank2SpillValue = parseFloat(tank2SpillTag.value)
          let differenceTank2SpillValue = 0
          this.tank2Spill = parseFloat(tank2SpillTag.value)
          tank2SpillValue.innerHTML = this.tank2Spill

          this.tank2SpillUnitCost = 1200 // in Euros/m2 - needs calibration
          tank2SpillTag.onchange = () => {
               this.tank2Spill = parseFloat(tank2SpillTag.value)
               tank2SpillValue.innerHTML = this.tank2Spill
               differenceTank2SpillValue = this.tank2Spill - previousTank2SpillValue
               previousTank2SpillValue = this.tank2Spill
               this.remainingBudget -= differenceTank2SpillValue * this.tank2SpillUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const subsurfaceTankAreaTag = document.getElementById('subsurfaceTankArea')
          const subsurfaceTankAreaValue = document.getElementById('subsurfaceTankAreaValue')
          const subsurfaceTankArray = this.range(100, 280, 10)
          subsurfaceTankAreaTag.value = subsurfaceTankArray[Math.floor(Math.random() * subsurfaceTankArray.length)]

          let previousSubsurfaceTankValue = parseFloat(subsurfaceTankAreaTag.value)
          let differenceSubsurfaceTankValue = 0
          this.subsurfaceTankArea = parseFloat(subsurfaceTankAreaTag.value)
          subsurfaceTankAreaValue.innerHTML = this.subsurfaceTankArea

          this.subsurfaceTankAreaUnitCost = 65 // in Euros/m2 - needs calibration
          subsurfaceTankAreaTag.onchange = () => {
               this.subsurfaceTankArea = parseFloat(subsurfaceTankAreaTag.value)
               subsurfaceTankAreaValue.innerHTML = this.subsurfaceTankArea
               differenceSubsurfaceTankValue = this.subsurfaceTankArea - previousSubsurfaceTankValue
               previousSubsurfaceTankValue = this.subsurfaceTankArea
               this.remainingBudget -= differenceSubsurfaceTankValue * this.subsurfaceTankAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const subsurfaceTankSpillTag = document.getElementById('subsurfaceTankSpill')
          const subsurfaceTankSpillValue = document.getElementById('subsurfaceTankSpillValue')
          const subsurfaceTankSpillArray = this.range(5, 12, 0.5)
          subsurfaceTankSpillTag.value = subsurfaceTankSpillArray[Math.floor(Math.random() * subsurfaceTankSpillArray.length)]

          let previousSubsurfaceTankSpillValue = parseFloat(subsurfaceTankSpillTag.value)
          let differenceSubsurfaceTankSpillValue = 0
          this.subsurfaceTankSpill = parseFloat(subsurfaceTankSpillTag.value)
          subsurfaceTankSpillValue.innerHTML = this.subsurfaceTankSpill

          this.subsurfaceTankSpillUnitCost = 600 // in Euros/m2 - needs calibration
          subsurfaceTankSpillTag.onchange = () => {
               this.subsurfaceTankSpill = parseFloat(subsurfaceTankSpillTag.value)
               subsurfaceTankSpillValue.innerHTML = this.subsurfaceTankSpill
               differenceSubsurfaceTankSpillValue = this.subsurfaceTankSpill - previousSubsurfaceTankSpillValue
               previousSubsurfaceTankSpillValue = this.subsurfaceTankSpill
               this.remainingBudget -= differenceSubsurfaceTankSpillValue * this.subsurfaceTankSpillUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const tank2MinVolPercentageTag = document.getElementById('tank2MinVolPercentage')
          const tank2MinVolPercentageValue = document.getElementById('tank2MinVolPercentageValue')
          const tank2VolArray = this.range(0.05, 0.35, 0.01)
          tank2MinVolPercentageTag.value = tank2VolArray[Math.floor(Math.random() * tank2VolArray.length)]

          let previousTank2MinVolPerValue = parseFloat(tank2MinVolPercentageTag.value)
          let differenceTank2MinVolPerValue = 0
          this.tank2MinVolPercentage = parseFloat(tank2MinVolPercentageTag.value) // we don't ever want to let the water level of Tank2 go BELOW 20%
          tank2MinVolPercentageValue.innerHTML = this.tank2MinVolPercentage

          this.tank2MinVolPercentageUnitCost = 0 // this is parametrical, no cost needed
          tank2MinVolPercentageTag.onchange = () => {
               this.tank2MinVolPercentage = parseFloat(tank2MinVolPercentageTag.value)
               tank2MinVolPercentageValue.innerHTML = this.tank2MinVolPercentage
               differenceTank2MinVolPerValue = this.tank2MinVolPercentage - previousTank2MinVolPerValue
               previousTank2MinVolPerValue = this.tank2MinVolPercentage
               this.remainingBudget -= differenceTank2MinVolPerValue * this.tank2MinVolPercentageUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const subsurfaceTankMaxVolPercentageTag = document.getElementById('subsurfaceTankMaxVolPercentage')
          const subsurfaceTankMaxVolPercentageValue = document.getElementById('subsurfaceTankMaxVolPercentageValue')
          const subsurfaceTankVolArray = this.range(0.5, 0.9, 0.01)
          subsurfaceTankMaxVolPercentageTag.value = subsurfaceTankVolArray[Math.floor(Math.random() * subsurfaceTankVolArray.length)]

          let previousSubsurfaceTankMaxVolPerValue = parseFloat(subsurfaceTankMaxVolPercentageTag.value)
          let differenceSubsurfaceTankMaxVolPerValue = 0
          this.subsurfaceTankMaxVolPercentage = parseFloat(subsurfaceTankMaxVolPercentageTag.value) // we don't ever want to let the water level of SubsurfaceTank go ABOVE 80%
          subsurfaceTankMaxVolPercentageValue.innerHTML = this.subsurfaceTankMaxVolPercentage

          this.subsurfaceTankMaxVolPercentageUnitCost = 0 // this is parametrical, no cost needed
          subsurfaceTankMaxVolPercentageTag.onchange = () => {
               this.subsurfaceTankMaxVolPercentage = parseFloat(subsurfaceTankMaxVolPercentageTag.value)
               subsurfaceTankMaxVolPercentageValue.innerHTML = this.subsurfaceTankMaxVolPercentage
               differenceSubsurfaceTankMaxVolPerValue = this.subsurfaceTankMaxVolPercentage - previousSubsurfaceTankMaxVolPerValue
               previousSubsurfaceTankMaxVolPerValue = this.subsurfaceTankMaxVolPercentage
               this.remainingBudget -= differenceSubsurfaceTankMaxVolPerValue * this.subsurfaceTankMaxVolPercentageUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const stormwaterAreaTag = document.getElementById('stormwaterArea')
          const stormwaterAreaValue = document.getElementById('stormwaterAreaValue')
          const stormwaterAreaArray = this.range(100000, 600000, 20000)
          stormwaterAreaTag.value = stormwaterAreaArray[Math.floor(Math.random() * stormwaterAreaArray.length)]

          let previousStormwaterValue = parseFloat(stormwaterAreaTag.value)
          let differenceStormwaterValue = 0
          this.stormwaterArea = parseFloat(stormwaterAreaTag.value)
          stormwaterAreaValue.innerHTML = this.stormwaterArea

          this.stormwaterAreaUnitCost = 0.023 // in Euros/m2 - needs calibration
          stormwaterAreaTag.onchange = () => {
               this.stormwaterArea = parseFloat(stormwaterAreaTag.value)
               stormwaterAreaValue.innerHTML = this.stormwaterArea
               differenceStormwaterValue = this.stormwaterArea - previousStormwaterValue
               previousStormwaterValue = this.stormwaterArea
               this.remainingBudget -= differenceStormwaterValue * this.stormwaterAreaUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const stormwaterCoeffTag = document.getElementById('stormwaterCoeff')
          const stormwaterCoeffValue = document.getElementById('stormwaterCoeffValue')
          const stormwaterCoeffArray = this.range(0.4, 0.7, 0.05)
          stormwaterCoeffTag.value = stormwaterCoeffArray[Math.floor(Math.random() * stormwaterCoeffArray.length)]

          let previousStormwaterCoeffValue = parseFloat(stormwaterCoeffTag.value)
          let differenceStormwaterCoeffValue = 0
          this.stormwaterCoeff = parseFloat(stormwaterCoeffTag.value)
          stormwaterCoeffValue.innerHTML = this.stormwaterCoeff

          this.stormwaterCoeffUnitCost = 13000 // in Euros/m2 - needs calibration
          stormwaterCoeffTag.onchange = () => {
               this.stormwaterCoeff = parseFloat(stormwaterCoeffTag.value)
               stormwaterCoeffValue.innerHTML = this.stormwaterCoeff
               differenceStormwaterCoeffValue = this.stormwaterCoeff - previousStormwaterCoeffValue
               previousStormwaterCoeffValue = this.stormwaterCoeff
               this.remainingBudget -= differenceStormwaterCoeffValue * this.stormwaterCoeffUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const bioswaleInfiltrationRateTag = document.getElementById('BioswaleInfiltrationRate')
          const bioswaleInfiltrationRateValue = document.getElementById('BioswaleInfiltrationRateValue')
          const infiltrationArray = this.range(0.4, 0.7, 0.05)
          bioswaleInfiltrationRateTag.value = infiltrationArray[Math.floor(Math.random() * infiltrationArray.length)]

          let previousBioswaleInfilValue = parseFloat(bioswaleInfiltrationRateTag.value)
          let differenceBioswaleInfilValue = 0
          this.BioswaleInfiltrationRate = parseFloat(bioswaleInfiltrationRateTag.value)
          bioswaleInfiltrationRateValue.innerHTML = this.BioswaleInfiltrationRate

          this.BioswaleInfiltrationRateUnitCost = 16000 // in Euros/m2 - needs calibration
          bioswaleInfiltrationRateTag.onchange = () => {
               this.BioswaleInfiltrationRate = parseFloat(bioswaleInfiltrationRateTag.value)
               bioswaleInfiltrationRateValue.innerHTML = this.BioswaleInfiltrationRate
               differenceBioswaleInfilValue = this.BioswaleInfiltrationRate - previousBioswaleInfilValue
               previousBioswaleInfilValue = this.BioswaleInfiltrationRate
               this.remainingBudget -= differenceBioswaleInfilValue * this.BioswaleInfiltrationRateUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const bioswaleBTag = document.getElementById('BioswaleB')
          const bioswaleBValue = document.getElementById('BioswaleBValue')
          const bioswaleBArray = this.range(0.2, 1, 0.1)
          bioswaleBTag.value = bioswaleBArray[Math.floor(Math.random() * bioswaleBArray.length)]

          let previousBioswaleBValue = parseFloat(bioswaleBTag.value)
          let differenceBioswaleBValue = 0
          this.BioswaleB = parseFloat(bioswaleBTag.value)
          bioswaleBValue.innerHTML = this.BioswaleB

          this.BioswaleBUnitCost = 3000 // in Euros/m2 - needs calibration
          bioswaleBTag.onchange = () => {
               this.BioswaleB = parseFloat(bioswaleBTag.value)
               bioswaleBValue.innerHTML = this.BioswaleB
               differenceBioswaleBValue = this.BioswaleB - previousBioswaleBValue
               previousBioswaleBValue = this.BioswaleB
               this.remainingBudget -= differenceBioswaleBValue * this.BioswaleBUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const bioswaleZTag = document.getElementById('BioswaleZ')
          const bioswaleZValue = document.getElementById('BioswaleZValue')
          const bioswaleZArray = this.range(0.5, 1.5, 0.1)
          bioswaleZTag.value = bioswaleZArray[Math.floor(Math.random() * bioswaleZArray.length)]

          let previousBioswaleZValue = parseFloat(bioswaleZTag.value)
          let differenceBioswaleZValue = 0
          this.BioswaleZ = parseFloat(bioswaleZTag.value)
          bioswaleZValue.innerHTML = this.BioswaleZ

          this.BioswaleZUnitCost = 4300 // in Euros/m2 - needs calibration
          bioswaleZTag.onchange = () => {
               this.BioswaleZ = parseFloat(bioswaleZTag.value)
               bioswaleZValue.innerHTML = this.BioswaleZ
               differenceBioswaleZValue = this.BioswaleZ - previousBioswaleZValue
               previousBioswaleZValue = this.BioswaleZ
               this.remainingBudget -= differenceBioswaleZValue * this.BioswaleZUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const bioswaleJTag = document.getElementById('BioswaleJ')
          const bioswaleJValue = document.getElementById('BioswaleJValue')
          const bioswaleJArray = this.range(0.01, 0.06, 0.01)
          bioswaleJTag.value = bioswaleJArray[Math.floor(Math.random() * bioswaleJArray.length)]

          let previousBioswaleJValue = parseFloat(bioswaleJTag.value)
          let differenceBioswaleJValue = 0
          this.BioswaleJ = parseFloat(bioswaleJTag.value)
          bioswaleJValue.innerHTML = this.BioswaleJ

          this.BioswaleJUnitCost = 27000 // in Euros/m2 - needs calibration
          bioswaleJTag.onchange = () => {
               this.BioswaleJ = parseFloat(bioswaleJTag.value)
               bioswaleJValue.innerHTML = this.BioswaleJ
               differenceBioswaleJValue = this.BioswaleJ - previousBioswaleJValue
               previousBioswaleJValue = this.BioswaleJ
               this.remainingBudget -= differenceBioswaleJValue * this.BioswaleJUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const bioswaleNTag = document.getElementById('BioswaleN')
          const bioswaleNValue = document.getElementById('BioswaleNValue')
          const bioswaleNArray = this.range(0.01, 0.05, 0.005)
          bioswaleNTag.value = bioswaleNArray[Math.floor(Math.random() * bioswaleNArray.length)]

          let previousBioswaleNValue = parseFloat(bioswaleNTag.value)
          let differenceBioswaleNValue = 0
          this.BioswaleN = parseFloat(bioswaleNTag.value)
          bioswaleNValue.innerHTML = this.BioswaleN

          this.BioswaleNUnitCost = 110000 // in Euros/m2 - needs calibration
          bioswaleNTag.onchange = () => {
               this.BioswaleN = parseFloat(bioswaleNTag.value)
               bioswaleNValue.innerHTML = this.BioswaleN
               differenceBioswaleNValue = this.BioswaleN - previousBioswaleNValue
               previousBioswaleNValue = this.BioswaleN
               this.remainingBudget += differenceBioswaleNValue * this.BioswaleNUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
          }

          const bioswaleYoTag = document.getElementById('BioswaleYo')
          const bioswaleYoValue = document.getElementById('BioswaleYoValue')
          const bioswaleYoArray = this.range(0.3, 0.7, 0.05)
          bioswaleYoTag.value = bioswaleYoArray[Math.floor(Math.random() * bioswaleYoArray.length)]

          let previousBioswaleYoValue = parseFloat(bioswaleYoTag.value)
          let differenceBioswaleYoValue = 0
          this.BioswaleYo = parseFloat(bioswaleYoTag.value)
          bioswaleYoValue.innerHTML = this.BioswaleYo

          this.BioswaleYoUnitCost = 6000 // in Euros/m2 - needs calibration
          bioswaleYoTag.onchange = () => {
               this.BioswaleYo = parseFloat(bioswaleYoTag.value)
               bioswaleYoValue.innerHTML = this.BioswaleYo
               differenceBioswaleYoValue = this.BioswaleYo - previousBioswaleYoValue
               previousBioswaleYoValue = this.BioswaleYo
               this.remainingBudget -= differenceBioswaleYoValue * this.BioswaleYoUnitCost
               this.budgetTag.innerHTML = `Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC`;
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

          this.cameraOffsetX = 9
          this.cameraOffsetY = 5
          this.cameraOffsetZ = 8


          this.camera.position.set(0, this.cameraOffsetY, this.cameraOffsetZ)
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
          // this.renderer.setClearColor("#262837") // ετσι αλλαζει το background χρωμα


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
                              this.loadingBar.style.transform = `scaleX(0)`
                              this.simulationButton.classList.add('visible')
                              this.playButton.classList.remove('visible')
                              this.introductionMenu.classList.add('visible')
                              // this.gameDifficulty.classList.add('visible')
                              this.soundControl.classList.add('visible')

                              // this.irrigationTimeseries = Array.from({length: 100}, () => 0.5 + Math.random() * 3)
                              this.irrigationTimeseries = Array.from({length: 100}, () => 25 + Math.random() * 20)

                              this.rainfallTimeseries = [0.60, 2.70, 21.30, 0.00, 4.20, 12.90, 0.90, 0.00, 1.50,
                              0.30, 8.40, 5.70, 1.50, 11.70, 0.60, 6.60, 0.90, 0.60, 0.00, 0.60, 0.00, 0.00, 0.00, 0.00,
                              0.00, 0.00, 0.00, 3.30, 3.30, 3.60, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10.80,
                              7.80, 9.90, 17.10, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 1.50, 0.90, 5.10, 2.10,
                              0.00, 0.00, 0.00, 0.30, 30.60, 17.40, 0.00, 0.00, 21.60, 14.70, 0.00, 0.00, 0.00, 0.00, 2.40,
                              0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.30, 0.00, 0.00, 0.00, 0.00, 0.00,
                              0.00, 0.00, 0.00, 0.00, 0.00, 3.00, 0.00, 1.80, 0.30, 3.30, 0.00, 0.00, 0.00, 2.70, 0.30, 0.00]
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
          const background_choices = ["/static/models/chill.mp3", "/static/models/acoustic1.mp3", "/static/models/acoustic2.mp3"]
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
               this.sound3.setVolume(0.5)
          })

          this.audioLoader.load("/static/models/lose.mp3",
          (buffer) => {
               this.sound4.setBuffer(buffer)
               this.sound4.setLoop(false)
               this.sound4.setVolume(0.5)
          })

          // Lets write some 3D TEXT 'Hydrousa' in the first scene/camera while the page is loading
          this.fontLoader = new FontLoader(this.loadingManager)
          this.textLoaded = false
          this.fontLoader.load("/static/models/fonts/helvetiker_regular.typeface.json", (font) => {
               const secondTextureLoader = new THREE.TextureLoader()
               const matcapTexture = secondTextureLoader.load("/static/models/matcaps/10.png")
               this.textGeometry = new TextGeometry('Hydrousa', {
                    font: font,
                    size: 0.8,
                    height: 0.4,
                    curveSegments: 6,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 4
               })
               this.textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
               this.text = new THREE.Mesh(this.textGeometry, this.textMaterial)

               this.text.position.set(-5, 1.2, 0)
               this.text.scale.set(0.5, 0.5, 0.5)
               this.loadingScene.add(this.text)
               this.textLoaded = true
          })

          // Create an AnimationMixer property
          this.characterMixer = null

          // A boolean property controlling whether the player is currently moving or not
          this.movementState = false
          this.rotationState = false

          // Character movement speed
          this.movementSpeed = 0.6

          // Property to handle character body rotation when he is moving
          this.currentCharacterAngle = 0

          // Create a Raycaster property to handle character animation and more
          this.raycaster = new THREE.Raycaster()

          // Create a mouse property to emulate the mouse
          this.mouse = new THREE.Vector2()

          this.handleWindowResizing()

          this.handleFullScreen()

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
               this.waterTowerMaxDistance = 30
               this.crop = this.simulationTown.children.find((child) => {return child.name === "old-grass-houses"})
               this.cropMaxDistance = 50
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
          this.rainDropsCount = 20000 // maybe this will need some reducing in the future to reduce the computational burden
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
          const _this = this.game // here 'this' refers to the window object (because the method gets triggered from an addEventListener) so I change it manually to refer to the Game object
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
               this.rotationState = false
          }


          // Update camera position
          if (finalPosX != currentPosX) {
               const angle = Math.atan(Math.abs((finalPosZ - currentPosZ)) / Math.abs((finalPosX - currentPosX)))
          }
          if (finalPosX > currentPosX && finalPosZ > currentPosZ) { // 0 < φ < π/2
                    this.camera.position.x = this.gltfCharacter.scene.position.x - this.cameraOffsetX / 2
                    this.camera.position.z = this.gltfCharacter.scene.position.z - this.cameraOffsetZ / 2
               }
          else if (finalPosX > currentPosX && finalPosZ < currentPosZ) { // π/2 < φ < π
                    this.camera.position.x = this.gltfCharacter.scene.position.x
                    this.camera.position.z = this.gltfCharacter.scene.position.z + this.cameraOffsetZ
          }
          else if (finalPosX < currentPosX && finalPosZ < currentPosZ) { // π < φ < 3π/2
               this.camera.position.x = this.gltfCharacter.scene.position.x
               this.camera.position.z = this.gltfCharacter.scene.position.z + this.cameraOffsetZ
          }
          else if (finalPosX < currentPosX && finalPosZ > currentPosZ) { // 3π2 < φ < 2π
               this.camera.position.x = this.gltfCharacter.scene.position.x - this.cameraOffsetX / 2
               this.camera.position.z = this.gltfCharacter.scene.position.z - this.cameraOffsetZ * 1.1
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

          // First let's make sure all other menus are closed
          this.cityMenu.classList.remove('visible')
          this.waterTowerMenu.classList.remove('visible')
          this.cropMenu.classList.remove('visible')

          this.openTankMaxVol = this.openTankArea * this.openTankSpill
          this.roofsTankMaxVol = this.roofsTankArea * this.roofsTankSpill
          this.tank2MaxVol = this.tank2Area * this.tank2Spill
          this.subsurfaceTankMaxVol = this.subsurfaceTankArea * this.subsurfaceTankSpill

          // to bioswale sistima exei mia stigmiaia paroxeteutikothta (analoga th diametro toy), epomenws
          // pera apo to this.BioswaleQmax poy antistoixei sthn megisth hmerhsia paroxh poy mporei na metaferei
          // iparxei kai o epipleon periorismos tou infiltration, o opoios 8ewroume aplopoiitika oti
          // dhmiourgi kata meso oro apwleies 30% kai epomenws to infiltration_rate einai 70%

          this.BioswaleA = (this.BioswaleB + this.BioswaleZ * this.BioswaleYo) * this.BioswaleYo
          this.BioswaleP = this.BioswaleB + 2 * this.BioswaleYo * Math.sqrt(1 + this.BioswaleZ ** 2)
          this.BioswaleR = this.BioswaleA / this.BioswaleP
          this.BioswaleQmax = (this.BioswaleA * this.BioswaleR ** (2 / 3) * Math.sqrt(this.BioswaleJ / 100)) / this.BioswaleN // in m3/s
          this.BioswaleQmax = this.BioswaleQmax * 3600 * 24 // in m3/day

          // total rainfall in mm
          this.rainfall = this.rainfallTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          // total irrigation demand in mm
          this.irrigation = this.irrigationTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          this.stormwaterTimeseries = this.rainfallTimeseries.map((num) => {return Math.min(num * this.stormwaterCoeff * this.stormwaterArea / 1000, this.BioswaleQmax) * this.BioswaleInfiltrationRate})
          this.yardsTimeseries = this.rainfallTimeseries.map((num) => {return num * this.yardsCoeff * this.yardsArea / 1000})
          this.roofsTimeseries = this.rainfallTimeseries.map((num) => {return num * this.roofsCoeff * this.roofsArea / 1000})

          this.timeseriesLength = this.rainfallTimeseries.length

          this.openTankStorage = new Float32Array(this.timeseriesLength + 1)
          this.openTankStorage.fill(0)

          this.roofsTankStorage = new Float32Array(this.timeseriesLength + 1)
          this.roofsTankStorage.fill(0)

          this.tank2Storage = new Float32Array(this.timeseriesLength + 1)
          this.tank2Storage.fill(0)

          this.subsurfaceTankStorage = new Float32Array(this.timeseriesLength + 1)
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
               // this.subsurfaceTankStorage[i+1] -= this.subsurfaceTankSpillTimeseries[i]
               this.totalOutput += this.irrigationAbstractFromOpenTank[i] + this.householdAbstractFromRoofsTank[i] + this.irrigationAbstractFromTank2[i] + this.tank2SpillTimeseries[i] + this.subsurfaceTankSpillTimeseries[i]
          }

          this.totalStorage = this.openTankStorage[this.openTankStorage.length - 1] + this.roofsTankStorage[this.roofsTankStorage.length - 1] + this.tank2Storage[this.tank2Storage.length - 1] + this.subsurfaceTankStorage[this.subsurfaceTankStorage.length - 1]

          this.equilibriumVerification = this.totalInput - this.totalStorage - this.totalOutput // this should always be equal to 0

          this.totalIrrigationDeficit = this.irrigationDeficitTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          this.totalHouseholdDeficit = this.householdDeficitTimeseries.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0)

          this.results.classList.add('visible')

          if (this.simulationRuns == 1) {
               this.timeCountingStarted = true
               this.previousTimeElapsed = Date.now()
               this.resultsText.innerHTML = `Irrigation Deficit: ${this.totalIrrigationDeficit.toFixed(2)} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Non-Potbale Household Deficit: ${this.totalHouseholdDeficit.toFixed(2)} m<span style="position: relative; bottom: 5px; right: 1px;">3<br>Try to optimize the system!</span>`
               this.resultsOK.onclick = () => {
                    if (this.simulationRuns == 1) {
                         this.simulationButton.disabled = false
                         this.results.classList.remove('visible')
                         this.clicksEnabled = true
                    }
               }
          }
          else {
               this.timeCountingStarted = false
               this.simulationButton.disabled = true
               this.clicksEnabled = false
               this.resultsOK.hidden = true
               // this.sound.setVolume(0.30)
               // this.sound2.setVolume(0.30)
               if (this.totalIrrigationDeficit == 0 && this.totalHouseholdDeficit == 0 && this.remainingBudget >= 0) {
                    this.resultsText.innerHTML = `Congratulations! The irrigation and non-potable household demands are being satisfied!<br>Nice Work!<br><b>Refresh</b> the page to play again!`
                    this.sound3.play()
               }
               else {
                    this.resultsText.innerHTML = `Oops! The demands are not being satisfied!<br>Irrigation Deficit Remaining: ${this.totalIrrigationDeficit.toFixed(2)} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Non-Potable Household Deficit Remaining: ${this.totalHouseholdDeficit.toFixed(2)} m<span style="position: relative; bottom: 5px; right: 1px;">3</span><br>Remaining Budget: ${this.remainingBudget.toFixed(2)} \u20AC<br><b>Refresh</b> the page to try again!`
                    this.sound4.play()
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
          this.previousTime = this.elapsedTime

          if (!this.pageLoaded) {
               if (this.textLoaded) {
                    this.text.position.x += (this.deltaTime / 10) * 12
                    if (this.text.position.x > 4.9) {
                         this.text.position.set(-5.4, 1.2, 0)
                    }
               }
               this.renderer.render(this.loadingScene, this.loadingCamera)
               window.requestAnimationFrame(() => {this.animate()})
          }
          else {
               if (this.timeCountingStarted) {
                    this.differenceTimeElapsed = Date.now() - this.previousTimeElapsed
                    this.previousTimeElapsed = Date.now()
                    this.remainingTime -= this.differenceTimeElapsed / 1000
                    if (this.remainingTime < 30) {
                         this.timeTag.style.color = "#ff0000"
                    }
                    this.timeTag.innerHTML = `Remaining Time: ${this.toHHMMSS(this.remainingTime)}`;
                    if (this.remainingTime <= 0) {
                         this.timeCountingStarted = false
                         this.timeTag.innerHTML = `Remaining Time: 00:00:00 `;
                         this.runSimulation()
                    }
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

               // Update camera lookat() method depending on the character's moving direction
               // this.orbitControls.target.set(this.gltfCharacter.scene.position)
               if (this.characterLookingDirection == "nw") {
                    this.camera.lookAt(this.gltfCharacter.scene.position.x + this.cameraOffsetX, this.gltfCharacter.scene.position.y, this.gltfCharacter.scene.position.z + this.cameraOffsetZ)
               }
               else if (this.characterLookingDirection == "sw") {
                    this.camera.lookAt(this.gltfCharacter.scene.position.x + this.cameraOffsetX, this.gltfCharacter.scene.position.y, this.gltfCharacter.scene.position.z - this.cameraOffsetZ)
               }
               else if (this.characterLookingDirection == "se") {
                    this.camera.lookAt(this.gltfCharacter.scene.position.x - this.cameraOffsetX, this.gltfCharacter.scene.position.y, this.gltfCharacter.scene.position.z - this.cameraOffsetZ)
               }
               else if (this.characterLookingDirection == "ne") {
                    this.camera.lookAt(this.gltfCharacter.scene.position.x - this.cameraOffsetX, this.gltfCharacter.scene.position.y, this.gltfCharacter.scene.position.z + this.cameraOffsetZ)
               }

               // Move the rain
               if (this.rainAdded) {
                    this.rainShowingCounter++;
                    if (this.rainShowingCounter == 10) {
                         this.sound.play()
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

               // Render our scene
               this.renderer.render(this.scene, this.camera)

               // Re-running the animate method on every next frame
               window.requestAnimationFrame(() => {this.animate()})
          }
     }
}

export { Game }
