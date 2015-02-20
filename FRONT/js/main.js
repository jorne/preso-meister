angular.module('app', [])
  .controller('presoController', ['$scope', '$http', '$timeout',
    function($scope, $http, $timeout) {
      var initizalize = function(){
        $scope.loggedIn = false;
        $scope.presentationLoaded = false;
        $scope.presentations = [];
      }

      $scope.setType = function(type){
        $scope.type = type;
      }

      $scope.finishedLoading = function(){
        console.log('finished')
        initializeReveal();
      }

      $scope.logIn = function(){
        if ($scope.type === "viewer"){
          $scope.loggedIn = true;
          Reveal.setUserType($scope.type);
          var getPresentationName = function(){
              var url = '/presentationName/';
              console.log('check presentationName')
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
        console.log('stopPresentation');
        setPresentationName('');
        $scope.presentationLoaded = false;
      }

      $scope.choosePresentation = function(name){
        console.log(name)
        setPresentationName(name);
      }

      var loadPresentations = function(){
        var url = '/presentations/';
        $http.get(url).
          success(function(data){                  
            $scope.presentations = data;
            console.log($scope.presentations);
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
