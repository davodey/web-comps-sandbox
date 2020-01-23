(function(w, doc) {
  'use strict';

  const template = doc.createElement('template');

  template.innerHTML = `
    <style>
      :host{height:50px;width:100%;background-color:#fff;box-shadow:0 2px 4px #c7c7c7;position:relative;overflow:hidden;font-size:14px;font-family:sans-serif;display:flex;align-items:center;cursor:pointer}:host img{margin:0 10px;width:30px;height:30px}:host p{font-size:14px}:host>p{text-transform:capitalize;width: 60px;}:host div{height:50px;width:100%;margin-left:10px;position:relative}:host div:after{content:'';display:block;flex-grow:1;height:50px;width:100%;transform-origin:100% 0;transform:skew(-45deg)}:host div p,:host div:after{position:absolute}:host div p{color:#fff;width:100%;left:50px;top:3px;z-index:1}:host div:after{right:-50px}p.gravity{color:#003666}div.gravity:after{background: linear-gradient(0.25turn,#007A98, #005D83, #002E60);}p.uxf{color:#39b4b3}div.uxf:after{background: linear-gradient(0.25turn,#3DC7C6, #39B4B3);}p.custom{color:#1cbc6c}div.custom:after{background: linear-gradient(0.25turn,#2DCF7E, #1CBC6C);}
    </style>
    <img>
    <p><slot name="source">Source</slot></p>
    <div>
      <p><slot name="info">Source</slot></p>
    </div>
`;

  class Banner extends HTMLElement {

    static get observedAttributes() {
      return ['source'];
    }

    get source(){
      return this.getAttribute('source');
    }

    set source(val){
      if(val){
        this.setAttribute('source',val);
      }else{
        this.removeAttribute('source');
      }
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      const clone = template.content.cloneNode(true);
      this.shadowRoot.appendChild(clone);
    }

    connectedCallback(){
      this.setProps();
      this.addEventListener('click', this.changeSource);
    };

    disconnectedCallback() {
      this.removeEventListener('click', this.changeSource);
    }

    attributeChangedCallback(name, oldValue, newValue){
      this.setProps();
    }

    setProps(){
      if(this.source === "gravity"){
        this.info = "This is a Gravity component.";
        this.img = 'gravity.svg';
      }else if(this.source === "uxf"){
        this.info = "This is an older UXF component not a part of Gravity.";
        this.img = 'uxf.svg';
      }else if(this.source === "custom"){
        this.info = "This is a custom component not a part of Gravity.";
        this.img = 'custom.svg';
      }
      this.shadowRoot.querySelector('slot[name="source"]').innerText = this.source;
      this.shadowRoot.querySelector('slot[name="info"]').innerText = this.info;
      this.shadowRoot.querySelector('img').src = this.img;
      this.shadowRoot.querySelector('img').alt = this.source;

      this.shadowRoot.querySelector('p:first-of-type').setAttribute('class',this.source)
      this.shadowRoot.querySelector('div').setAttribute('class',this.source)
    }

    changeSource(){
      const sources = ["gravity", "uxf", "custom"];
      var index = sources.indexOf(this.source);
      index <=1 ? this.source = sources[index+1] : this.source = sources[0];
    }

  }

  customElements.define('source-banner',Banner);

})(window, document);
