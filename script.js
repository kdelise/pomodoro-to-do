document.addEventListener('DOMContentLoaded', () => {
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  const messageDisplay = document.querySelector('.message');
  const startButton = document.getElementById('start-button');
  const pauseButton = document.getElementById('pause-button');
  const resetButton = document.getElementById('reset-button');
  const timerBar = document.querySelector('.timer-bar');

  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task-button');
  const taskList = document.getElementById('task-list');

  let timer;
  let isRunning = false;
  let isWorkSession = true;
  let timeLeft = 25 * 60;
  const WORK_DURATION = 25 * 60;
  const BREAK_DURATION = 5 * 60;

  let tasks = [];

  function updateDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      minutesDisplay.textContent = minutes.toString().padStart(2, '0');
      secondsDisplay.textContent = seconds.toString().padStart(2, '0');
  }

  function updateProgressBar() {
      const totalTime = isWorkSession ? WORK_DURATION : BREAK_DURATION;
      const progress = (timeLeft / totalTime) * 100;
      timerBar.style.width = `${progress}%`;
  }

  function startTimer() {
      if (isRunning) return;
      isRunning = true;
      messageDisplay.textContent = isWorkSession ? "Work Session" : "Break Time";
      timer = setInterval(() => {
          if (timeLeft <= 0) {
              clearInterval(timer);
              isRunning = false;
              alert(isWorkSession ? "Time to take a break!" : "Break is over, time to work!");
              isWorkSession = !isWorkSession;
              timeLeft = isWorkSession ? WORK_DURATION : BREAK_DURATION;
              startTimer();
              return;
          }
          timeLeft--;
          updateDisplay();
          updateProgressBar();
      }, 1000);
  }

  function pauseTimer() {
      clearInterval(timer);
      isRunning = false;
      messageDisplay.textContent = "Paused";
  }

  function resetTimer() {
      clearInterval(timer);
      isRunning = false;
      isWorkSession = true;
      timeLeft = WORK_DURATION;
      updateDisplay();
      updateProgressBar();
      messageDisplay.textContent = "Press Start to Begin";
  }

  function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
          const li = document.createElement('li');
          li.className = task.completed ? 'completed' : '';
          li.innerHTML = `
              <span>${task.text}</span>
              <div class="task-buttons">
                  <input type="checkbox" class="complete-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
                  <button class="delete-button" data-index="${index}">X</button>
              </div>
          `;
          taskList.appendChild(li);
      });
  }

  function addTask() {
      const text = taskInput.value.trim();
      if (text) {
          tasks.push({ text, completed: false });
          taskInput.value = '';
          renderTasks();
      }
  }

  function handleTaskListClick(event) {
      if (event.target.classList.contains('delete-button')) {
          const index = event.target.dataset.index;
          tasks.splice(index, 1);
          renderTasks();
      } else if (event.target.classList.contains('complete-checkbox')) {
          const index = event.target.dataset.index;
          tasks[index].completed = event.target.checked;
          renderTasks();
      }
  }

  startButton.addEventListener('click', startTimer);
  pauseButton.addEventListener('click', pauseTimer);
  resetButton.addEventListener('click', resetTimer);
  addTaskButton.addEventListener('click', addTask);
  taskList.addEventListener('click', handleTaskListClick);

  taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          addTask();
      }
  });

  updateDisplay();
  updateProgressBar();
  renderTasks();
});
