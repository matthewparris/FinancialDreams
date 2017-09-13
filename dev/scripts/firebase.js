import firebase from 'firebase';

//initialize firebase

  var config = {
		apiKey: "AIzaSyAw_AE0GOlH9zbWzXz-PhXVCBgndJWC0ro",
		authDomain: "financial-dreams.firebaseapp.com",
		databaseURL: "https://financial-dreams.firebaseio.com",
		projectId: "financial-dreams",
		storageBucket: "",
		messagingSenderId: "502611061452"
  };
  firebase.initializeApp(config);


export default firebase;