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
        $('li[listingid]'+(options.enableSortByPopularity.endsWith('-all') ? '' : ':has(.hotness-signal)')+', .s-item'+(options.enableSortByPopularity.endsWith('-all') ? '' : ':has(.s-item__itemHotness)')).each(function () {
            // Convert to jQuery object
            var listing = $(this);

            if (options.enableSortByPopularity.endsWith('-all') || listing.find('.hotness-signal:contains(" Sold"), .s-item__itemHotness:contains(" Sold")').length) {
            if (options.enableSortByPopularity !== 'disable-sort') {
            // Default listing sold count to 0
            var soldCount = 0;

            // Get sold count as integer
            if (options.enableSortByPopularity === 'enable-sort-by-rating-all') {
                soldCount = parseInt($(listing.find('.selrat, .s-item__seller-info-text')[0]).text().replace(/[(,)]/g, '')) || 0;
            } else if (options.enableSortByPopularity === 'enable-sort-by-positive-all') {
                soldCount = parseFloat($(listing.find('.selrat, .s-item__seller-info-text')[1]).text()) || 0;
            } else {
                soldCount = parseInt(listing.find('.hotness-signal:contains(" Sold"), .s-item__itemHotness:contains(" Sold")').text().replace(',', '')) || 0;
            }

            if (options.enableSortByPopularity === 'enable-sort-by-price') {
                var feeEl = listing.find('.fee, .s-item__shipping');
                var fee = feeEl.length ? (feeEl.text().trim() === 'Free International Shipping' ? 0 : parseFloat(feeEl.text().replace(',', ''))) : 0;

                var price = options.splitByQuantity ? (listing.find('.lvtitle, .s-item__title').text().match(/(?: |^)[0-9]+x/i) ? parseFloat(listing.find('.lvprice.prc .bold, .s-item__price').text().replace(',', ''))/listing.find('.lvtitle, .s-item__title').text().match(/(?: |^)([0-9]+)x/i)[1] : parseFloat(listing.find('.lvprice.prc .bold, .s-item__price').text().replace(',', ''))) : (parseFloat(listing.find('.lvprice.prc .bold, .s-item__price').text().replace(',', '')));

                soldCount = (price+fee)/soldCount || 0;

                listing.find('.lvprice.prc .bold, .s-item__price').after('<div class="cmpat">Avg: '+soldCount+'</div>');
            } else if (options.enableSortByPopularity === 'enable-sort-by-average-all') {
                soldCount = parseInt($(listing.find('.selrat, .s-item__seller-info-text')[0]).text().replace(/[(,)]/g, ''))*(parseFloat($(listing.find('.selrat, .s-item__seller-info-text')[1]).text())/100) || 0;

                listing.find('.lvprice.prc .bold, .s-item__price').after('<div class="cmpat">Avg: '+soldCount+'</div>');
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
        var ul = $('ul#ListViewInner, .srp-results');

        // Re-add the sorted results
        ul.prepend(results.map(function(item){
            return item.listing;
        }));

        // Warn the user about the modified result order
        ul.prepend('<li><hr /></li>');
        ul.prepend('<li>These search results have been modified by <b>eBay™ Popularity Sort</b>.</li>');

        $('li[listingid], .s-item').each(function () {
            var listing = $(this);
            var feeEl = listing.find('.fee, .s-item__shipping');
            var fee = feeEl.length ? (feeEl.text().trim() === 'Free International Shipping' ? 0 : parseFloat(feeEl.text().replace(',', ''))) : 0;
            listing.find('.lvprice.prc .bold, .s-item__price').text(parseFloat(listing.find('.lvprice.prc .bold, .s-item__price').text().replace(',', ''))+fee);
        });
    });
});