var left_side_width=220;
$(function(){function e(){var e=$(window).height()-$("body > .header").height()-($("body > .footer").outerHeight()||0);$(".wrapper").css("min-height",e+"px");var d=$(".wrapper").height();d>e?$(".left-side, html, body").css("min-height",d+"px"):$(".left-side, html, body").css("min-height",e+"px")}$("[data-toggle='offcanvas']").click(function(e){e.preventDefault();992>=$(window).width()?($(".row-offcanvas").toggleClass("active"),$(".left-side").removeClass("collapse-left"),$(".right-side").removeClass("strech"),$(".row-offcanvas").toggleClass("relative")):
($(".left-side").toggleClass("collapse-left"),$(".right-side").toggleClass("strech"))});$(".btn").bind("touchstart",function(){$(this).addClass("hover")}).bind("touchend",function(){$(this).removeClass("hover")});$("[data-toggle='tooltip']").tooltip();$("[data-widget='collapse']").click(function(){var e=$(this).parents(".box").first(),d=e.find(".box-body, .box-footer");e.hasClass("collapsed-box")?(e.removeClass("collapsed-box"),$(this).children(".fa-plus").removeClass("fa-plus").addClass("fa-minus"),
d.slideDown()):(e.addClass("collapsed-box"),$(this).children(".fa-minus").removeClass("fa-minus").addClass("fa-plus"),d.slideUp())});$(".navbar .menu").slimscroll({height:"200px",alwaysVisible:!1,size:"3px"}).css("width","100%");$('.btn-group[data-toggle="btn-toggle"]').each(function(){var e=$(this);$(this).find(".btn").click(function(d){e.find(".btn.active").removeClass("active");$(this).addClass("active");d.preventDefault()})});$("[data-widget='remove']").click(function(){$(this).parents(".box").first().slideUp()});
e();$(".wrapper").resize(function(){e();fix_sidebar()});fix_sidebar()});function fix_sidebar(){$("body").hasClass("fixed")&&$(".sidebar").slimscroll({height:$(window).height()-$(".header").height()+"px",color:"rgba(0,0,0,0.2)"})}
$(window).load(function(){(function(){var e,k,d,h,n,r,z,q,u,E,C,I,F,J,s,y,G,H,v,f,A,g,B,w,c,D,S,K,M,O,x,L,T,P,Q,U,R,W,V,X,N=[].slice,Y={}.hasOwnProperty,Z=function(a,b){function m(){this.constructor=a}for(var l in b)Y.call(b,l)&&(a[l]=b[l]);return m.prototype=b.prototype,a.prototype=new m,a.__super__=b.prototype,a},aa=[].indexOf||function(a){for(var b=0,m=this.length;m>b;b++)if(b in this&&this[b]===a)return b;return-1};d={catchupTime:500,initialRate:.03,minTime:500,ghostTime:500,maxProgressPerFrame:10,
easeFactor:1.25,startOnPageLoad:!0,restartOnPushState:!0,restartOnRequestAfter:500,target:"body",elements:{checkInterval:100,selectors:["body"]},eventLag:{minSamples:10,sampleCount:3,lagThreshold:3},ajax:{trackMethods:["GET"],trackWebSockets:!1}};w=function(){var a;return null!=(a="undefined"!=typeof performance&&null!==performance?"function"==typeof performance.now?performance.now():void 0:void 0)?a:+new Date};D=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||
window.msRequestAnimationFrame;G=window.cancelAnimationFrame||window.mozCancelAnimationFrame;null==D&&(D=function(a){return setTimeout(a,50)},G=function(a){return clearTimeout(a)});K=function(a){var b,m;return b=w(),(m=function(){var l;return l=w()-b,33<=l?(b=w(),a(l,function(){return D(m)})):setTimeout(m,33-l)})()};S=function(){var a,b,m;return m=arguments[0],b=arguments[1],a=3<=arguments.length?N.call(arguments,2):[],"function"==typeof m[b]?m[b].apply(m,a):m[b]};H=function(){var a,b,m,l,p,c,d;b=
arguments[0];l=2<=arguments.length?N.call(arguments,1):[];c=0;for(d=l.length;d>c;c++)if(m=l[c])for(a in m)Y.call(m,a)&&(p=m[a],null!=b[a]&&"object"==typeof b[a]&&null!=p&&"object"==typeof p?H(b[a],p):b[a]=p);return b};J=function(a){var b,m,l,p,c;p=m=b=0;for(c=a.length;c>p;p++)l=a[p],m+=Math.abs(l),b++;return m/b};h=function(){function a(){}return a.prototype.on=function(b,a,l,p){var c;return null==p&&(p=!1),null==this.bindings&&(this.bindings={}),null==(c=this.bindings)[b]&&(c[b]=[]),this.bindings[b].push({handler:a,
ctx:l,once:p})},a.prototype.once=function(b,a,l){return this.on(b,a,l,!0)},a.prototype.off=function(b,a){var l,c;if(null!=(null!=(l=this.bindings)?l[b]:void 0)){if(null==a)return delete this.bindings[b];l=0;for(c=[];l<this.bindings[b].length;)this.bindings[b][l].handler===a?c.push(this.bindings[b].splice(l,1)):c.push(l++);return c}},a.prototype.trigger=function(){var b,a,l,c,d,e,f;if(l=arguments[0],b=2<=arguments.length?N.call(arguments,1):[],null!=(a=this.bindings)?a[l]:void 0){d=0;for(f=[];d<this.bindings[l].length;)e=
this.bindings[l][d],c=e.handler,a=e.ctx,e=e.once,c.apply(null!=a?a:this,b),e?f.push(this.bindings[l].splice(d,1)):f.push(d++);return f}},a}();null==window.Pace&&(window.Pace={});H(Pace,h.prototype);c=Pace.options=H({},d,window.paceOptions,function(a,b){var m;if(null==a&&(a="options"),null==b&&(b=!0),m=document.querySelector("[data-pace-"+a+"]")){if(m=m.getAttribute("data-pace-"+a),!b)return m;try{return JSON.parse(m)}catch(c){return"undefined"!=typeof console&&null!==console?console.error("Error parsing inline pace options",
c):void 0}}}());V=["ajax","document","eventLag","elements"];h=0;for(r=V.length;r>h;h++)x=V[h],!0===c[x]&&(c[x]=d[x]);z=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return Z(b,a),b}(Error);k=function(){function a(){this.progress=0}return a.prototype.getElement=function(){var b;if(null==this.el){if(b=document.querySelector(c.target),!b)throw new z;this.el=document.createElement("div");this.el.className="pace pace-active";document.body.className=document.body.className.replace("pace-done",
"");document.body.className+=" pace-running";this.el.innerHTML='<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';null!=b.firstChild?b.insertBefore(this.el,b.firstChild):b.appendChild(this.el)}return this.el},a.prototype.finish=function(){var b;return b=this.getElement(),b.className=b.className.replace("pace-active",""),b.className+=" pace-inactive",document.body.className=document.body.className.replace("pace-running",""),document.body.className+=
" pace-done"},a.prototype.update=function(b){return this.progress=b,this.render()},a.prototype.destroy=function(){try{this.getElement().parentNode.removeChild(this.getElement())}catch(b){z=b}return this.el=void 0},a.prototype.render=function(){var b,a;return null==document.querySelector(c.target)?!1:(b=this.getElement(),b.children[0].style.width=""+this.progress+"%",(!this.lastRenderedProgress||this.lastRenderedProgress|0!==this.progress|0)&&(b.children[0].setAttribute("data-progress-text",""+(0|
this.progress)+"%"),100<=this.progress?a="99":(a=10>this.progress?"0":"",a+=0|this.progress),b.children[0].setAttribute("data-progress",""+a)),this.lastRenderedProgress=this.progress)},a.prototype.done=function(){return 100<=this.progress},a}();d=function(){function a(){this.bindings={}}return a.prototype.trigger=function(b,a){var c,d,e,f,g;if(null!=this.bindings[b]){f=this.bindings[b];g=[];d=0;for(e=f.length;e>d;d++)c=f[d],g.push(c.call(this,a));return g}},a.prototype.on=function(b,a){var c;return null==
(c=this.bindings)[b]&&(c[b]=[]),this.bindings[b].push(a)},a}();U=window.XMLHttpRequest;Q=window.XDomainRequest;P=window.WebSocket;v=function(a,b){var c,d,p;p=[];for(c in b.prototype)try{d=b.prototype[c],null==a[c]&&"function"!=typeof d?p.push(a[c]=d):p.push(void 0)}catch(e){}return p};g=[];Pace.ignore=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?N.call(arguments,1):[],g.unshift("ignore"),c=b.apply(null,a),g.shift(),c};Pace.track=function(){var a,b,c;return b=arguments[0],a=2<=
arguments.length?N.call(arguments,1):[],g.unshift("track"),c=b.apply(null,a),g.shift(),c};O=function(a){var b;return(null==a&&(a="GET"),"track"===g[0])?"force":!g.length&&c.ajax&&("socket"===a&&c.ajax.trackWebSockets||(b=a.toUpperCase(),0<=aa.call(c.ajax.trackMethods,b)))?!0:!1};q=function(a){function b(){var a,d=this;b.__super__.constructor.apply(this,arguments);a=function(a){var b;return b=a.open,a.open=function(c,m){return O(c)&&d.trigger("request",{type:c,url:m,request:a}),b.apply(a,arguments)}};
window.XMLHttpRequest=function(b){var c;return c=new U(b),a(c),c};v(window.XMLHttpRequest,U);null!=Q&&(window.XDomainRequest=function(){var b;return b=new Q,a(b),b},v(window.XDomainRequest,Q));null!=P&&c.ajax.trackWebSockets&&(window.WebSocket=function(b,a){var c;return c=new P(b,a),O("socket")&&d.trigger("request",{type:"socket",url:b,protocols:a,request:c}),c},v(window.WebSocket,P))}return Z(b,a),b}(d);R=null;f=function(){return null==R&&(R=new q),R};f().on("request",function(a){var b,d,l,p;return p=
a.type,l=a.request,Pace.running||!1===c.restartOnRequestAfter&&"force"!==O(p)?void 0:(d=arguments,b=c.restartOnRequestAfter||0,"boolean"==typeof b&&(b=0),setTimeout(function(){var b,a,c,f;if("socket"===p?2>l.readyState:0<(b=l.readyState)&&4>b){Pace.restart();c=Pace.sources;f=[];b=0;for(a=c.length;a>b;b++){if(x=c[b],x instanceof e){x.watch.apply(x,d);break}f.push(void 0)}return f}},b))});e=function(){function a(){var b=this;this.elements=[];f().on("request",function(){return b.watch.apply(b,arguments)})}
return a.prototype.watch=function(b){var a,c,d;return d=b.type,a=b.request,c="socket"===d?new C(a):new I(a),this.elements.push(c)},a}();I=function(){return function(a){var b,c,d,e,f,g=this;if(this.progress=0,null!=window.ProgressEvent)for(a.addEventListener("progress",function(b){return g.progress=b.lengthComputable?100*b.loaded/b.total:g.progress+(100-g.progress)/2}),f=["load","abort","timeout","error"],c=0,d=f.length;d>c;c++)b=f[c],a.addEventListener(b,function(){return g.progress=100});else e=
a.onreadystatechange,a.onreadystatechange=function(){var b;return 0===(b=a.readyState)||4===b?g.progress=100:3===a.readyState&&(g.progress=50),"function"==typeof e?e.apply(null,arguments):void 0}}}();C=function(){return function(a){var b,c,d,e,f=this;this.progress=0;e=["error","open"];c=0;for(d=e.length;d>c;c++)b=e[c],a.addEventListener(b,function(){return f.progress=100})}}();h=function(){return function(a){var b,c,d;null==a&&(a={});this.elements=[];null==a.selectors&&(a.selectors=[]);d=a.selectors;
b=0;for(c=d.length;c>b;b++)a=d[b],this.elements.push(new n(a))}}();n=function(){function a(b){this.selector=b;this.progress=0;this.check()}return a.prototype.check=function(){var b=this;return document.querySelector(this.selector)?this.done():setTimeout(function(){return b.check()},c.elements.checkInterval)},a.prototype.done=function(){return this.progress=100},a}();d=function(){function a(){var b,a,c=this;this.progress=null!=(a=this.states[document.readyState])?a:100;b=document.onreadystatechange;
document.onreadystatechange=function(){return null!=c.states[document.readyState]&&(c.progress=c.states[document.readyState]),"function"==typeof b?b.apply(null,arguments):void 0}}return a.prototype.states={loading:0,interactive:50,complete:100},a}();r=function(){return function(){var a,b,d,e,f,g=this;a=this.progress=0;f=[];e=0;d=w();b=setInterval(function(){var q;return q=w()-d-50,d=w(),f.push(q),f.length>c.eventLag.sampleCount&&f.shift(),a=J(f),++e>=c.eventLag.minSamples&&a<c.eventLag.lagThreshold?
(g.progress=100,clearInterval(b)):g.progress=3/(a+3)*100},50)}}();E=function(){function a(b){this.source=b;this.last=this.sinceLastUpdate=0;this.rate=c.initialRate;this.progress=this.lastProgress=this.catchup=0;null!=this.source&&(this.progress=S(this.source,"progress"))}return a.prototype.tick=function(b,a){var d;return null==a&&(a=S(this.source,"progress")),100<=a&&(this.done=!0),a===this.last?this.sinceLastUpdate+=b:(this.sinceLastUpdate&&(this.rate=(a-this.last)/this.sinceLastUpdate),this.catchup=
(a-this.progress)/c.catchupTime,this.sinceLastUpdate=0,this.last=a),a>this.progress&&(this.progress+=this.catchup*b),d=1-Math.pow(this.progress/100,c.easeFactor),this.progress+=d*this.rate*b,this.progress=Math.min(this.lastProgress+c.maxProgressPerFrame,this.progress),this.progress=Math.max(0,this.progress),this.progress=Math.min(100,this.progress),this.lastProgress=this.progress,this.progress},a}();y=F=T=s=M=L=null;Pace.running=!1;A=function(){return c.restartOnPushState?Pace.restart():void 0};null!=
window.history.pushState&&(W=window.history.pushState,window.history.pushState=function(){return A(),W.apply(window.history,arguments)});null!=window.history.replaceState&&(X=window.history.replaceState,window.history.replaceState=function(){return A(),X.apply(window.history,arguments)});u={ajax:e,elements:h,document:d,eventLag:r};(B=function(){var a,b,d,e,f;Pace.sources=L=[];f=["ajax","elements","document","eventLag"];b=0;for(e=f.length;e>b;b++)a=f[b],!1!==c[a]&&L.push(new u[a](c[a]));a=null!=(d=
c.extraSources)?d:[];d=0;for(b=a.length;b>d;d++)x=a[d],L.push(new x(c));return Pace.bar=s=new k,M=[],T=new E})();Pace.stop=function(){return Pace.trigger("stop"),Pace.running=!1,s.destroy(),y=!0,null!=F&&("function"==typeof G&&G(F),F=null),B()};Pace.restart=function(){return Pace.trigger("restart"),Pace.stop(),Pace.start()};Pace.go=function(){return Pace.running=!0,s.render(),y=!1,F=K(function(a,b){var d,e,f,g,q,k,n,h,D,K,u,r,C,v;e=D=0;f=!0;q=K=0;for(r=L.length;r>K;q=++K)for(x=L[q],n=null!=M[q]?M[q]:
M[q]=[],q=null!=(v=x.elements)?v:[x],k=u=0,C=q.length;C>u;k=++u)g=q[k],g=null!=n[k]?n[k]:n[k]=new E(g),f&=g.done,g.done||(e++,D+=g.tick(a));return d=D/e,s.update(T.tick(a,d)),h=w(),s.done()||f||y?(s.update(100),Pace.trigger("done"),setTimeout(function(){return s.finish(),Pace.running=!1,Pace.trigger("hide")},Math.max(c.ghostTime,Math.min(c.minTime,w()-h)))):b()})};Pace.start=function(a){H(c,a);Pace.running=!0;try{s.render()}catch(b){z=b}return document.querySelector(".pace")?(Pace.trigger("start"),
Pace.go()):setTimeout(Pace.start,50)};"function"==typeof define&&define.amd?define("theme-app",[],function(){return Pace}):"object"==typeof exports?module.exports=Pace:c.startOnPageLoad&&Pace.start()}).call(this)});(function(e){jQuery.fn.center=function(k){k=k?this.parent():window;this.css({position:"absolute",top:(e(k).height()-this.outerHeight())/2+e(k).scrollTop()+"px",left:(e(k).width()-this.outerWidth())/2+e(k).scrollLeft()+"px"});return this}})(jQuery);
(function(e,k,d){function h(){z=k.setTimeout(function(){n.each(function(){var d=e(this),k=d.width(),n=d.height(),h=e.data(this,"resize-special-event");k===h.w&&n===h.h||d.trigger("resize",[h.w=k,h.h=n])});h()},r.delay)}var n=e([]),r=e.resize=e.extend(e.resize,{}),z;r.delay=250;r.throttleWindow=!0;e.event.special.resize={setup:function(){if(!r.throttleWindow&&this.setTimeout)return!1;var d=e(this);n=n.add(d);e.data(this,"resize-special-event",{w:d.width(),h:d.height()});1===n.length&&h()},teardown:function(){if(!r.throttleWindow&&
this.setTimeout)return!1;var d=e(this);n=n.not(d);d.removeData("resize-special-event");n.length||clearTimeout(z)},add:function(k){function n(k,q,r){var u=e(this),s=e.data(this,"resize-special-event");s.w=q!==d?q:u.width();s.h=r!==d?r:u.height();h.apply(this,arguments)}if(!r.throttleWindow&&this.setTimeout)return!1;var h;if(e.isFunction(k))return h=k,n;h=k.handler;k.handler=n}}})(jQuery,this);
(function(e){jQuery.fn.extend({slimScroll:function(k){var d=e.extend({width:"auto",height:"250px",size:"7px",color:"#000",position:"right",distance:"1px",start:"top",opacity:.4,alwaysVisible:!1,disableFadeOut:!1,railVisible:!1,railColor:"#333",railOpacity:.2,railDraggable:!0,railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:!1,wheelStep:20,touchScrollStep:200,borderRadius:"0px",railBorderRadius:"0px"},k);this.each(function(){function h(c){if(E){c=c||
window.event;var g=0;c.wheelDelta&&(g=-c.wheelDelta/120);c.detail&&(g=c.detail/3);e(c.target||c.srcTarget||c.srcElement).closest("."+d.wrapperClass).is(f.parent())&&n(g,!0);c.preventDefault&&!v&&c.preventDefault();v||(c.returnValue=!1)}}function n(c,e,k){v=!1;var h=c,n=f.outerHeight()-g.outerHeight();e&&(h=parseInt(g.css("top"))+c*parseInt(d.wheelStep)/100*g.outerHeight(),h=Math.min(Math.max(h,0),n),h=0<c?Math.ceil(h):Math.floor(h),g.css({top:h+"px"}));y=parseInt(g.css("top"))/(f.outerHeight()-g.outerHeight());
h=y*(f[0].scrollHeight-f.outerHeight());k&&(h=c,c=h/f[0].scrollHeight*f.outerHeight(),c=Math.min(Math.max(c,0),n),g.css({top:c+"px"}));f.scrollTop(h);f.trigger("slimscrolling",~~h);q();u()}function r(){window.addEventListener?(this.addEventListener("DOMMouseScroll",h,!1),this.addEventListener("mousewheel",h,!1),this.addEventListener("MozMousePixelScroll",h,!1)):document.attachEvent("onmousewheel",h)}function z(){s=Math.max(f.outerHeight()/f[0].scrollHeight*f.outerHeight(),H);g.css({height:s+"px"});
var c=s==f.outerHeight()?"none":"block";g.css({display:c})}function q(){z();clearTimeout(F);y==~~y?(v=d.allowPageScroll,G!=y&&f.trigger("slimscroll",0==~~y?"top":"bottom")):v=!1;G=y;s>=f.outerHeight()?v=!0:(g.stop(!0,!0).fadeIn("fast"),d.railVisible&&B.stop(!0,!0).fadeIn("fast"))}function u(){d.alwaysVisible||(F=setTimeout(function(){d.disableFadeOut&&E||C||I||(g.fadeOut("slow"),B.fadeOut("slow"))},1E3))}var E,C,I,F,J,s,y,G,H=30,v=!1,f=e(this);if(f.parent().hasClass(d.wrapperClass)){var A=f.scrollTop(),
g=f.parent().find("."+d.barClass),B=f.parent().find("."+d.railClass);z();if(e.isPlainObject(k)){if("height"in k&&"auto"==k.height){f.parent().css("height","auto");f.css("height","auto");var w=f.parent().parent().height();f.parent().css("height",w);f.css("height",w)}if("scrollTo"in k)A=parseInt(d.scrollTo);else if("scrollBy"in k)A+=parseInt(d.scrollBy);else if("destroy"in k){g.remove();B.remove();f.unwrap();return}n(A,!1,!0)}}else d.height="auto"==d.height?f.parent().height():d.height,A=e("<div></div>").addClass(d.wrapperClass).css({position:"relative",
overflow:"hidden",width:d.width,height:d.height}),f.css({overflow:"hidden",width:d.width,height:d.height}),B=e("<div></div>").addClass(d.railClass).css({width:d.size,height:"100%",position:"absolute",top:0,display:d.alwaysVisible&&d.railVisible?"block":"none","border-radius":d.railBorderRadius,background:d.railColor,opacity:d.railOpacity,zIndex:90}),g=e("<div></div>").addClass(d.barClass).css({background:d.color,width:d.size,position:"absolute",top:0,opacity:d.opacity,display:d.alwaysVisible?"block":
"none","border-radius":d.borderRadius,BorderRadius:d.borderRadius,MozBorderRadius:d.borderRadius,WebkitBorderRadius:d.borderRadius,zIndex:99}),w="right"==d.position?{right:d.distance}:{left:d.distance},B.css(w),g.css(w),f.wrap(A),f.parent().append(g),f.parent().append(B),d.railDraggable&&g.bind("mousedown",function(c){var d=e(document);I=!0;t=parseFloat(g.css("top"));pageY=c.pageY;d.bind("mousemove.slimscroll",function(c){currTop=t+c.pageY-pageY;g.css("top",currTop);n(0,g.position().top,!1)});d.bind("mouseup.slimscroll",
function(c){I=!1;u();d.unbind(".slimscroll")});return!1}).bind("selectstart.slimscroll",function(c){c.stopPropagation();c.preventDefault();return!1}),B.hover(function(){q()},function(){u()}),g.hover(function(){C=!0},function(){C=!1}),f.hover(function(){E=!0;q();u()},function(){E=!1;u()}),f.bind("touchstart",function(c,d){c.originalEvent.touches.length&&(J=c.originalEvent.touches[0].pageY)}),f.bind("touchmove",function(c){v||c.originalEvent.preventDefault();c.originalEvent.touches.length&&(n((J-c.originalEvent.touches[0].pageY)/
d.touchScrollStep,!0),J=c.originalEvent.touches[0].pageY)}),z(),"bottom"===d.start?(g.css({top:f.outerHeight()-g.outerHeight()}),n(0,!0)):"top"!==d.start&&(n(e(d.start).position().top,null,!0),d.alwaysVisible||g.hide()),r()});return this}});jQuery.fn.extend({slimscroll:jQuery.fn.slimScroll})})(jQuery);