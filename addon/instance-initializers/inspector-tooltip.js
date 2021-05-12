/* eslint no-inner-declarations: "off"*/
import componentExt from '../utils/component-ext';

let isListenerAttached = false;
const locationAttribute = 'l';

function calculateToolTipPosition($element, $tooltip, fileName) {
  let elementCoordinates = $element.getBoundingClientRect();
  $tooltip.innerText = fileName;

  $tooltip.style.display = 'inline-block';

  let tooltipCoordinates = $tooltip.getBoundingClientRect();
  let top, left;

  if (elementCoordinates.top - tooltipCoordinates.height - 8 > 0) {
    top = elementCoordinates.top - tooltipCoordinates.height - 8;
  } else {
    top = elementCoordinates.bottom + 12;
  }

  if (elementCoordinates.left + tooltipCoordinates.width > window.innerWidth) {
    left = elementCoordinates.right - tooltipCoordinates.width;
  } else {
    left = elementCoordinates.left;
  }
  $tooltip.style.top = `${top}px`;
  $tooltip.style.left = `${left}px`;
}

function attachMouseOverListener($tooltip, templateInspectorService) {
  document.body.addEventListener('mouseover', async (event) => {
    let { target } = event;
    if (
      event.altKey &&
      event.shiftKey &&
      target.hasAttribute(locationAttribute)
    ) {
      let fileInfo = target.getAttribute(locationAttribute);
      let resolvedLocation = templateInspectorService.getFileInfo(fileInfo);

      target.classList.add('inspector-element-highlight');
      calculateToolTipPosition(event.target, $tooltip, resolvedLocation);
    }
  });
}

function attachMouseOutListener($tooltip) {
  document.body.addEventListener('mouseout', (event) => {
    let { target } = event;

    if (
      target.id !== 'inspector' &&
      target.hasAttribute(locationAttribute) &&
      target.classList.contains('inspector-element-highlight')
    ) {
      target.classList.remove('inspector-element-highlight');
      $tooltip.style.display = 'none';
    }
  });
}

function attachClickListener($tooltip, templateInspectorService) {
  document.body.addEventListener('click', async (event) => {
    let { target } = event;
    if (
      event.altKey &&
      event.shiftKey &&
      target.hasAttribute(locationAttribute)
    ) {
      let fileInfo = target.getAttribute(locationAttribute);
      event.stopPropagation();
      event.preventDefault();

      await templateInspectorService.openFile(fileInfo);
      $tooltip.style.display = 'none';
    }
  });
}

function createToolTip(templateInspectorService) {
  let $tooltip = document.createElement('div');

  $tooltip.classList.add('inspector-tooltip');
  document.body.appendChild($tooltip);

  attachMouseOverListener($tooltip, templateInspectorService);
  attachMouseOutListener($tooltip, templateInspectorService);
  attachClickListener($tooltip, templateInspectorService);
}

export function initialize(applicationInstance) {
  if (isListenerAttached) {
    return;
  }

  let templateInspectorService = applicationInstance.lookup(
    'service:template-inspector'
  );

  componentExt();
  createToolTip(templateInspectorService);
  isListenerAttached = true;
}

export default {
  initialize,
};
