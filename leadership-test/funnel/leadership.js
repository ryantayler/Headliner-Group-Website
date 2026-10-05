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
 believer:{n:"The Believer",c:"Richard Branson",t:0,d:0,made:"Gut, through people",
  desc:"Sells the vision before it exists and pulls people into it on belief alone. Moves fast, starts more than they finish, and the room follows because they want to.",
  best:"optimiser",work:"architect",
  why:"You sell it, they prove it and build the machine that holds it up.",
  whyWork:"You start things on belief, they only commit when it's right, so the ideas you back get the discipline to last."},
 charger:{n:"The Charger",c:"Elon Musk",t:0,d:1,made:"Gut, through systems",
  desc:"Backs an instinct hard, then builds a machine around it at brutal speed. Rewrites the plan mid flight and expects everyone to keep up.",
  best:"anchor",work:"architect",
  why:"You set the direction hard and fast, they keep the humans intact behind you.",
  whyWork:"You move fast on instinct, they wait for the right call, so your speed lands on the bets worth making."},
 purist:{n:"The Purist",c:"Steve Jobs",t:0,d:2,made:"Gut, through the work",
  desc:"Knows what good looks like and will not ship until it is. Slow to release, uncompromising on detail, and usually right in a way that annoys people.",
  best:"optimiser",work:"anchor",
  why:"You won't compromise the work, they run everything around it, so the detail gets the time it needs.",
  whyWork:"You hold the standard on the work, they hold the team together, so people stay with you while you push."},
 anchor:{n:"The Anchor",c:"Ted Lasso",t:1,d:0,made:"Proof, through people",
  desc:"Reads the evidence, then moves the org through trust and patience rather than force. Steady, deeply consultative, plays a long game on culture.",
  best:"charger",work:"purist",
  why:"You build the team, they supply the conviction to point it somewhere.",
  whyWork:"You build trust in the team, they hold the standard on the work, so the culture you build ships something great."},
 optimiser:{n:"The Optimiser",c:"Jeff Bezos",t:1,d:1,made:"Proof, through systems",
  desc:"Measures everything and lets the numbers pick the direction. Builds process that outlives them and scales aggressively once the data clears.",
  best:"believer",work:"purist",
  why:"You measure and systemise, they create the thing worth measuring.",
  whyWork:"You run the numbers, they refuse to ship anything ordinary, so what you scale is worth scaling."},
 architect:{n:"The Architect",c:"Warren Buffett",t:1,d:2,made:"Proof, through the work",
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
  var reads=[["Trigger",r.tri===0?"Gut":"Proof"],
             ["Drive",["Through people","Through systems","Through the work"][r.dri]],
             ["Manner",cap(r.man)],["Reactiveness",cap(r.rea)]];
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

/* the cell the dot lands in, lit so the style reads off the map at a glance.
   top is where the map's box starts, 8 on screen and 6 on the print sheet */
function cellRect(r,top){
  var h=76/3, x=r.tri?50:8, y=top+r.dri*h;
  return '<rect class="cell" x="'+x+'" y="'+y.toFixed(2)+'" width="42" height="'+h.toFixed(2)+'" fill="'+C.cell+'"></rect>';
}

function mapSVG(r){
  var cx=(8+r.tp/100*84).toFixed(2), cy=(8+r.dp/100*76).toFixed(2), lab="";
  GRID.forEach(function(k,i){
    var left=i<3, y=[15,46.9,78.8][i%3], tx=left?11:89, an=left?"":' text-anchor="end"', on=(k===r.key)?" on":"";
    lab+='<text class="zlab'+on+'" x="'+tx+'" y="'+y+'"'+an+'>'+short(k)+'</text>'+
      '<text class="zceleb'+on+'" x="'+tx+'" y="'+(y+(on?4.2:3.8))+'"'+an+'>'+STYLES[k].c+'</text>';
  });
  return '<svg class="map" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Where you sit on the Trigger and Drive map">'+
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

function rawHTML(r){
  return 'Your scores out of 28. Trigger '+r.ts+', Drive '+r.ds+', Manner '+r.ms+', Reactiveness '+r.xs+'.';
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
    card("Where you sit","Trigger and Drive place your dot. The six labels are the anchor points those two axes produce.",
      mapSVG(r)+'<div class="sliders">'+slidersHTML(r)+'</div>')+
    card("Your blend","Nobody is one style. This is how close your dot sits to each of the six, listed in the same order as the map. They're match scores, so they don't add to 100.",
      '<div class="blend">'+barsHTML(r)+'</div><div class="raw">'+rawHTML(r)+'</div>')+
  '</div>'+
  card("Who to hire","A match works whether you're hiring them or working for them. Your style and its two matches are lit on the grid.",
    '<div class="hire">'+gridSVG(r,pre)+'<div>'+hireHTML(r)+'</div></div>',gap);
  return out;
}

/* ---------- Print sheet, result page only ---------- */
/* The print sheet is the result page itself, one A4 page: the same hero and the same
   cards, built by the same functions and sized for paper by the print rules. */
function printHTML(r){
  return '<section class="psheet">'+
    '<div class="pbrand"><div class="pk">Headliner Leadership Styles Test</div><div class="pmark">Headliner<small>Group</small></div></div>'+
    '<div class="band--dark beam-band result phero">'+heroHTML(r,"Your leadership style is")+'</div>'+
    '<div class="pcards band--paper2">'+cardsHTML(r,"p")+'</div>'+
    '<div class="pfoot">headlinergroup.com.au</div>'+
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
  document.querySelectorAll("[data-print]").forEach(function(b){
    b.addEventListener("click",function(){
      var dark=b.getAttribute("data-print")==="dark";
      document.documentElement.classList.toggle("pdark",dark);
      setTimeout(function(){window.print();setTimeout(function(){document.documentElement.classList.remove("pdark");},400);},60);
    });
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
