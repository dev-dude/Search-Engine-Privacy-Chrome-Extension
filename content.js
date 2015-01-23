var self = this,
    randomIeVersion = ['MSIE 11.0','MSIE 10.0','MSIE 9.0','MSIE 8.0'],
    randomWindowsVersion = ['Windows NT 6.1','Windows NT 5.1','Windows NT 6.2'],
    not64 = ['WOW64;',''],
    randomRV = ['9.0.1','11.0','18.0','19.0','29.0','1.8.1.20','1.9.0.10'],
    firefox = [' Firefox/27.0','Firefox/25.0','Firefox/32.0'],
    currentBrowser;

function rv(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function generateRandomUserAgentForEveryRequest() {
// Determine if ie or firefox
    if (Math.floor((Math.random() * 1) + 1) === 1) {
        currentBrowser = {'ie': '; ' + rv(randomIeVersion) + '; ', 'firefox': '', 'trident': '; Trident/6.0'};
    } else {
        currentBrowser = {'ie': '; ', 'firefox': 'Gecko/20100101 ' + rv(firefox), 'trident': ''};
    }
    return 'Mozilla/5.0' + ' (' + rv(randomWindowsVersion) + currentBrowser.ie  + rv(not64) +
        ' rv:'+ rv(randomRV) +  currentBrowser.trident + ') ' + currentBrowser.firefox;
}

if (chrome.hasOwnProperty('webRequest')) {
    chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
            //console.log(JSON.stringify(details));
            var headers = details.requestHeaders,
                blockingResponse = {};

            for (var i = 0, l = headers.length; i < l; ++i) {
                if (headers[i].name == 'User-Agent') {
                    headers[i].value = generateRandomUserAgentForEveryRequest();
                    console.log(headers[i].value);
                    break;
                }
            }

            blockingResponse.requestHeaders = headers;
            return blockingResponse;
        },
        {urls: [ "http://*/*" ]}, ['requestHeaders', 'blocking']);
}

function sansTrackingUrl(pattern, savedThis) {
    return savedThis.attr('href').match('^(.*?)'+pattern)[1];
}

function poisonTracking() {}

function getAllLinks() {
    $('a').each(function() {
        var a,
            savedThis = $(this),
            sansTrackingUrl,
            parent,
            found = false;

        if (savedThis.attr('href')) {
            if (savedThis.attr('onmousedown') && savedThis.attr('onmousedown').indexOf('rwt') !== -1) {
                // Remove onmousedown click events
                savedThis.unbind().attr('onmousedown', 'false');
                found = true;
            } else if (savedThis.attr('href').indexOf('&stick') !== -1) {
                savedThis.attr('href', self.sansTrackingUrl('&stick', savedThis));
                found = true;
                // Remove sa potential url parameter tracking
            } else if (savedThis.attr('href').indexOf('&sa') !== -1) {
                savedThis.attr('href', self.sansTrackingUrl('&sa', savedThis));
                found = true;
            }

            if (found) {
                parent = savedThis.parent();
                savedThis.remove();
                a = document.createElement('a');
                a.setAttribute('class', savedThis.attr("class"));
                a.setAttribute('id', savedThis.attr("id"));
                a.setAttribute('href', savedThis.attr("href"));
                a.innerHTML = savedThis.html() + '*';
                parent.append(a);
            }

        }
    });
}

$(document).ready(function() {
    // Change to desired search engine
    if (document.location.href.indexOf('duck') !== -1) {
        window.checkInterval = false;
        if (!window.checkInterval) {
            console.log('sanitizedLinks');
            checkInterval = setInterval(function () {
                if (document.getElementById('rso')) {
                    if (document.getElementById('rso').children.length > 2) {
                        getAllLinks();
                    }
                }
            }, 1000);
        }
    }

});