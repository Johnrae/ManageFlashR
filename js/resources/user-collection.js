import Backbone from 'backbone';
import userModel from './user-model.js';
import {APP_URL} from '../data.js';

let userCollection = Backbone.Collection.extend({

  url: APP_URL,

  model: userModel,

  parse(data) {
    return data.results;
  }

});

export default userCollection;