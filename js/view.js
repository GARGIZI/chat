export const UI = {
  BLOCKS: {
    LOGIN: {
      BLOCK: document.querySelector('.lognIn'),
      INPUT: document.querySelector('.lognIn__form-input'),
      BTN: document.querySelector('.lognIn__form-btn'),
    },

    
    CONFIRMATIOM: {
      BLOCK: document.querySelector('.сonfirmation'),
      INPUT: document.querySelector('.сonfirmation__form-input'),
      BTN: document.querySelector('.сonfirmation__form-btn'),
    },
    
    CHAT: {
      BLOCK: document.querySelector('.chat'),
      BTN_SEND_MESSAGE: document.querySelector('.chat__chatText-send'),
      FIELD_MESSAGE: document.querySelector('.chat__chatText input'),
      TEMPLATE: document.querySelector('.chat__mainContent template'),
      TRACK_MESSAGE: document.querySelector('.chat__mainContent'),
    },
  },
}

export const API = {
  URL: 'https://chat1-341409.oa.r.appspot.com/api/user',
}