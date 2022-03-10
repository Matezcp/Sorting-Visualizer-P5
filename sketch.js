//#####################################
//Global Variables
var values // <-- Array to sort
var types // <-- Type of each value in the array (to color the bars)
var sliderNumValues// <-- Slider to change the num of values
var sliderSpeed // <-- Slider to change the speed of visualization
var selectSorter // <-- Select to select the sorting algorithm
var buttonNewValues // <-- Button to get new values
var buttonSortValues // <-- Button to sort the values
var numValues // <-- Current length of the array values
var divNumValues// <-- Div to display the current num of values
var divSpeedText// <-- Div to indicate that sliderSpeed changes the speed
//#####################################



//#####################################
//Auxiliar Functions
/*
* Fill the array with random values
*/
function newValues() {
  for(let i = 0;i<values.length;i++){
    values[i] = random(windowHeight*5/6)
  }
}

/*
* Create two arrays with lengths num and fill the values with random values and the types with -1
* @param num - Length of the array
*/
function setValues(num){
  numValues = num
  values = new Array(num)
  types = new Array(num).fill(-1)
  newValues()
}

/*
* Set the var sorter to the select sorter
*/
function sorter(){
  selectValue = selectSorter.value()
  console.log(selectValue)
  if(selectValue == "BubbleSort"){
    bubbleSort()
  }
  else if(selectValue == "Insertion Sort"){
    insertionSort()
  }
  else if(selectValue == "QuickSort"){
    quickSort(0,numValues-1)
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
  canva = createCanvas(windowWidth,windowHeight);

  //Slider to change the num of values
  sliderNumValues = createSlider(3,200,40,1)
  sliderNumValues.position(3*windowWidth/5,0)
  sliderNumValues.size(2*windowWidth/15,windowHeight/16)
  sliderNumValues.addClass("slider")
  
   //Set the array
   setValues(40)
   numValues = 40

   //Div to display the current num of values
   divNumValues = createDiv(40)
   divNumValues.position(3*windowWidth/5+2*windowWidth/15,0)
   divNumValues.size(windowWidth/15,windowHeight/16)
   divNumValues.addClass("divNumValues")


  //Slider to change the speed of visualization
  sliderSpeed = createSlider(0,99,75)
  sliderSpeed.position(4*windowWidth/5,0)
  sliderSpeed.size(2*windowWidth/15,windowHeight/16)
  sliderSpeed.addClass("slider")

  //Div to indicate that sliderSpeed changes the speed
  divSpeedText = createDiv("Speed")
  divSpeedText.position(4*windowWidth/5+2*windowWidth/15,0)
  divSpeedText.size(windowWidth/15,windowHeight/16)
  divSpeedText.addClass("divNumValues")

  //Select to select the sorting algorithm
  selectSorter = createSelect()
  selectSorter.position(windowWidth/5,0)
  selectSorter.size(windowWidth/5,windowHeight/16)
  selectSorter.option("BubbleSort")
  selectSorter.option("Insertion Sort")
  selectSorter.option("QuickSort")
  selectSorter.selected("BubbleSort")
  selectSorter.addClass("select")

  //Button to get new values
  buttonNewValues = createButton("New Values")
  buttonNewValues.position(0,0)
  buttonNewValues.size(windowWidth/5,windowHeight/16)
  buttonNewValues.mousePressed(newValues)
  buttonNewValues.addClass("buttonNewValues")

  //Button to sort the values
  buttonSortValues = createButton("Sort")
  buttonSortValues.position(2*windowWidth/5,0)
  buttonSortValues.size(windowWidth/5,windowHeight/16)
  buttonSortValues.mousePressed(sorter)
  buttonSortValues.addClass("buttonSort")
}

/*
* Executed every frame
*/
function draw() {

  background("#219ebc")

  //Número de valores
  if(numValues != sliderNumValues.value()){
    setValues(sliderNumValues.value())
    divNumValues.html(sliderNumValues.value())
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
//Auxiliar Sort Algorithms Functions
/*
* Swap 2 values in the values array in a asynchronous way (used by Bubblesort and QuickSort)
* @param index1 - index of first element to be swapped
* @param index2 -index of second element to be swapped
*/
async function swap(index1,index2){
  await sleep(100-sliderSpeed.value())
  let tmp = values[index1]
  values[index1] = values[index2]
  values[index2] = tmp

  tmp = types[index1]
  types[index1] = -1
  types[index2] = tmp
}

/*
* Make the partition for the quickSort Algorithm
* @param start - index that starts the partition
* @param end - index that ends the partition
*/
async function partition(start,end){
  let pivotIndex = end
  let pivot = values[end]
  let left = start
  let rigth = end-1

  types[pivotIndex] = 1

  while(left <= rigth){
    types[left] = 0
    while(values[left] < pivot){
      await sleep(100-sliderSpeed.value())
      types[left]  = -1
      left++
      types[left] = 0
    }
    types[left] = -1

    types[rigth] = 0
    while(values[rigth] >= pivot){
      await sleep(100-sliderSpeed.value())
      types[rigth] = -1
      rigth--
      types[rigth] = 0
    }
    types[rigth] = -1


    if(left <= rigth){
      await swap(left,rigth)
      left++
      rigth--
    }
  }

  //Put the pivot in place
  await swap(left,end)

  return left
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

/*
* Asynchronous Insertion Sort algorithm
*/
async function insertionSort(){
  for(let i = 1;i < values.length; i++){
    let current = values[i]
    let j = i-1
    types[j] = 0
    while((j>-1) && (values[j] > current)){
      types[j] = 0
      await sleep(100-sliderSpeed.value())
      types[j] = -1
      values[j+1] = values[j]
      j--
    }
    types[j] = -1
    values[j+1] = current
  }
}

/* 
* Asynchronous Recursive QuickSort algorithm
* @param start - index that starts the sorting
* @param end - index that ends the sorting
*/
async function quickSort(start,end){
  if(start >= end){
    return
  }

  let pivotIndex = await partition(start,end)

  types[pivotIndex] = -1

  //await Promise.all([quickSort(start,pivotIndex-1),quickSort(pivotIndex+1,end)])
  await quickSort(start,pivotIndex-1)
  await quickSort(pivotIndex+1,end)

  return
}

//#####################################
