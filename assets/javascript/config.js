
// {
//     "web": {
//         "client_id": "137123594979-ian7b2a2qullo5lj0chv4cfeu6hhklim.apps.googleusercontent.com",
//         "project_id": "boot-camp-class--1565968326612",
//         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//         "token_uri": "https://oauth2.googleapis.com/token",
//         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//         "client_secret": "aXPml-z1dNWPezNfgOTgod0T",
//         "redirect_uris": [
//             "https://syedtakbar.github.io/Potato-Album/"
//         ],
//         "javascript_origins": [
//             "https://syedtakbar.github.io"
//         ]
//     }
// }



const auth_config = {};

auth_config.oAuthClientID = "137123594979-ian7b2a2qullo5lj0chv4cfeu6hhklim.apps.googleusercontent.com";
auth_config.oAuthclientSecret = "aXPml-z1dNWPezNfgOTgod0T";
auth_config.oAuthCallbackUrl =  "https://syedtakbar.github.io/Potato-Album/";
auth_config.port = 8080;
auth_config.scopes = [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'profile',
];

auth_config.photosToLoad = 150;
auth_config.searchPageSize = 100;
auth_config.albumPageSize = 50;
auth_config.apiEndpoint = 'https://photoslibrary.googleapis.com';


