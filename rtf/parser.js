


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
//alert(rtfUnicodeToString("\\'dc"));




function parse(rtftext){





  rtftext = rtftext.replace(/\\rtf1/g,"<div class='rtf1'></div>");
  rtftext = rtftext.replace(/\\ansicpg1252/g,"<div class='ansicpg1252'></div>");
  rtftext = rtftext.replace(/\\ansi/g,"<div class='ansi'></div>");
  rtftext = rtftext.replace(/\\nouicompat/g,"<div class='nouicompat'></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class='fonttbl'></div>");

  rtftext = rtftext.replace(/\\cpg1252/g,"<div class='cpg1252'></div>");
  rtftext = rtftext.replace(/\\deff0/g,"<div class='deff0'></div>");
  rtftext = rtftext.replace(/\\viewkind4/g,"<div class='viewkind4'></div>");
  rtftext = rtftext.replace(/\\uc1/g,"<div class='uc1'></div>");
  rtftext = rtftext.replace(/\\d/g,"<div class='d'></div>");
  rtftext = rtftext.replace(/\\sa200/g,"<div class='sa200'></div>");
  rtftext = rtftext.replace(/\\sl276/g,"<div class='sl276'></div>");
  rtftext = rtftext.replace(/\\slmult1/g,"<div class='slmult1'></div>");
  rtftext = rtftext.replace(/\\fs22/g,"<div class='fs22'></div>");
  rtftext = rtftext.replace(/\\lang7/g,"<div class='lang7'></div>");
  rtftext = rtftext.replace(/\\pard/g,"<div class='pard'></div>");

  rtftext = rtftext.replace(/\\pntext/g,"<div class='pntext'></div>");

  rtftext = rtftext.replace(/\\tab/g,"<div class='tab'></div>&#9;");
  rtftext = rtftext.replace(/\\fi-360/g,"<div class='fi-360'></div>");
  rtftext = rtftext.replace(/\\li720/g,"<div class='li720'></div>");
  rtftext = rtftext.replace(/\\sl240/g,"<div class='sl240'></div>");






  //var match = /\\colortbl ((\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+))?;)*/.exec(rtftext);


//  console.log(match);

//{\colortbl ;\red255\green0\blue0;\red0\green176\blue80;}


  rtftext = rtftext.replace(/([^\\])({\\\*\\)/g,"$1<div class='opening'></div><div class='group' style='display:none'>");
  rtftext = rtftext.replace(/([^\\]|^)({)/g,"$1<div class='opening'></div><div class='group'>");
  rtftext = rtftext.replace(/([^\\]|^)}/g,"$1<div class='closing'></div></div>");
  rtftext = rtftext.replace(/([^\\])}/g,"<div class='closing'></div></div>");









  rtftext = rtftext.replace(/\\colortbl ((\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+))?;)*/g,function(x){
    console.log("XX: "+x);
    //x = x.replace(/(\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+));/g,"color: rgb($2,$3,$4)");
    var i = 0;
      x = x.replace(/(\\red([0-9]+)\\green([0-9]+)\\blue([0-9]+));|;/g,function(a0,a1,r,g,b){
        var res = "";
        if(a0 == ";"){
          res = "<style> .cf0{color: rgb(0,0,0)}</style>";
        }else{
          res = "<style> .cf"+i+"{color: rgb("+r+","+g+","+b+")}</style>";
        }

        i++;
        return res;
        console.log(arguments);
      });
  //  console.log(x);
    return x;
  //  console.log(arguments);
  });
  rtftext = rtftext.replace(/\\colortbl/g,"<div class='colortbl'></div>");
  rtftext = rtftext.replace(/\\cf([0-9]+)/g,"<div class ='cf$1'></div>");










  rtftext = rtftext.replace(/\\b0/g,"<div class='b0'></div><div style='font-weight: bold;'>");
rtftext = rtftext.replace(/\\b/g,"<div class='b'></div></div>");

    rtftext = rtftext.replace(/\\i0/g,"<div class='i0'></div></i>");
  rtftext = rtftext.replace(/\\i/g,"<div class='i'></div><i>");

    rtftext = rtftext.replace(/\\ulnone/g,"<div class='ulnone'></div></ul>");
  rtftext = rtftext.replace(/\\ul/g,"<div class='ul'></div><ul>");

  rtftext = rtftext.replace(/\\par/g,"<div class='par'></div><br></br>");
  rtftext = rtftext.replace(/(\\'[0-9a-fA-F]+)/g,function(x){
    //console.log(arguments);
    var cha = rtfUnicodeToString(x);
    //console.log(x+" => "+cha);
    return cha;
  });

  //rtfUnicodeToString











  rtftext = rtftext.replace(/\\f([0-9]+)\\fnil\\fcharset([0-9]+) ([^;]*);/g,"<style> .f$1 ~ *{font-family: $3}</style>");
  rtftext = rtftext.replace(/\\f([0-9]+)/g,"<div class ='f$1'></div>");
  rtftext = rtftext.replace(/\\fnil/g,"<div class ='fnil'></div>");

  rtftext = rtftext.replace(/\\fs([0-9]+)/g,"<div class ='fs$1'></div><style> .fs$1 ~ *{font-size: $1px}</style>");
//rtftext = rtftext.replace(/>[^<]*([^<])[^<]*</g,function(){
//  console.log(arguments);
//});






var html = "";
var instyle = false;
var outside = true;
for(var i = 0; i<rtftext.length;i++){

  if(rtftext.indexOf("<style>",i)==i){
    instyle = true;
  }
  if(rtftext.indexOf("</style>",i)==i){
    instyle = false;
  }

  if(rtftext[i] == '>'){
    outside = true;
    html+=rtftext[i];
    continue;
    //console.log(rtftext[i]);
  }
  if(rtftext[i]== '<'){
    outside = false;
    html+=rtftext[i];
    continue;
    //console.log(rtftext[i]);
  }
//console.log(inside);
//console.log(rtftext[i]);
  if(outside && !instyle){

    html+="<div class='char'>"+rtftext[i]+"</div>";
  }else{

        html+=rtftext[i];


  }

}
html+="<style> .char{float:left;white-space:pre;}</style>";
//console.log(html)
document.write("<div class='rtf'>"+html+"</div>");


var addclass ="";
  $(".rtf *").each(function(a,e){
    var firstClass = e.className.split(' ')[0];

    var match;
    match = /cf([0-9]+)/.exec(firstClass);
    if(match){
      //  console.log(match);
        addclass = firstClass;
    }else{
      //console.log(e.className);
      $(e).addClass(addclass);
    }
  });
return;

  /*
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
  rtftext = rtftext.replace(/\\fonttbl/g,"<div class="fonttbl"></div>");
*/


  console.log(rtftext);
  return;
  var html;

  var groupStateStack = [];
  var currentGroupState = null;


//  div replace


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
