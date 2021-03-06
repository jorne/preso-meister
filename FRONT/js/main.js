var app = angular.module('app', []);
app.controller('presoController', ['$scope', '$http', '$timeout', 'socketio', '$window',
    function($scope, $http, $timeout, socketio, $window) {
      var initizalize = function(){
        $scope.loggedIn = false;
        $scope.presentationLoaded = false;

        $scope.presentations = [];

        $scope.voteCountYes = 0;
        $scope.voteCountNo  = 0;
        $scope.voteYesWidth = 50;
        $scope.voteNoWidth  = 50;

        $scope.voted = 0;
        reloadJavascriptVariables();
        $scope.takingNotes = false;
        $scope.notes = "";
        $scope.emailAddress = '';
        $scope.messageSent = '';
        $scope.questionRaised = false;

      }

      $scope.setType = function(type){
        $scope.type = type;
      }

      $scope.finishedLoading = function(){
        initializeReveal();
      }

      $scope.logIn = function(){
        if ($scope.type === "viewer"){
          $scope.loggedIn = true;
          Reveal.setUserType($scope.type);
          var getPresentationName = function(){
              var url = '/presentationName/';
              $http.get(url).
                success(function(data){
                  if (data === ""){
                    $timeout(function() {
                      getPresentationName();
                    }, 1000);
                  }else{
                    $scope.presentationLoaded = true;
                    setSlides(data);
                  }
                }).
                error(function(data) {
                    $timeout(function() {
                      getPresentationName();
                    }, 1000);
                });
          }
          $timeout(function() {
            getPresentationName();
          }, 1000);
        }else{
          var url = '/meister?user=' + $scope.userName + '&password=' + $scope.password;
          $http.post(url).
            success(function(data) {
                if (data === "ok"){
                      $scope.loggedIn = true;
                      Reveal.setUserType($scope.type);
                      initializeVote();
                      loadPresentations();
                }else{
                      $scope.password = "";
                      alert('Username or password incorrect.')
                }
            }).
            error(function(data) {
                $scope.password = "";
                alert('Username or password incorrect.')
            });
        }
      }

      $scope.stopPresentation = function(){
        setPresentationName('');
        $scope.presentationLoaded = false;

        socket.emit('presentationStopped', 'ended');
      }

      $scope.choosePresentation = function(name){
        setPresentationName(name);
      }

      $scope.emailNotes = function(){
        var url = '/notes?user=' + $scope.userName + '&email=' + $scope.email + '&message=' + $scope.notes;

        $http.post(url).
            success(function(data) {
               $scope.email = '';
               $scope.messageSent = true
            }).
            error(function(data) {
                alert('WERROR')
            });
      }

      // Voting
      $scope.vote = function(topic, value){
          var url = '/vote?topic=' + topic + '&value=' + value;
          if (!$scope.voted){
              $http.post(url).
              success(function(data) {
                  $scope.voted = true;
              }).
              error(function(data) {
                  //console.log(data)
              });
          }

      }

      $scope.ask = function(){
        $scope.questionRaised = !$scope.questionRaised;
        var msg = {userName:$scope.userName, questionRaised:$scope.questionRaised};
        // console.log(msg);
        socketio.emit('question', msg, true);
        // console.log('question: ' + msg);

      }

      var initializeVote = function(){
          var url = '/vote';
          // console.log(url);
          $http.delete(url).
            success(function(data) {
            }).
            error(function(data) {
                //console.log(data)
            });
      }

      socketio.on('votes', function(data){
        if (angular.isDefined(data.yes)){
          $scope.voteCountYes = data.yes;
        }else{
          $scope.voteCountYes = 0;
        }
        if (angular.isDefined(data.no)){
            $scope.voteCountNo  = data.no;
        }else{
          $scope.voteCountNo  = 0;
        }

          console.log($scope.voteCountYes)
          console.log($scope.voteCountNo)

          $scope.voteYesWidth = $scope.voteCountYes / ($scope.voteCountYes + $scope.voteCountNo) * 100;
          $scope.voteNoWidth  = $scope.voteCountNo / ($scope.voteCountYes + $scope.voteCountNo) * 100;

          //console.log($scope.voteCountYes, $scope.voteCountNo);
      });

      $scope.questions = [];
      // Receive question messages
      socketio.on('question', function(data){
        // console.log('received question from: ' + data.userName);
        if(data.questionRaised) {
          $scope.questions.push(data.userName);
        } else {
          var index = $scope.questions.indexOf(data.userName);
          $scope.questions.splice(index, 1);
        }
        console.log($scope.questions);
      });


      var reloadJavascriptVariables= function(){
        $scope.following = $window.following;
        $timeout(function() {
          reloadJavascriptVariables();
        }, 1000);
      }

      var loadPresentations = function(){
        var url = '/presentations/';
        $http.get(url).
          success(function(data){
            $scope.presentations = data;
          }).
          error(function(data) {
            console.log('error:' + data)
          });

      }

      var setPresentationName = function(presentationName){
        $scope.presentationLoaded = true;
        var url = '/presentationName/?user=' + $scope.userName + '&password=' + $scope.password + '&presentationName=' + presentationName;
        $http.post(url).
          success(function(data) {
            setSlides(presentationName);
          }).
          error(function(data) {
          });
      }
      var setSlides = function(name){
          $scope.incPresentationUrl = '/presentationSlides/' + name;
      }

      var initializeReveal = function(){
        Reveal.initialize({
          controls: true,
          progress: true,
          history: true,
          center: true,



          transition: 'slide', // none/fade/slide/convex/concave/zoom

          // Optional reveal.js plugins
          dependencies: [
            { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
            { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            { src: 'plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
            { src: 'plugin/zoom-js/zoom.js', async: true },
            { src: 'plugin/notes/notes.js', async: true }
          ]
        });
      }

      initizalize();
    }
  ]);

app.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    });


app.factory('socketio', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
