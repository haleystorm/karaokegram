// client side js
(function() {

    // Check browser. Needed for recording api.
    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox');

    // Search list data array for filling in results list
    var searchListData = [];
    
    // Webcam stream for displaying in video html element
    var webcamStream = {};
    navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

    // MediaRecorder - http://w3c.github.io/mediacapture-record/MediaRecorder.html#MediaRecorderAPI
    var mediaRecorder = {};

    // Video data
    var videoBlob = {};

    // DOM Ready ================================
    $(document).ready(function(){

        // Check if browser if firefox. Show alert if it isn't.
        if(!is_firefox) {
            alert("Sorry, this site is only supported by Firefox.");
        }

        // Start streaming from the webcam
        if(navigator.getUserMedia) {
            navigator.getUserMedia({ audio: true, video: true }, onMediaSuccess, onMediaError);
        } else {
            alert('getUserMedia() is not supported in your browser');
        }

        // Search button click
        $('#btn-do-search').on('click', doSearch);

        // Search result video link click. Must be done on static element.
        $('#resultList ul').on('click', 'li div a.linkshowvideo', showVideo);

        // Start recording click
        $('#btn-start-recording').on('click', doStartRecording);

        // Stop recording click
        $('#btn-stop-recording').on('click', doStopRecording);

        // Send Video click
        $('#btn-submit').on('click', doSendVideo);

    });

    // Functions ================================

    // Send search info to server and fill result list with data received
    function doSearch(event) {
        event.preventDefault();

        // Empty content string
        var tableContent = '';

        var q = $('#searchYouTube fieldset input#inputSearch').val();

        $.getJSON( '/search?q=' + q, function( data ) {

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

    // Start web camera stream, start recording the stream, and disable start button
    function doStartRecording(event) {
        event.preventDefault();

        $('#btn-start-recording').attr('disabled', true);
        $('#btn-stop-recording').removeAttr('disabled');
        $('#btn-submit').attr('disabled', true);
        
        // Start recording from webcam
        // TODO check that webcamStream is active
        useMediaRecorder(webcamStream);
    }

    // Stop web camera stream, stop recording the stream, and re-enable start button
    function doStopRecording(event) {
        event.preventDefault();

        $('#btn-stop-recording').attr('disabled', true);
        $('#btn-start-recording').removeAttr('disabled');
        $('#btn-submit').removeAttr('disabled');

        // Stop recording from webcam
        mediaRecorder.stop();
        //webcamStream.stop();
    }

    // Send video data and form information to server
    function doSendVideo(event) {
        event.preventDefault();

        // Super basic validation - increase errorCount variable if any fields are blank
        var errorCount = 0;
        $('#sendVideo input').each(function(index, val) {
            if($(this).val() === '') { errorCount++; }
        });

        // TODO check blob size and fail if too small

        // Check and make sure errorCount is still at zero
        if(errorCount === 0) {
            console.log("sending data to server");

            var fd = new FormData();
            fd.append('username', $('#sendVideo fieldset input#inputUserName').val());
            fd.append('email', $('#sendVideo fieldset input#inputUserEmail').val());
            fd.append('friendname', $('#sendVideo fieldset input#inputFriendName').val());
            fd.append('friendemail', $('#sendVideo fieldset input#inputFriendEmail').val());
            fd.append('video.webm', videoBlob, 'video.webm');

            // Post data to server
            // var request = new XMLHttpRequest();
            // request.open("POST", "/users/upload");
            // request.send(fd);
            $.ajax({
                type: 'POST',
                data: fd,
                url: '/upload',
                cache: false,
                contentType: false,
                processData: false,
            }).done(function( response ) {
                // Clear the camera
                var video = document.querySelector('video');
                video.src = '#';
                videoBlob = {};

                // Clear the form inputs
                $('#sendVideo fieldset input').val('');

                alert("Thanks for using karaokegram!");
            });
        }
        else {
            // If errorCount is more than 0, error out
            alert('Please fill in all fields');
            return false;
        }
    }

    // Show selected YouTube Video
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

    function onMediaError(e) {
        console.error('media error', e);
    }

    function onMediaSuccess(stream) {

        // Stick our stream into the global object
        webcamStream = stream;

        // Set video source to camera stream
        var video = document.querySelector('video');
        video.controls = false;
        video.muted = true;
        video.src = window.URL.createObjectURL(stream);
        
        video.play();
    }

    function useMediaRecorder(stream) {
        var video = document.querySelector('video');

        //video.addEventListener('loadedmetadata', function() {

            // Stick our recorder into the global object
            mediaRecorder = new MediaRecorder(stream);

            // Data is available once the mediaRecorder is stopped.
            mediaRecorder.ondataavailable = function(event) {
                console.log('ondataavailable', event.data.type, event.data.size, event.data);

                if (!event.data.size) {
                    console.warn('Recording of', event.data.type, 'failed.');
                    return;
                }

                // Stick the video data into the global object
                videoBlob = new window.Blob([event.data], {
                    // at this stage, Firefox MediaRecorder API doesn't allow to choose the output mimeType format!
                    // It specifies the container format as well as the audio and video capture formats.
                    type: event.data.type || self.mimeType || 'audio/ogg'
                });
            };

            mediaRecorder.start();
        //}, false);
    }

})();
