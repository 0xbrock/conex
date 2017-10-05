const renderTabContainers = async function() {
  const tabContainers = $1('#tabcontainers');
  const identities = await browser.contextualIdentities.query({});

  browser.browserAction.setBadgeText({text: ''});
  for(const context of identities.concat({cookieStoreId: 'firefox-default', color: 'default', name: 'default'})
                                 .concat({cookieStoreId: 'firefox-private', color: 'private', name: 'private browsing tabs'})) {
    tabContainers.appendChild(createTabContainerHeaderElement(context.cookieStoreId, context.color, context.name));
  }

  return;
}

