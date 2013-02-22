angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.carousel","ui.bootstrap.collapse","ui.bootstrap.dialog","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.popover","ui.bootstrap.tabs","ui.bootstrap.tooltip","ui.bootstrap.transition"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/dialog/message.html","template/pagination/pagination.html","template/popover/popover.html","template/tabs/pane.html","template/tabs/tabs.html","template/tooltip/tooltip-popup.html"]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(e,t,n){this.groups=[],this.closeOthers=function(r){var i=angular.isDefined(t.closeOthers)?e.$eval(t.closeOthers):n.closeOthers;i&&angular.forEach(this.groups,function(e){e!==r&&(e.isOpen=!1)})},this.addGroup=function(e){var t=this;this.groups.push(e),e.$on("$destroy",function(n){t.removeGroup(e)})},this.removeGroup=function(e){var t=this.groups.indexOf(e);t!==-1&&this.groups.splice(this.groups.indexOf(e),1)}}]),angular.module("ui.bootstrap.accordion").directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}),angular.module("ui.bootstrap.accordion").directive("accordionGroup",["$parse","$transition","$timeout",function(e,t,n){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@"},link:function(t,n,r,i){var s,o;i.addGroup(t),t.isOpen=!1,r.isOpen&&(s=e(r.isOpen),o=s.assign,t.$watch(function(){return s(t.$parent)},function(n){t.isOpen=n}),t.isOpen=s?s(t.$parent):!1),t.$watch("isOpen",function(e){e&&i.closeOthers(t),o&&o(t.$parent,e)})}}}]),angular.module("ui.bootstrap.alert",[]).directive("alert",function(){return{restrict:"EA",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"}}}),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition","$q",function(e,t,n,r){function f(){function n(){a?(e.next(),f()):e.pause()}u&&t.cancel(u);var r=+e.interval;!isNaN(r)&&r>=0&&(u=t(n,r))}var i=this,s=i.slides=[],o=-1,u,a;i.currentSlide=null,i.select=function(r,u){function l(){i.currentSlide&&angular.isString(u)&&!e.noTransition&&r.$element?(r.$element.addClass(u),r.$element[0].offsetWidth=r.$element[0].offsetWidth,angular.forEach(s,function(e){angular.extend(e,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(r,{direction:u,active:!0,entering:!0}),angular.extend(i.currentSlide||{},{direction:u,leaving:!0}),e.$currentTransition=n(r.$element,{}),function(t,n){e.$currentTransition.then(function(){c(t,n)},function(){c(t,n)})}(r,i.currentSlide)):c(r,i.currentSlide),i.currentSlide=r,o=a,f()}function c(t,n){angular.extend(t,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(n||{},{direction:"",active:!1,leaving:!1,entering:!1}),e.$currentTransition=null}var a=s.indexOf(r);u===undefined&&(u=a>o?"next":"prev"),r&&r!==i.currentSlide&&(e.$currentTransition?(e.$currentTransition.cancel(),t(l)):l())},i.indexOfSlide=function(e){return s.indexOf(e)},e.next=function(){var e=(o+1)%s.length;return i.select(s[e],"next")},e.prev=function(){var e=o-1<0?s.length-1:o-1;return i.select(s[e],"prev")},e.$watch("interval",f),e.play=function(){a||(a=!0,f())},e.pause=function(){a=!1,u&&t.cancel(u)},i.addSlide=function(t,n){t.$element=n,s.push(t),s.length===1||t.active?(i.select(s[s.length-1]),s.length==1&&e.play()):t.active=!1},i.removeSlide=function(e){var t=s.indexOf(e);s.splice(t,1),s.length>0&&e.active&&(t>=s.length?i.select(s[t-1]):i.select(s[t]))}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"="}}}]).directive("slide",[function(){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{active:"="},link:function(e,t,n,r){r.addSlide(e,t),e.$on("$destroy",function(){r.removeSlide(e)}),e.$watch("active",function(t){t&&r.select(e)})}}}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(e){var t=function(e,t,n){t.removeClass("collapse"),t.css({height:n});var r=t[0].offsetWidth;t.addClass("collapse")};return{link:function(n,r,i){var s,o=!0;n.$watch(function(){return r[0].scrollHeight},function(e){r[0].scrollHeight!==0&&(s||t(n,r,r[0].scrollHeight+"px"))}),n.$watch(i.collapse,function(e){e?l():f()});var u,a=function(t){return u&&u.cancel(),u=e(r,t),u.then(function(){u=undefined},function(){u=undefined}),u},f=function(){o?(o=!1,s||t(n,r,"auto")):a({height:r[0].scrollHeight+"px"}).then(function(){s||t(n,r,"auto")}),s=!1},l=function(){s=!0,o?(o=!1,t(n,r,0)):(t(n,r,r[0].scrollHeight+"px"),a({height:"0"}))}}}}]);var dialogModule=angular.module("ui.bootstrap.dialog",["ui.bootstrap.transition"]);dialogModule.controller("MessageBoxController",["$scope","dialog","model",function(e,t,n){e.title=n.title,e.message=n.message,e.buttons=n.buttons,e.close=function(e){t.close(e)}}]),dialogModule.provider("$dialog",function(){var e={backdrop:!0,modalClass:"modal",backdropClass:"modal-backdrop",transitionClass:"fade",triggerClass:"in",resolve:{},backdropFade:!1,modalFade:!1,keyboard:!0,backdropClick:!0},t={};this.options=function(e){t=e},this.$get=["$http","$document","$compile","$rootScope","$controller","$templateCache","$q","$transition",function(n,r,i,s,o,u,a,f){function c(e){var t=angular.element("<div>");return t.addClass(e),t}function h(n){var r=this,i=this.options=angular.extend({},e,t,n);this.backdropEl=c(i.backdropClass),i.backdropFade&&(this.backdropEl.addClass(i.transitionClass),this.backdropEl.removeClass(i.triggerClass)),this.modalEl=c(i.modalClass),i.modalFade&&(this.modalEl.addClass(i.transitionClass),this.modalEl.removeClass(i.triggerClass)),this.handledEscapeKey=function(e){e.which===27&&(r.close(),e.preventDefault(),r.$scope.$apply())},this.handleBackDropClick=function(e){r.close(),e.preventDefault(),r.$scope.$apply()}}var l=r.find("body");return h.prototype.isOpen=function(){return this._open},h.prototype.open=function(e,t){var n=this,r=this.options;e&&(r.templateUrl=e),t&&(r.controller=t);if(!r.template&&!r.templateUrl)throw new Error("Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.");return this._loadResolves().then(function(e){var t=e.$scope=n.$scope=s.$new();n.modalEl.html(e.$template);if(n.options.controller){var r=o(n.options.controller,e);n.modalEl.contents().data("ngControllerController",r)}i(n.modalEl.contents())(t),n._addElementsToDom(),setTimeout(function(){n.options.modalFade&&n.modalEl.addClass(n.options.triggerClass),n.options.backdropFade&&n.backdropEl.addClass(n.options.triggerClass)}),n._bindEvents()}),this.deferred=a.defer(),this.deferred.promise},h.prototype.close=function(e){function i(e){e.removeClass(t.options.triggerClass)}function s(){t._open&&t._onCloseComplete(e)}var t=this,n=this._getFadingElements();if(n.length>0){for(var r=n.length-1;r>=0;r--)f(n[r],i).then(s);return}this._onCloseComplete(e)},h.prototype._getFadingElements=function(){var e=[];return this.options.modalFade&&e.push(this.modalEl),this.options.backdropFade&&e.push(this.backdropEl),e},h.prototype._bindEvents=function(){this.options.keyboard&&l.bind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.bind("click",this.handleBackDropClick)},h.prototype._unbindEvents=function(){this.options.keyboard&&l.unbind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.unbind("click",this.handleBackDropClick)},h.prototype._onCloseComplete=function(e){this._removeElementsFromDom(),this._unbindEvents(),this.deferred.resolve(e)},h.prototype._addElementsToDom=function(){l.append(this.modalEl),this.options.backdrop&&l.append(this.backdropEl),this._open=!0},h.prototype._removeElementsFromDom=function(){this.modalEl.remove(),this.options.backdrop&&this.backdropEl.remove(),this._open=!1},h.prototype._loadResolves=function(){var e=[],t=[],r,i=this;return this.options.template?r=a.when(this.options.template):this.options.templateUrl&&(r=n.get(this.options.templateUrl,{cache:u}).then(function(e){return e.data})),angular.forEach(this.options.resolve||[],function(n,r){t.push(r),e.push(n)}),t.push("$template"),e.push(r),a.all(e).then(function(e){var n={};return angular.forEach(e,function(e,r){n[t[r]]=e}),n.dialog=i,n})},{dialog:function(e){return new h(e)},messageBox:function(e,t,n){return new h({templateUrl:"template/dialog/message.html",controller:"MessageBoxController",resolve:{model:{title:e,message:t,buttons:n}}})}}}]}),angular.module("ui.bootstrap.dropdownToggle",[]).directive("dropdownToggle",["$document","$location","$window",function(e,t,n){var r=null,i;return{restrict:"CA",link:function(n,s,o){n.$watch(function(){return t.path()},function(){i&&i()}),s.parent().bind("click",function(e){i&&i()}),s.bind("click",function(t){t.preventDefault(),t.stopPropagation();var n=!1;r&&(n=r===s,i()),n||(s.parent().addClass("open"),r=s,i=function(t){t&&(t.preventDefault(),t.stopPropagation()),e.unbind("click",i),s.parent().removeClass("open"),i=null,r=null},e.bind("click",i))})}}}]),angular.module("ui.bootstrap.modal",[]).directive("modal",["$parse",function(e){var t,n=angular.element(document.getElementsByTagName("body")[0]),r={backdrop:!0,escape:!0};return{restrict:"EA",link:function(i,s,o){function l(e){i.$apply(function(){model.assign(i,e)})}function c(e){e.which===27&&f()}function h(){f()}function p(){u.escape&&n.unbind("keyup",c),u.backdrop&&(t.css("display","none").removeClass("in"),t.unbind("click",h)),s.css("display","none").removeClass("in"),n.removeClass("modal-open")}function d(){u.escape&&n.bind("keyup",c),u.backdrop&&(t.css("display","block").addClass("in"),u.backdrop!="static"&&t.bind("click",h)),s.css("display","block").addClass("in"),n.addClass("modal-open")}var u=angular.extend(r,i.$eval(o.uiOptions||o.bsOptions||o.options)),a=o.modal||o.show,f;o.close?f=function(){i.$apply(o.close)}:f=function(){i.$apply(function(){e(a).assign(i,!1)})},s.addClass("modal"),u.backdrop&&!t&&(t=angular.element('<div class="modal-backdrop"></div>'),t.css("display","none"),n.append(t)),i.$watch(a,function(e,t){e?d():p()})}}}]),angular.module("ui.bootstrap.pagination",[]).directive("pagination",function(){return{restrict:"EA",scope:{numPages:"=",currentPage:"=",maxSize:"=",onSelectPage:"&",nextText:"@",previousText:"@"},templateUrl:"template/pagination/pagination.html",replace:!0,link:function(e){e.$watch("numPages + currentPage + maxSize",function(){e.pages=[];var t=e.maxSize&&e.maxSize<e.numPages?e.maxSize:e.numPages,n=e.currentPage-Math.floor(t/2);n<1&&(n=1),n+t-1>e.numPages&&(n-=n+t-1-e.numPages);for(var r=0;r<t&&r<e.numPages;r++)e.pages.push(n+r);e.currentPage>e.numPages&&e.selectPage(e.numPages)}),e.noPrevious=function(){return e.currentPage===1},e.noNext=function(){return e.currentPage===e.numPages},e.isActive=function(t){return e.currentPage===t},e.selectPage=function(t){e.isActive(t)||(e.currentPage=t,e.onSelectPage({page:t}))},e.selectPrevious=function(){e.noPrevious()||e.selectPage(e.currentPage-1)},e.selectNext=function(){e.noNext()||e.selectPage(e.currentPage+1)}}}}),angular.module("ui.bootstrap.popover",[]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{popoverTitle:"@",popoverContent:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$compile","$timeout","$parse",function(e,t,n){var r='<popover-popup popover-title="{{tt_title}}" popover-content="{{tt_popover}}" placement="{{tt_placement}}" animation="tt_animation()" is-open="tt_isOpen"></popover-popup>';return{scope:!0,link:function(i,s,o){function f(){return{width:s.prop("offsetWidth"),height:s.prop("offsetHeight"),top:s.prop("offsetTop"),left:s.prop("offsetLeft")}}function l(){var e,n,r,o;a&&t.cancel(a),u.css({top:0,left:0,display:"block"}),s.after(u),e=f(),n=u.prop("offsetWidth"),r=u.prop("offsetHeight");switch(i.tt_placement){case"right":o={top:e.top+e.height/2-r/2+"px",left:e.left+e.width+"px"};break;case"bottom":o={top:e.top+e.height+"px",left:e.left+e.width/2-n/2+"px"};break;case"left":o={top:e.top+e.height/2-r/2+"px",left:e.left-n+"px"};break;default:o={top:e.top-r+"px",left:e.left+e.width/2-n/2+"px"}}u.css(o),i.tt_isOpen=!0}function c(){i.tt_isOpen=!1,angular.isDefined(i.tt_animation)&&i.tt_animation()?a=t(function(){u.remove()},500):u.remove()}var u=e(r)(i),a;o.$observe("popover",function(e){i.tt_popover=e}),o.$observe("popoverTitle",function(e){i.tt_title=e}),o.$observe("popoverPlacement",function(e){i.tt_placement=e||"top"}),o.$observe("popoverAnimation",function(e){i.tt_animation=n(e)}),i.tt_isOpen=!1,s.bind("click",function(){i.tt_isOpen?i.$apply(c):i.$apply(l)})}}}]),angular.module("ui.bootstrap.tabs",[]).controller("TabsController",["$scope","$element",function(e,t){var n=e.panes=[];this.select=e.select=function(t){angular.forEach(n,function(e){e.selected=!1}),t.selected=!0},this.addPane=function(r){n.length||e.select(r),n.push(r)},this.removePane=function(r){var i=n.indexOf(r);n.splice(i,1),r.selected&&n.length>0&&e.select(n[i<n.length?i:i-1])}}]).directive("tabs",function(){return{restrict:"EA",transclude:!0,scope:{},controller:"TabsController",templateUrl:"template/tabs/tabs.html",replace:!0}}).directive("pane",["$parse",function(e){return{require:"^tabs",restrict:"EA",transclude:!0,scope:{heading:"@"},link:function(t,n,r,i){var s,o;t.selected=!1,r.active&&(s=e(r.active),o=s.assign,t.$watch(function(){return s(t.$parent)},function(n){t.selected=n}),t.selected=s?s(t.$parent):!1),t.$watch("selected",function(e){e&&i.select(t),o&&o(t.$parent,e)}),i.addPane(t),t.$on("$destroy",function(){i.removePane(t)})},templateUrl:"template/tabs/pane.html",replace:!0}}]),angular.module("ui.bootstrap.tooltip",[]).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{tooltipTitle:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$compile","$timeout","$parse",function(e,t,n){var r='<tooltip-popup tooltip-title="{{tt_tooltip}}" placement="{{tt_placement}}" animation="tt_animation()" is-open="tt_isOpen"></tooltip-popup>';return{scope:!0,link:function(i,s,o){function f(){return{width:s.prop("offsetWidth"),height:s.prop("offsetHeight"),top:s.prop("offsetTop"),left:s.prop("offsetLeft")}}function l(){var e,n,r,o;a&&t.cancel(a),u.css({top:0,left:0,display:"block"}),s.after(u),e=f(),n=u.prop("offsetWidth"),r=u.prop("offsetHeight");switch(i.tt_placement){case"right":o={top:e.top+e.height/2-r/2+"px",left:e.left+e.width+"px"};break;case"bottom":o={top:e.top+e.height+"px",left:e.left+e.width/2-n/2+"px"};break;case"left":o={top:e.top+e.height/2-r/2+"px",left:e.left-n+"px"};break;default:o={top:e.top-r+"px",left:e.left+e.width/2-n/2+"px"}}u.css(o),i.tt_isOpen=!0}function c(){i.tt_isOpen=!1,angular.isDefined(i.tt_animation)&&i.tt_animation()?a=t(function(){u.remove()},500):u.remove()}var u=e(r)(i),a;o.$observe("tooltip",function(e){i.tt_tooltip=e}),o.$observe("tooltipPlacement",function(e){i.tt_placement=e||"top"}),o.$observe("tooltipAnimation",function(e){i.tt_animation=n(e)}),i.tt_isOpen=!1,s.bind("mouseenter",function(){i.$apply(l)}),s.bind("mouseleave",function(){i.$apply(c)})}}}]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(e,t,n){function u(e){for(var t in e)if(i.style[t]!==undefined)return e[t]}var r=function(i,s,o){o=o||{};var u=e.defer(),a=r[o.animation?"animationEndEventName":"transitionEndEventName"],f=function(e){n.$apply(function(){i.unbind(a,f),u.resolve(i)})};return a&&i.bind(a,f),t(function(){angular.isString(s)?i.addClass(s):angular.isFunction(s)?s(i):angular.isObject(s)&&i.css(s),a||u.resolve(i)}),u.promise.cancel=function(){a&&i.unbind(a,f),u.reject("Transition cancelled")},u.promise},i=document.createElement("trans"),s={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},o={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",msTransition:"MSAnimationEnd",transition:"animationend"};return r.transitionEndEventName=u(s),r.animationEndEventName=u(o),r}]),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion-group.html",'<div class="accordion-group">  <div class="accordion-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen">{{heading}}</a></div>  <div class="accordion-body" collapse="!isOpen">    <div class="accordion-inner" ng-transclude></div>  </div></div>')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion.html",'<div class="accordion" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(e){e.put("template/alert/alert.html","<div class='alert' ng-class='type && \"alert-\" + type'>    <button type='button' class='close' ng-click='close()'>&times;</button>    <div ng-transclude></div></div>")}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(e){e.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel">    <div class="carousel-inner" ng-transclude></div>    <a ng-click="prev()" class="carousel-control left">&lsaquo;</a>    <a ng-click="next()" class="carousel-control right">&rsaquo;</a></div>')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(e){e.put("template/carousel/slide.html","<div ng-class=\"{    'active': leaving || (active && !entering),    'prev': (next || active) && direction=='prev',    'next': (next || active) && direction=='next',    'right': direction=='prev',    'left': direction=='next'  }\" class=\"item\" ng-transclude></div>")}]),angular.module("template/dialog/message.html",[]).run(["$templateCache",function(e){e.put("template/dialog/message.html",'<div class="modal-header">	<h1>{{ title }}</h1></div><div class="modal-body">	<p>{{ message }}</p></div><div class="modal-footer">	<button ng-repeat="btn in buttons" ng-click="close(btn.result)" class=btn ng-class="btn.cssClass">{{ btn.label }}</button></div>')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(e){e.put("template/pagination/pagination.html",'<div class="pagination"><ul>  <li ng-class="{disabled: noPrevious()}"><a ng-click="selectPrevious()">{{previousText || \'Previous\'}}</a></li>  <li ng-repeat="page in pages" ng-class="{active: isActive(page)}"><a ng-click="selectPage(page)">{{page}}</a></li>  <li ng-class="{disabled: noNext()}"><a ng-click="selectNext()">{{nextText || \'Next\'}}</a></li>  </ul></div>')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(e){e.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">  <div class="arrow"></div>  <div class="popover-inner">      <h3 class="popover-title" ng-bind="popoverTitle" ng-show="popoverTitle"></h3>      <div class="popover-content" ng-bind="popoverContent"></div>  </div></div>')}]),angular.module("template/tabs/pane.html",[]).run(["$templateCache",function(e){e.put("template/tabs/pane.html",'<div class="tab-pane" ng-class="{active: selected}" ng-show="selected" ng-transclude></div>')}]),angular.module("template/tabs/tabs.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tabs.html",'<div class="tabbable">  <ul class="nav nav-tabs">    <li ng-repeat="pane in panes" ng-class="{active:pane.selected}">      <a href="" ng-click="select(pane)">{{pane.heading}}</a>    </li>  </ul>  <div class="tab-content" ng-transclude></div></div>')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(e){e.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">  <div class="tooltip-arrow"></div>  <div class="tooltip-inner" ng-bind="tooltipTitle"></div></div>')}]);

angular.module("ngLocale", [], ["$provide", function($provide) {
    var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
    $provide.value("$locale", {"NUMBER_FORMATS":{"DECIMAL_SEP":",","GROUP_SEP":" ","PATTERNS":[{"minInt":1,"minFrac":0,"macFrac":0,"posPre":"","posSuf":"","negPre":"-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":3},{"minInt":1,"minFrac":2,"macFrac":0,"posPre":"","posSuf":" \u00A4","negPre":"-","negSuf":" \u00A4","gSize":3,"lgSize":3,"maxFrac":2}],"CURRENCY_SYM":"€"},"pluralCat":function (n) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;},"DATETIME_FORMATS":{"MONTH":["tammikuuta","helmikuuta","maaliskuuta","huhtikuuta","toukokuuta","kesäkuuta","heinäkuuta","elokuuta","syyskuuta","lokakuuta","marraskuuta","joulukuuta"],"SHORTMONTH":["tammikuuta","helmikuuta","maaliskuuta","huhtikuuta","toukokuuta","kesäkuuta","heinäkuuta","elokuuta","syyskuuta","lokakuuta","marraskuuta","joulukuuta"],"DAY":["sunnuntaina","maanantaina","tiistaina","keskiviikkona","torstaina","perjantaina","lauantaina"],"SHORTDAY":["su","ma","ti","ke","to","pe","la"],"AMPMS":["ap.","ip."],"medium":"d.M.yyyy H.mm.ss","short":"d.M.yyyy H.mm","fullDate":"cccc d. MMMM y","longDate":"d. MMMM y","mediumDate":"d.M.yyyy","shortDate":"d.M.yyyy","mediumTime":"H.mm.ss","shortTime":"H.mm"},"id":"fi-fi"});
}]);

angular.module('citizens-initiative', ['citizens-initiative-graph', 'ui.bootstrap.dialog'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: function($scope, $location, $routeParams, Graph) {
                    Graph.setLocationSetter(function(path) {
                        $location.path(path);
                        $scope.$apply();
                    });
                    $scope.graph = Graph;
                },
                template: document.getElementById('initiatives-all.html').innerHTML
            })
            .when('/:id/:pretty', {
                controller: function($scope, $location, $routeParams, Data, Graph, $dialog) {
                    $scope.id = 'https://www.kansalaisaloite.fi/api/v1/initiatives/' + $routeParams.id;
                    var d = $dialog.dialog({
                        modalFade: true,
                        template: document.getElementById('initiatives-one.html').innerHTML,
                        resolve: {
                            id: $scope.id
                        },
                        controller: function($scope, dialog, id){
                            _gaq.push(['_trackEvent', 'Initiatives', 'Open', id]);
                            $scope.id = id;
                            $scope.data = Data.data;

                            $scope.initiative = {name: {'fi':''}, currentTotal:0, totalSupportCount:[]};

                            $scope.$watch('data', function(data) {
                                if (!data || !data[$scope.id]) {
                                    return;
                                }

                                var initiative = data[$scope.id];
                                if (!initiative.hasOwnProperty('support')) {
                                    initiative.id = $scope.id;
                                    initiative.support = initiativeSupportArray(initiative);
                                    initiative.currentTotal = initiative.support[initiative.support.length-1][1];
                                }

                                $scope.initiative = initiative;
                            }, true);

                            $scope.close = function() {
                                dialog.close();
                            };
                            $scope.graph = Graph;
                        }
                    });
                    d.open().then(function() {
                        $location.path('/');
                    });
                    $scope.show = function() {
                    };
                    setTimeout(function() {
                        $('.spinner').remove();
                    }, 0);
                },
                template: '{{show()}}'
            });
        $locationProvider.html5Mode(true);
    });

angular.module('citizens-initiative-data', ['ngResource'])
    .factory('Data', function($resource) {
        var Data = $resource('/initiatives-all.json').get();
        var cache = null;

        return {
            data: Data,
            googleDataArray: function() {
                if (cache) {
                    return cache;
                }
                var data = $.map(Data, function(initiative, id) {
                    if (typeof(initiative) !== "object") {
                        return null;
                    }

                    initiative.id = id;

                    return initiative;
                });

                if (data.length < 1) {
                    return [];
                }

                var chartData = [];
                data = $.map(data, function(initiative) {
                    if (!initiative.hasOwnProperty('support')) {
                        initiative.support = initiativeSupportArray(initiative);
                        initiative.currentTotal = initiative.support[initiative.support.length-1][1];
                    }
                    return initiative;
                });
                data.sort(function(b, a) {
                    return a.currentTotal - b.currentTotal;
                });
                window.idPos = $.map(data, function(initiative, i) {
                    return [initiative.id, null];
                });
                idPos.unshift('Time');
                var names = $.map(data, function(initiative) {
                    return initiative.name.fi;
                });
                names.unshift('Time');
                chartData.push([]);
                var timeCount = {};
                var i;
                var url;
                $.each(data, function(i, initiative) {
                    id = initiative.id;
                    $.each(initiative.support, function(i, count) {
                        time = count[0];
                        count = count[1];

                        if (!time || !count) {
                            return;
                        }

                        if (!timeCount.hasOwnProperty(time)) {
                            timeCount[time] = Array(idPos.length);
                            timeCount[time][0] = time;
                            for (i = 1; i < idPos.length; i++) timeCount[time][i] = null;
                        }
                        timeCount[time][idPos.indexOf(id)] = count;
                        timeCount[time][idPos.indexOf(id)+1] = '<div class="initiative-tooltip"><p><span class="count">' + count + '</span><span class="date">' + dateFullFormatter.formatValue(time) + '</span></p><p class="name">' + initiative.name.fi + '</p></div>';
                    });
                });
                chartData = $.map(timeCount, function(counts, time) {
                    return [counts];
                });
                chartData.sort(function(a, b) {
                    return a[0] - b[0];
                });
                chartData[0] = names;

                cache = chartData;

                return chartData;
            }
        };
    });

angular.module('citizens-initiative-graph', ['citizens-initiative-data'])
    .directive('initiativeChartSingle', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                initiative: '=initiative'
            },
            controller: function($scope, $element, $attrs, Graph) {
                $scope.$watch('initiative', function(initiative) {
                    if (!initiative.id) {
                        return;
                    }
                    Graph.drawSingle('initiative-chart-fulltime', initiative);
                });
            },
            template: '<div ng-transclude></div>'
        };
    })
    .factory('Graph', function(Data) {
        var wrapper = null;
        var locationSetter = null;
        return {
            data: function() {
                return Data.data();
            },
            setLocationSetter: function(setter) {
                locationSetter = setter;
            },
            drawSingle: function(containerId, initiative) {
                if (!document.getElementById(containerId)) {
                    return;
                }

                var data = new google.visualization.DataTable();
                data.addColumn('datetime', 'Time');
                data.addColumn('number', initiative.name.fi);
                data.addColumn({type:'boolean',role:'certainty'});
                data.addColumn({type:'string',role:'tooltip',p:{html:true}});

                var rows = [];
                angular.forEach(initiative.support, function(value) {
                    if (!value.hasOwnProperty('length') || value.length !== 2) {
                        return;
                    }
                    var val = value.slice(0);
                    val.push(true);
                    val.push('<div class="initiative-tooltip"><p><span class="count">' + value[1] + '</span><span class="date">' + dateFullFormatter.formatValue(value[0]) + '</span></p></div>');
                    rows.push(val);
                });

                if (rows.length < 1) {
                    return;
                }

                rows.unshift([new Date(initiative.startDate), 0, false, '<div class="initiative-tooltip"><p><span class="count">0</span><span class="date">' + dateFullFormatter.formatValue(new Date(initiative.startDate)) + '</span></p></div>']);

                data.addRows(rows);

                var chart = new google.visualization.ChartWrapper({
                    chartType: 'LineChart',
                    containerId: containerId,
                    dataTable: data
                });
                chart.setOptions({
                    'backgroundColor': 'white',
                    'hAxis': {
                        'format': 'MM.yyyy',
                        'minValue': new Date(initiative.startDate),
                        'maxValue': new Date(initiative.endDate),
                        'viewWindow': {
                            'min': new Date(initiative.startDate),
                            'max': new Date(initiative.endDate)
                        }
                    },
                    'vAxis': {
                        'minValue': 0,
                        'maxValue': 50000,
                        'viewWindow': {
                            'min': 0,
                            'max': 50000
                        },
                        'gridlines': {
                            'count': 6
                        }
                    },
                    'legend': {
                        'position': 'none'
                    },
                    'chartArea': {
                        'top': 20,
                        'left': 60,
                        'width': 450,
                        'height': 260
                    },
                    width: 530,
                    height: 300,
                    'tooltip': {
                        'isHtml': true
                    }
                });

                chart.draw();
            },
            draw: function(containerId) {
                if (!document.getElementById(containerId)) {
                    return;
                }
                if (document.getElementById(containerId).childElementCount > 1) {
                    return;
                }
                var arrayedData = Data.googleDataArray().slice(0);

                if (arrayedData.length < 1) {
                    return;
                }

                dataTable = new google.visualization.DataTable();
                for (var i in arrayedData[0]) {
                    if (i == 0) {
                        dataTable.addColumn('datetime', arrayedData[0][i]);
                        continue;
                    }
                    dataTable.addColumn('number', arrayedData[0][i]);
                    dataTable.addColumn({type:'string',role:'tooltip',p:{html:true}});
                }

                arrayedData[0] = null;

                dataTable.addRows(arrayedData);
                wrapper = new google.visualization.ChartWrapper({
                    chartType: 'LineChart',
                    containerId: containerId,
                    dataTable: dataTable
                });
                wrapper.setOptions({
                    'backgroundColor': 'whiteSmoke',
                    'chartArea': {
                        'top': 20,
                        'left': 60
                    },
                    'hAxis': {
                        'format': 'dd.MM.yyyy' // dd.MM.yyyy HH:mm
                    },
                    'tooltip': {
                        'isHtml': true
                    }
                });

                var listener = google.visualization.events.addListener(wrapper, 'select', function(e) {
                    if (wrapper.getChart().getSelection().length < 1) {
                        return;
                    }
                    var id = idPos[wrapper.getChart().getSelection()[0].column];
                    locationSetter('/' + id.match(/\d+$/)[0] + '/');
                });

                wrapper.draw();
            }
        };
    });


var initiativeSupportArray = function(initiative) {
    var support = [];
    angular.forEach(initiative.totalSupportCount, function(value, time) {
        time = timeParser(time);
        time = new Date(time(0, 4), time(4, 2) - 1, time(6, 2), time(9, 2));
        support.push([time, value]);
    });
    support.sort(function(a,b) {return a[0] - b[0];});
    return support;
};

var timeParser = function(time) {
    return function(start, length) {
        return parseInt(time.substr(start, length), 10);
    };
};
var idToUrl = function(id) {
    return 'https://www.kansalaisaloite.fi/fi/aloite/' + id.match(/\d+$/)[0];
};

    /*

        var initiativeData = data[id].totalSupportCount.map(function(count, i) {
            return [count.time, count.count, true, ];
        });
        initiativeData.sort(function(a, b) {
            return a[0] - b[0];
        });


        // ...
    });
    */

google.load('visualization', '1', {packages:['corechart'], callback:function() {
    window.dateFullFormatter = new google.visualization.DateFormat({pattern: "dd.MM.yyyy HH:mm:ss"});
    angular.bootstrap(document, ['citizens-initiative']);
}});

new Spinner({lines: 9, length: 4, width: 5, radius: 13, corners: 1, rotate: 5, color: '#000', speed: 1, trail: 79, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: '200', left: 'auto'}).spin(document.getElementById('chart_div'));

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37909592-1']);
_gaq.push(['_trackPageview']);
(function() {
    var ga = document.createElement('script'); ga.async = true;
    ga.src = '//www.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/fi_FI/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
