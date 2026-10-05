/* =========================================================================
   HEADLINER LEADERSHIP STYLES TEST, the funnel script. One file for all
   three pages. Each page carries a marker on <main> (data-page="landing",
   "questions" or "result") and only that page's part runs.

   The questions, the scoring and the result copy live here and nowhere else,
   so the landing page example, the questions page and the result page can
   never disagree.
   ========================================================================= */

/* ---------- Links ----------
   The only place the funnel's addresses live. In the funnel builder each step
   has its own URL, so change these three and nothing else. Every element with
   data-link="test", "result" or "site" takes its href from here. */
var LINKS={
  test:"questions.html",
  result:"result.html",
  site:"https://headlinergroup.com.au"
};

var STYLES={
 believer:{n:"The Believer",c:"Richard Branson",t:0,d:0,made:"Gut, through people",
  desc:"Sells the vision before it exists and pulls people into it on belief alone. Moves fast, starts more than they finish, and the room follows because they want to.",
  best:"optimiser",work:"architect",
  why:"You sell it, they prove it and build the machine that holds it up."},
 charger:{n:"The Charger",c:"Elon Musk",t:0,d:1,made:"Gut, through systems",
  desc:"Backs an instinct hard, then builds a machine around it at brutal speed. Rewrites the plan mid flight and expects everyone to keep up.",
  best:"anchor",work:"architect",
  why:"You set the direction hard and fast, they keep the humans intact behind you."},
 purist:{n:"The Purist",c:"Steve Jobs",t:0,d:2,made:"Gut, through the work",
  desc:"Knows what good looks like and will not ship until it is. Slow to release, uncompromising on detail, and usually right in a way that annoys people.",
  best:"optimiser",work:"anchor",
  why:"You will not compromise the work, so they run everything around it."},
 anchor:{n:"The Anchor",c:"Ted Lasso",t:1,d:0,made:"Proof, through people",
  desc:"Reads the evidence, then moves the org through trust and patience rather than force. Steady, deeply consultative, plays a long game on culture.",
  best:"charger",work:"purist",
  why:"You build the team, they supply the conviction to point it somewhere."},
 optimiser:{n:"The Optimiser",c:"Jeff Bezos",t:1,d:1,made:"Proof, through systems",
  desc:"Measures everything and lets the numbers pick the direction. Builds process that outlives them and scales aggressively once the data clears.",
  best:"believer",work:"purist",
  why:"You measure and systemise, they create the thing worth measuring."},
 architect:{n:"The Architect",c:"Warren Buffett",t:1,d:2,made:"Proof, through the work",
  desc:"Waits for the right thing, then commits and holds. Almost no activity for long stretches, enormous conviction when they finally act.",
  best:"charger",work:"believer",
  why:"You wait for the right call, they create the momentum between calls."}
};
var ANCHORS={believer:[10,8],charger:[10,50],purist:[10,92],
             anchor:[90,8],optimiser:[90,50],architect:[90,92]};
var BOX={believer:[15,14],charger:[15,32],purist:[15,50],
         anchor:[64,14],optimiser:[64,32],architect:[64,50]};
/* grid order, so lists line up with the map: gut on the left, proof on the right */
var ORDER=["believer","anchor","charger","optimiser","purist","architect"];
var GRID=["believer","charger","purist","anchor","optimiser","architect"];

// axis: t trigger (high = proof), d drive (high = the work), m manner (high = measured), x reactiveness (high = deferred)
var Q=[
 {a:"t",r:1,q:"I have committed real money to something I could not have justified on paper at the time."},
 {a:"d",r:1,q:"When something goes wrong, my first instinct is who needs support, not what broke."},
 {a:"m",r:1,q:"I have said something in a meeting knowing it would embarrass someone, because it needed saying."},
 {a:"x",r:0,q:"I have let a problem run for a fortnight while I worked out how to raise it."},
 {a:"t",r:0,q:"I have asked for another round of numbers when the team was already ready to move."},
 {a:"d",r:0,q:"I have let a team member struggle through a week because fixing the output mattered more."},
 {a:"m",r:1,q:"People have described me as blunt more than once."},
 {a:"x",r:0,q:"I will hold an issue until I can raise it privately, even if the group keeps working off bad information."},
 {a:"t",r:1,q:"I have overruled an analysis because it did not match what I believed was true."},
 {a:"d",r:1,q:"I spend more of my week in conversations than producing anything myself."},
 {a:"m",r:0,q:"I spend more time deciding how to say something than deciding whether it is true."},
 {a:"x",r:1,q:"I would rather have an awkward conversation today than a smooth one on Friday."},
 {a:"t",r:0,q:"I have missed an opportunity because I wanted more certainty before committing."},
 {a:"d",r:0,q:"I have redone someone's work myself instead of coaching them through it."},
 {a:"m",r:1,q:"I have named a problem in front of a group before checking how the person would take it."},
 {a:"x",r:1,q:"When something annoys me, the person usually hears about it the same day."},
 {a:"t",r:1,q:"I would rather back the wrong thing early than the right thing late."},
 {a:"d",r:1,q:"I could describe my team's mood more accurately than the status of the work."},
 {a:"m",r:0,q:"I soften feedback so it lands, even when that means the point arrives weaker."},
 {a:"x",r:0,q:"I sit on bad news until I have worked out what to do about it."},
 {a:"t",r:0,q:"I need to see something work at small scale before I will put real weight behind it."},
 {a:"d",r:0,q:"I would rather ship the right thing with a strained team than the wrong thing with a happy one."},
 {a:"m",r:1,q:"I would rather be understood than liked."},
 {a:"x",r:1,q:"I have reacted to a problem before I had the full picture."},
 {a:"t",r:1,q:"I have started work on something before the business case was finished."},
 {a:"d",r:0,q:"I judge my week by what got finished, not by how the team is travelling."},
 {a:"m",r:0,q:"I have rewritten a message several times to get the tone right."},
 {a:"x",r:0,q:"I would rather raise something once, properly, than raise it early and be half right."}
];
var LBL=["Strongly disagree","Mildly disagree","Mildly agree","Strongly agree"];

/* Ryan's own answers, taken 17 August 2026. The landing page runs them
   through the real scoring, so it shows his actual result. The Purist. */
var EXAMPLE=[3,1,3,3, 3,4,4,2, 4,2,1,1, 4,3,4,2, 3,1,3,3, 2,4,3,2, 4,3,3,3];

var KEY="hl-leadership-v3";
var C={cell:"#D5F3EC",deep:"#0A7261",mid:"#1FB89D",rim:"#D7DDDA",grey:"#C9D0CD",card:"#FFFFFF",paper:"#F2F4F3",dot:"#B5BDBA"};

function $(id){return document.getElementById(id);}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function short(k){return STYLES[k].n.replace("The ","");}

/* ---------- Answers, carried between pages ----------
   The result page reads them from ?a= (28 digits, 1 to 4), so a result is a
   link someone can keep or send. The browser keeps a copy as well, so the
   questions page remembers where someone was up to. */
function encode(ans){return ans.map(function(v){return v||0;}).join("");}
function decode(str){
  if(!/^[1-4]{28}$/.test(str||"")) return null;
  return str.split("").map(Number);
}
function load(){
  try{var v=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(v)&&v.length===Q.length)return v;}catch(e){}
  return null;
}
function save(ans){try{localStorage.setItem(KEY,JSON.stringify(ans));}catch(e){}}
function clearSaved(){try{localStorage.removeItem(KEY);}catch(e){}}
function resultHref(ans){return LINKS.result+(LINKS.result.indexOf("?")>-1?"&":"?")+"a="+encode(ans);}

/* ---------- Scoring, as MODEL.md ---------- */
function score(ans){
  function sum(axis){var t=0;Q.forEach(function(o,i){if(o.a===axis)t+=o.r?(5-ans[i]):ans[i];});return t;}
  function pct(s){return (s-7)/21*100;}
  var r={ts:sum("t"),ds:sum("d"),ms:sum("m"),xs:sum("x")};
  r.tp=pct(r.ts); r.dp=pct(r.ds); r.mp=pct(r.ms); r.xp=pct(r.xs);
  r.tri = r.ts<=17 ? 0 : 1;                          // 7 to 17 gut, 18 to 28 proof
  r.dri = r.ds<=14 ? 0 : (r.ds<=21 ? 1 : 2);         // inclusive bands
  r.man = r.ms<=14 ? "blunt" : (r.ms<=20 ? "balanced" : "measured");
  r.rea = r.xs<=14 ? "immediate" : (r.xs<=20 ? "balanced" : "deferred");
  r.key=Object.keys(STYLES).filter(function(k){return STYLES[k].t===r.tri&&STYLES[k].d===r.dri;})[0];
  r.s=STYLES[r.key];

  // blend: how close the dot sits to each anchor
  var MAX=Math.hypot(80,84), P=2.2;
  var raws=Object.keys(STYLES).map(function(k){
    var a=ANCHORS[k], lin=Math.max(0,1-Math.hypot(r.tp-a[0],r.dp-a[1])/MAX);
    return {k:k,lin:lin,cur:Math.pow(lin,P)};
  });
  var topLin=Math.max.apply(null,raws.map(function(x){return x.lin;}));
  var topCur=Math.max.apply(null,raws.map(function(x){return x.cur;}));
  r.scored={};
  raws.forEach(function(x){r.scored[x.k]=Math.max(0,Math.min(100,Math.round(100*topLin*(topCur>0?x.cur/topCur:0))));});

  // who to hire
  var B=STYLES[r.s.best], W=STYLES[r.s.work], bits=[];
  if(r.man!=="balanced") bits.push("you are <b>"+r.man+"</b> in manner, so screen for <b>"+(r.man==="blunt"?"measured":"blunt")+"</b>");
  if(r.rea!=="balanced") bits.push("you are <b>"+r.rea+"</b> in reactiveness, so screen for <b>"+(r.rea==="immediate"?"deferred":"immediate")+"</b>");
  r.best="<b>"+B.n+"</b>, "+B.c+". "+r.s.why;
  r.work="<b>"+W.n+"</b>, "+W.c+". Two drive steps across, so it works but you will both have to translate more.";
  r.screen=bits.length
    ? "Inside "+short(r.s.best)+", "+bits.join(", and ")+"."
    : "You sit balanced on both screening axes, so no candidate is ruled out on either.";
  return r;
}

/* ---------- Result pieces, shared by the landing example and the result page ---------- */
function heroHTML(r,tag){
  var reads=[["Trigger",r.tri===0?"Gut":"Proof"],
             ["Drive",["Through people","Through systems","Through the work"][r.dri]],
             ["Manner",cap(r.man)],["Reactiveness",cap(r.rea)]];
  return '<div class="shell result__grid">'+
    '<div class="result__copy">'+
      '<div class="minihead">'+tag+'</div>'+
      '<h2 class="display d1">'+r.s.n+'</h2>'+
      '<div class="celeb">Closest read, <b>'+r.s.c+'</b></div>'+
      '<p class="desc">'+r.s.desc+'</p>'+
    '</div>'+
    '<div class="reads">'+reads.map(function(x){return '<div class="read"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>';}).join("")+'</div>'+
  '</div>';
}

/* the cell the dot lands in, lit so the style reads off the map at a glance.
   top is where the map's box starts, 8 on screen and 6 on the print sheet */
function cellRect(r,top){
  var h=76/3, x=r.tri?50:8, y=top+r.dri*h;
  return '<rect class="cell" x="'+x+'" y="'+y.toFixed(2)+'" width="42" height="'+h.toFixed(2)+'" fill="'+C.cell+'"></rect>';
}

function mapSVG(r){
  var cx=(8+r.tp/100*84).toFixed(2), cy=(8+r.dp/100*76).toFixed(2), lab="";
  GRID.forEach(function(k,i){
    var left=i<3, y=[14.1,46,77.9][i%3], x=left?16.4:83.6, tx=left?19:81, an=left?"":' text-anchor="end"';
    lab+='<circle cx="'+x+'" cy="'+y+'" r="1.1" fill="'+C.dot+'"></circle>'+
      '<text class="zlab" x="'+tx+'" y="'+(y-.3)+'"'+an+'>'+short(k)+'</text>'+
      '<text class="zceleb" x="'+tx+'" y="'+(y+3)+'"'+an+'>'+STYLES[k].c+'</text>';
  });
  return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Where you sit on the Trigger and Drive map">'+
    '<rect x="8" y="8" width="84" height="76" fill="'+C.paper+'" stroke="'+C.rim+'" stroke-width=".4" rx="2"></rect>'+
    cellRect(r,8)+
    '<line x1="50" y1="8" x2="50" y2="84" stroke="'+C.rim+'" stroke-width=".4"></line>'+
    '<line x1="8" y1="33.3" x2="92" y2="33.3" stroke="'+C.rim+'" stroke-width=".4"></line>'+
    '<line x1="8" y1="58.7" x2="92" y2="58.7" stroke="'+C.rim+'" stroke-width=".4"></line>'+lab+
    '<circle cx="'+cx+'" cy="'+cy+'" r="6.5" fill="#2DE2C3" opacity=".22"></circle>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="3.6" fill="#2DE2C3" opacity=".45"></circle>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="2" fill="#fff" stroke="'+C.deep+'" stroke-width="1.1"></circle>'+
    '<text class="axlab" x="8" y="92">Gut</text><text class="axlab" x="92" y="92" text-anchor="end">Proof</text>'+
    '<text class="axlab" x="8" y="5">Through people</text><text class="axlab" x="92" y="5" text-anchor="end">Through the work</text>'+
  '</svg>';
}

function slidersHTML(r){
  function one(name,ends,on,v){
    return '<div class="slider"><div class="axname">'+name+'</div>'+
      '<div class="slabels">'+ends.map(function(e,i){return '<span class="'+(on===i?"on":"")+'">'+e+'</span>';}).join("")+'</div>'+
      '<div class="strack"><div class="sfill" style="width:'+v+'%"></div><div class="sdot" style="left:'+v+'%"></div></div></div>';
  }
  return '<div class="sname">The two that set your style</div>'+
    one("Trigger",["Gut","Proof"],r.tri,r.tp)+
    one("Drive",["Through people","Systems","The work"],r.dri,r.dp)+
    '<div class="sname" style="margin-top:28px">The two that screen your hire</div>'+
    one("Manner",["Blunt","Measured"],r.man==="blunt"?0:(r.man==="measured"?1:-1),r.mp)+
    one("Reactiveness",["Immediate","Deferred"],r.rea==="immediate"?0:(r.rea==="deferred"?1:-1),r.xp);
}

function barsHTML(r){
  return ORDER.map(function(k){
    var m=r.scored[k], on=(k===r.key);
    return '<div class="bar'+(on?" top":"")+'"><div class="brow">'+
      '<span class="bname">'+STYLES[k].n+(on?'<span class="you">You</span>':'')+'</span>'+
      '<span class="bpct">'+m+'%</span></div>'+
      '<div class="btrack"><div class="bfill" style="width:'+m+'%"></div></div></div>';
  }).join("");
}

function hireHTML(r){
  return '<div class="mrow"><span class="mtag mtag--on">Best fit</span><p>'+r.best+'</p></div>'+
    '<div class="mrow"><span class="mtag">Workable</span><p>'+r.work+'</p></div>'+
    '<div class="mrow"><span class="mtag">Screen</span><p>'+r.screen+'</p></div>';
}

function rawHTML(r){
  return 'Your scores out of 28. Trigger '+r.ts+', Drive '+r.ds+', Manner '+r.ms+', Reactiveness '+r.xs+'.';
}

function gridSVG(r){
  var key=r.key, s=r.s, lines=[
    ["believer","architect",1,38.5,21,63.5,53],["purist","anchor",1,38.5,53,63.5,21],
    ["believer","optimiser",0,38.5,17,63.5,35],["charger","anchor",0,38.5,35,63.5,17],
    ["charger","architect",0,38.5,39,63.5,57],["purist","optimiser",0,38.5,57,63.5,39]];
  var ln=lines.map(function(l){
    var lit=(l[0]===key||l[1]===key), sec=l[2]===1;
    var col=lit?(sec?C.mid:C.deep):C.grey, mk=lit?(sec?"ahs":"ah"):"ahg";
    return '<line x1="'+l[3]+'" y1="'+l[4]+'" x2="'+l[5]+'" y2="'+l[6]+'" stroke="'+col+'" stroke-width="'+(sec?".6":".95")+'"'+
      (sec?' stroke-dasharray="2.2 1.8"':'')+' opacity="'+(lit?1:.8)+'" marker-end="url(#'+mk+')" marker-start="url(#'+mk+')"></line>';
  }).join("");
  var bx=Object.keys(BOX).map(function(k){
    var p=BOX[k], on=(k===key||k===s.best||k===s.work), o=on?1:.45;
    return '<g opacity="'+o+'"><rect x="'+p[0]+'" y="'+p[1]+'" width="23" height="10" rx="2" fill="'+(k===key?"#E3F5F1":C.card)+'"'+
      ' stroke="'+(k===key?C.deep:(on?C.mid:C.rim))+'" stroke-width="'+(k===key?".7":(on?".5":".35"))+'"></rect>'+
      '<text class="gname" x="'+(p[0]+11.5)+'" y="'+(p[1]+5.2)+'" text-anchor="middle">'+short(k)+'</text>'+
      '<text class="gsub" x="'+(p[0]+11.5)+'" y="'+(p[1]+8.2)+'" text-anchor="middle">'+STYLES[k].c+'</text></g>';
  }).join("");
  function mk(id,fill){return '<marker id="'+id+'" markerWidth="4.5" markerHeight="4.5" refX="3.6" refY="2.25" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M0,0 L4.5,2.25 L0,4.5 z" fill="'+fill+'"></path></marker>';}
  return '<svg class="pgrid" viewBox="0 0 100 66" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The six styles and how they pair">'+
    '<defs>'+mk("ah",C.deep)+mk("ahs",C.mid)+mk("ahg",C.grey)+'</defs>'+
    '<text class="gaxis" x="26.5" y="7" text-anchor="middle">Trigger, gut</text>'+
    '<text class="gaxis" x="76" y="7" text-anchor="middle">Trigger, proof</text>'+
    '<line x1="51" y1="11" x2="51" y2="64" stroke="'+C.rim+'" stroke-width=".4" stroke-dasharray="2 2"></line>'+
    '<text class="gaxis" x="12" y="18.4" text-anchor="end">Through</text><text class="gaxis" x="12" y="21.4" text-anchor="end">people</text>'+
    '<text class="gaxis" x="12" y="36.4" text-anchor="end">Through</text><text class="gaxis" x="12" y="39.4" text-anchor="end">systems</text>'+
    '<text class="gaxis" x="12" y="54.4" text-anchor="end">Through</text><text class="gaxis" x="12" y="57.4" text-anchor="end">the work</text>'+
    ln+bx+'</svg>';
}

function card(title,sub,body,extra){
  return '<div class="card"'+(extra||"")+'><div class="cardhead"><h3 class="display d3">'+title+'</h3>'+
    (sub?'<p class="sub">'+sub+'</p>':'')+'</div>'+body+'</div>';
}

/* the cards under the hero */
function cardsHTML(r){
  var gap=' style="margin-top:clamp(16px,2vw,26px)"';
  var out='<div class="grid g2">'+
    card("Where you sit","Trigger and Drive place your dot. The six labels are the anchor points those two axes produce.",
      mapSVG(r)+'<div>'+slidersHTML(r)+'</div>')+
    card("Your blend","Nobody is one style. This is how close your dot sits to each of the six, listed in the same order as the map. They're match scores, so they don't add to 100.",
      '<div>'+barsHTML(r)+'</div><div class="raw">'+rawHTML(r)+'</div>')+
  '</div>'+
  card("Who to hire","A match works whether you're hiring them or working for them. Your style and its two matches are lit on the grid.",
    '<div class="hire">'+gridSVG(r)+'<div>'+hireHTML(r)+'</div></div>',gap);
  return out;
}

/* ---------- Print sheet, result page only ---------- */
function printHTML(r){
  var pcx=(8+r.tp/100*84).toFixed(2), pcy=(6+r.dp/100*76).toFixed(2), lab="";
  GRID.forEach(function(k,i){
    var left=i<3, y=[12.1,44,75.9][i%3], x=left?16.4:83.6, tx=left?19:81, an=left?"":' text-anchor="end"';
    lab+='<circle cx="'+x+'" cy="'+y+'" r="1" fill="'+C.dot+'"></circle><text class="pl" x="'+tx+'" y="'+(y-.3)+'"'+an+'>'+short(k)+'</text>'+
      '<text class="pc" x="'+tx+'" y="'+(y+2.9)+'"'+an+'>'+STYLES[k].c+'</text>';
  });
  var SL=[["Trigger","Gut","Proof",r.tp,r.tri===0,r.tri===1],
          ["Drive","Through people","The work",r.dp,r.dri===0,r.dri===2],
          ["Manner","Blunt","Measured",r.mp,r.man==="blunt",r.man==="measured"],
          ["Reactiveness","Immediate","Deferred",r.xp,r.rea==="immediate",r.rea==="deferred"]];
  var styles=GRID.map(function(k){var s=STYLES[k];return '<tr><td class="n">'+short(k)+'</td><td>'+s.c+'</td><td>'+s.made+'</td><td>'+s.desc.split(". ")[0]+'.</td></tr>';}).join("");
  var pairs=GRID.map(function(k){var s=STYLES[k];return '<tr><td class="n">'+short(k)+'</td><td><b>'+short(s.best)+'</b></td><td>'+short(s.work)+'</td><td>'+s.why+'</td></tr>';}).join("");
  return '<section class="psheet">'+
    '<div class="pbrand"><div class="pk">Leadership Styles Test</div><div class="pmark">Headliner<small>Group</small></div></div>'+
    '<div class="phero"><div class="pk">Your leadership style</div><h1>'+r.s.n+'</h1><div class="pceleb">Closest read, '+r.s.c+'</div><p>'+r.s.desc+'</p></div>'+
    '<div class="pcols"><div><h2 style="margin-top:0">Where you sit</h2>'+
      '<svg viewBox="0 0 100 96" xmlns="http://www.w3.org/2000/svg">'+
      '<rect x="8" y="6" width="84" height="76" fill="'+C.paper+'" stroke="'+C.rim+'" stroke-width=".4" rx="2"></rect>'+cellRect(r,6)+
      '<line x1="50" y1="6" x2="50" y2="82" stroke="'+C.rim+'" stroke-width=".4"></line>'+
      '<line x1="8" y1="31.3" x2="92" y2="31.3" stroke="'+C.rim+'" stroke-width=".4"></line>'+
      '<line x1="8" y1="56.7" x2="92" y2="56.7" stroke="'+C.rim+'" stroke-width=".4"></line>'+lab+
      '<circle id="pd3" cx="'+pcx+'" cy="'+pcy+'" r="6" fill="#2DE2C3" opacity=".3"></circle>'+
      '<circle id="pd1" cx="'+pcx+'" cy="'+pcy+'" r="2" fill="#fff" stroke="'+C.deep+'" stroke-width="1.2"></circle>'+
      '<text class="pa" x="8" y="89">Gut</text><text class="pa" x="92" y="89" text-anchor="end">Proof</text>'+
      '<text class="pa" x="8" y="4">Through people</text><text class="pa" x="92" y="4" text-anchor="end">Through the work</text></svg></div>'+
      '<div><h2 style="margin-top:0">Your axes</h2>'+SL.map(function(a){
        return '<div class="psl"><div class="pslname">'+a[0]+'</div><div class="pslends"><span class="'+(a[4]?"on":"")+'">'+a[1]+'</span><span class="'+(a[5]?"on":"")+'">'+a[2]+'</span></div>'+
          '<div class="pbar"><div class="pbarf" style="width:'+a[3]+'%"></div><div class="pdot" style="left:'+a[3]+'%"></div></div></div>';}).join("")+'</div></div>'+
    '<h2>Your blend</h2><div class="pblend">'+ORDER.map(function(k){var v=r.scored[k],on=(k===r.key);
      return '<div class="pbitem'+(on?" on":"")+'"><div class="pbrow"><span class="pbname">'+STYLES[k].n+(on?'<span class="pyou">You</span>':'')+'</span><span>'+v+'%</span></div><div class="pbtrack"><div class="pbfill" style="width:'+v+'%"></div></div></div>';}).join("")+'</div>'+
    '<h2>Who to hire</h2><div class="phire"><div><span class="tg">Best fit</span><span>'+r.best+'</span></div><div><span class="tg">Workable</span><span>'+r.work+'</span></div><div><span class="tg">Screen</span><span>'+r.screen+'</span></div></div>'+
    '<div class="pfoot">'+rawHTML(r)+' Headliner Leadership Styles Test. headlinergroup.com.au</div>'+
  '</section>'+
  '<section class="psheet">'+
    '<div class="pbrand"><div class="pk">The model</div><div class="pmark">Headliner<small>Group</small></div></div>'+
    '<h1>Headliner Leadership Styles</h1>'+
    '<p class="pintro">Twenty eight statements, four axes, six styles. It tells you what kind of leader you are, who to hire under you, and who you work best under.</p>'+
    '<h2>The four axes</h2><table><tr><th style="width:24mm">Axis</th><th style="width:44mm">Scale</th><th>What it measures</th><th style="width:30mm">Role</th></tr>'+
    '<tr><td class="n">Trigger</td><td>Gut to Proof</td><td>What you need before you act. Some move on a read. Some need it in hand first.</td><td><b>Sets your style</b></td></tr>'+
    '<tr><td class="n">Drive</td><td>People, Systems, The work</td><td>What moves the work forward. The people on it, the systems around it, or the work itself.</td><td><b>Sets your style</b></td></tr>'+
    '<tr><td class="n">Manner</td><td>Blunt to Measured</td><td>How it lands. Blunt keeps the point intact. Measured protects the relationship.</td><td>Screens the hire</td></tr>'+
    '<tr><td class="n">Reactiveness</td><td>Immediate to Deferred</td><td>How fast you get to it. Immediate hides nothing. Deferred arrives considered.</td><td>Screens the hire</td></tr></table>'+
    '<h2>The six styles</h2><table><tr><th style="width:24mm">Style</th><th style="width:26mm">Closest read</th><th style="width:34mm">Made up of</th><th>In one line</th></tr>'+styles+'</table>'+
    '<h2>Who pairs with who</h2><table><tr><th style="width:24mm">You are</th><th style="width:26mm">Best fit</th><th style="width:24mm">Workable</th><th>Why the best fit works</th></tr>'+pairs+'</table>'+
    '<h2>The rules behind the pairings</h2><div class="prules">'+
      '<div><b>Trigger, always opposite.</b> Someone has to be the one who says prove it, and someone has to be the one who moves before the proof arrives.</div>'+
      '<div><b>Drive, one step across, not two.</b> Same drive and nobody covers the ground you skip. Two steps and you have no shared language.</div>'+
      '<div><b>Manner, opposite.</b> Two blunt leaders and people stop bringing things forward. Two measured leaders and the point never lands hard enough.</div>'+
      '<div><b>Reactiveness, opposite.</b> Two immediate leaders and every small thing becomes an event. Two deferred leaders and problems age while everyone plans.</div>'+
      '<div><b>No hierarchy.</b> A match is a match whether you are hiring them or working for them.</div></div>'+
    '<div class="pfoot">Headliner Leadership Styles Test. headlinergroup.com.au</div>'+
  '</section>';
}

/* ---------- Pages ---------- */
function initLanding(){
  var r=score(EXAMPLE);
  $("example-hero").innerHTML=heroHTML(r,"Ryan Tayler's leadership style");
  $("example-cards").innerHTML=cardsHTML(r);
  $("styles").innerHTML=GRID.map(function(k){
    var s=STYLES[k];
    return '<article class="card"><div class="style__top"><h3 class="display d3">'+s.n+'</h3>'+
      '<div class="style__read">Closest read, <b>'+s.c+'</b></div></div>'+
      '<span class="style__made">'+s.made+'</span><p>'+s.desc+'</p>'+
      '<div class="style__pair">Pairs best with <b>'+STYLES[s.best].n+'</b>.</div></article>';
  }).join("");
}

function initQuestions(){
  var ans=load()||new Array(Q.length).fill(null);
  var qs=$("qs");
  Q.forEach(function(o,i){
    var d=document.createElement("div");d.className="q";d.id="q"+i;
    d.innerHTML='<span class="qn" aria-hidden="true">'+String(i+1).padStart(2,"0")+'</span><p class="qt" id="qt'+i+'">'+o.q+'</p>'+
      '<div class="opts" role="group" aria-labelledby="qt'+i+'">'+LBL.map(function(l,j){
        return '<button type="button" class="opt" aria-pressed="false" data-i="'+i+'" data-v="'+(j+1)+'">'+l+'</button>';}).join("")+'</div>';
    qs.appendChild(d);
  });
  var gos=[].slice.call(document.querySelectorAll("[data-go]"));
  function paint(){
    var done=ans.filter(function(a){return a!==null;}).length, all=done===Q.length;
    document.querySelectorAll(".opt").forEach(function(el){
      el.setAttribute("aria-pressed", ans[+el.dataset.i]===+el.dataset.v ? "true" : "false");
    });
    Q.forEach(function(o,i){$("q"+i).classList.toggle("is-done",ans[i]!==null);});
    $("pcount").textContent=done+" of "+Q.length+" answered";
    $("pfill").style.width=(done/Q.length*100)+"%";
    $("pstate").textContent= all ? "All done" : (Q.length-done)+" to go";
    gos.forEach(function(g){
      g.setAttribute("aria-disabled", all ? "false" : "true");
      if(all) g.setAttribute("href",resultHref(ans)); else g.removeAttribute("href");
    });
    $("finish-note").textContent = all ? "Your result is ready." : "Answer all 28 to see your result.";
  }
  qs.addEventListener("click",function(e){
    var el=e.target.closest(".opt"); if(!el) return;
    var i=+el.dataset.i, was=ans[i];
    ans[i]=+el.dataset.v; save(ans); paint();
    // move on to the next unanswered statement, the first time this one is answered
    if(was===null){
      var next=ans.indexOf(null,i+1); if(next<0) next=ans.indexOf(null);
      var target= next<0 ? $("finish") : $("q"+next);
      var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});
    }
  });
  paint();
}

function initResult(){
  var m=/[?&]a=([1-4]{28})(?:&|$)/.exec(location.search);
  var ans=m?decode(m[1]):load();
  if(ans&&ans.some(function(a){return a===null;})) ans=null;
  if(!ans){ $("empty").hidden=false; return; }
  var r=score(ans);
  $("result-hero").innerHTML=heroHTML(r,"Your leadership style");
  $("result-cards").innerHTML=cardsHTML(r);
  $("result").hidden=false;
  document.title=r.s.n+", Headliner Leadership Styles Test";
  // the print sheet sits directly on body, so the print rules can hide everything else
  var ps=document.createElement("div"); ps.id="printsheet"; ps.innerHTML=printHTML(r);
  document.body.appendChild(ps);
  $("retake").addEventListener("click",function(){clearSaved();});
  document.querySelectorAll("[data-print]").forEach(function(b){
    b.addEventListener("click",function(){
      var dark=b.getAttribute("data-print")==="dark";
      document.documentElement.classList.toggle("pdark",dark);
      setTimeout(function(){window.print();setTimeout(function(){document.documentElement.classList.remove("pdark");},400);},60);
    });
  });
}

(function(){
  document.querySelectorAll("[data-link]").forEach(function(a){
    var to=LINKS[a.getAttribute("data-link")]; if(to) a.setAttribute("href",to);
  });
  var page=(document.querySelector("[data-page]")||{}).getAttribute&&document.querySelector("[data-page]").getAttribute("data-page");
  if(page==="landing") initLanding();
  if(page==="questions") initQuestions();
  if(page==="result") initResult();
})();
