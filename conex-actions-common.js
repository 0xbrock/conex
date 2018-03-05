const renderTabContainers = async function(parent) {
  const tabs = browser.tabs.query({audible: true});
  const identities = browser.contextualIdentities.query({});

  browser.browserAction.setBadgeText({text: ''});
  const identitiesWithAudibleContainers = (await tabs).map(x => x.cookieStoreId);
  for(const context of [{cookieStoreId: 'firefox-default', color: 'default', name: 'default'}]
                       .concat((await identities).sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase()))
                       .concat({cookieStoreId: 'firefox-private', color: 'private', name: 'private browsing tabs'})) {
    parent.appendChild(
      createTabContainerHeaderElement(
        context.cookieStoreId, 
        context.color, 
        context.name, 
        1,
        '',
        identitiesWithAudibleContainers.includes(context.cookieStoreId)));
  }
}
