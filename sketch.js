//#####################################
//Global Variables
var values // <-- Array to sort
var types // <-- Type of each value in the array (to color the bars)
var sliderNumValues // <-- Slider to change the num of values
var sliderSpeed // <-- Slider to change the speed of visualization
var selectSorter // <-- Select to select the sorting algorithm
var buttonNewValues // <-- Button to get new values
var buttonSortValues // <-- Button to sort the values
var numValues // <-- Current length of the array values
var sorter // <-- Get the sorting function that will be executed
//#####################################



//#####################################
//Auxiliar Functions
/*
* Fill the array with random values
*/
function newValues() {
  for(let i = 0;i<values.length;i++){
    values[i] = random(windowHeight*3/4)
  }
}

/*
* Create two arrays with lengths num and fill the values with random values and the types with -1
* @param num - Length of the array
*/
function setValues(num){
  values = new Array(num)
  types = new Array(num).fill(-1)
  newValues()
}

/*
* Set the var sorter to the select sorter
*/
function setNewSorter(){
  if(selectSorter.value() == "BubbleSort"){
    sorter = bubbleSort
  }
}

/*
* Waits a certain amount of time but in a asynchronous way
* @param ms - time in ms to wait
*/
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}
//#####################################



//#####################################
//P5 Standards Function
/*
* Executed 1 time when the program starts
*/
function setup() {
  createCanvas(windowWidth,windowHeight);

  //Slider to change the num of values
  sliderNumValues = createSlider(3,100,20,1)
  sliderNumValues.position(12,windowHeight/8)
  sliderNumValues.style('width', '80px');
  sliderNumValues.size(Math.min(windowWidth/4,250))

  //Slider to change the speed of visualization
  sliderSpeed = createSlider(0,99,75)
  sliderSpeed.position(windowWidth-windowHeight/8-50,windowHeight/8)

  //Select to select the sorting algorithm
  selectSorter = createSelect()
  selectSorter.position(windowWidth/2,windowHeight/9)
  selectSorter.option("BubbleSort")
  selectSorter.selected("BubbleSort")
  selectSorter.changed(setNewSorter)

  //Set the sorter
  setNewSorter()

  //Button to get new values
  buttonNewValues = createButton("New Values")
  buttonNewValues.position(10,10)
  buttonNewValues.mousePressed(newValues)

  //Button to sort the values
  buttonSortValues = createButton("Sort")
  buttonSortValues.position(windowWidth/2,10)
  buttonSortValues.mousePressed(sorter)
  
  //Set the array
  setValues(round(windowWidth/2))
  numValues = round(windowWidth/2)
}

/*
* Executed every frame
*/
function draw() {
  // put drawing code here

  background("#219ebc")
  //Menu de opções
  fill("#fb8500")
  rect(0,0,windowWidth,windowHeight/6)

  //Infos
  //#######################
  //Text of the slider to change num of values
  textSize(20)
  textFont('Arial');
  textStyle(BOLD);
  fill(255);
  text("Num of values",10,windowHeight/9)
  //Text of the slider to change the speed of visualization
  textSize(20)
  textFont('Arial');
  textStyle(BOLD);
  fill(255);
  text("Speed",windowWidth-windowHeight/8-50,windowHeight/9)
  //Display num of values
  textSize(20)
  textFont('Arial');
  textStyle(BOLD);
  fill(255)
  text(numValues,Math.min(windowWidth/4,250)+20,(windowHeight/7)+4)
  //#######################

  //Número de valores
  if(numValues != sliderNumValues.value()){
    setValues(sliderNumValues.value())
    numValues = sliderNumValues.value()
  }


  //Draw the bars
  for(let i = 0;i<windowWidth/2;i++){
    if(types[i] == -1)
      fill("#023047")
    else if(types[i] == 0){
      fill("#8ecae6")
    }
    else if(types[i] == 1){
      fill("#ffb703")
    }
    rect(i*windowWidth/numValues,windowHeight - values[i], windowWidth/numValues,values[i])
  }
 
}

//#####################################



//#####################################
//Auxiliar Sort Algoriths Functions
/*
* Swap 2 values in the values array in a asynchronous way (used by Bubblesort)
* @param index1 - index of first element to be swapped
* @param index2 -index of second element to be swapped
*/
async function swap(index1,index2){
  await sleep(100-sliderSpeed.value())
  let tmp = values[index1]
  values[index1] = values[index2]
  values[index2] = tmp
  types[index1] = -1
  types[index2] = 0
}
//#####################################



//#####################################
//Sort Algorithms
/*
* Asynchronous Bubblesort algorithm
*/
async function bubbleSort(){
  for(let i=0;i<values.length;i++){
    for(let j=0;j<values.length-1-i;j++){
      types[j] = -1
      if(values[j] > values[j+1]){
        types[j] = 0
        await swap(j,j+1)
      }
    }
    types[values.length-1-i] = -1
  }
}
//#####################################
