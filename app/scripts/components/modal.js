import React from 'react';
import Reflux from 'reflux';
import v from 'vquery';
import Modal from 'react-modal';

import style from './style';

import Settings from './settings';

import {clickStore, modalStore, prefsStore} from './store';
import {Btn, Col} from './bootstrap';

var Contribute = React.createClass({
  getInitialState(){
    return {
      contribute: false
    };
  },
  componentDidMount(){
    style.modal.content.top = '25%';
    style.modal.content.left = '25%';
    style.modal.content.right = '25%';
    style.modal.content.bottom = '35%';
  },
  handleContribution(opt){
    clickStore.set_click(true, false);
    if (opt === 'later') {
      prefsStore.set_prefs('installTime', Date.now());
      modalStore.set_modal(false);
    } else if (opt === 'no' || opt === 'contributed') {
      prefsStore.set_prefs('installTime', 'disable');
      modalStore.set_modal(false);
    } else if (opt === 'yes') {
      prefsStore.set_prefs('installTime', Date.now());
      modalStore.set_modal(false);
    }
  },
  handleCloseBtn(){
    clickStore.set_click(true, false);
    modalStore.set_modal(false);
  },
  render: function() {
    return (
      <Col size="12" className="about">
        <Btn style={{top: '26%', right: '26%'}} className="ntg-modal-btn-close" fa="close" onClick={this.handleCloseBtn} />
        <form  action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="8VL34HHRFN3LS" />
          <Btn onClick={()=>this.handleContribution('yes')} className="ntg-setting-btn" name="submit" style={{top: '60%'}} fa="paypal">Yes</Btn>
        </form>
        <Btn onClick={()=>this.handleContribution('later')} className="ntg-setting-btn" style={{top: '60%', marginLeft: '70px'}}>Maybe Later</Btn>
        <Btn onClick={()=>this.handleContribution('no')} className="ntg-setting-btn" style={{top: '60%', marginLeft: '173px'}}>No Thanks</Btn>
        <Btn onClick={()=>this.handleContribution('contributed')} className="ntg-setting-btn" style={{top: '60%', marginLeft: '266px'}}>I Already Contributed</Btn>
        <img src="../../images/icon-128-54.png" className="ntg-about"/>
        <div className="ntg-about">
          <h3 className="ntg-about">Thank you for using Tab Master 5000.</h3>
          <div>
            <p>Hi, my name is Jason Hicks and I am the author of TM5K. I build and maintain TM5K during my free hours. If you like using this extension, a contribution would help me continue fixing bugs, and adding new features.</p>
            <p>You can also contribute to this project by submitting <a href="https://github.com/jaszhix/tab-master-5000-chrome-extension/issues" target="_blank">issues</a> on Github if you come across a bug, or have a suggestion.</p>
            <p>Thank you very much!</p>
          </div>
        </div>
      </Col>
    );
  }
});

var ModalHandler = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState(){
    return {
      modal: {}
    };
  },
  propTypes: {
    collapse: React.PropTypes.bool
  },
  getDefaultProps(){
    return {
      collapse: true
    };
  },
  componentDidMount(){
    this.listenTo(modalStore, this.modalChange);
  },
  modalChange(){
    var modal = modalStore.get_modal();
    this.setState({modal: modal});
    if (prefsStore.get_prefs().animations) {
      style.modal.overlay.backgroundColor = 'rgba(216, 216, 216, 0.21)';
      if (modal.state) {
        v('#main').css({
          transition: '-webkit-filter .2s ease-in',
          WebkitFilter: 'blur(5px)'
        });
      } else {
        v('#main').css({WebkitFilter: 'none'});
      }
    } else {
      style.modal.overlay.backgroundColor = 'rgba(216, 216, 216, 0.59)';
      v('#main').css({WebkitFilter: 'none'});
    }
  },
  render: function() {
    var s = this.state;
    var p = this.props;
    return (
      <Modal
        id="modal"
        isOpen={s.modal.state}
        onRequestClose={()=>modalStore.set_modal(false)}
        style={style.modal}>
          {s.modal.type === 'settings' ? <Settings tabs={p.tabs} prefs={p.prefs} collapse={p.collapse} /> : null}
          {s.modal.type === 'contribute' ? <Contribute /> : null}
      </Modal>
    );
  }
});

export default ModalHandler;