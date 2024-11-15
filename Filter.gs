// public accessor to this module - strategy pattern
function filterData(data, merchantType, strategy = "direct") {
    switch (strategy) {
    case 'direct':
        return directFilter(data, merchantType);
    case 'fuzzy':
        return fuzzyMatchFilter(data, merchantType);
    }
}

function fuzzyMatchFilter(data, merchantType) {
    let shopNameListSDx = [];

    shopNameListSDx = data.map(getMassagedShopListInSoundex);

    let refListSDx = getMerchantCache(merchantType).map(s => soundex(s));

    // TODO: need to implement an anti-soundux alg'm handling the case of A&W & A&A precisely {n}000

    let idx = shopNameListSDx.reduce(reduceToIdx(refListSDx), []);
    let idxFinalized = idx.map(x => x + 1);
    return idxFinalized;
}

function reduceToIdx(refListSDx) {
    return (accumulator, currentValue, currentIndex, array) => {
        if (refListSDx.includes(currentValue))
            accumulator.push(currentIndex);
        return accumulator;
    }
}

/**********************************************************
 * soundex is nice; but cannot find short-form by the alg'm
 * popy -> limitation to remove geographical data [OK]Scarborough [X]North York
 * [TODO] if move to other place, control the default of popy
 **********************************************************/
function getMassagedShopListInSoundex(id, idx, arr) {
    return getShopNameInSoundex(arr[idx][2]);
}

function popy(shopPreprocess) {
    let popy = 2;
    // normally, the right side is province/area, no need to analyze for my needs
    while (popy >= 1) {
        popy--;
        shopPreprocess.pop();
    }
    return shopPreprocess;
}

function getShopNameInSoundex(shopDescription) {
    let shopPreprocess = shopDescription.split(' ');
    popy(shopPreprocess);
    return soundex(shopPreprocess.join(' '));
}

function directFilter(data, merchantType) {
    let typeCode = getMerchantCache(merchantType);
    let result = data
        .reduce((c, v, i) =>
            v[2].startsWith(typeCode) ? c.concat(i + 1) : c, []);
    return result;
}

// filter target: starts with Symbol or numbers
const regexStartwSymbolFollowedByNumber = /^[\W0-9]{1,}/gm;
function filterPureNumberItem(value) {
    return !regexStartwSymbolFollowedByNumber.test(value);
}
