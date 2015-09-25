// client side js
(function() {

    // SearchList data array for filling in video box
    var searchListData = [];

    // DOM Ready ================================
    $(document).ready(function(){

        // Search button click
        $('#btnDoSearch').on('click', doSearch);
    });

    function doSearch(event) {
        event.preventDefault();

        var tableContent = '';

        var q = $('#searchYouTube fieldset input#inputSearch').val();

        $.getJSON( '/users/searchList?q=' + q, function( data ) {

            // Stick our search list data into the global object
            searchListData = data;

            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function() {
                tableContent += '<li>';
                tableContent += '<div class="result">';
                tableContent += '<a href="#" class="linkshowvideo" rel="' + this.id + '">' + this.title + '</a>';
                tableContent += '<div class="description">';
                tableContent += this.description;
                tableContent += '</div>';
                tableContent += '</div>';
                tableContent += '</li>';
            });

            // Inject the whole content string into our existing HTML table
            $('#resultList ul').html(tableContent);
        });
    }

})();