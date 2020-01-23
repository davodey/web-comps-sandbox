(function(w, doc) {
  'use strict';

  const SVG_CHECK_SM_18 = `
    <svg
      class="pe-icon--check-sm-18"
      aria-hidden="true"
      focusable="false"
      aria-label="on"
    >
    <path
      d="M7.35823097,13.99969 C7.08123097,13.99969 6.81423097,13.88469 6.62523097,13.67969 L4.26623097,11.13469 C3.89123097,10.72869 3.91523097,10.09669 4.32023097,9.72169 C4.72423097,9.34469 5.35623097,9.36869 5.73323097,9.77469 L7.25323097,11.41469 L12.182231,4.42369 C12.501231,3.97269 13.125231,3.86469 13.576231,4.18269 C14.027231,4.50069 14.135231,5.12469 13.817231,5.57569 L8.17523097,13.57569 C8.00223097,13.82269 7.72523097,13.97769 7.42423097,13.99769 C7.40223097,13.99869 7.38023097,13.99969 7.35823097,13.99969"
    ></path>
  </svg>
`;

  const SVG_REMOVE_SM_18 = `
    <svg
      class="pe-icon--remove-sm-18"
      aria-hidden="true"
      focusable="false"
      aria-label="off"
    >
    <path
      d="M10.4066,9 L13.7086,5.698 C14.0976,5.31 14.0976,4.68 13.7086,4.291 C13.3196,3.903 12.6906,3.903 12.3016,4.291 L8.9996,7.593 L5.6976,4.291 C5.3096,3.903 4.6796,3.903 4.2916,4.291 C3.9026,4.68 3.9026,5.31 4.2916,5.698 L7.5936,9 L4.2916,12.302 C3.9026,12.69 3.9026,13.32 4.2916,13.709 C4.4856,13.903 4.7406,14 4.9946,14 C5.2496,14 5.5036,13.903 5.6976,13.709 L8.9996,10.407 L12.3016,13.709 C12.4966,13.903 12.7506,14 13.0056,14 C13.2596,14 13.5146,13.903 13.7086,13.709 C14.0976,13.32 14.0976,12.69 13.7086,12.302 L10.4066,9 Z"
    ></path>
  </svg>
`;

  const template = doc.createElement('template');

  template.innerHTML = `
  <style>
  *,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box}:host{font-size:24px;position:relative;display:block;width:2em;height:1em;padding:0;border:0;border-radius:22px;margin:4px 0;color:#fff;background-color:#a9a9a9;cursor:pointer;-webkit-transition:background .3s;transition:background .3s;overflow:visible;min-width:50px}:host([on]:not([on=false])){background:#047a9c}:host([disabled]:not([disabled=false])){color:#c7c7c7;background-color:#e9e9e9;cursor:not-allowed}:host:before{content:"";background:#fff;display:block;position:absolute;left:3px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);width:.75em;height:.75em;-webkit-transition:left .3s;transition:left .3s;border-radius:100%}:host([on]:not([on=false])):before{left:27px}:host([disabled]:not([disabled=false])):before{background-color:#c7c7c7}:host(:focus){outline:0}:host(:focus):after{content:"";position:absolute;left:50%;top:50%;width:-webkit-calc(100% + 8px);width:calc(100% + 8px);height:-webkit-calc(100% + 8px);height:calc(100% + 8px);border:2px solid #1977d4;border-radius:22px;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:1}svg{width:.75em;height:.75em;position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);fill:currentColor;pointer-events:none}svg[class*=check]{left:5px}svg[class*=remove]{right:5px}:host(:not([on])) svg[class*=check],:host([on]:not([on=false])) svg[class*=remove]{display:none}@media (prefers-reduced-motion:reduce){:host,:host:before{-webkit-transition:none!important;transition:none!important}}
  </style>
  ${SVG_CHECK_SM_18}
  ${SVG_REMOVE_SM_18}
  `;

  if (w.ShadyCSS) w.ShadyCSS.prepareTemplate(template, 'pearson-toggle');

  class Toggle extends HTMLElement {
    static get observedAttributes() {
      return ['on', 'disabled'];
    }

    get on() {
      return this.hasAttribute('on') & this.getAttribute('on') !== 'false';
    }

    set on(value) {
      const isOn = Boolean(value);
      if (isOn) {
        this.setAttribute('on', '');
      } else {
        this.removeAttribute('on');
      }
    }

    get disabled() {
      return this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
    }

    set disabled(value) {
      const isDisabled = Boolean(value);
      if (isDisabled) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    get name() {
      return this.getAttribute('name');
    }

    get value() {
      return this.getAttribute('value');
    }

    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      const clone = template.content.cloneNode(true);

      this.shadowRoot.appendChild(clone);

      this.onToggleClick = this.onToggleClick.bind(this);
      this.onToggleKeyDown = this.onToggleKeyDown.bind(this);

      this.onLabelClick = this.onLabelClick.bind(this);

      this.onDOMLoaded = this.onDOMLoaded.bind(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const isTruthy = newValue !== 'false';
      if (name === 'on') {
        this.setAttribute('aria-checked', isTruthy);
      }
      if (name === 'disabled') {
        this.setAttribute('aria-disabled', isTruthy);
        if (isTruthy) {
          this.removeAttribute('tabindex');
          this.blur();
        } else {
          this.setAttribute('tabindex', '0');
        }
      }
    }

    connectedCallback() {
      // Add attributes required for a11y
      if (!this.hasAttribute('tabindex') && !this.disabled) {
        this.setAttribute('tabindex', 0);
      }

      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'switch');
      }

      if (!this.hasAttribute('aria-checked')) {
        this.setAttribute('aria-checked', 'false');
      }

      // Lazily upgrade properties to make sure
      // observed attributes are handled properly
      this.upgradeProperty('on');
      this.upgradeProperty('disabled');

      // Bind listeners to the toggle
      this.addEventListener('click', this.onToggleClick);
      this.addEventListener('keydown', this.onToggleKeyDown);

      // If the consumer did not set an `aria-label`,
      if (!this.hasAttribute('aria-label')) {
        // We need to find an external one
        doc.addEventListener('DOMContentLoaded', this.onDOMLoaded, true);
      }
    }

    disconnectedCallback() {
      doc.removeEventListener('DOMContentLoaded', this.onDOMLoaded);

      if (this.labelNode) {
        this.labelNode.removeEventListener('click', this.onLabelClick);
      }
    }

    onToggleClick(e) {
      e.stopPropagation();
      this.toggleOn();
    }

    onToggleKeyDown(e) {
      if (e.altKey) {
        return;
      }

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.click();
          return;
      }
    }

    // When this label is clicked, we want to
    // click on this toggle and focus on it
    onLabelClick(e) {
      e.preventDefault();

      if (this.disabled) return;

      this.click();
      this.focus();
    }

    onDOMLoaded() {
      this.labelNode = this.findLabelNode();

      // If the external label does not have an ID, we must
      // ensure that it has one

      if (this.id !== null && this.labelNode !== null) {
        if (!this.labelNode.id) this.labelNode.id = this.id + 'label';
      }

      if (this.labelNode !== null) {
        // This toggle must be labelled by the external label node
        this.setAttribute('aria-labelledby', this.labelNode.id);
        // We listen for the external label to be clicked
        this.labelNode.addEventListener('click', this.onLabelClick);
      }
    }

    upgradeProperty(prop) {
      if (this.hasOwnProperty(prop)) {
        let value = this[prop];
        delete this[prop];
        this[prop] = value;
      }
    }

    toggleOn() {
      if (this.disabled) return;

      this.on = !this.on;

      // The toggle should emit a change event
      // for the benefit of consumers
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            on: this.on
          },
          bubbles: true
        })
      );
    }

    // Helper function for finding external label node
    findLabelNode() {
      if (this.parentElement.tagName === 'LABEL') {
        return this.parentElement;
      }
      const scope = this.getRootNode();
      return scope.querySelector(`label[for="${this.id}"]`);
    }
  }

  customElements.define('pearson-toggle', Toggle);
})(window, document);
