(function(w, doc) {
  'use strict';

  const template = doc.createElement('template');

  template.innerHTML = `
    <style>
      :host{
        height:500px;
        width:300px;
        display:block;
        background-color:rgba(0,0,0,0.8);
        border-radius:8px;
        padding:20px;
        color:white;
        margin:20px auto;
        font-family:sans-serif;
        position:relative;
      }
      :host input{
        width:100%;
        height:44px;
        background-color:transparent;
        border:none;
        border-bottom:1px solid white;
        color:white;
      }
      :host button{
        height:44px;
        width:100%;
        color:white;
        background-color:#DF5D48;
        border:none;
        border-radius:8px;
        cursor:pointer;
      }
      :host button::placeholder{
        color:white;
      }
      :host button, :host input{
        margin-top:20px;
      }
    </style>
    <h1>Login</h1>
    <span></span>
    <input type="email" placeholder="Email"></input>
    <input type="password" placeholder="Password"></input>
    <button type="submit">Login</button>
`;

  class Login extends HTMLElement {

    static get observedAttributes() {
      return ['access'];
    }

    set access(value) {
      const isFriend= Boolean(value);
      if (isFriend)
       this.setAttribute('access', 'logged-in');
      else
       this.removeAttribute('access');
    }

    get access() {
      return this.hasAttribute('access');
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      const clone = template.content.cloneNode(true);
      this.shadowRoot.appendChild(clone);
      //custom event
      var button = this.shadowRoot.querySelector("button");
      button.onclick = (evt) => {
        this.access = !this.access
        this.dispatchEvent(new CustomEvent("login", {
          detail: this.access
        }));
      };
    }

    connectedCallback(){
    };

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue){
      if(this.access) this.setAccess();
    }

    setAccess(){
      var h1 = this.shadowRoot.querySelector('h1'),
          message = this.shadowRoot.querySelector('span'),
          inputs = this.shadowRoot.querySelectorAll('input'),
          button = this.shadowRoot.querySelector('button');
      h1.innerText = "Welcome";
      for(var i = 0; i < inputs.length; i++){
          inputs[i].setAttribute('hidden','')
      }
      message.innerText = inputs[0].value + ' you are logged in!'
      button.setAttribute('hidden','');
    }

  }//end Class

  customElements.define('log-in',Login);

  var login = document.querySelector("log-in");
  login.addEventListener("login", (evt) => {
    console.log(evt.detail);
  });

})(window, document);
