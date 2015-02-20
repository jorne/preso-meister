angular.module('app', [])
  .controller('presoController', ['$scope', '$http', '$timeout',
    function($scope, $http, $timeout) {
      var initizalize = function(){
        $scope.loggedIn = false;

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
        }else{
          var url = '/meister?user=' + $scope.userName + '&password=' + $scope.password;  
          $http.post(url).
            success(function(data, status, headers, config) {
                if (data === "ok"){
                      $scope.loggedIn = true;
                      Reveal.setUserType($scope.type);
                }else{
                      $scope.password = "";
                      alert('Wrong password')
                }
            }).
            error(function(data, status, headers, config) {
                $scope.password = "";
                alert('Wrong password')
            });
        
        }
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
