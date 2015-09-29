// client side js
(function() {

    // SearchList data array for filling in video box
    var searchListData = [];

    // DOM Ready ================================
    $(document).ready(function(){

        // Search button click
        $('#btnDoSearch').on('click', doSearch);

        // Show video link click. Must be done on static element.
        $('#resultList ul').on('click', 'li div a.linkshowvideo', showVideo);
    });

    // Functions ================================

    // Fill list with data
    function doSearch(event) {
        event.preventDefault();

        // Empty content string
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

    // Show YouTube Video
    function showVideo(event) {

        // Prevent link from firing
        event.preventDefault();

        // Retrieve video id from the link rel attribute
        var thisId = $(this).attr('rel');

        // Create url for video with thisId
        var url = "https://www.youtube.com/embed/" + thisId;

        // Create iframe for video
        var videoContent = '<iframe class="frameYouTube" scrolling="no" frameborder="no" src="' + url + '" ></iframe>';

        // Inject the video content string into our exiting HTML div
        $('#watchYouTube').html(videoContent);
    }

})();
