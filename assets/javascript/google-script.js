
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
      this.gapiload(this.Clientid);      
    },

    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
    }  ,

    gapiload: function (clientId) {  
              gapi.load("client:auth2", function() {
                        gapi.auth2.init({client_id: clientId});
              });
    }, 

    authenticate: function () {
      return gapi.auth2.getAuthInstance()
      .signIn({scope: this.SignInScope })
      .then(function() { 
                          console.log("Sign-in successful"); 
      }, function(err) { 
                          console.error("Error signing in", err); 
      });
    },

    loadClient: function () {
      gapi.client.setApiKey(this.APIKey);
      return gapi.client.load(this.ClientURL)
      .then(function() { 
                        console.log("GAPI client loaded for API"); 
      }, function(err) { 
                        console.error("Error loading GAPI client for API", err); 
                        console.log(this.APIKey);
                        console.log(this.ClientURL);
      });
    },

    uploadPicture: function () {

      return gapi.client.photoslibrary.albums.batchAddMediaItems({
        "albumId": "AGuxb8ZfXlw711cBZVR26eVjuyx1ocnV85rUesB4PdS3ewFW0_C3_EAT62tDesaVzZD__TGb_g9b",
        "resource": {
          "mediaItemIds": [
            "https://siciliancookingplus.com/wp-content/uploads/2016/01/03085543-87de-47ab-a4eb-58e7e39d022e-620x372.jpeg"
          ]
        }
      })
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response);
                },
                function(err) { console.error("Execute error", err); });
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

  GoogleObj.uploadPicButton.addEventListener("click", function () {
    GoogleObj.uploadPicture();
    GoogleObj.picDiv.innerHTML = "";
  });


  
 





  
  function execute() {
    
  }




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



