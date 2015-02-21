var app = angular.module('app', []);

app.controller('presoController', ['$scope', '$http', '$timeout','$window',
    function($scope, $http, $timeout, $window) {
      var initizalize = function(){
        $scope.loggedIn = false;
        $scope.presentationLoaded = false;
        $scope.presentations = [];
        reloadJavascriptVariables();
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
                      loadPresentations();
                }else{
                      $scope.password = "";
                      alert('Wrong password')
                }
            }).
            error(function(data) {
                $scope.password = "";
                alert('Wrong password')
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

      $scope.getImageUrl = function(name){
        var urlArray  = name.split('.html');
        var url = '/presentationSlides/' + urlArray[0] + '.jpg';
        console.log(url);
        return url;
      }

      var reloadJavascriptVariables = function(){
          $scope.following = $window.following;
          console.log($window.following)
          console.log($scope.following)
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
            console.log('presentationName is set');
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

  app.controller('question', ['$scope',
    function($scope) {
      var questionRaised = false;
      $scope.ask = function(){
        console.log('question: ' + $scope.userName);
        questionRaised = true;
        socket.emit('question', $scope.userName);
        console.log('question: ' + $scope.userName);
      }
    }
  ]);

app.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    });
