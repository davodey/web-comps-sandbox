import './friend-button.js';

(function(w, doc) {
  'use strict';

  const template = doc.createElement('template');

  template.innerHTML = `
    <style>
      :host{
        display:block;
        height:200px;
        width:200px;
        padding-top:16px;
        background-color:#f5f5f5;
        box-shadow:0 2px 4px #c7c7c7;
        border-radius:8px;
        font-family:sans-serif;
        text-align:center;
        display:flex;
        justify-content:center;
      }
      :host img{
        height:70px;
        width:70px;
        border-radius:100%;
      }
    </style>
    <div>
    <img src="">
    <p>Name Here</p>
    <friend-button></friend-button>
    </div>
`;

  class Card extends HTMLElement {

    static get observedAttributes() {
      return ['photo', 'name', 'friend'];
    }

    get photo(){
      return this.getAttribute('photo');
    }

    set photo(val){
      if(val){
        this.setAttribute('photo',val);
      }else{
        this.removeAttribute('photo');
      }
    }

    get name(){
      return this.getAttribute('name');
    }

    set name(val){
      if(val){
        this.setAttribute('name',val);
      }else{
        this.removeAttribute('name');
      }
    }

    get friend(){
      return this.getAttribute('friend');
    }

    set friend(val){
      if(val){
        this.setAttribute('friend',val);
      }else{
        this.removeAttribute('friend');
      }
    }


    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      const clone = template.content.cloneNode(true);
      this.shadowRoot.appendChild(clone);
    }

    connectedCallback(){
      this.setDetails()
    };

    attributeChangedCallback(name, oldValue, newValue){
      if (oldValue === newValue) {
          return;
      }
      this.setDetails()
    }

    setDetails(){
      this.shadowRoot.querySelector('p').innerText = this.name;
      this.photo != null ? this.shadowRoot.querySelector('img').setAttribute('src',"https://placeimg.com/70/70") : this.shadowRoot.querySelector('img').setAttribute('src','custom.svg');
    }

  }

  customElements.define('custom-card',Card);

})(window, document);
