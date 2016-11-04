


function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function downloadRTF(){
  var template = document.getElementById("rtftemplate");
  var content = template.innerHTML;
  download("test.rtf",content);
}
function rtfUnicodeToString(unicode){
  unicode = unicode.replace("\\'","\\u0025");;
  return unescape(JSON.parse('"'+unicode+'"'));
}
alert(rtfUnicodeToString("\\'dc"));

function parse(rtftext){
  var html;

  var groupStateStack = [];
  var currentGroupState = null;


  for(var i=0;i<rtftext.length;i++){
    var nextToken;

    /*
    parse brace
      parse groupignore -> set flag for ignore
        parse action -> if ignore flag, perform brace skip
          parse arguments _> parse arguments depensing on action
            parse html -> take any token to }\{



     */

    function parseArgument(){//gets next argument from token stream


    }
    function parseArgument(){//gets next argument from token stream


    }



    var nextTokenEquals = function(str,cb){
      var equals;
      if(str instanceof RegExp){
        var match = str.exec(rtftext.substring(i));
        if (match != null) {
          console.log(match);
            //console.log("match found at " + match.index);
            //console.log(match);
            equals = (match.index == 0);
            if(equals){
              nextToken = match[0];
            }
        }

      }else{
        equals = (rtftext.indexOf(str,i) == i);
        if(equals){
          nextToken = str;
        }
      }
      if(equals){
        i+= nextToken.length;
        console.log(nextToken);
      }

      if(equals && cb){
        cb();
        //carry out action assigned to destination
      }

      return equals;
    }
    function write(str){
        html+=str;
    }



    if(false){}
    else if(nextTokenEquals('\\')){
      if(
        nextTokenEquals('i',function(){
          write("<i>");
        })
        ||nextTokenEquals('i0',function(){
          write("</i>");
        })
        ||nextTokenEquals('ul',function(){
          write("<ul>");
        })
        ||nextTokenEquals('ulnone',function(){
          write("</ul>");
        })
      ){

      }

    }
    else if(nextTokenEquals('{')){

      //section destinationchanges
      if((nextTokenEquals('\\*') || nextTokenEquals('\\')) &&
          nextTokenEquals('footnote')
          ||nextTokenEquals(/.*deff0\\/)
        ||nextTokenEquals('header')
        ||nextTokenEquals('rtf1')
        ||nextTokenEquals('footer')
        ||nextTokenEquals('pict')
        ||nextTokenEquals('info')
        ||nextTokenEquals('fonttbl')
        ||nextTokenEquals('stylesheet')
        ||nextTokenEquals('colortbl')
      )
      {
        groupStateStack.push(currentGroupState);
        currentGroupState = new GroupState(nextToken);
        console.log("push");
      }else{
        //if the first control word is not known skip the whole Group
        //stack braces to remove the right frame
        var depth = 1;
        for(;depth>0;i++){
          if(rtftext[i] == '{'){
            depth++;
          }
          if(rtftext[i] == '}'){
            depth--;
          }
        }




      }
        //endsection destinationchanges
      /*
      If the character is an opening brace (),
      the reader stores its current state on the stack
      */
    }
    else if(nextTokenEquals('}')){
      currentGroupState = groupStateStack.pop();
      console.log("pop");
      /*
       If the character is a closing brace (),
       the reader retrieves the current state from the stack.
      */
    }
    else {


      }


    }

}
var template = document.getElementById("rtftemplate");
parse(template.innerHTML);
