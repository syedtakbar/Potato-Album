
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
      .then(this.logAuthResult(true),this.logAuthResult(false));
    },

    logAuthResult: function (isSuccess) {

      this.resultDiv.innerHTML = "";
      const h3Elem = document.createElement("h3");

      if (isSuccess === true)
      {
        h3Elem.innerText = "Sign-in successful";
      }
      else
      {
        h3Elem.innerText = "Error signing in " ;
        h3Elem.style = "color: red";
      }
      this.resultDiv.append(h3Elem); 
    },

    loadClient: function (apiKey, clientURL) {
      gapi.client.setApiKey(apiKey);
      return gapi.client.load(clientURL)
      .then(this.LoadClientResult(true),this.LoadClientResult(false));
    },

    LoadClientResult: function ( isSuccess) {

      this.resultDiv.innerHTML = "";
      const h3Elem = document.createElement("h3");

      if (isSuccess === true)
      {
        h3Elem.innerText = "GAPI client loaded for API";
      }
      else
      {
        h3Elem.innerText = "Error loading GAPI client for API ";
        h3Elem.style = "color: red";
      }
      this.resultDiv.append(h3Elem); 
    },

    uploadPicture: function () {

      return gapi.client.photoslibrary.albums.batchAddMediaItems({
        "albumId": "AGuxb8ZfXlw711cBZVR26eVjuyx1ocnV85rUesB4PdS3ewFW0_C3_EAT62tDesaVzZD__TGb_g9b",
        "resource": {
          "mediaItemIds": [
            "https://siciliancookingplus.com/wp-content/uploads/2016/01/03085543-87de-47ab-a4eb-58e7e39d022e-620x372.jpeg"
          ]
        }
      }).then(this.uploadMediaResult(response, true),this.uploadMediaResult(err, false));
    },

    uploadMediaResult: function (response, isSuccess) {

      this.resultDiv.innerHTML = "";
      const h3Elem = document.createElement("h3");

      if (isSuccess === true)
      {
        h3Elem.innerText = response.result;
      }
      else
      {
        h3Elem.innerText = "Execute error ";
        h3Elem.style = "color: red";
      }
      this.resultDiv.append(h3Elem); 
    },

    createAlbum: function (albumName) {      
      return gapi.client.photoslibrary.albums.create({
                                                        "resource": {
                                                                "album": {
                                                                          "title": albumName
                                                                }
                                                        }
      }).then(this.createAlbumResult(response, true), this.createAlbumResult(err, false));
    },

    createAlbumResult: function (response, isSuccess) {

      this.resultDiv.innerHTML = "";
      const h3Elem = document.createElement("h3");

      if (isSuccess === true)
      {
        h3Elem.innerText = response.result;
      }
      else
      {
        h3Elem.innerText = "Execute error : " ;
        h3Elem.style = "color: red";
      }
      this.resultDiv.append(h3Elem); 
    },

  };

  GoogleObj.authButton.addEventListener("click", function () {          
          GoogleObj.authenticate().then(GoogleObj.loadClient(GoogleObj.apiKey, GoogleObj.ClientURL));
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



