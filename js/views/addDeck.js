//this view allows you to add a deck

import React from 'react';
import Backbone from 'backbone';

export default React.createClass({

submitHandler(){
  this.props.onSubmitClick();
},

backBtnHandler(){
  this.props.onBackBtnClick();
},

  render() {
    <div>
    <button className='backBtn' onClick={() => this.backBtnHandler()}>back</button>
      <form>
        <input placeholder='question'></input>
        <input placeholder='answer'></input>
        <button onClick={() => this.submitHandler()}>Submit</button>
      </form>

    </div>
    

  }
}); 