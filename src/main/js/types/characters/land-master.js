/**
 * land-master.js
 *
 * The type of "land master" containing class attributes.
 *
 * Acting in synergy with her environment, the land master's
 * abilities rely heavily on her adjacent resources and terrain.
 * By consuming resources in such a manner, her abilities tend 
 * to be more powerful, but at the cost of convenience (requiring 
 * proximity to certain features).
 *
 */

$(function () {
    ktah.types.LandMaster = function () {
        return{
            // Public properties
            stone: 0,
            wood: 0,
            sand: 0,
            water: 0,
            
            // "Constructor"
            create: function () {
                
            }
        
        }
    }
});