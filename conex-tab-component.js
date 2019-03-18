import {$, $1, $e} from './conex-helper.js'

const tabItem = (data) => `
  <form class="tab-item ${data.color}" action="">
    <input type="hidden" name="tab-id" value="${data.tabId}"/>
    <input title="show tab" type="radio" id="tabid-${data.tabId}-title" name="action" value="focus-tab"/>
    <label title="show tab" class="tab-thumbnail" for="tabid-${data.tabId}-title">
      <img class="thumbnail-image" src="${data.thumbnail}" alt="thumbnail" width="200"/>
    </label>
    <label title="show tab" class="tab-favicon" for="tabid-${data.tabId}-title">
      <img class="favicon-image" alt="favicon" src="${data.favicon}" />
    </label>
    <label title="show tab" class="tab-content" for="tabid-${data.tabId}-title">
        <div class="tab-title">${data.title}</div>
        <div class="tab-url">${data.url}</div>
    </label>
    <input title="close tab" type="radio" id="tabid-${data.tabId}-close-tab" name="action" value="close-tab"/>
    <label title="close tab" class="tab-close" for="tabid-${data.tabId}-close-tab">&#9587;</label>
    <input type="submit"/>
  </form>
`;

class TabItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.ignoredKeyDownKeys = ['Tab'];
    const d = {color: this.getAttribute('color'),
              tabId: this.getAttribute('tab-id'),
              thumbnail: this.getAttribute('thumbnail'),
              favicon: this.getAttribute('favicon'),
              title: this.getAttribute('tab-title'),
              url: this.getAttribute('url')}

    this.innerHTML = tabItem(d);
    this.form = $1('form', this);

    this.addEventListener("keydown", e => {
      console.debug('tab-item keydown', e);
      if(this.ignoredKeyDownKeys.includes(e.key)) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();

      switch (e.key) {
        case "ArrowUp":   this.focusPreviousTabOrContainer(); return;
        case "ArrowDown": this.focusNextTabOrContainer(); return;
        case "Enter":     $1('input[value=focus-tab]', this).checked = true; break;
        case "Backspace": $1('input[value=close-tab]', this).checked = true; break;
        default:          this.continueSearch(e); return;
      }
      $1('form', this).dispatchEvent((new Event('change')));
    });

    this.form.addEventListener("change", e => {
      switch($1('input[name=action]:checked').value) {
        case 'focus-tab': this.focusTab(); break; 
        case 'close-tab': this.closeTab(); break;
        default: console.error('unknown action: ', $1('input[name=action]:checked'));  break;
      }
    });
  }

  continueSearch(e) {
    console.debug('continue search placeholder for:', e);
  }

  focusTab() {
    console.debug('show tab');
    
  }

  closeTab() {
    console.debug('close tab');
  }

  focusNextTabOrContainer() {
    let elem = this;
    do {
      elem = elem.nextElementSibling;
      if (elem == null) {
        this.parentElement.nextElementSibling && this.parentElement.nextElementSibling.focus();
        return;
      }
    } while (elem.style.display == "none");

    elem.focus();
  }

  focusPreviousTabOrContainer() {
    let elem = this;
    do {
      elem = elem.previousElementSibling;
      if (elem.nodeName != 'TAB-ITEM') {
        this.parentElement.focus();
        return;
      }
    } while (elem.style.display == "none");

    elem.focus();
  }

  disconnectedCallback() {
    console.debug('tab-item disconnnected');
  }

  adoptedCallback() {
    console.debug('tab-item adopted');
  }
};

window.customElements.define('tab-item', TabItem);

// <tab-item tabindex='2' color='blue-marker' tab-id='42' thumbnail='./thumbnail.jpg' favicon='./favicon.ico' tab-title='0 this is a wonderful title' url='heise.de/artikel/golang'></tab-item>
export const createTabComponent = function(tabId, tabIndex, tabTitle, url, color) {
  return $e('tab-item', {tabindex: tabIndex,
                         tab_id: tabId,
                         tab_title: tabTitle || "...",
                         url: url,
                         color: color,
                         thumbnail: './thumbnail-placeholder.jpg',
                         favicon: './favicon-placeholder.ico'});
}

console.debug('conex-tab-component.js successfully loaded');
