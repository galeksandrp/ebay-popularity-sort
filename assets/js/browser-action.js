$(function () {
    // Get initial stored toggle value
    chrome.storage.sync.get({
        enableSortByPopularity: 'enable-sort-by-popularity'
    }, function(items) {
        // Set checkbox checked value based on stored toggle value
        $('#'+items.enableSortByPopularity).prop('checked', true);
        $('#'+items.enableSortByPopularity).prop('wasChecked', true);
    });

    $('[name="choice"]').change(function(){
        // Update stored toggle value using checkbox checked property
        chrome.storage.sync.set({
            enableSortByPopularity: $('[name="choice"]:checked').val()
        });
    });

    $('[name="choice"]').click(function(){
        if ($(this).prop('wasChecked')) {
        	$(this).prop('wasChecked', false);
        	chrome.storage.sync.set({
                enableSortByPopularity: false
            });
        	$(this).prop('checked', false);
        } else {
            $(this).prop('wasChecked', true);
        }
    });
});