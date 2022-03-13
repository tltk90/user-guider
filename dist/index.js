"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.guide = guide;
var ANIMATE_TIME = 500;

function guide(config) {
  var configIndex = 0;
  var configCount = config.length - 1;

  var _initializeElement = initializeElement(),
      guider = _initializeElement.guider,
      guiderText = _initializeElement.guiderText,
      buttons = _initializeElement.buttons;

  var setButtonDisableState = function setButtonDisableState() {
    if (configIndex === 0) {
      buttons.children[0].disabled = true;
    } else {
      buttons.children[0].disabled = false;
    }

    if (configIndex === configCount) {
      buttons.children[1].disabled = true;
    } else {
      buttons.children[1].disabled = false;
    }
  };

  buttons.children[0].addEventListener('click', function () {
    // prev press
    configIndex--;
    requestAnimationFrame(function () {
      setButtonDisableState();
      showGuide(config[configIndex], guider, guiderText);
    });
  });
  buttons.children[1].addEventListener('click', function () {
    // next press
    configIndex++;
    requestAnimationFrame(function () {
      setButtonDisableState();
      showGuide(config[configIndex], guider, guiderText);
    });
  });
  setButtonDisableState();
  showGuide(config[configIndex], guider, guiderText);
}

function initializeElement() {
  var overlay = document.createElement('div');
  var guider = document.createElement('div');
  var guiderText = document.createElement('span');
  var buttons = document.createElement('div');
  var close = document.createElement('div');
  buttons.innerHTML = '<button id="prev"> &lt; </button> <button id="next">&gt;</button>';
  overlay.setAttribute('class', 'ug-overlay');
  guider.setAttribute('class', 'ug-container');
  buttons.setAttribute('class', 'ug-container-button');
  close.setAttribute('class', 'ug-close-button');
  close.addEventListener('click', removeContainer);
  guider.appendChild(close);
  guider.appendChild(guiderText);
  guider.appendChild(buttons);
  guider.style.opacity = '0';
  document.body.appendChild(overlay);
  overlay.appendChild(guider);
  return {
    guider: guider,
    guiderText: guiderText,
    buttons: buttons
  };
}

function showGuide(c, guider, guiderText) {
  var el = document.querySelector(c.element);
  var rect = el.getBoundingClientRect();
  var onTop = rect.y < document.body.clientHeight / 2;
  var onLeft = rect.x < document.body.clientWidth / 2;
  var classToBeAdded;

  if (onTop) {
    classToBeAdded = onLeft ? 'ug-bubble-top' : 'ug-bubble-top-right';
  } else {
    classToBeAdded = onLeft ? 'ug-bubble-bottom-left' : 'ug-bubble-bottom';
  }

  function animate() {
    var transition = "opacity ".concat(ANIMATE_TIME / 2, "ms ease-in-out");
    var oldT = el.style.transition;
    guider.style.transition = transition;
    guider.style.opacity = '0';
    setTimeout(function () {
      clearBubbleClass(guider);
      guider.classList.add(classToBeAdded);
      guiderText.innerHTML = c.text;
      var top = onTop ? rect.bottom : undefined;
      var bottom = !onTop ? document.body.clientHeight - rect.top : undefined;
      var left = onLeft ? rect.x - rect.width / 2 : rect.x + rect.width / 2 - guider.clientWidth;
      guider.style.top = top ? "".concat(top, "px") : '';
      guider.style.bottom = bottom ? "".concat(bottom, "px") : '';
      guider.style.left = "".concat(left, "px");
      guider.style.opacity = '1';
      guider.style.transition = oldT;
    }, ANIMATE_TIME);
  }

  animate();
}

function clearBubbleClass(el) {
  el.classList.remove('ug-bubble-bottom', 'ug-bubble-top', 'ug-bubble-bottom-left', 'ug-bubble-top-right');
}

function removeContainer() {
  var overlay = document.querySelector('.ug-overlay');
  document.body.removeChild(overlay);
}