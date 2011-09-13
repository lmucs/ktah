/**
 *
 * charClass.js
 *
 * prototype constructor for ktah character classes
 *
 * dependencies: classes/teacher.js, 
 */

//Class id's:
var TEACHER = 0;
var TINKERER = 1;
var SCIENTIST = 2;

function charClass(class, name, level)
{
  this.class = class;
  
  switch (this.class)
  {
    case TEACHER:
      return new teacher(name, level);
      break;
    case TINKERER:
      return new tinkerer(name, level);
      break;
    case SCIENTIST:
      return new scientist(name, level);
      break;
    default:
      break;
  }
}
