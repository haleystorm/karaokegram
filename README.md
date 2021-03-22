# KARAOKEGRAM
Send a performance to a long distance friend.

The brain child of N. Cooler and K. Wisniewski,
this collaborative art-app-in-progress hopes to bring silly song and danciness to our internet friends.


    Karaokegram's webcam recording is only supported by Firefox.


Karaokegram runs on Node with Express, Pug, and Stylus. It uses the Google YouTube api to search for videos and does audio/video capture using ```navigator.getUserMedia()```. Read [Capturing Audio & Video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-resources) for more info.


Suggestions and tips are welcome.


## Setup

1. Install [Node.js](http://nodejs.org/)

2. Install [Grunt](http://gruntjs.com/getting-started#installing-the-cli)

3. Clone the karaokegram repository
   ```sh
   $ git clone https://github.com/haleystorm/karaokegram.git
   ```

4. Navigate to the karaokegram folder
   ```sh
   $ cd karaokegram
   ```

5. Install dependencies
   ```sh
   $ npm install
   ```

6. Create config file
   ```sh
   $ cp config/default-example.json config/default.json
   ```

7. Add api key and gmail password to default.json

8. Serve the presentation and monitor source files for changes
   ```sh
   $ grunt
   ```

9. Open <http://localhost:3000>.



## License

MIT licensed

Copyright (C) 2015 Haley Quentmeyer, http://haleystorm.github.io/
