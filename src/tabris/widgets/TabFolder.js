import NativeObject from '../NativeObject';
import Composite from './Composite';
import Tab from './Tab';
import {warn} from '../Console';

const EVENT_TYPES = ['select', 'scroll'];

export default class TabFolder extends Composite {

  get _nativeType() {
    return 'tabris.TabFolder';
  }

  _acceptChild(child) {
    return child instanceof Tab;
  }

  _addChild(child, index) {
    super._addChild(child, index);
    if (this.$children.indexOf(child) === 0) {
      child.$trigger('appear');
      this.$previousSelection = child;
    }
  }

  _removeChild(child) {
    let childIndex = this.$children.indexOf(child);
    let rightNeighbor = this.$children[childIndex + 1];
    let leftNeighbor = this.$children[childIndex - 1];
    let newSelection = rightNeighbor || leftNeighbor;
    if (newSelection) {
      this.selection = newSelection;
    } else {
      this._triggerChangeEvent('selection', null);
    }
    super._removeChild(child);
  }

  _listen(name, listening) {
    if (EVENT_TYPES.includes(name)) {
      this._nativeListen(name, listening);
    } else if (name === 'selectionChanged') {
      this._onoff('select', listening, this.$triggerChangeSelection);
    } else {
      super._listen(name, listening);
    }
  }

  _trigger(name, event) {
    if (name === 'select') {
      let selection = tabris._proxies.find(event.selection);
      return super._trigger('select', {selection});
    }
    if (name === 'scroll') {
      let selection = event.selection ? tabris._proxies.find(event.selection) : null;
      return super._trigger('scroll', {selection, offset: event.offset});
    }
    return super._trigger(name, event);
  }

  _triggerChangeEvent(name, value) {
    super._triggerChangeEvent(name, value);
    if (name === 'selection') {
      if (this.$previousSelection) {
        this.$previousSelection._trigger('disappear');
      }
      if (value) {
        value._trigger('appear');
      }
      this.$previousSelection = value;
    }
  }

  $triggerChangeSelection({selection}) {
    this._triggerChangeEvent('selection', selection);
  }

}

NativeObject.defineProperties(TabFolder.prototype, {
  paging: {type: 'boolean', default: false},
  tabBarLocation: {type: ['choice', ['top', 'bottom', 'hidden', 'auto']], default: 'auto'},
  tabMode: {type: ['choice', ['fixed', 'scrollable']], default: 'fixed'},
  selection: {
    set(name, tab) {
      if (this._children().indexOf(tab) < 0) {
        warn('Can not set TabFolder selection to ' + tab);
        return;
      }
      this._nativeSet('selection', tab.cid);
      this._triggerChangeEvent('selection', tab);
    },
    get() {
      if (!this.$children.length) {
        return null;
      }
      let selection = this._nativeGet('selection');
      return selection ? tabris._proxies.find(selection) : null;
    }
  },
  textColor: {type: 'color'},
  win_tabBarTheme: {type: ['choice', ['default', 'light', 'dark']], default: 'default'},
});
