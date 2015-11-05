import Backbone from 'backbone';
import EditCardView from './views/editCard';
import AddCardView from './views/addCard';

let Router = Backbone.Router.extend({
  
  routes: {
    ''              : 'home',
    'register'      : 'register'
    'deck'          : 'userView',
    'deck/:deckID'  : 'deckView',
    'addDeck'       : 'addDeck',
    'card/:cardID'  : 'imageView',
    'addCard'       : 'addCard'
  },

  start() {
    Backbone.history.start();
  },

    initialize(appElement) {
    this.el = appElement;
    this.deck = new deckCollection();
    this.card = new cardCollection();
    this.user = new userCollection();
    let router = this;
  },

  goto(route) {
    this.navigate(route, {trigger: true});
  },

  render(component){
    ReactDom.render(component, this.el);
  },


  logout() {
    
  },

  register() {
    //FIXME Function below belongs on actual Register VIEW. 
    // let request = $.ajax({
    //   url: 'http://localhost:3000/login',
    //   method: 'POST',
    //   data: {
    //     user: {
    //       username: '',
    //       full_name: '',
    //       password: '',
    //     }
    //   }
  },

  home() {
    this.user.fetch().then(() => {
      this.render(<HomeView
        onHomeClick={() => this.goto('')}
        onLoginClick={() => this.goto('login')}
        onLogoutClick={()=> this.goto('logout')}
        onRegisterClick={() => this.goto('register')}
      );
    });
  },

  imageView(id) {
    let card = this.cardCollection.get(id)

    if (card) {
      this.render(
        <EditCardView data={data}/>
      );
    } else {
      card = this.cardCollection.fetch().then(() => {
        this.render( <EditCardView data={data}/> );
     
      });
    }
  },

  addCard() {
    this.render(
      <AddCardView cancelClick={this.goto('deck/:deckID')}
    );
  },

});