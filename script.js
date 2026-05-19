const form = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const Priority = document.querySelector('#priorityInput');
const date = document.querySelector('#dateInput');
const taskList = document.querySelector('#taskList'); 
const completedTasks = document.querySelector('#completedTasks');
const totalTasks = document.querySelector('#totalTasks');
const pendingTasks = document.querySelector('#pendingTasks');
const inp = document.querySelector('#searchInput');
const filterBtn = document.querySelectorAll('.filter-btn');
const emptyMsg = document.querySelector('.empty-message');
const themeBtn = document.querySelector('#themeBtn');
const categoryInput = document.querySelector('#categoryInput');
const sortInput = document.querySelector('#sortInput');


const allTask = [];

form.addEventListener('submit', function(det){
  det.preventDefault();

  if(taskInput.value.trim() === ""){
    alert('Please add your task!');
    return;
  }

  const task = {
    name: taskInput.value,
    Priority: Priority.value,
    date: date.value,
    category: categoryInput.value,
    completed: false
  }

  taskInput.value = "";
  Priority.value = "";
  date.value = "";

  allTask.push(task);
  
  renderTask(allTask);

  localStorage.setItem('tasks', JSON.stringify(allTask));
})

const savedTask = JSON.parse(localStorage.getItem('tasks'));

if(savedTask){
  allTask.push(...savedTask);
  renderTask(allTask);
}



function renderTask(arr){

  const compArr = allTask.filter((card)=>{
    return card.completed;
  });

  completedTasks.textContent = compArr.length;
  totalTasks.textContent = allTask.length;
  pendingTasks.textContent = allTask.length - compArr.length;

  taskList.innerHTML = "";

  arr.forEach((indTask)=>{
    let taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    let cardInfo = document.createElement('div');

    let spn = document.createElement('span');
    spn.textContent = indTask.Priority || 'low';
    spn.classList.add('priority');
    spn.classList.add(indTask.Priority?.toLowerCase() || 'low');

    let h3 = document.createElement('h3');
    h3.textContent = indTask.name;

    let p = document.createElement('p');
    p.textContent = indTask.date ? `Due:${indTask.date}` : 'No date';

    let small = document.createElement('small');
    small.textContent = indTask.category || 'work';
    small.classList.add('category');
    
    let cardBtn = document.createElement('div');
    cardBtn.classList.add('task-actions');

    let comBtn = document.createElement('button');
    comBtn.classList.add('complete-btn');
    comBtn.textContent = 'Complete';

    let delBtn = document.createElement('button');
    delBtn.classList.add('delete-btn');
    delBtn.textContent = 'Delete';

    cardInfo.appendChild(spn);
    cardInfo.appendChild(h3);
    cardInfo.appendChild(p);
    cardInfo.appendChild(small);

    cardBtn.appendChild(comBtn);
    cardBtn.appendChild(delBtn);

    taskCard.appendChild(cardInfo);
    taskCard.appendChild(cardBtn);

    if(indTask.completed){
      taskCard.classList.add('completed');
      comBtn.disabled = true;
    }

    comBtn.addEventListener('click', function(){
      indTask.completed = true;

      localStorage.setItem('tasks', JSON.stringify(allTask));

      renderTask(allTask);
    })

    delBtn.addEventListener('click', function(){

      const delArr = allTask.filter((obj)=>{
        return obj !== indTask
      });

      allTask.length = 0;

      allTask.push(...delArr);

      localStorage.setItem('tasks', JSON.stringify(allTask));

      renderTask(allTask);
    })


    taskList.appendChild(taskCard);
  });

};


    inp.addEventListener('input', function(){
      const filteredArr = allTask.filter((card)=>{
        return card.name.toLowerCase().startsWith(inp.value.toLocaleLowerCase());
      })

      filteredArr.length == 0 ? taskList.textContent = 'No matching Task available!' : renderTask(filteredArr);

    });


    

    filterBtn.forEach((btn)=>{
      btn.addEventListener('click', function(){
        if(btn.dataset.filter === 'all'){
          filterBtn.forEach((ut)=>{
            ut.classList.remove('active');
            btn.classList.add('active');
          })
          allTask.length == 0 ? taskList.textContent = "No tasks added yet." : renderTask(allTask);
        }

        else if(btn.dataset.filter === 'pending'){
          filterBtn.forEach((ut)=>{
            ut.classList.remove('active');
            btn.classList.add('active');
          })
          const pending = allTask.filter((task)=>{
            return !task.completed;
          })

          pending.length == 0 ? taskList.textContent = 'Nothing is Pending Now!' : renderTask(pending);
        }

        else if(btn.dataset.filter === 'completed'){
          filterBtn.forEach((ut)=>{
            ut.classList.remove('active');
            btn.classList.add('active');
          })
          const complete = allTask.filter((task)=>{
            return task.completed;
          })

          complete.length == 0 ? taskList.textContent = "You Haven't Completed Any Task Yet!" : renderTask(complete);

        }
        
      });
    });

    // Theme Section:-

    themeBtn.addEventListener('click', function(){
      if(document.body.classList.contains('dark')){
        themeBtn.textContent = '🌙 Dark';
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
      else{
        themeBtn.textContent = '☀️ Light';
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });

    const savedTheme = localStorage.getItem('theme');

    if(savedTheme === 'dark'){
      document.body.classList.add('dark');
    }
    else{
      themeBtn.textContent = '🌙 Dark';
      document.body.classList.add('light');
    }

// sort task
    

  sortInput.addEventListener('change', function(){

      // Create copy of original array
      const sortedarr = [];
      sortedarr.push(...allTask);

      if(sortInput.value === 'high'){
        const ordered = {
          High: 3,
          Medium: 2,
          Low: 1
        }
        sortedarr.sort((a,b)=>{
          return (ordered[b.Priority] - ordered[a.Priority]);
        });

        renderTask(sortedarr);
      }

      else if(sortInput.value === 'latest'){
        sortedarr.sort((a,b)=>{
          return (new Date(b.date) - new Date(a.date));
        });
        renderTask(sortedarr);
      }

      else if(sortInput.value === 'oldest'){
        sortedarr.sort((a,b)=>{
          (new Date(a.date) - new Date(b.date));
        });
        renderTask(sortedarr);
      }

      else{
        renderTask(allTask);
      }
  })

//localstorage