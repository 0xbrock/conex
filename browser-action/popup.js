var bg = browser.extension.getBackgroundPage();

let $ = function(s){ return document.querySelectorAll(s); };
let $1 = function(s){ return document.querySelector(s); };
let $e = function(name, attributes, children) {
  let e = document.createElement(name);
  for(let key in attributes) {
    if(key == 'content') {
      e.appendChild(document.createTextNode(attributes[key]));
      continue;
    }
    e.setAttribute(key.replace(/_/g, '-'), attributes[key]);
  }

  for(let i in children) {
    e.appendChild(children[i]);
  }

  return e;
};

function keyHandling(event) {
  let searchElement = $1('#search');
  if(event.key == "Enter") {
    try {
      if(tabId = document.activeElement.dataset.tabId) {
        bg.activateTab(tabId);
      } else if(url = document.activeElement.dataset.url) {
        bg.newTabInCurrentContainerGroup(url);
      } else if(cookieStoreId = document.activeElement.dataset.cookieStore) {
        browser.tabs.create({cookieStoreId: cookieStoreId})
      } else {
        console.error('unhandled active element:', document.activeElement);
      }
      window.close();
    } catch(e){};
    return false;
  } else if(event.key == "Tab") {
  } else if(document.activeElement != searchElement) {
    $1('#search').focus();
    $1('#search').value = "";
    if(event.key.length == 1) {
      $1('#search').value = event.key;
    }
  }
}

document.body.addEventListener("keypress", keyHandling);

function sectionElement(id, color, name, tabindex) {
  return $e('ul', {id: id},[
      $e('li', {tabindex: tabindex || 1, class: 'section', data_cookie_store: id}, [
        $e('div', {}, [
          $e('span', {class: 'circle circle-'+color, content: ' '}),
          $e('span', {content: name}),
        ])
      ])
  ]);
}

function makeHistoryItem(searchItem) {
  element = $e('li', {tabindex: 1, class: 'thumbnail', data_title: searchItem.title.toLowerCase(), data_url: searchItem.url.toLowerCase()}, [
      $e('div', {}, [
        $e('div', {class: 'text'}, [
          $e('div', {class: 'tab-title', content: searchItem.title}),
          $e('div', {class: 'tab-url', content: searchItem.url.replace('http://','').replace('https://','')})
        ])
      ])
  ]);
  element.addEventListener('click', _ => bg.newTabInCurrentContainerGroup(searchItem.url));

  return element;
}

function renderTabGroups() {
  return new Promise((resolve, _) => {
    let getContexts = browser.contextualIdentities.query({});
    getContexts.then(contexts => {
      for(let i in contexts) {
        $1('#tabgroups').appendChild(sectionElement(contexts[i].cookieStoreId, contexts[i].color, contexts[i].name));
      }
      $1('#tabgroups').appendChild(sectionElement('firefox-default', 'none', 'default'));
    }, e => console.error(e));
    resolve({});
  });
}

let tabs = bg.getTabsByGroup();
let tabGroups = renderTabGroups();

setTimeout(function(){
  document.getElementById('search').focus();
  tabGroups.then(_ => {
    tabs.then(elements => {
      for(tabGroup in elements) {
        let ul = $1('#'+tabGroup);
        elements[tabGroup].forEach(function(element) {
          element.addEventListener("click", function() {
            bg.activateTab(element.dataset.tabId);
            window.close();
          });
          ul.appendChild(element);
        });
      }
    });


    // filter results
    document.querySelector('#search').addEventListener("keyup", function(event) {
      if(event.target.value != "") {
        Array.from(document.querySelectorAll('.thumbnail')).forEach(function(element) {
          let searchTerms = element.dataset.title + element.dataset.url;
          if(searchTerms) {
            let matchesSearchTerms = event.target.value.split(" ").every(searchTerm => {
              return searchTerms.indexOf(searchTerm.toLowerCase()) >= 0
            });
            element.style.display = matchesSearchTerms ? "" : "none";
          }
        });

        Array.from($('#tabgroups ul')).forEach(ul => {
          ul.querySelector('li.section').tabIndex = -1; // section should not be selectable when we have search results

          // hide sections that don't have tabs that match the search
          if(Array.from(ul.querySelectorAll('li.thumbnail')).filter(li => li.style.display != "none") == 0) {
            ul.style.display = "none";
          } else {
            ul.style.display = "";
          }
        });

        // search history for search strings that are longer than one letter
        if(event.target.value.length > 1 && $('#history ul li').length == 0) {
          console.log("fetching history");
          document.getElementById('history').innerHTML = "";
          let historyUl = document.getElementById('history');
          let historySection = sectionElement('', 'none', 'history', -1);
          historyUl.appendChild(historySection);
          var searching = browser.history.search({
            text: event.target.value,
            startTime: 0
          }).then(result => {
            let tabLinks = Array.from($('#tabgroups li')).map(t => t.dataset.url);
            console.log(tabLinks);
            let historyTags = result
              .sort((a,b) => b.visitCount - a.visitCount)
              .filter(e => ! tabLinks.includes(e.url.toLowerCase().replace('http://', '').replace('https://', '')))
              .forEach(searchResult => historyUl.appendChild(makeHistoryItem(searchResult)));
          }, e => console.error(e));
        } else if(event.target.value.length <= 1) {
          console.log("deleting history");
          document.getElementById('history').innerHTML = "";
        } else {
          console.log("using cached history");
        }
      } else {
        document.getElementById('history').innerHTML = "";
        Array.from($('#tabgroups ul')).forEach(ul => {
          ul.style.display = "";
          ul.querySelector('li.section').tabIndex = 1;
        });
        Array.from($('#tabgroups li.thumbnail')).forEach(li => li.style.display = "none" )
      }
    });
  }, e => console.error(e));
},200);

