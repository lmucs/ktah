/**
 * charClass.js
 *
 * Contains general character attributes between classes.
 * 
 */

$(function () {
    ktah.types.Character = function () {
        return {
            // Public properties
            name: "",
            level: 0,
            health: 10, // TODO: Arbitrary placeholder
            characterClass: "",
            
            // "Constructor"
            create: function (name, level, health, charClass) {
                this.name = name;
                this.level = level;
                this.health = health;
                this.characterClass = charClass;
            }
        };
    };
});