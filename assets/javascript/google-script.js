
  window.onload = function(){
    GoogleObj.init();
  };


  const GoogleObj = {

    images : ["./assets/images/crystal-1.jpg", "./assets/images/crystal-2.jpg", "./assets/images/crystal-3.jpg", "./assets/images/crystal-4.jpg"],
    authButton: document.getElementById("log-in"),
    createAlbumButton: document.getElementById("create-album"),
    getPicButton: document.getElementById("get-pic"),
    uploadPicButton: document.getElementById("upload-pic"),
  
    albumInput: document.getElementById("album-input"),

    picDiv: document.getElementById("div-pic"),
    resultDiv: document.getElementById("div-result"),
    gallaryDiv: document.getElementById("div-gallary"),

    Clientid:   "137123594979-ian7b2a2qullo5lj0chv4cfeu6hhklim.apps.googleusercontent.com",
    SignInScope: "https://www.googleapis.com/auth/photoslibrary",
    APIKey: "AIzaSyCBYvgkH707PEctHZZ22ufrvU_SNvqT5p8",
    ClientURL: "https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest",

    init : function() {
      this.gapiload();      
    },

    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
    }  ,

    gapiload: function () {  
              gapi.load("client:auth2", function() {
                        gapi.auth2.init({client_id: this.Clientid.bind(GoogleObj)});
              });
    }, 

    authenticate: function () {
      return gapi.auth2.getAuthInstance()
      .signIn({scope: this.SignInScope.bind(GoogleObj) })
      .then(function() { 
                          console.log("Sign-in successful"); 
      }, function(err) { 
                          console.error("Error signing in", err); 
      });
    },

    loadClient: function () {
      gapi.client.setApiKey(this.APIKey.bind(GoogleObj));
      return gapi.client.load(this.ClientURL.bind(GoogleObj))
      .then(function() { 
                        console.log("GAPI client loaded for API"); 
      }, function(err) { 
                        console.error("Error loading GAPI client for API", err); 
      });
    },


    createAlbum: function (albumName) {      
      return gapi.client.photoslibrary.albums.create({
          "resource": {
                  "album": {
                            "title": albumName
                  }
          }
      })
      .then(function(response) {
                                console.log("Response", response);
      }, function(err) { 
                          console.error("Execute error", err); 
      });
    },

  };

  GoogleObj.authButton.addEventListener("click", function () {          
          GoogleObj.authenticate().then(GoogleObj.loadClient);
  });

  GoogleObj.createAlbumButton.addEventListener("click", function () {
    GoogleObj.createAlbum(GoogleObj.albumInput.value);
    GoogleObj.albumInput.value = "";
  });

  GoogleObj.getPicButton.addEventListener("click", function () {    
    GoogleObj.picDiv.innerHTML = "";
    const img = document.createElement("img");    
    img.src = GoogleObj.images[GoogleObj.getRandomInt(0,3)];
    img.alt = GoogleObj.images[GoogleObj.getRandomInt(0,3)];
    img.style = "width: 200px; height:200px;";
    GoogleObj.picDiv.appendChild(img);
  });
 
  //authenticate().then(loadClient)


  
  // function authenticate() {
  //   return gapi.auth2.getAuthInstance()
  //       .signIn({scope: "https://www.googleapis.com/auth/photoslibrary"})
  //       .then(function() { console.log("Sign-in successful"); },
  //             function(err) { console.error("Error signing in", err); });
  // }

  // function loadClient() {
  //   gapi.client.setApiKey("AIzaSyCBYvgkH707PEctHZZ22ufrvU_SNvqT5p8");
  //   return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
  //       .then(function() { console.log("GAPI client loaded for API"); },
  //             function(err) { console.error("Error loading GAPI client for API", err); });
  // }
  // // Make sure the client is loaded and sign-in is complete before calling this method.
  // function execute() {
  //   return gapi.client.photoslibrary.albums.create({
  //     "resource": {
  //       "album": {
  //         "title": "Potato-App"
  //       }
  //     }
  //   })
  //       .then(function(response) {
  //               // Handle the results here (response.result has the parsed body).
  //               console.log("Response", response);
  //             },
  //             function(err) { console.error("Execute error", err); });
  // }



