$(function () {
    // Get initial stored toggle value
    chrome.storage.sync.get({
        enableSortByPopularity: true,
        enableSortByPrice: false
    }, function(items) {
        // Set checkbox checked value based on stored toggle value
        $('#enable-sort-by-popularity').prop('checked', items.enableSortByPopularity);
        $('#enable-sort-by-price').prop('checked', items.enableSortByPrice);
    });

    $('#enable-sort-by-popularity').change(function(){
        // Update stored toggle value using checkbox checked property
        chrome.storage.sync.set({
            enableSortByPopularity: $('#enable-sort-by-popularity').prop('checked')
        });
    });

    $('#enable-sort-by-price').change(function(){
        // Update stored toggle value using checkbox checked property
        chrome.storage.sync.set({
            enableSortByPrice: $('#enable-sort-by-price').prop('checked')
        });
    });
});