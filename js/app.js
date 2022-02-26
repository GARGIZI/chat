import { format  } from "date-fns";
import Cookies from "js-cookie";
import { sendRequest, headers } from "./request.js";
import { UI, API } from "./view.js";
import { isValidateEmail } from './isValidateEmail.js';

const socket = new WebSocket(`ws://chat1-341409.oa.r.appspot.com/websockets?${Cookies.get('token')}`);

UI.BLOCKS.CHAT.BTN_SEND_MESSAGE.addEventListener('click', () => sendMessage(event));
UI.BLOCKS.CHAT.FIELD_MESSAGE.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  event.preventDefault();

  socket.send(JSON.stringify({
    text: UI.BLOCKS.CHAT.FIELD_MESSAGE.value
  }));

  socket.onmessage = function (event) {
    UI.BLOCKS.CHAT.TRACK_MESSAGE.prepend(messageCompletion(JSON.parse(event.data)));
    UI.BLOCKS.CHAT.FIELD_MESSAGE.parentElement.reset(); 
  };
}

UI.BLOCKS.LOGIN.BTN.addEventListener('click', postRequest);

function postRequest(event) {
  event.preventDefault();
  const body = {email: UI.BLOCKS.LOGIN.INPUT.value};

  if (!isValidateEmail(body.email)) {
    alert('Неверный формат почты');
    return;
  } 

  Cookies.set('email', UI.BLOCKS.LOGIN.INPUT.value);

  sendRequest('POST', API.URL, body, headers)
  .then(() => {
    UI.BLOCKS.LOGIN.BLOCK.classList.remove('active');
    UI.BLOCKS.CONFIRMATIOM.BLOCK.classList.add('active');
  });
}

UI.BLOCKS.CONFIRMATIOM.BTN.addEventListener('click', enter);

function enter(event) {
  event.preventDefault();
  Cookies.set('token', UI.BLOCKS.CONFIRMATIOM.INPUT.value);
  const body = {name: 'new-name'};
  const token = Cookies.get('token');
  headers.Authorization = `Bearer ${token}`;

  sendRequest('PATCH', API.URL, body, headers)
  .then(() => {
    UI.BLOCKS.CONFIRMATIOM.BLOCK.classList.remove('active');
    UI.BLOCKS.CHAT.BLOCK.classList.add('active');
    downloadMessagesHistory();
  });
}

async function downloadMessagesHistory() {
  const URL = 'https://chat1-341409.oa.r.appspot.com/api/messages/';
  const response = await fetch(URL, {
    headers: headers,
  });

  const data = (await response.json()).messages.reverse();
  localStorage.setItem('data', JSON.stringify(data));
  scrollUpdate();
}

function scrollUpdate() {
  const data = JSON.parse(localStorage.getItem('data'));
  const length = data.length;
  const arrUsers = [];
  for (let i = 0; i < length; i++) {
    if (length < 20) {
      arrUsers.push(data[i]);
      if (i === length - 1) {
      localStorage.setItem('arrUsers', JSON.stringify(arrUsers));
      renderMessagesHistory(JSON.parse(localStorage.getItem('arrUsers')));
      data.splice(0, length);
      localStorage.setItem('data', JSON.stringify(data));
      alert('Вся история загружена');
      }
    }
    if (i === 20) {
      localStorage.setItem('arrUsers', JSON.stringify(arrUsers));
      renderMessagesHistory(JSON.parse(localStorage.getItem('arrUsers')));
      data.splice(0,20);
      localStorage.setItem('data', JSON.stringify(data));
      break; 
    }
    arrUsers.push(data[i]);
  }
}

UI.BLOCKS.CHAT.TRACK_MESSAGE.addEventListener('scroll', function () {
  if (this.scrollHeight - Math.abs(this.scrollTop) === this.clientHeight) {
    scrollUpdate();
  }
});

function renderMessagesHistory(data) {
  data.forEach(item => {
    UI.BLOCKS.CHAT.TRACK_MESSAGE.append(messageCompletion(item));
  });
  localStorage.removeItem('arrUsers');
}

function messageCompletion(item) {
  const textMessage = UI.BLOCKS.CHAT.TEMPLATE.content.querySelector('.message p');
  const timeMessage = UI.BLOCKS.CHAT.TEMPLATE.content.querySelector('.message span');
  const getNowTime = () => format(Date.now(), 'p').slice(0,5);

  textMessage.textContent = item.text;
  timeMessage.textContent = getNowTime();
  const parentElement = textMessage.parentElement;

  if (item.user.email === Cookies.get('email')) {
    parentElement.style.background = 'blue';
    parentElement.style.alignSelf = 'flex-end';
  } else {
    parentElement.style.background = 'gray';
    parentElement.style.alignSelf = 'flex-start';
  }

  const message = UI.BLOCKS.CHAT.TEMPLATE.content.cloneNode(true);
  return message;
}