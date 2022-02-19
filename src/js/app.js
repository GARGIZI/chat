import { format  } from "date-fns";
import Cookies from "js-cookie";
import { UI, API } from "./view.js";

UI.BTN_SEND_MESSAGE.addEventListener('click', sendMessage);
UI.FIELD_MESSAGE.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const textMessage = UI.TEMPLATE.content.querySelector('p');
  const timeMessage = UI.TEMPLATE.content.querySelector('span');

  textMessage.textContent = UI.FIELD_MESSAGE.value;
  timeMessage.textContent = format(Date.now(), 'p').slice(0, 5);

  const message = UI.TEMPLATE.content.cloneNode(true);

  trackMessage.append(message);
}

UI.GET_CODE.BTN.addEventListener('click', postRequest);

async function postRequest(event) {
  event.preventDefault();
  const request = await fetch(API.URL, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:1234',
    },
    method: 'POST',
    body: JSON.stringify({email: UI.GET_CODE.INPUT.value}),
  });

  const data = await request.json();
  console.log(data);
}

UI.CONFIRMATIOM.BTN.addEventListener('click', enter);

async function enter(event) {
  event.preventDefault();
  Cookies.set('token', UI.CONFIRMATIOM.INPUT.value)
  const token = Cookies.get('token');
  const URL = 'https://chat1-341409.oa.r.appspot.com/api/user';

  const request = await fetch(URL, {
    method: 'PATCH',
    body: JSON.stringify({name: 'new-name'}),
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:1234',
    },
  });

  const data = await request.json();
  console.log(data);
}
