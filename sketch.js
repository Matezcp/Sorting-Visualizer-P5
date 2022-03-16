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
var labelParallel// <-- Label to indicate code will be Parallel or not
var checkboxParallel// <-- Checkbox to active the Parallelism
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
* Adapt the UI depending which algorithm is been used
*/
function adaptUI(){
  selectValue = selectSorter.value()
  if(selectValue == "MergeSort" || selectValue == "QuickSort"){
    labelParallel.style("display", "flex")
    selectSorter.position(windowWidth/5+windowWidth/15,0)
    selectSorter.size(2*windowWidth/15,windowHeight/16)
    buttonNewValues.size(windowWidth/10,windowHeight/16)
  }
  else{
    labelParallel.style("display", "none")
    selectSorter.position(windowWidth/5,0)
    selectSorter.size(windowWidth/5,windowHeight/16)
    buttonNewValues.size(windowWidth/5,windowHeight/16)
  }
}

/*
* Set the var sorter to the select sorter
*/
function sorter(){
  selectValue = selectSorter.value()
  if(selectValue == "BubbleSort"){
    bubbleSort()
  }
  else if(selectValue == "Insertion Sort"){
    insertionSort()
  }
  else if(selectValue == "QuickSort"){
    quickSort(0,numValues-1)
  }
  else if(selectValue == "MergeSort"){
    mergeSort(0,numValues-1)
  }
  else if(selectValue == "Selection Sort"){
    selectionSort()
  }
  else if(selectValue == "HeapSort"){
    heapSort()
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
  selectSorter.option("Selection Sort")
  selectSorter.option("QuickSort")
  selectSorter.option("MergeSort")
  selectSorter.option("HeapSort")
  selectSorter.selected("BubbleSort")
  selectSorter.changed(adaptUI)
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

  //Checkbox to active the Parallelism
  checkboxParallel = select("#parallelCheckbox")
  checkboxParallel.position(windowWidth/10,0)
  checkboxParallel.size(windowWidth/10+windowWidth/15,windowHeight/16)

  // Label to indicate code will be Parallel or not
  labelParallel = select("#parallelLabel")
  labelParallel.position(windowWidth/10,0)
  labelParallel.size(windowWidth/10+windowWidth/15,windowHeight/16)

  //Adapt the UI initially
  adaptUI()
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

/*
* Merge the 2 sides of the array for the mergeSort Algorithm
* @param start - index that is the start of the merge
* @param middle - index that is the middle of the merge
* @param end - index that is the end of the merge
*/
async function merge(start,middle,end)
{
  let temp = Array(end-start+1)

  let indexLeft = start
  let indexRigth = middle+1
  let indexArray = start

  while(indexLeft <= middle && indexRigth <= end){
    types[indexLeft] = 0
    types[indexRigth] = 0

    if(values[indexLeft] < values[indexRigth]){
      temp[indexArray] = values[indexLeft]
      await sleep(100-sliderSpeed.value())
      types[indexLeft] = -1
      indexLeft++
    }
    else{
      temp[indexArray] = values[indexRigth]
      await sleep(100-sliderSpeed.value())
      types[indexRigth] = -1
      indexRigth++
    }
    indexArray++
  }

  if(indexLeft > middle){
    types[indexLeft-1] = -1
    while(indexRigth <= end){
      types[indexRigth] = 0
      temp[indexArray] = values[indexRigth]
      await sleep(100-sliderSpeed.value())
      types[indexRigth] = -1
      indexRigth++
      indexArray++
    }
  }
  else if(indexRigth > end){
    types[indexRigth-1] = -1
    while(indexLeft <= middle){
      types[indexLeft] = 0
      temp[indexArray] = values[indexLeft]
      await sleep(100-sliderSpeed.value())
      types[indexLeft] = -1
      indexLeft++
      indexArray++
    }
  }

  types[indexLeft-1] = -1
  types[indexRigth-1] = -1

  for(let i=start;i<=end;i++){
    await sleep(100-sliderSpeed.value())
    values[i] = temp[i]
  }
}

/*
* Function that takes an array and heapify it from a given index
* @param numNodes - number of nodes that the heap have
* @param node - index of the node we are analyzing
*/
async function heapify(numNodes,node){

  let largest = node
  let leftChild = node*2+1
  let rightChild = node*2+2

  types[node] = 0

  if(leftChild < numNodes && values[leftChild] > values[largest]){
    await sleep(100-sliderSpeed.value())
    types[largest] = -1
    largest = leftChild
    types[largest] = 0
  }
  
  if(rightChild < numNodes && values[rightChild] > values[largest]){
    await sleep(100-sliderSpeed.value())
    types[largest] = -1
    largest = rightChild
    types[largest] = 0
  }

  if(largest != node){
    await swap(node,largest)
    await heapify(numNodes,largest)
  }

  types[node] = -1
}

/*
* Initially make the array a binary heap
*/
async function buildHeap(){
  for (let i = Math.floor(numValues / 2) - 1; i >= 0; i--){
    await heapify(numValues, i);
  }
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


  if(checkboxParallel.checked()){
    //Parallel
    await Promise.all([quickSort(start,pivotIndex-1),quickSort(pivotIndex+1,end)])
  }
  else{
    await quickSort(start,pivotIndex-1)
    await quickSort(pivotIndex+1,end)
  }

  return
}

/*
* Asynchronous Recursive MergeSort algorithm
* @param start - index that starts the sorting
* @param end - index that ends the sorting
*/
async function mergeSort(start,end){
  if(start >= end){
    return
  }

  let middle = parseInt((start+end)/2)

  if(checkboxParallel.checked()){
    //Parallel
    await Promise.all([mergeSort(start,middle),mergeSort(middle+1,end)])
  }
  else{
    await mergeSort(start,middle)
    await mergeSort(middle+1,end)
  }

  await merge(start,middle,end)
}

/*
* Asynchronous Selection Sort algorithm
*/
async function selectionSort(){

  for(let i = 0;i < numValues-1; i++){

    let minIndex = i

    for(let j=i+1;j<numValues;j++){
      types[j] = 0

      if(values[j] < values[minIndex])
        minIndex = j
      
      await sleep(100-sliderSpeed.value())
      types[j] = -1
    }
    
    await swap(i,minIndex)
  }
}

/*
* Asynchronous HeapSort algorithm
*/
async function heapSort(){

  await buildHeap()
  
  for(let i=numValues-1;i>0;i--){
    await swap(0,i)
    await heapify(i,0)
  }

}


//#####################################
