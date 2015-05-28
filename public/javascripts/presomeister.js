var app = angular.module('presoApp', []);

app.controller('presoController', ['$scope',
    function($scope) {
        // Global vars.
        $scope.loggedIn = false;
        $scope.presentationLoaded = false;
        $scope.presentations = [];
        
        // Functions.
        var initializeReveal = function(){
            Reveal.initialize({
            controls: true,
            progress: true,
            history: true,
            center: true,
            transition: 'slide', 

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
        };
        
        // Initialize.
        var initizalize = function(){
            initializeReveal();
        };
        
        // Start app.
        initizalize();
    }]
);
                                   