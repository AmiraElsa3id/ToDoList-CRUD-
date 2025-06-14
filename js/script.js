var userInputTask = document.getElementById("userInputTask");
var searchBtn = document.getElementById("searchBtn");
var searchInput = document.getElementById("searchInput");
var form = document.getElementById("form");
var editTaskInput = document.getElementById("editTaskInput");
var editOverlay = document.getElementById("editOverlay");
var closeEdit = document.getElementById("closeEdit");
var cancelEdit = document.getElementById("cancelEdit");
var saveEdit = document.getElementById("saveEdit");
var currentEditIndex = -1;
var currentEditType = 'tasks'; // 'tasks' or 'finishedtasks'

// Add event listeners for the custom overlay
if (closeEdit) {
    closeEdit.addEventListener('click', () => {
        editOverlay.style.display = 'none';
        currentEditIndex = -1;
    });
}

if (cancelEdit) {
    cancelEdit.addEventListener('click', () => {
        editOverlay.style.display = 'none';
        currentEditIndex = -1;
    });
}

if (saveEdit) {
    saveEdit.addEventListener('click', saveEditedTask);
}

var tasks;
var finishedTasks;

// check the localStorage for tasks
if( localStorage.getItem("tasks")==null){
   tasks =[];
    
}else{
   tasks= JSON.parse(localStorage.getItem("tasks"))
   displayTask(tasks);
}

// check the localStorage for finishedTasks
if( localStorage.getItem("finishedtasks")==null){
    finishedTasks =[];
 }else{
    finishedTasks= JSON.parse(localStorage.getItem("finishedtasks"))
 }
 displayFinishedTask(finishedTasks);

//  Add Task
function addTask(){
    tasks.push(userInputTask.value);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    userInputTask.value="";
    displayTask(tasks);
    updateProgress();
}

// function changeTaskCounter(ele){
// }

// Display all Tasks
function displayTask(arr){
    document.getElementById("taskCount").innerHTML=tasks.length;
    
var box=``
for(var i = 0 ; i<arr.length;i++){
    box+=`
     <div class="col-lg-7">
                        <div class="task d-flex justify-content-between p-2 rounded-2">
                            <p class=" m-0 d-flex align-items-center "> ${arr[i]}</p>
                            <div class="icons">
                                <button onclick="checkTask(${i})" class="btn check">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                                <button onclick="editTask(${i})" class="btn edit">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button data-id="${arr[i].id}" onclick="deleteTask(this)" class="btn delete">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
    `
}
document.getElementById("tasks").innerHTML=box;
}

// Display all FinishedTasks
function displayFinishedTask(arr){
    var box=``;
    for(var i = 0 ; i<arr.length;i++){
        box+=`
         <div class="col-lg-7">
                        <div class="task d-flex justify-content-between p-2 rounded-2">
                            <p class=" m-0 d-flex align-items-center text-decoration-line-through">${arr[i]}</p>
                            <div class="icons">
                                <button onclick="unfinishTask(${i})" class="btn unfinish">
                                    <i class="fa-solid fa-undo"></i>
                                </button>
                                <button onclick="editTask(${i})" class="btn edit">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button onclick="deleteFinishedTask(${i})" class="btn delete">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
        `
    }
    document.getElementById("finishedTasks").innerHTML=box;
    document.getElementById("finishedTasksCount").innerHTML = arr.length;
    }

// Delete a finished task
function deleteFinishedTask(index) {
    finishedTasks.splice(index, 1);
    localStorage.setItem("finishedtasks", JSON.stringify(finishedTasks));
    displayFinishedTask(finishedTasks);
    updateProgress();
}

// Unfinish a task and move it back to the tasks list
function unfinishTask(index) {
    tasks.push(finishedTasks[index]);
    finishedTasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("finishedtasks", JSON.stringify(finishedTasks));
    displayTask(tasks);
    displayFinishedTask(finishedTasks);
    updateProgress();
}

// Edit a task
function editTask(index) {
    if (currentEditType === 'tasks') {
        editTaskInput.value = tasks[index];
        currentEditIndex = index;
    } else {
        editTaskInput.value = finishedTasks[index];
        currentEditIndex = index;
    }
    // editOverlay.classList.add('visible');
    editOverlay.style.display = 'block';
}

// Save edited task
function saveEditedTask() {
    const newTask = editTaskInput.value.trim();
    if (newTask) {
        if (currentEditType === 'tasks') {
            tasks[currentEditIndex] = newTask;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            displayTask(tasks);
        } else {
            finishedTasks[currentEditIndex] = newTask;
            localStorage.setItem("finishedtasks", JSON.stringify(finishedTasks));
            displayFinishedTask(finishedTasks);
        }
        updateProgress();
    }
    editOverlay.style.display = 'none';
    currentEditIndex = -1;
}

// Delete a certain task
function deleteTask(index){
    tasks.splice(index,1);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    displayTask(tasks);
    updateProgress();
}

// Check a certain task as Finished and add to Finished tasks list with displaying the result
function checkTask(index){
    finishedTasks.push(tasks[index]);
    localStorage.setItem("finishedtasks",JSON.stringify(finishedTasks));
    displayFinishedTask(finishedTasks);
    deleteTask(index);
updateProgress();
}
//clear all site's data (array + LocalStorage)
function clearAll(){
localStorage.removeItem("tasks");
localStorage.removeItem("finishedtasks");
tasks=[];
finishedTasks=[];
displayTask(tasks);
displayFinishedTask(finishedTasks);
updateProgress();}

//Search for tasks and display them
function searchTask(val){
    var result=[];
    for(var i =0 ;i <tasks.length ;i++){
        if(tasks[i].toLowerCase().includes(val.toLowerCase())){
            result.push(tasks[i])
            console.log(result)
        }
    }
    if(result.length==0){
        document.getElementById("tasks").innerHTML=`<h2 class="text-danger text-center">No Tasks Found</h2>`
    }
    else{
        displayTask(result);
    }
}

// remove the defaul behaviour of the form (reloading the page after submit)
form.addEventListener("submit",function(e){
    e.preventDefault();
    console.log("hi")
})


// searchBtn.onclick=searchTask(searchInput.val)
// displayTask(tasks);
function updateProgress() {
    const totalTasks = tasks.length + finishedTasks.length;
    const completedTasks = finishedTasks.length;
    const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute("aria-valuenow", percentage);
    taskStatus.textContent = `${completedTasks} of ${totalTasks} tasks done`;
}
updateProgress();

removeCheckedBtn.addEventListener("click", function() {
    tasks.push(...finishedTasks);
    finishedTasks=[];   
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("finishedtasks", JSON.stringify(finishedTasks));
    displayTask(tasks);
    displayFinishedTask(finishedTasks);
    updateProgress();
});
