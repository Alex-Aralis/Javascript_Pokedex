var url = "https://pokeapi.co/api/v2/";

angular.module('pokeApp', [])
.controller('pokeController', function($scope, $http){
    $scope.entryClickHandler = function(pokeobj){
        $scope.view_pokemon = pokeobj;
        console.log(pokeobj);
    }

    $scope.loadPokedex = function(callback){
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

    $scope.loadPokemonData = function(entry_number, callback){
        if(localStorage.getItem('pokedata'+entry_number)){
            console.log('entry ' +entry_number+'has been retrieved from the cache');
            callback(JSON.parse(localStorage.getItem('pokedata'+entry_number)));
        }else{
            $scope.getPokemonData(entry_number, function(pokedata){
                localStorage.setItem('pokedata'+entry_number, JSON.stringify(pokedata));
                callback(pokedata);
            });
        }
    }

    $scope.getPokemonData = function(entry_number, callback){
        $http.get(url+'pokemon/' + entry_number + '/')
            .then(function(result){
                delete result.data.game_indices;
                delete result.data.moves;

                console.log('entry number ' + entry_number + 'has succeeded');
                callback(result.data);
            }, function (){
                console.log('entry number ' + entry_number + 'has failed');
                $scope.getPokemonData(entry_number, callback);
            });
    }

    $scope.loadPokemonDesc = function(entry_number, callback){
        if(localStorage.getItem('pokedesc'+entry_number)){
            console.log('entry ' +entry_number+' desc has been retrieved from the cache');
            callback(JSON.parse(localStorage.getItem('pokedesc'+entry_number)));
        }else{
            $scope.getPokemonDesc(entry_number, function(pokedesc){
                localStorage.setItem('pokedesc'+entry_number, JSON.stringify(pokedesc));
                callback(pokedesc);
            });
        }
    }
    

    $scope.getPokemonDesc = function(entry_number, callback){
        $http.get(url+'pokemon-species/' + entry_number + '/')
        .then(function(result){
            console.log('entry number ' + entry_number + 'has succeeded for desc');
            callback(result.data);
        }, function (){
            console.log('entry number ' + entry_number + 'has failed for desc');
            $scope.getPokemonDesc(entry_number, callback);
        });
        
    }

    $scope.getPokeobj = function(id){
        if(!$scope.pokeListObj){
            $scope.pokeListObj = {};
        }

        if($scope.pokeListObj[id]){
            return $scope.pokeListObj[id];
        }else{
            $scope.pokeListObj[id] = {};
            return $scope.pokeListObj[id];
        }
    }

    $scope.loadPokedex(function(pokedex){
        pokedex.pokemon_entries.forEach(function(entry){
            $scope.loadPokemonData(entry.entry_number, function(pokedata){
                $scope.getPokeobj(entry.entry_number).pokedata = pokedata;
                console.log(pokedata);
                $scope.pokeList = _.sortBy($scope.pokeListObj, function(val, key){
                    return key;
                });
            });

            $scope.loadPokemonDesc(entry.entry_number, function(pokedesc){
                $scope.getPokeobj(entry.entry_number).pokedesc = pokedesc;
            });
        });
    });
});
