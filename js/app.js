$(document).foundation()

var Pokedex = {

    template: template = $("#li_template")
            .detach()
            .removeAttr("id"),

    addPokemonToList: function(pokemon) {
        var li = this.template.clone().bind(this);
        var list = $("#pokemon_list");
        var icon = li.find(".pokemon-icon");
        icon.attr("src", "http://pokeapi.co/media/sprites/pokemon/" + pokemon.entry_number + ".png");
        li.text(pokemon.pokemon_species.name);
        li.append(icon);
        list.append(li);
    },

    loadPokemon: function(pokemon) {
        $.each(pokemon.pokemon_entries, function(i, pokemon) {
            this.addPokemonToList(pokemon);
        }.bind(this));
    },

    getAllPokemon: function() {
        $.get({
            url: this.url,
        }).done(this.loadPokemon.bind(this));
    },

    init: function(url) {
        this.url = url;
        if(!/^.*\/$/.test(url))
            this.url += "/";

        this.getAllPokemon()
    },
};

Pokedex.init("https://pokeapi.co/api/v2/pokedex/2");
