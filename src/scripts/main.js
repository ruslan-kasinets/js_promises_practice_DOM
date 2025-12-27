'use strict';

const body = document.body;

const firstPromise = new Promise((resolve, reject) => {
  const timerId = setTimeout(() => reject(new Error('Error')), 3000);

  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button === 0) {
        clearTimeout(timerId);
        resolve();
      }
    },
    { once: true },
  );
});

const secondPromise = new Promise((resolve, reject) => {
  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button === 0 || e.button === 2) {
        resolve();
      }
    },
    { once: true },
  );
});

const thirdPromise = new Promise((resolve, reject) => {
  let rightClick = false;
  let leftClick = false;

  const clickHandler = function (e) {
    if (e.button === 0) {
      leftClick = true;
    }

    if (e.button === 2) {
      rightClick = true;
    }

    if (rightClick && leftClick) {
      document.removeEventListener('mousedown', clickHandler);
      resolve();
    }
  };

  document.addEventListener('mousedown', clickHandler);
});

const createMessage = (text, isError = false) => {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.className = isError ? 'error' : 'success';
  div.textContent = text;
  body.append(div);
};

const successHandler = (successText) => createMessage(successText);
const errorHandler = (errorText) => createMessage(errorText, true);

firstPromise.then(
  () =>
    successHandler(
      'First promise was resolved on a left click in the document',
    ),
  () => errorHandler('First promise was rejected in 3 seconds if not clicked'),
);

secondPromise.then(() => successHandler('Second promise was resolved'));

thirdPromise.then(() => successHandler('Third promise was resolved'));
