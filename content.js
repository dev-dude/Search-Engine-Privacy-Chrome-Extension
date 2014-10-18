/******* Google Remove Tracking ******/
var self = this;

function sansTrackingUrl(pattern, savedThis) {
    return savedThis.attr('href').match('^(.*?)'+pattern)[1];
}

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
    if (document.location.href.indexOf('google') !== -1) {
        window.googInterval = false;
        if (!window.googInterval) {
            console.log('sanitizedLinks');
            googInterval = setInterval(function () {
                if (document.getElementById('rso')) {
                    if (document.getElementById('rso').children.length > 2) {
                        getAllLinks();
                    }
                }
            }, 1000);
        }
    }
});