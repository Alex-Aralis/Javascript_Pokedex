var url = "https://pokeapi.co/api/v2/";

angular.module('pokeApp', [])
.controller('pokeController', function($scope, $http){
    $scope.entryClickHandler = function(pokeobj){
        $scope.view_pokemon = pokeobj;
        console.log(pokeobj);
    }

    function loadPokedex(callback){
        if(localStorage.pokedex){
            $scope.pokedex = JSON.parse(localStorage.pokedex);
            callback($scope.pokedex);
        }else{
            $http.get(url+'pokedex/2/')
                .then(function(result){
                    localStorage.pokedex = JSON.stringify(result.data);
                    callback(result.data);
                });
        }
    }

    function loadPokemon(entry_number, callback){
        if(localStorage.getItem('pokemon'+entry_number)){
            console.log('entry ' +entry_number+'has been retrieved from the cache');
            callback(JSON.parse(localStorage.getItem('pokemon'+entry_number)));
        }else{
            getPokemon(entry_number, function(pokeobj){
                localStorage.setItem('pokemon'+entry_number, JSON.stringify(pokeobj));
                callback(pokeobj);
            });
        }
    }

    function loadPokemonDesc(entry_number, callback){
        if(localStorage.getItem('pokemonDesc'+entry_number)){
            console.log('entry ' +entry_number+' desc has been retrieved from the cache');
            callback(JSON.parse(localStorage.getItem('pokemonDesc'+entry_number)));
        }else{
            getPokemonDesc(entry_number, function(pokeobj){
                localStorage.setItem('pokemonDesc'+entry_number, JSON.stringify(pokeobj));
                callback(pokeobj);
            });
        }
    }
    

    function getPokemonDesc(entry_number, callback){
        $http.get(url+'pokemon-species/' + entry_number + '/')
        .then(function(result){
            console.log('entry number ' + entry_number + 'has succeeded for desc');
            callback(result.data);
        }, function (){
            console.log('entry number ' + entry_number + 'has failed for desc');
            getPokemonDesc(entry_number, callback);
        });
        
    }

    function getPokemon(entry_number, callback){
        $http.get(url+'pokemon/' + entry_number + '/')
        .then(function(result){
            delete result.data.game_indices;
            delete result.data.moves;

            console.log('entry number ' + entry_number + 'has succeeded');
            callback(result.data);
        }, function (){
            console.log('entry number ' + entry_number + 'has failed');
            getPokemon(entry_number, callback);
        });
    }

    loadPokedex(function(pokedex){
        if(localStorage.pokeListObj){
            $scope.pokeListObj = JSON.pasre(localStorage.pokeListObj);
        }else{
            $scope.pokeListObj = {};
        }
        
        if(localStorage.pokeDesc){
            $scope.pokeDescObj = JSON.pasre(localStorage.pokeDesc);
        }else{
            $scope.pokeDescObj = {};
        }
        

        pokedex.pokemon_entries.forEach(function(entry){
            loadPokemon(entry.entry_number, function(pokeobj){
                $scope.pokeListObj[entry.entry_number] = pokeobj;
                $scope.pokeList = _.sortBy($scope.pokeListObj, function(val, key, obj){
                    return obj.id;
                });
            });

            loadPokemonDesc(entry.entry_number, function(pokeDesc){
                $scope.pokeDescObj[entry.entry_number] = pokeDesc;
            });
        });
    });
});
