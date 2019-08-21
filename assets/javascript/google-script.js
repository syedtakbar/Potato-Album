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
    FileToUpload: {},
    googleObj: this,
    albumObj : {},
    images : ["./assets/images/crystal-1.jpg", "./assets/images/crystal-2.jpg", "./assets/images/crystal-3.jpg", "./assets/images/crystal-4.jpg"],
    authButton: document.getElementById("log-in"),
    createAlbumButton: document.getElementById("create-album"),
    getPicButton: document.getElementById("get-pic"),
    uploadPicButton: document.getElementById("upload-pic"),
    // selectFilesButton: document.getElementById("get-files"),
    selectFileButton: document.getElementById("get-file"),
    
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
      gapi.client.setApiKey(APIKey);
      return gapi.client.load(clientURL)      
      .then(Logger.logResult,Logger.logError);
    },


    
    uploadMediaItem: function (AlbumId, Image) {
    
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

    uploadImage : function (imageName, imageContent) {
        
        const url = "https://photoslibrary.googleapis.com/v1/uploads";

        console.log("start to upload images...");
        console.log("imageName:" + imageName);
        console.log("imageContent:" + imageContent);

          return fetch(url, {
              method: 'POST', // *GET, POST, PUT, DELETE, etc.
              mode: 'cors', // no-cors, cors, *same-origin
              cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
              credentials: 'same-origin', // include, *same-origin, omit
              headers: {
                 // 'Authorization': "Bearer " + service._http.request.credentials.access_token,
                  'Content-Type': 'application/octet-stream',
                  'X-Goog-Upload-File-Name': imageName,
                  'X-Goog-Upload-Protocol': "raw",                  
              },
              redirect: 'follow', // manual, *follow, error
              referrer: 'no-referrer', // no-referrer, *client
              body: JSON.stringify(imageContent), // body data type must match "Content-Type" header
          })
          .then(response => response.json())
          .then(consle.log(JSON.stringify(response))); // parses JSON response into native JavaScript objects 
    },

    selectFiles: function (evt) {
      const files = evt.target.files;       
      const output = [];
      for (let i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</li>');
      }
      document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';      
    },

    selectFile: function (evt, callback) {          
      const file = evt.target.files[0];       
      let output = "";
      output = "<strong>" + escape(file.name) + "</strong> ( " + (file.type || "n/a" ) + " ) - " +
                    file.size + " bytes, last modified: " +
                    (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : "n/a");
      
      document.getElementById('list').innerHTML = output;  
      this.FileToUpload = file;         
      callback(window.URL.createObjectURL(file));      
    },

    loadImage: function (imageFile) {         
      GoogleObj.picDiv.innerHTML = "";
      const img = document.createElement("img");  
      const file =   GoogleObj.images[GoogleObj.getRandomInt(0,3)];
      img.src = imageFile;    
      img.alt = "missing file:" + file;
      img.style = "width: 200px; height:200px;";
      GoogleObj.picDiv.appendChild(img);
    },

    uploadFile: function (fileToRead, Callback) {
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = function() {
        const fileContent = reader.result;        
        console.log(fileContent);

        Callback(fileToRead.name, fileContent);        
      };
      
      reader.readAsDataURL(fileToRead);
    },

    convertImageToCanvas: function(image) {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);
    
      return canvas;
    },

    convertCanvasToImage: function (canvas) {
      var image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    }
  };

  GoogleObj.authButton.addEventListener("click", function () {                  
          GoogleObj.authenticate().then(GoogleObj.loadClient(GoogleObj.APIKey, GoogleObj.ClientURL));
  });

  GoogleObj.createAlbumButton.addEventListener("click", function () {
    
    GoogleObj.createAlbum(GoogleObj.albumInput.value);
    GoogleObj.albumInput.value = "";
  });

  // GoogleObj.getPicButton.addEventListener("click", function () {  
  //   const file =   GoogleObj.images[GoogleObj.getRandomInt(0,3)];
  //   GoogleObj.loadImage(file);    
  // });

  GoogleObj.selectFileButton.addEventListener("change", 
    function (event) {
      GoogleObj.selectFile(event, GoogleObj.loadImage);    
  });

  GoogleObj.uploadPicButton.addEventListener("click", function () {

    // if (Object.entries(GoogleObj.albumObj).length === 0 && GoogleObj.albumObj.constructor === Object)
    // {      
    //   return false;
    // }
    //const imageFile = GoogleObj.picDiv.getElementsByTagName("img")[0].src;
    //const canvas = GoogleObj.convertImageToCanvas(imageFile);
    GoogleObj.uploadFile(GoogleObj.FileToUpload, GoogleObj.uploadImage);

    //GoogleObj.uploadMediaItem(GoogleObj.albumObj.id, GoogleObj.picDiv.getElementsByTagName("img")[0].src);
    
  });