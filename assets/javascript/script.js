


  /**
   * Sample JavaScript code for photoslibrary.albums.create
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

  function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/photoslibrary"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyCBYvgkH707PEctHZZ22ufrvU_SNvqT5p8");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.photoslibrary.albums.create({
      "resource": {
        "album": {
          "title": "Potato-App"
        }
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "137123594979-ian7b2a2qullo5lj0chv4cfeu6hhklim.apps.googleusercontent.com"});
  });


