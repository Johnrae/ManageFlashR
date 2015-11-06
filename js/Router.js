import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import Backbone from 'backbone';
import React from 'react';
import ReactDom from 'react-dom';
import Cookies from 'js-cookie';

import {
  UserCollection,
  UserModel,
  CardCollection,
  CardModel,
  DeckCollection,
  DeckModel
} from './resources';

import {
  RegisterPage,
  UserView,
  DeckView,
  NavView,
  EditCardView,
  AddCardView,
  LoginPage,
} from './views';

let Router = Backbone.Router.extend({
  
  routes: {

    ''                            : 'home',
    'loginPage'                   : 'LoginPage',
    'login'                       : 'login',
    'isLogged'                    : 'isLogged',
    'registerPage'                : 'RegisterPage',
    'register'                    : 'register',
    'dashboard'                   : 'userView',
    'deck/addDeck'                : 'addDeck',
    'deck/:deckID'                : 'deckView',
    'deck/:deckID/cards/:cardID'  : 'cardView',
    'deck/:deckID/addCard'        : 'addCard'
  },


  start() {
    Backbone.history.start();
  },

  initialize(appElement) {
    this.el = appElement;
    this.deck = new DeckCollection();
    this.card = new CardCollection();
    this.user = new UserCollection();
    let router = this;
  },

  goto(route) {
    this.navigate(route, {
      trigger: true,
      replace: true
    });
  },

  render(component){
    ReactDom.render(component, this.el);
  },

  loginPage() {
    ReactDom.render(
      <LoginPage
        user={Cookies.getJSON('user')}
        onLoginClick={() => this.navigate('login', {trigger: true})}
        // onLogoutClick={() => this.navigate('logout', {trigger: true})}
        onRegisterClick={() => this.navigate('registerPage', {trigger: true})}/>,
      document.querySelector('.app')
    );
  },

  login() {
    let request = $.ajax({
      url: `https://rocky-garden-9800.herokuapp.com/signup`,
      method: 'POST',
      data: {
        username: $('#username').val(),
        password: $('#password').val(),
      }
    });
    $('.app').html('loading...');
    request.then((data) => {
      console.log('data:', data);
      Cookies.set('user', data);
      $.ajaxSetup({
        headers: {
          auth_token: data.access_token
        }
      });
      this.goto('userPage');
    }).fail(() => {
      $('.app').html('Try again');
      alert('Sorry, your login was rejected.  Please try again, or Register as a New User.');
    });
  },

  isLogged() {
    console.log('PLASE');
    if (Cookies.get('user')) {
      this.goto('deck');
    } else {
      this.goto('loginPage');
    }
  },

  registerPage() {
    ReactDom.render(
      <RegisterPage 
        user={Cookies.getJSON('user')}
        onRegisterClick={() => this.navigate('register', {trigger: true})}/>,
      document.querySelector('.app')
    );
  },

  register() {
    let request = $.ajax({
      url: `https://rocky-garden-9800.herokuapp/signup`,
      method: 'POST',
      data: {
        username: $('#username').val(),
        fullname: $('#fullname').val(),
        email: $('#email').val(),
        password: $('#password').val(),
      }
    });
    $('.app').html('loading...');
    request.then((data) => {
      console.log('data:', data);
      Cookies.set('user', data);
      $.ajaxSetup({
        headers: {
          auth_token: data.access_token
        }
      });
      this.goto('deck');
    }).fail(() => {
      $('.app').html('Submit again');
    });
  },

  home() {

    this.goto('isLogged');

  },

  deckView(id) {
    this.deck.fetch().then(() => {
      this.render(
        <deckViewComponent
        onCardSelect = {() => this.goto('card/'+ id)}
        onAddCardClick = {() => this.goto('addCard')}
        onBackBtnClick = {() => this.goto('deck')}/>
      );
   });  
  },

  addDeck(){
    this.render(
      <addDeck
      onBackBtnClick={() => this.goto('deck')}
      onSubmitClick={(title) =>{
        letnewQuestion = document.querySelector('.enterTitle').value;
        letnewDeck = new DeckCollection ({
          Title: title,
        })
        newDeck.save().then(() => {
          this.goto('addCard')})
        }
      }/>
    )
  },
 
  saveEdit(quest, ans, cardId) {
    this.card.get(cardId).save({
      Question: quest,
      Answer: ans
    }).then(() => this.goto('deck/'+ deckId));
  },

  cardView(cardId) {
    let card = this.card.get(cardId);

    this.render(
      <EditCardView 
        data={card}
        onSubmitClick={ (quest, ans) => this.saveEdit(quest, ans, cardId) }
      />
    );
  },

  addCard() {

    this.render(
      <AddCardView 
        onCancelClick={this.goto()}
        onSubmit={(quest, ans) => {
          let cardAddition = new CardModel({
            Question: quest,
            Answer: ans
          })
         cardAddition.save().then(()=> this.goto('deck/'));
        }}/>
    );
  },

});

export default Router;
