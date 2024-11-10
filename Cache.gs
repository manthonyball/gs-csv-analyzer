// C1-default 10 mins timeout the cache, I make it 3 mins h; configure via script propertise
function getMerchantCache(key) {
  let merchantCache = CacheService.getScriptCache();
  let cache = merchantCache.get(key);
  if(cache==null){
    initializeCache(getMerchantMap());
    cache = merchantCache.get(key);
  }

  return cache.split(',');
}

function getSpecialHandlingCache() {
  let specialCache = CacheService.getScriptCache();
  let cache = specialCache.get('special');
  if(cache==null){
    let queryableSpecialHandling = JSON.parse(getSpecialHandlingMap());
    let specialHandling = Object.values(queryableSpecialHandling).flat();
    let obj = {'special':specialHandling}
    initializeCache(JSON.stringify(obj));
    cache = specialCache.get('special');
  }

  return cache.split(',');
}
//////////////////// Region - internal functions ////////////////////

function initializeCache(cacheContentString) {
  let jsonMap = JSON.parse(cacheContentString);
  let cache = CacheService.getScriptCache();
  for (const [key, value] of Object.entries(jsonMap))
    cache.put(key,value.toString(),PropertiesService.getScriptProperties().getProperties().CacheExpireInMinutes); // C1
}