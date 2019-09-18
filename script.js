let indexNum = 1;
let textName = document.getElementById('textName');
let queueTable = document.getElementById('queue-table');
let queueDoneTable = document.getElementById('queue-done-table');

let queue = [];
let done = [];
let localStorageQueue;

// methods that return back the html render
const getHtml = user => {
  let htmlRow = `
    <div class="Cell HidePartTime">
    <p>${user.enqueuedAt}</p>
    </div>
    <div class="Cell">
    <p>${user.name}</p>
    </div>
    <div class="Cell">
    <p>${user.queueNum}</p>
    </div>
    `;
  return htmlRow;
};

const initialRow = (row, user) => {
  row.className = 'Row';
  row.id = `u${user.queueNum}`;
  row.innerHTML = getHtml(user);
};

// anonymous method that work every time the app is go app,
// and check if have some local storage.
(() => {
  localStorageQueue = JSON.parse(window.localStorage.getItem('queue'));
  if (localStorageQueue) {
    localStorageQueue.forEach(element => {
      // 1.Create row element
      const row = document.createElement('row');

      // 2. initial row states
      initialRow(row, element);

      // 3. append row to a table
      queueTable.appendChild(row);
    });
  }
})();

// methods that return back the time
const getTime = (hour, min) => {
  let time;
  if (min < 10) {
    time = `${hour}:0${min}`;
  } else {
    time = `${hour}:${min}`;
  }
  return time;
};
function addToQueue() {
  // 1. initial queue details
  const txtName = document.getElementById('textName').value;
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  const time = getTime(hour, min);
  let user = {
    enqueuedAt: time,
    name: txtName,
    queueNum: indexNum++
  };

  // 2. add current queue to queue
  queue.push(user);

  // 3. initial obj row
  const row = document.createElement('row');

  initialRow(row, user);

  // 4. add row to queue table
  queueTable.appendChild(row);

  // 5.save list to the local storage
  window.localStorage.setItem('queue', JSON.stringify(queue));
}

const callNextBtn = () => {
  // 1.remove current from done list
  if (queueDoneTable.childNodes.length > 3) {
    let doneUser = done.shift();
    let childToRemove = document.getElementById(`u${doneUser.queueNum}`);
    if (!childToRemove) return;
    queueDoneTable.removeChild(childToRemove);
  }

  // 2. get user from queue table
  // 2a. try take from local storage(if not take from the regular array)
  if (localStorageQueue !== null && localStorageQueue.length > 0) {
    queue = localStorageQueue;
  }
  let user = queue.shift();
  if (!user) return;

  // 3. remove from table ui
  let childToRemove = document.getElementById(`u${user.queueNum}`);
  if (!childToRemove) return;
  queueTable.removeChild(childToRemove);

  // 4. create element to done list
  const row = document.createElement('row');
  initialRow(row, user);

  // 5. add that element to done list
  queueDoneTable.appendChild(row);

  // 6. assign value to done list
  done.push(user);

  // 7.save list to the local storage
  window.localStorage.setItem('queue', JSON.stringify(queue));
};
