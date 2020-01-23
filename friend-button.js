(function(w, doc) {
  'use strict';

  const template = doc.createElement('template');

  template.innerHTML = `
    <style>
    button{
      height:44px;
      width:120px;
      padding: 0 10px;
      margin:0 auto;
      background-color:#4A90E2;
      border-radius:8px;
      color:white;
      font-family:sans-serif;
      font-size:14px;
      display:flex;
      align-items:center;
      border:none;
      cursor:pointer;
    }
    button img{
      margin-right:12px;
    }
    .added{
      background-color:#4AE29F;
    }
    </style>
    <button><img src="add-24.svg"><span>Add friend</span></button>
`;

  class FriendButton extends HTMLElement {

    static get observedAttributes() {
      return ['friend'];
    }

    set friend(value) {
      const isFriend= Boolean(value);
      if (isFriend)
       this.setAttribute('friend', '');
      else
       this.removeAttribute('friend');
    }

    get friend() {
      return this.hasAttribute('friend');
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      const clone = template.content.cloneNode(true);
      this.shadowRoot.appendChild(clone);
    }

    connectedCallback(){
      //read from parent to reflect state
      if(this.getRootNode().host.friend != null) this.friend = true;

      this.addEventListener('click', this.onClick);
    };

    disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
    }

    attributeChangedCallback(name, oldValue, newValue){
      newValue!=null ? this.setAdded() : this.reset();
    }

    onClick() {
      this.friend = !this.friend;
      //set parent card to reflect the change
      this.getRootNode().host.friend = this.friend;
    }

    setAdded(){
      this.shadowRoot.querySelector('button').classList.add('added');
      this.shadowRoot.querySelector('span').innerText = "Added!";
      this.shadowRoot.querySelector('img').setAttribute('src','correct-24.svg');
    }

    reset(){
      this.shadowRoot.querySelector('button').classList.remove('added');
      this.shadowRoot.querySelector('span').innerText = "Add friend";
      this.shadowRoot.querySelector('img').setAttribute('src','add-24.svg');
    }

  }

  customElements.define('friend-button',FriendButton);

})(window, document);
