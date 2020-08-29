/* eslint no-inner-declarations: "off"*/
import Component from '@ember/component';

let isListenerAttached = false;
const locationAttribute = 'data-loc';

function calculateToolTipPosition($element, $tooltip) {
  let elementCoordinates = $element.getBoundingClientRect();
  $tooltip.innerText = $element.getAttribute(locationAttribute);

  $tooltip.style.display = 'inline-block';

  let tooltipCoordinates = $tooltip.getBoundingClientRect();
  let top, left;

  if ((elementCoordinates.top - tooltipCoordinates.height - 8) > 0) {
    top = elementCoordinates.top - tooltipCoordinates.height - 8;
  } else {
    top = elementCoordinates.bottom + 12;
  }

  if ((elementCoordinates.left + tooltipCoordinates.width) > window.innerWidth) {
    left = elementCoordinates.right - tooltipCoordinates.width;
  } else {
    left = elementCoordinates.left;
  }
  $tooltip.style.top = `${top}px`;
  $tooltip.style.left = `${left}px`;

}

function attachMouseOverListener($tooltip) {
  document.body.addEventListener('mouseover', (event) => {
    let { target } = event;
    if (event.altKey
      && event.shiftKey
      && target.hasAttribute(locationAttribute)) {

      target.classList.add('inspector-element-highlight');
      calculateToolTipPosition(event.target, $tooltip);
    }
  });
}

function attachMouseOutListener($tooltip) {
  document.body.addEventListener('mouseout', (event) => {
    let { target } = event;

    if (target.id !== 'inspector'
    && target.hasAttribute(locationAttribute)
    && target.classList.contains('inspector-element-highlight')) {
      event.target.classList.remove('inspector-element-highlight');
      $tooltip.style.display = 'none';
    }
  });
}

function attachClickListener($tooltip) {
  let { serverUrl } = window.emberTemplateInspector;

  document.body.addEventListener('click', (event) => {
    let { target } = event;
    if (event.altKey
      && event.shiftKey
      && target.hasAttribute(locationAttribute)) {
      let file = target.getAttribute(locationAttribute);
      event.stopPropagation();
      event.preventDefault();
      fetch(`${serverUrl}/openfile?file=${file}`);
      $tooltip.style.display = 'none';
    }
  });
}

export function initialize() {
  if (isListenerAttached) {
    return;
  }

  Component.reopen({
    init() {
      this._super(...arguments);
      if (this.tagName !== '') {
        this.attributeBindings = [...this.attributeBindings || [], 'data-loc']; // to avoid mutating the parent definition.
      }
    }
  });

  let $tooltip = document.createElement('div');

  $tooltip.classList.add('inspector-tooltip');
  document.body.appendChild($tooltip);

  attachMouseOverListener($tooltip);
  attachMouseOutListener($tooltip);
  attachClickListener($tooltip);

  isListenerAttached = true;
}

export default {
  initialize
};
