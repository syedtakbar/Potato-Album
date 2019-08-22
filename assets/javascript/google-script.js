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

    AccessToken : {},
    UploadToken: {},
    FileToUpload: {},    
    AlbumId: {},

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
      this.gapiload(this.Clientid, this.APIKey);      
    },

    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
    }  ,

    gapiload: function (clientId, APIKey) {  
              gapi.load("client:auth2", function() {
                        gapi.auth2.init({client_id: clientId,
                        apiKey: APIKey,
                        discoveryDocs: "https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest",
                        scope : "https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/plus.login"                                                
                      });
                        
              });
    }, 

    authenticate: function () {   
      this.AccessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;   
      console.log("AccessToken:" + this.AccessToken )   ;
      return gapi.auth2.getAuthInstance()
      .signIn({scope: this.SignInScope })     
      .then(Logger.logResult,Logger.logError);
    },



    loadClient: function (APIKey, clientURL) {
      gapi.client.setApiKey(APIKey);
      return gapi.client.load(clientURL)      
      .then(Logger.logResult,Logger.logError);
    },

    uploadMediaItem: function (albumId, uploadToken) {
      const mediaItem = {
        resource: { 
          albumId: albumId,
          newMediaItems : [{
                description : "Test Picture",
                simpleMediaItem : {
                uploadToken : uploadToken
              }
            }
          ],
        },
      };
      console.log(mediaItem);
      return gapi.client.photoslibrary.mediaItems.batchCreate(mediaItem)
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
        .then(
               function (response) {
                  this.AlbumId = response.result.id;
                  console.log("albumid: " + this.AlbumId );
                  Logger.logAPIResult(response);
               },Logger.logError);          
    },

    
    uploadImage : function (accessToken, imageName, imageContent, CallBack) {
        
      const url = "https://photoslibrary.googleapis.com/v1/uploads";

      fetch(url, {
            mode: "cors",
            method: "post",
            headers: {
              'Authorization' : "Bearer " + accessToken,
              'Content-type': "application/octet-stream",              
              'X-Goog-Upload-File-Name' : imageName,
              'X-Goog-Upload-Protocol': "raw",   
            },
            //encoding : "base64",
            body: imageContent,
      }).then (
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
          }

          // console.log(response.headers.get('Content-Type'));
          // console.log(response.headers.get('Date'));          
          // console.log(response.status);              
          // console.log(response.type);
          // console.log(response.url);   

          return  response.text();            
        }
      ).then (
          function (responsText) {  
              this.UploadToken = responsText;              
              console.log(responsText);
              CallBack(this.AlbumId, responsText);
              
          }
      ).catch(function(err) {
        console.log('Fetch Error :-S', err);
      });                   
    },

    selectFiles: function (evt) {
      const files = evt.target.files;       
      const output = [];
      for (let i = 0, f; f < files.length; i++) {
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

    uploadFile: function (AccessToken, fileToRead, Callback, Callback2) {
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = function() {
        const fileContent = reader.result;        
        //console.log(fileContent);

        Callback(AccessToken, fileToRead.name, fileContent, Callback2);        
      };
      
      reader.readAsArrayBuffer(fileToRead);
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

    GoogleObj.uploadFile(GoogleObj.AccessToken, GoogleObj.FileToUpload, GoogleObj.uploadImage, GoogleObj.uploadMediaItem);

    //GoogleObj.uploadMediaItem(GoogleObj.AlbumId, GoogleObj.UploadToken );
    
  });

