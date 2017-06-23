// Wait for document to load
$(document).ready(function () {
    // Get on/off toggle value for this feature
    chrome.storage.sync.get({
        enableSortByPopularity: 'enable-sort-by-popularity',
        splitByQuantity: true
    }, function (options) {
        // Check whether this feature is disabled
        if (!options.enableSortByPopularity) {
            return;
        }

        // Array of search results
        var results = [];

        // Traverse search results
        $('li[listingid]'+(options.enableSortByPopularity.endsWith('-all') ? '' : ':has(.hotness-signal)')).each(function () {
            // Convert to jQuery object
            var listing = $(this);

            if (options.enableSortByPopularity.endsWith('-all') || listing.find('.hotness-signal:contains(" sold")').length) {
            if (options.enableSortByPopularity !== 'disable-sort') {
            // Default listing sold count to 0
            var soldCount = 0;

            // Get sold count as integer
            if (options.enableSortByPopularity === 'enable-sort-by-rating-all') {
                soldCount = parseInt($(listing.find('.selrat')[0]).text().replace(/[(,)]/g, '')) || 0;
            } else if (options.enableSortByPopularity === 'enable-sort-by-positive-all') {
                soldCount = parseFloat($(listing.find('.selrat')[1]).text()) || 0;
            } else {
                soldCount = parseInt(listing.find('.hotness-signal:contains(" sold")').text()) || 0;
            }

            if (options.enableSortByPopularity === 'enable-sort-by-price') {
                var feeEl = listing.find('.fee');

                var price = options.splitByQuantity ? (listing.find('.lvtitle').text().match(/(?: |^)[0-9]+x/i) ? parseFloat(listing.find('.lvprice.prc .bold').text().replace(',', ''))/listing.find('.lvtitle').text().match(/(?: |^)([0-9]+)x/i)[1] : parseFloat(listing.find('.lvprice.prc .bold').text().replace(',', ''))) : (parseFloat(listing.find('.lvprice.prc .bold').text().replace(',', '')));

                soldCount = (price+(feeEl.length ? parseFloat(listing.find('.fee').text().replace(',', '')) : 0))/soldCount || 0;

                listing.find('.lvprice.prc .bold').after('<div class="cmpat">Avg: '+soldCount+'</div>');
            } else if (options.enableSortByPopularity === 'enable-sort-by-average-all') {
                soldCount = parseInt($(listing.find('.selrat')[0]).text().replace(/[(,)]/g, ''))*(parseFloat($(listing.find('.selrat')[1]).text())/100) || 0;

                listing.find('.lvprice.prc .bold').after('<div class="cmpat">Avg: '+soldCount+'</div>');
            }
            }
            // Add item sold count and listing itself
            results.push({ sold: soldCount, listing: listing });

            // Delete element temporarily
            listing.remove();
            }
        });

        // Sort all listings by sold count DESC
        var sortFunc = function (a, b) {
            return b.sold - a.sold;
        };
        if (options.enableSortByPopularity === 'enable-sort-by-price') sortFunc = function (a, b) {
            return a.sold - b.sold;
        };
        if (options.enableSortByPopularity !== 'disable-sort') results.sort(sortFunc);

        // Get search results parent list
        var ul = $('ul#ListViewInner');

        // Re-add the sorted results
        ul.prepend(results.map(function(item){
            return item.listing;
        }));

        // Warn the user about the modified result order
        ul.prepend('<li><hr /></li>');
        ul.prepend('<li>These search results have been modified by <b>eBay™ Popularity Sort</b>.</li>');

        $('li[listingid]').each(function () {
            var listing = $(this);
            var feeEl = listing.find('.fee');
            listing.find('.lvprice.prc .bold').text(parseFloat(listing.find('.lvprice.prc .bold').text().replace(',', ''))+(feeEl.length ? parseFloat(listing.find('.fee').text().replace(',', '')) : 0));
        });
    });
});