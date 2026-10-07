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
   has its own URL, so change these and nothing else. Every element with a
   data-link naming one of them takes its href from here. */
var LINKS={
  landing:"landing.html",
  form:"form.html",
  test:"questions.html",
  result:"result.html",
  site:"https://headlinergroup.com.au"
};

var STYLES={
 believer:{n:"The Believer",c:"Richard Branson",t:0,d:0,made:"Acts on gut, drives success through people",
  desc:"Sells the vision before it exists and pulls people into it on belief alone. Moves fast, starts more than they finish, and the room follows because they want to.",
  best:"optimiser",work:"architect",
  why:"You sell it, they prove it and build the machine that holds it up.",
  whyWork:"You start things on belief, they only commit when it's right, so the ideas you back get the discipline to last."},
 charger:{n:"The Charger",c:"Elon Musk",t:0,d:1,made:"Acts on gut, drives success through systems",
  desc:"Backs an instinct hard, then builds a machine around it at brutal speed. Rewrites the plan mid flight and expects everyone to keep up.",
  best:"anchor",work:"architect",
  why:"You set the direction hard and fast, they keep the humans intact behind you.",
  whyWork:"You move fast on instinct, they wait for the right call, so your speed lands on the bets worth making."},
 purist:{n:"The Purist",c:"Steve Jobs",t:0,d:2,made:"Acts on gut, drives success through the work",
  desc:"Knows what good looks like and will not ship until it is. Slow to release, uncompromising on detail, and usually right in a way that annoys people.",
  best:"optimiser",work:"anchor",
  why:"You won't compromise the work, they run everything around it, so the detail gets the time it needs.",
  whyWork:"You hold the standard on the work, they hold the team together, so people stay with you while you push."},
 anchor:{n:"The Anchor",c:"Ted Lasso",t:1,d:0,made:"Acts on proof, drives success through people",
  desc:"Reads the evidence, then moves the org through trust and patience rather than force. Steady, deeply consultative, plays a long game on culture.",
  best:"charger",work:"purist",
  why:"You build the team, they supply the conviction to point it somewhere.",
  whyWork:"You build trust in the team, they hold the standard on the work, so the culture you build ships something great."},
 optimiser:{n:"The Optimiser",c:"Jeff Bezos",t:1,d:1,made:"Acts on proof, drives success through systems",
  desc:"Measures everything and lets the numbers pick the direction. Builds process that outlives them and scales aggressively once the data clears.",
  best:"believer",work:"purist",
  why:"You measure and systemise, they create the thing worth measuring.",
  whyWork:"You run the numbers, they refuse to ship anything ordinary, so what you scale is worth scaling."},
 architect:{n:"The Architect",c:"Warren Buffett",t:1,d:2,made:"Acts on proof, drives success through the work",
  desc:"Waits for the right thing, then commits and holds. Almost no activity for long stretches, enormous conviction when they finally act.",
  best:"charger",work:"believer",
  why:"You wait for the right call, they create the momentum between calls.",
  whyWork:"You hold your conviction quietly, they sell the vision loudly, so people buy into the calls you make."}
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
   through the real scoring, so the example is a real result. It is not
   labelled as his on the page. The Purist. */
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
  var B=STYLES[r.s.best], W=STYLES[r.s.work], want=[], you=[];
  if(r.man!=="balanced"){ want.push("<b>"+(r.man==="blunt"?"measured":"blunt")+"</b> in manner"); you.push(r.man); }
  if(r.rea!=="balanced"){ want.push("<b>"+(r.rea==="immediate"?"deferred":"immediate")+"</b> in reactiveness"); you.push(r.rea); }
  function a(k){return (/^[AEIOU]/.test(short(k))?"an ":"a ")+short(k);}
  // The Charger and the Optimiser sit in the middle of Drive, so both of their matches are
  // one step across. They get two best fits and no workable. Everyone else has one of each.
  r.two=(r.s.d===1);
  r.best="<b>"+B.n+"</b>, like "+B.c+". "+r.s.why;
  r.work="<b>"+W.n+"</b>, like "+W.c+". "+r.s.whyWork;
  // The screen is about the best fit hire. Look for one whose manner and pace are the opposite of yours.
  var hire= r.two ? a(r.s.best)+" or "+a(r.s.work) : a(r.s.best);
  var any= r.two ? short(r.s.best)+" or "+short(r.s.work) : short(r.s.best);
  r.screen=want.length
    ? "When you hire "+hire+", look for one who's "+want.join(" and ")+". You're "+you.join(" and ")+", so they cover "+(want.length>1?"both":"it")+"."
    : "You're balanced on manner and reactiveness, so any "+any+" can work.";
  return r;
}

/* ---------- Result pieces, shared by the landing example and the result page ---------- */
function heroHTML(r,tag){
  // each scale read as a sentence, so the result says what it means
  var reads=[["Your decisions are triggered by",r.tri===0?"Gut":"Proof"],
             ["You drive success through",["People","Systems","The work"][r.dri]],
             ["Your professional manner is",cap(r.man)],
             ["You react to problems",{immediate:"Immediately",balanced:"In good time",deferred:"After some thought"}[r.rea]]];
  return '<div class="shell result__grid">'+
    '<div class="result__copy">'+
      '<div class="minihead minihead--quiet">'+tag+'</div>'+
      '<h2 class="display d1">'+r.s.n+'</h2>'+
      '<div class="celeb">Similar to <b>'+r.s.c+'</b></div>'+
      '<p class="desc">'+r.s.desc+'</p>'+
    '</div>'+
    '<div class="reads">'+reads.map(function(x){return '<div class="read"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>';}).join("")+'</div>'+
  '</div>';
}

/* The map. Gut and proof name the two columns along the bottom. The three Drive rows
   are named up the left side, the work at the bottom to people at the top. The box is
   set in from the left to make room for those names. */
var MAP={x:9,y:4,w:83,h:75};
function cellRect(r){
  var h=MAP.h/3, w=MAP.w/2, x=MAP.x+(r.tri?w:0), y=MAP.y+r.dri*h;
  return '<rect class="cell" x="'+x+'" y="'+y.toFixed(2)+'" width="'+w+'" height="'+h.toFixed(2)+'" fill="'+C.cell+'"></rect>';
}

function mapSVG(r){
  var M=MAP, mx=M.x+M.w/2, h3=M.h/3, bottom=M.y+M.h, right=M.x+M.w;
  var cx=(M.x+r.tp/100*M.w).toFixed(2), cy=(M.y+r.dp/100*M.h).toFixed(2), lab="", rows="";
  GRID.forEach(function(k,i){
    var left=i<3, y=M.y+7+(i%3)*h3, tx=left?M.x+3:right-3, an=left?"":' text-anchor="end"', on=(k===r.key)?" on":"";
    lab+='<text class="zlab'+on+'" x="'+tx+'" y="'+y.toFixed(2)+'"'+an+'>'+short(k)+'</text>'+
      '<text class="zceleb'+on+'" x="'+tx+'" y="'+(y+(on?4.2:3.8)).toFixed(2)+'"'+an+'>'+STYLES[k].c+'</text>';
  });
  ["People","Systems","The work"].forEach(function(t,i){
    var y=(M.y+h3*i+h3/2).toFixed(2), x=M.x-2.4;
    rows+='<text class="axlab axrow" x="'+x+'" y="'+y+'" text-anchor="middle" transform="rotate(-90 '+x+' '+y+')">'+t+'</text>';
  });
  return '<svg class="map" viewBox="0 0 100 89" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Where you sit on the Trigger and Drive map">'+
    '<rect x="'+M.x+'" y="'+M.y+'" width="'+M.w+'" height="'+M.h+'" fill="'+C.paper+'" stroke="'+C.rim+'" stroke-width=".4" rx="2"></rect>'+
    cellRect(r)+
    '<line x1="'+mx+'" y1="'+M.y+'" x2="'+mx+'" y2="'+bottom+'" stroke="'+C.rim+'" stroke-width=".4"></line>'+
    '<line x1="'+M.x+'" y1="'+(M.y+h3).toFixed(2)+'" x2="'+right+'" y2="'+(M.y+h3).toFixed(2)+'" stroke="'+C.rim+'" stroke-width=".4"></line>'+
    '<line x1="'+M.x+'" y1="'+(M.y+2*h3).toFixed(2)+'" x2="'+right+'" y2="'+(M.y+2*h3).toFixed(2)+'" stroke="'+C.rim+'" stroke-width=".4"></line>'+lab+
    '<circle cx="'+cx+'" cy="'+cy+'" r="6.5" fill="#2DE2C3" opacity=".22"></circle>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="3.6" fill="#2DE2C3" opacity=".45"></circle>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="2" fill="#fff" stroke="'+C.deep+'" stroke-width="1.1"></circle>'+
    // trigger, along the bottom
    '<text class="axlab" x="'+(M.x+M.w/4)+'" y="'+(bottom+5)+'" text-anchor="middle">Gut</text>'+
    '<text class="axlab" x="'+(M.x+3*M.w/4)+'" y="'+(bottom+5)+'" text-anchor="middle">Proof</text>'+
    // drive, up the left side
    rows+
  '</svg>';
}

/* The scales have two ends and no zero, so the fill runs out from the middle to the dot */
function fromMid(v){
  var lo=Math.min(v,50), w=Math.abs(v-50);
  return "left:"+lo.toFixed(2)+"%;width:"+w.toFixed(2)+"%";
}

function slidersHTML(r){
  function one(name,ends,on,v){
    return '<div class="slider"><div class="axname">'+name+'</div>'+
      '<div class="slabels'+(ends.length===3?' slabels--3':'')+'">'+ends.map(function(e,i){return '<span class="'+(on===i?"on":"")+'">'+e+'</span>';}).join("")+'</div>'+
      '<div class="strack"><div class="sfill" style="'+fromMid(v)+'"></div><div class="sdot" style="left:'+v+'%"></div></div></div>';
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
    '<div class="mrow">'+(r.two?'<span class="mtag mtag--on">Best fit</span>':'<span class="mtag">Workable</span>')+'<p>'+r.work+'</p></div>'+
    '<div class="mrow"><span class="mtag">Screen</span><p>'+r.screen+'</p></div>';
}

function gridSVG(r,pre){
  pre=pre||"";
  var key=r.key, s=r.s, lines=[
    ["believer","architect",1,38.5,21,63.5,53],["purist","anchor",1,38.5,53,63.5,21],
    ["believer","optimiser",0,38.5,17,63.5,35],["charger","anchor",0,38.5,35,63.5,17],
    ["charger","architect",0,38.5,39,63.5,57],["purist","optimiser",0,38.5,57,63.5,39]];
  var ln=lines.map(function(l){
    var lit=(l[0]===key||l[1]===key), sec=l[2]===1;
    var col=lit?(sec?C.mid:C.deep):C.grey, mk=lit?(sec?"ahs":"ah"):"ahg";
    return '<line x1="'+l[3]+'" y1="'+l[4]+'" x2="'+l[5]+'" y2="'+l[6]+'" stroke="'+col+'" stroke-width="'+(sec?".6":".95")+'"'+
      (sec?' stroke-dasharray="2.2 1.8"':'')+' opacity="'+(lit?1:.8)+'" marker-end="url(#'+pre+mk+')" marker-start="url(#'+pre+mk+')"></line>';
  }).join("");
  var bx=Object.keys(BOX).map(function(k){
    var p=BOX[k], on=(k===key||k===s.best||k===s.work), o=on?1:.45;
    return '<g opacity="'+o+'"><rect x="'+p[0]+'" y="'+p[1]+'" width="23" height="10" rx="2" fill="'+(k===key?"#E3F5F1":C.card)+'"'+
      ' stroke="'+(k===key?C.deep:(on?C.mid:C.rim))+'" stroke-width="'+(k===key?".7":(on?".5":".35"))+'"></rect>'+
      '<text class="gname" x="'+(p[0]+11.5)+'" y="'+(p[1]+5.2)+'" text-anchor="middle">'+short(k)+'</text>'+
      '<text class="gsub" x="'+(p[0]+11.5)+'" y="'+(p[1]+8.2)+'" text-anchor="middle">'+STYLES[k].c+'</text></g>';
  }).join("");
  function mk(id,fill){return '<marker id="'+pre+id+'" markerWidth="4.5" markerHeight="4.5" refX="3.6" refY="2.25" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M0,0 L4.5,2.25 L0,4.5 z" fill="'+fill+'"></path></marker>';}
  return '<svg class="pgrid" viewBox="0 0 100 66" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The six styles and how they pair">'+
    '<defs>'+mk("ah",C.deep)+mk("ahs",C.mid)+mk("ahg",C.grey)+'</defs>'+
    '<text class="gaxis" x="26.5" y="7" text-anchor="middle">On gut</text>'+
    '<text class="gaxis" x="76" y="7" text-anchor="middle">On proof</text>'+
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
function cardsHTML(r,pre){
  var gap=' style="margin-top:clamp(16px,2vw,26px)"';
  var out='<div class="grid g2">'+
    card("Where you sit","Your dot is placed based on your trigger and drive result. This defines your leadership style.",
      mapSVG(r)+'<div class="sliders">'+slidersHTML(r)+'</div>')+
    card("Your blend","Nobody is 100% one style. This is your blend of each of the six styles. Your highest result defines your style, and if you come back again next month you may have moved slightly in your style.",
      '<div class="blend">'+barsHTML(r)+'</div>')+
  '</div>'+
  card("Who to work with","This shows the styles that fit best alongside yours, as a business partner, a direct report or a manager. You generally want someone with a different trigger to you, so there's someone challenging how you make decisions. And you want someone with a slightly different drive, so you get another angle on the work.",
    '<div class="hire">'+gridSVG(r,pre)+'<div>'+hireHTML(r)+'</div></div>',gap);
  return out;
}

/* ---------- Print sheet, result page only ---------- */
/* Ryan's signature, as the site uses it. Ink only, so it takes the text colour. */
var SIG="<svg viewBox=\"0 0 601.04 273.69\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" class=\"psig\" role=\"img\" aria-label=\"Ryan Tayler\"> <path d=\"M394.25,46.02c32.82.56,65.41,1.12,97.93,1.68.55-2.98,1-5.46,1.47-8.05,6.11,1.13,6.02,5.62,6.52,10.1,4.97,0,9.74.2,14.49-.05,5.58-.29,9.47,2.55,12.68,6.47,1.02,1.25,1.33,3.37,1.35,5.1.04,2.69-1.29,4.69-3.79,1.98-6.56-7.09-15.54-4.8-23.51-6.34-1.04-.2-3.15,1.45-3.63,2.68-6.12,15.73-11.35,31.84-18.19,47.24-6.12,13.79-13.8,26.92-21.18,40.12-1.1,1.98-4.36,2.75-6.62,4.08l-1.19-1.02c.64-2.21.8-4.73,2.01-6.57,8.7-13.24,16.1-27.13,21.86-41.91,5.65-14.52,11.38-29,17.56-44.72-6.9-.81-12.64-2.02-18.38-2.06-28.76-.19-57.52-.14-86.28.11-2.12.02-5.25,1.81-6.18,3.65-12.6,25.01-25.31,49.98-37.1,75.37-7.93,17.06-14.45,34.78-21.23,51.29-2.73-.29-4.63-.49-7.51-.8.2-2.64.47-6.06.72-9.49.31-4.31,1.14-8.65.82-12.91-1.41-19-6.87-36.27-22.12-49.15-10.1-8.53-21.47-14.71-33.84-19.23-9.74-3.56-19.52-7.05-29.13-10.93-2.19-.88-5.35-3.28-5.3-4.89.08-2.58,2.03-5.53,4.01-7.5,1.75-1.74,4.53-2.74,7.03-3.38,12.55-3.19,25.11-6.41,37.77-9.12,10.92-2.34,21.95-4.18,32.99-5.9,5.93-.93,11.98-1.13,17.97-1.69,9.24-.86,18.46-1.92,27.71-2.53,5.34-.35,10.73-.1,16.09.13,5.91.26,10.39-1.93,14.01-6.6,1.22-1.58,3.98-3.6,5.21-3.15,1.89.69,3.12,3.29,4.48,5.19.4.56.3,1.5.51,2.78ZM373.24,55.73c-46.61,1.06-92.54,8.58-137.92,20.46.71.88,1.4,1.22,2.12,1.47,23.34,8.13,46.84,15.94,65.22,33.68,9.73,9.39,16.05,20.68,19.22,33.73,1.13,4.64,1.8,9.38,2.68,14.12,16.33-34.71,32.45-68.96,48.68-103.46Z\"/> <path d=\"M131.29,176.82c11.1-14.62,21.78-28.67,32.73-43.1-5.7-1.03-10.34-3.16-10.78-9.02-.48-6.44-1.27-13.29,5.13-17.99,2.81,2.95,5.86,5.35,2.89,10.05-1.12,1.78-.49,4.66-.71,7.71,12.73-3.86,19.39-14.44,28.61-21.48,4.99,3.58,5,5.85,1.1,10.86-17.49,22.41-34.87,44.91-52.65,67.85,7.33,5.22,14.52,10.12,21.47,15.33,19.32,14.48,38.54,29.1,57.83,43.62,4.6,3.46,9.47,6.56,13.94,10.16,1.37,1.11,1.84,3.33,2.72,5.04-2.2-.04-4.99.78-6.5-.26-8.31-5.69-16.24-11.93-24.42-17.81-21.05-15.11-42.42-29.78-63.17-45.29-16.3-12.18-31.92-25.29-47.72-38.13-2.53-2.06-4.65-4.74-6.54-7.42-6.27-8.88-4.43-16.06,5.8-20.42,6.73-2.87,14.18-4.08,20.92-6.93,15.29-6.46,31.26-11.74,44.39-22.4,3.27-2.66,6.49-5.91,8.43-9.58,5-9.46-.5-17.61-12.67-21.06-15.93-4.51-31.67-2.62-47.66-.52-15.85,2.09-29.86,8.08-42.29,17.69-4.19,3.25-7.61,7.79-10.53,12.29-3.12,4.81-1.59,8.85,3.11,12.37,2.66,1.98,5.14,4.25,7.41,6.66.64.68.79,2.71.24,3.37-.55.67-2.37.84-3.4.51-14.91-4.79-17.55-23.64-9.8-32.39,8.14-9.18,17.15-16.8,29.39-20.18,6.87-1.9,13.24-5.82,20.16-7.23,8.77-1.79,17.91-1.72,26.82-2.9,9.51-1.27,18.7.22,27.79,2.56,10.84,2.79,21.33,12.69,19.57,23.26-.68,4.1-3.03,8.23-5.55,11.65-13.77,18.68-34.49,26.22-55.19,33.74-6.19,2.25-12.38,4.49-18.48,6.96-5.5,2.22-6.34,5.1-1.98,9.05,10.77,9.74,21.88,19.1,32.91,28.55,1.98,1.69,4.22,3.08,6.68,4.86Z\"/> <path d=\"M431.94,124.6c12.34-4.7,19.77-14.08,28.36-21.8,4.93,3.56,5.41,5.22,1.97,9.7-14.59,19.01-29.29,37.93-43.97,56.88-3.95,5.1-8.03,10.1-11.92,15.25-1.35,1.78-2.35,4.1-4.91,1.79-2.1-1.9-3.34-4.06-1.12-6.91,5.48-7.04,10.83-14.18,16.23-21.28,6.09-8.01,12.17-16.01,18.32-24.09-12.21-4.63-15.04-18.99-5.62-27.23,3.38,2.84,6.09,5.6,2.81,10.51-.97,1.45-.15,4.1-.15,7.2Z\"/> <path d=\"M219.18,130.17c-1.39.94-2.82,1.83-4.18,2.83-5.77,4.23-11.35,8.73-17.32,12.65-3.56,2.34-8.8,3.7-11.36.19-1.62-2.22-.61-7.89,1.19-10.78,7.77-12.47,17.54-23.11,31.58-28.91,1.22-.5,2.38-1.22,3.64-1.52,2.07-.48,5.8-1.45,6.05-.91,1.5,3.19,4.9,4.66,4.82,9.71-.17,10.81-6.25,18.88-9.71,28.14-.34.92-.61,2.19-1.32,2.59-2.23,1.26-4.65,2.19-6.99,3.24-.13-2.14-.87-4.47-.26-6.38,1.11-3.5,3.02-6.74,4.59-10.09-.25-.25-.49-.51-.74-.76ZM196.05,135.61l1.06,1.17c9.47-7.07,18.97-14.1,28.37-21.27.92-.7,1.2-2.22,1.78-3.37l-1.25-1.01c-11.1,6.78-22.83,12.77-29.95,24.48Z\"/> <path d=\"M382.41,136.72c8.58-6.36,17.53-12.29,25.59-19.26,4.02-3.47,6.05.83,9.03.5.08,2.2.9,4.71.12,6.53-2.79,6.47-5.83,12.88-9.42,18.93-1.28,2.16-4.42,3.21-6.72,4.76-.66-.48-1.31-.95-1.97-1.43,1.88-5.34,3.75-10.67,6.12-17.4-2.61,1.88-4.14,2.96-5.64,4.07-5.74,4.26-11.47,8.55-17.23,12.78-.51.37-1.26.63-1.87.59-3.15-.24-6.84.24-9.21-1.28-1.18-.76-.74-5.63.34-8.02,4.31-9.54,11.61-16.89,19.69-23.19,5.22-4.07,11.49-6.84,17.44-9.92,1.56-.81,5.04-1.23,5.26-.75,1.4,3.09,7.09,4.44,3.78,10.07-8.03-5.24-13.18,1.27-18.71,5.27-5.55,4.01-10.47,8.91-15.58,13.51-.89.8-1.37,2.07-2.04,3.12l1.03,1.11Z\"/> <path d=\"M105.43,76.5c3.34,4.73,2.94,8.07.12,12.3-17.26,25.79-34.13,51.83-51.22,77.73-.76,1.16-2.37,1.76-3.58,2.62-.33-1.94-1.55-4.34-.83-5.74,3-5.85,6.46-11.48,9.99-17.04,13.62-21.4,27.33-42.75,41.04-64.09,1.22-1.89,2.76-3.57,4.48-5.79Z\"/> <path d=\"M480.33,125.74c.43-.37,1.35-1.85,2.36-1.91,8.73-.52,12.99-7.61,18.89-12.34,4.35-3.49,8.89-7.02,13.91-9.29,1.92-.86,5.71,1.33,8,3.02.77.56.2,4.4-.93,5.82-5.91,7.45-14.35,11.38-22.71,15.35-.45.21-1.02.22-1.39.5-1.96,1.47-6.32.64-5.21,5.04.92,3.66,6.06,6,9.97,4.85,2.99-.88,5.97-2.06,9.02-2.35,1.7-.17,3.55,1.2,5.34,1.87-.86,1.52-1.34,3.77-2.64,4.43-5.6,2.88-11.82,4.06-17.65,1.48-3.39-1.5-6.01-4.86-8.78-7.58-2.66-2.62-5.08-5.49-8.19-8.9Z\"/> <path d=\"M239.68,138.14c-.65-7.2,8.02-27.88,13.23-32.48,5.41,2.44,4.48,6.28,2.61,11.09,1.94-.99,3.85-2.03,5.81-2.95,7.94-3.73,14.38.27,13.54,9-.59,6.14-2.65,12.12-3.95,18.2-.75,3.5-1.01,7.14-2.07,10.53-.61,1.95-2.37,4.95-3.67,4.98-2.74.06-5.02-2.21-4.25-5.41,1.87-7.78,4.04-15.5,6.12-23.23.62-2.29,1.35-4.55,2.22-7.48-7.63-.43-12.1,4.1-16.94,7.4-3.26,2.22-5.92,5.28-8.93,7.88-1.02.89-2.27,1.52-3.71,2.46Z\"/> <path d=\"M527.69,144.84c-3.08-1.21-4.62-3.9-3.22-7.44,4.02-10.2,8.33-20.3,12.56-30.42.17-.41.72-.66,1.64-1.47,1.58,2.81,3.06,5.46,4.8,8.55,2.45-1.21,5.76-2.78,9-4.46,4.33-2.24,7.89-.88,10.89,2.39.71.77,1.24,2.65.79,3.33-.77,1.18-2.61,2.78-3.57,2.53-8.9-2.31-13.91,3.76-18.84,8.97-5.04,5.34-9.12,11.58-14.06,18.01Z\"/> </svg>";

/* The print sheet is the result page itself, one A4 page: the same hero and the same
   cards, built by the same functions and sized for paper by the print rules. */
function printHTML(r){
  return '<section class="psheet">'+
    '<div class="pbrand"><div class="pk">Headliner Leadership Styles Test</div>'+
      '<div class="plogo"><div class="hl-stage"><div class="hl-logo"><div class="hl-beam"></div><span class="hl-word">Headliner</span><div class="hl-group">Group</div></div></div></div></div>'+
    '<div class="band--dark beam-band result phero">'+heroHTML(r,"Your leadership style is")+'</div>'+
    '<div class="pcards band--paper2">'+cardsHTML(r,"p")+'</div>'+
    '<div class="pfoot"><span>headlinergroup.com.au</span>'+SIG+'</div>'+
  '</section>';
}

/* ---------- Pages ---------- */
function initLanding(){
  var r=score(EXAMPLE);
  $("example-hero").innerHTML=heroHTML(r,"Your leadership style is");
  $("example-cards").innerHTML=cardsHTML(r);
  $("styles").innerHTML=GRID.map(function(k){
    var s=STYLES[k];
    return '<article class="card"><div class="style__top"><h3 class="display d3">'+s.n+'</h3>'+
      '<div class="style__read">'+s.c+'</div></div>'+
      '<span class="style__made">'+s.made+'</span><p>'+s.desc+'</p></article>';
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

/* ---------- Download as PDF ----------
   The buttons save a finished one page A4 PDF, no print window. The page draws the
   print sheet to an image with html-to-image, which renders through the browser itself
   so the beam, the blur and the masks come out as they look, then jsPDF wraps that
   image in an A4 page. Both libraries load from jsDelivr on the first click only.
   The dark one is a digital poster, black to every edge. The light one keeps the white
   page with the same margin the printed sheet has. */
var PDF_LIBS=["https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js",
              "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"];
/* The brand fonts, handed to html-to-image as data. It cannot read Google's stylesheet
   itself, because the browser hides a cross site sheet's rules from scripts, and without
   this every heading in the PDF falls back to a system face. Latin only, fetched once. */
var FONT_CSS="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600&display=swap";
function fontCSS(){
  if(fontCSS.p) return fontCSS.p;
  fontCSS.p=fetch(FONT_CSS).then(function(res){return res.text();}).then(function(css){
    var latin=css.split(/(?=\/\* )/).filter(function(b){return /^\/\* latin \*\//.test(b);});
    if(latin.length) css=latin.join("");
    var urls=(css.match(/url\([^)]+\)/g)||[]).filter(function(u,i,a){return a.indexOf(u)===i;});
    return Promise.all(urls.map(function(u){
      return fetch(u.slice(4,-1).replace(/["']/g,"")).then(function(res){return res.blob();}).then(function(blob){
        return new Promise(function(ok){var fr=new FileReader();fr.onload=function(){ok([u,"url("+fr.result+")"]);};fr.readAsDataURL(blob);});
      });
    })).then(function(pairs){ pairs.forEach(function(p){css=css.split(p[0]).join(p[1]);}); return css; });
  }).catch(function(){ fontCSS.p=null; return ""; });
  return fontCSS.p;
}
function loadScript(src){
  return new Promise(function(ok,fail){
    var s=document.querySelector('script[data-src="'+src+'"]');
    if(s){ if(s.dataset.ready) ok(); else { s.addEventListener("load",ok); s.addEventListener("error",fail); } return; }
    s=document.createElement("script"); s.src=src; s.async=true; s.dataset.src=src;
    s.onload=function(){ s.dataset.ready="1"; ok(); }; s.onerror=fail;
    document.head.appendChild(s);
  });
}
function downloadPDF(r,dark,btn){
  if(btn.dataset.busy) return;
  var lab=btn.querySelector("span")||btn, was=lab.textContent, root=document.documentElement, ps=$("printsheet");
  btn.dataset.busy="1"; lab.textContent="Preparing your PDF";
  var bg= dark ? "#0A0A0A" : "#FFFFFF";
  function done(msg){
    ps.classList.remove("pdf-render"); root.classList.remove("pdark");
    lab.textContent=msg||was; delete btn.dataset.busy;
    if(msg) setTimeout(function(){ lab.textContent=was; },3000);
  }
  var fonts="";
  Promise.all(PDF_LIBS.map(loadScript).concat([fontCSS().then(function(c){fonts=c;})])).then(function(){
    root.classList.toggle("pdark",dark);
    ps.classList.add("pdf-render");
    return (document.fonts&&document.fonts.ready) || null;
  }).then(function(){
    // the sheet sits off screen while it is drawn, so the copy is put back in place
    return window.htmlToImage.toJpeg(ps,{quality:.95,pixelRatio:2.5,backgroundColor:bg,cacheBust:true,fontEmbedCSS:fonts||undefined,
      style:{position:"static",left:"0",top:"0",margin:"0"}});
  }).then(function(img){
    var w=ps.offsetWidth, h=ps.offsetHeight;
    var pdf=new window.jspdf.jsPDF({unit:"mm",format:"a4",orientation:"portrait"});
    pdf.setFillColor(bg); pdf.rect(0,0,210,297,"F");
    var pw=210, ph=210*h/w, x=0;
    if(ph>297){ pw=297*w/h; ph=297; x=(210-pw)/2; }
    pdf.addImage(img,"JPEG",x,0,pw,ph);
    pdf.save("Headliner-Leadership-Style-"+r.s.n.replace(/^The /,"")+(dark?"-Dark":"")+".pdf");
    done();
  }).catch(function(){ done("Couldn't make the PDF, try again"); });
}

function initResult(){
  var m=/[?&]a=([1-4]{28})(?:&|$)/.exec(location.search);
  var ans=m?decode(m[1]):load();
  if(ans&&ans.some(function(a){return a===null;})) ans=null;
  if(!ans){ $("empty").hidden=false; return; }
  var r=score(ans);
  $("result-hero").innerHTML=heroHTML(r,"Your leadership style is");
  $("result-cards").innerHTML=cardsHTML(r);
  $("result").hidden=false;
  document.title=r.s.n+", Headliner Leadership Styles Test";
  // the print sheet sits directly on body, so the print rules can hide everything else
  var ps=document.createElement("div"); ps.id="printsheet"; ps.innerHTML=printHTML(r);
  document.body.appendChild(ps);
  $("retake").addEventListener("click",function(){clearSaved();});
  // Share: the phone's own share sheet where there is one, otherwise copy the link.
  // The link carries the answers, so whoever opens it sees this exact result.
  var sh=$("share"), lab=sh.querySelector("span"), note=$("share-note");
  sh.addEventListener("click",function(){
    var url=location.href, said=lab.textContent;
    function done(t){ lab.textContent=t; setTimeout(function(){lab.textContent=said;},2500); }
    if(navigator.share){
      navigator.share({title:"My leadership style",text:"My leadership style is "+r.s.n+".",url:url}).catch(function(){});
      return;
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(function(){done("Link copied");},function(){note.textContent=url;note.hidden=false;});
    } else { note.textContent=url; note.hidden=false; }
  });
  document.querySelectorAll("[data-pdf]").forEach(function(b){
    b.addEventListener("click",function(){ downloadPDF(r,b.getAttribute("data-pdf")==="dark",b); });
  });
}

/* ---------- The site header, as the site's main.js ----------
   Transparent over the dark top of the page, solid once scrolled, and the
   burger opens the menu below 900. */
function initHeader(){
  var hdr=document.querySelector(".hdr"), nav=document.querySelector(".nav"), burger=document.querySelector(".burger");
  function onScroll(){ if(hdr) hdr.classList.toggle("is-stuck", window.scrollY>24); }
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();
  if(burger&&nav&&hdr){
    burger.addEventListener("click",function(){
      var open=nav.classList.toggle("is-open");
      hdr.classList.toggle("is-open",open);
      burger.setAttribute("aria-expanded",String(open));
      document.body.style.overflow=open?"hidden":"";
    });
    nav.addEventListener("click",function(e){ if(e.target.closest("a")&&nav.classList.contains("is-open")) burger.click(); });
  }
}

(function(){
  initHeader();
  document.querySelectorAll("[data-link]").forEach(function(a){
    var to=LINKS[a.getAttribute("data-link")]; if(to) a.setAttribute("href",to);
  });
  var page=(document.querySelector("[data-page]")||{}).getAttribute&&document.querySelector("[data-page]").getAttribute("data-page");
  if(page==="landing") initLanding();
  if(page==="questions") initQuestions();
  if(page==="result") initResult();
})();
