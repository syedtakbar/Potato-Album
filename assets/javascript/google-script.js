
  window.onload = function(){
    GoogleObj.init();
  };

  const Logger  = {
         
      resultDiv: document.getElementById("div-result"),
      
      logResult: function () {
      document.getElementById("div-result").innerHTML = "";  
      const h3Elem = document.createElement("h3");
      h3Elem.innerText = "Event successful!";
      document.getElementById("div-result").appendChild(h3Elem);       
    },

    logAPIResult: function (response) {
      document.getElementById("div-result").innerHTML = "";  
      
      const h3Elem = document.createElement("h3");

      if (response.result) {     
        const result =  JSON.stringify(response.result, null, 2);   
        h3Elem.innerText = JSON.stringify(response.result, null, 2);     
        GoogleObj.albumObj =  response.result;
      } 
      else {
        h3Elem.innerText = "API didn't perfom as expected";
      }
      document.getElementById("div-result").appendChild(h3Elem);   
    },

    logError: function (err) {      
      document.getElementById("div-result").innerHTML = "";  
      const h3Elem = document.createElement("h3");
      h3Elem.innerText = JSON.stringify(err, null, 2);
      h3Elem.style = "color: red";
      document.getElementById("div-result").appendChild(h3Elem); 
    }
  };

  const GoogleObj = {
    albumObj : {},
    images : ["./assets/images/crystal-1.jpg", "./assets/images/crystal-2.jpg", "./assets/images/crystal-3.jpg", "./assets/images/crystal-4.jpg"],
    authButton: document.getElementById("log-in"),
    createAlbumButton: document.getElementById("create-album"),
    getPicButton: document.getElementById("get-pic"),
    uploadPicButton: document.getElementById("upload-pic"),
  
    albumInput: document.getElementById("album-input"),

    picDiv: document.getElementById("div-pic"),
    
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
      .then(Logger.logResult,Logger.logError);
    },



    loadClient: function (APIKey, clientURL) {
      //this.init();
      gapi.client.setApiKey(APIKey);
      return gapi.client.load(clientURL)      
      .then(Logger.logResult,Logger.logError);
    },


    
    uploadPicture: function (AlbumId, Image) {
    
      const mediaItems = {
        albumId: AlbumId,
        resource:  { 
          mediaItemIds : [Image]
          }
      };

      console.log(JSON.stringify(mediaItems, null, 2));
      return gapi.client.photoslibrary.albums.batchAddMediaItems(mediaItems)
      // return gapi.client.photoslibrary.albums.batchAddMediaItems({
      //   "albumId": "AGuxb8ZfXlw711cBZVR26eVjuyx1ocnV85rUesB4PdS3ewFW0_C3_EAT62tDesaVzZD__TGb_g9b",
      //   "resource": {
      //     "mediaItemIds": [
      //       "https://siciliancookingplus.com/wp-content/uploads/2016/01/03085543-87de-47ab-a4eb-58e7e39d022e-620x372.jpeg"
      //     ]
      //   }
      // })
      .then(Logger.logAPIResult,Logger.logError);
    },

    createAlbum: function (albumName) {     
      
  
      const albumObj = {
              resource: { 
                  album : {
                    title: albumName,
                  },
            },
      };

      return gapi.client.photoslibrary.albums.create(albumObj)    
        .then(Logger.logAPIResult,Logger.logError); 
    },
  };

  GoogleObj.authButton.addEventListener("click", function () {                    
          GoogleObj.authenticate().then(GoogleObj.loadClient(GoogleObj.APIKey, GoogleObj.ClientURL));
  });

  GoogleObj.createAlbumButton.addEventListener("click", function () {
    
    GoogleObj.createAlbum(GoogleObj.albumInput.value);
    GoogleObj.albumInput.value = "";
  });

  GoogleObj.getPicButton.addEventListener("click", function () {     
    const img = document.createElement("img");  
    const file =   GoogleObj.images[GoogleObj.getRandomInt(0,3)];
    img.src = file;    
    img.alt = "missing file:" + file;
    img.style = "width: 200px; height:200px;";
    GoogleObj.picDiv.appendChild(img);
  });

  GoogleObj.uploadPicButton.addEventListener("click", function () {

    if (Object.entries(GoogleObj.albumObj).length === 0 && GoogleObj.albumObj.constructor === Object)
    {      
      return false;
    }
 
    GoogleObj.uploadPicture(GoogleObj.albumObj.id, GoogleObj.picDiv.getElementsByTagName("img")[0].src);
    
  });



