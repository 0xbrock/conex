const tabContainers = renderTabContainers();

const openInDifferentContainer = function(element) {
  try {
    if(cookieStoreId == element.dataset.cookieStore) {
      bg.openActiveTabInDifferentContainer(cookieStoreId);
    }
    window.close();
  } catch(e){ console.error(e); }
}

const keyHandling = function(event) {
  if(event.key == 'Enter') {
    openInDifferentContainer(document.activeElement);
    return false;
  }
};

tabContainers.then(() => {
  $1('li').focus();
  if(bg.lastCookieStoreId != bg.defaultCookieStoreId) {
    $1('#'+bg.lastCookieStoreId+' li').focus();
  }
});

for(const section of $('.section')) {
  section.addEventListener('click', () => { openInDifferentContainer(section); });
}

document.body.addEventListener('keypress', keyHandling);
