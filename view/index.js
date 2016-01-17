!function(window,document,JSON){"use strict";!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.dragula=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){function lookupClass(className){var cached=cache[className];return cached?cached.lastIndex=0:cache[className]=cached=new RegExp(start+className+end,"g"),cached}function addClass(el,className){var current=el.className;current.length?lookupClass(className).test(current)||(el.className+=" "+className):el.className=className}function rmClass(el,className){el.className=el.className.replace(lookupClass(className)," ").trim()}var cache={},start="(?:^|\\s)",end="(?:\\s|$)";module.exports={add:addClass,rm:rmClass}},{}],2:[function(require,module,exports){(function(global){function dragula(initialContainers,options){function isContainer(el){return-1!==drake.containers.indexOf(el)||o.isContainer(el)}function events(remove){var op=remove?"remove":"add";touchy(documentElement,op,"mousedown",grab),touchy(documentElement,op,"mouseup",release)}function eventualMovements(remove){var op=remove?"remove":"add";touchy(documentElement,op,"mousemove",startBecauseMouseMoved)}function movements(remove){var op=remove?"remove":"add";crossvent[op](documentElement,"selectstart",preventGrabbed),crossvent[op](documentElement,"click",preventGrabbed)}function destroy(){events(!0),release({})}function preventGrabbed(e){_grabbed&&e.preventDefault()}function grab(e){_moveX=e.clientX,_moveY=e.clientY;var ignore=1!==whichMouseButton(e)||e.metaKey||e.ctrlKey;if(!ignore){var item=e.target,context=canStart(item);context&&(_grabbed=context,eventualMovements(),"mousedown"===e.type&&(isInput(item)?item.focus():e.preventDefault()))}}function startBecauseMouseMoved(e){if(_grabbed){if(0===whichMouseButton(e))return void release({});if(void 0===e.clientX||e.clientX!==_moveX||void 0===e.clientY||e.clientY!==_moveY){if(o.ignoreInputTextSelection){var clientX=getCoord("clientX",e),clientY=getCoord("clientY",e),elementBehindCursor=doc.elementFromPoint(clientX,clientY);if(isInput(elementBehindCursor))return}var grabbed=_grabbed;eventualMovements(!0),movements(),end(),start(grabbed);var offset=getOffset(_item);_offsetX=getCoord("pageX",e)-offset.left,_offsetY=getCoord("pageY",e)-offset.top,classes.add(_copy||_item,"gu-transit"),renderMirrorImage(),drag(e)}}}function canStart(item){if(!(drake.dragging&&_mirror||isContainer(item))){for(var handle=item;getParent(item)&&isContainer(getParent(item))===!1;){if(o.invalid(item,handle))return;if(item=getParent(item),!item)return}var source=getParent(item);if(source&&!o.invalid(item,handle)){var movable=o.moves(item,source,handle,nextEl(item));if(movable)return{item:item,source:source}}}}function manualStart(item){var context=canStart(item);context&&start(context)}function start(context){isCopy(context.item,context.source)&&(_copy=context.item.cloneNode(!0),drake.emit("cloned",_copy,context.item,"copy")),_source=context.source,_item=context.item,_initialSibling=_currentSibling=nextEl(context.item),drake.dragging=!0,drake.emit("drag",_item,_source)}function invalidTarget(){return!1}function end(){if(drake.dragging){var item=_copy||_item;drop(item,getParent(item))}}function ungrab(){_grabbed=!1,eventualMovements(!0),movements(!0)}function release(e){if(ungrab(),drake.dragging){var item=_copy||_item,clientX=getCoord("clientX",e),clientY=getCoord("clientY",e),elementBehindCursor=getElementBehindPoint(_mirror,clientX,clientY),dropTarget=findDropTarget(elementBehindCursor,clientX,clientY);dropTarget&&(_copy&&o.copySortSource||!_copy||dropTarget!==_source)?drop(item,dropTarget):o.removeOnSpill?remove():cancel()}}function drop(item,target){var parent=getParent(item);_copy&&o.copySortSource&&target===_source&&parent.removeChild(_item),isInitialPlacement(target)?drake.emit("cancel",item,_source,_source):drake.emit("drop",item,target,_source,_currentSibling),cleanup()}function remove(){if(drake.dragging){var item=_copy||_item,parent=getParent(item);parent&&parent.removeChild(item),drake.emit(_copy?"cancel":"remove",item,parent,_source),cleanup()}}function cancel(revert){if(drake.dragging){var reverts=arguments.length>0?revert:o.revertOnSpill,item=_copy||_item,parent=getParent(item);parent===_source&&_copy&&parent.removeChild(_copy);var initial=isInitialPlacement(parent);initial===!1&&!_copy&&reverts&&_source.insertBefore(item,_initialSibling),initial||reverts?drake.emit("cancel",item,_source,_source):drake.emit("drop",item,parent,_source,_currentSibling),cleanup()}}function cleanup(){var item=_copy||_item;ungrab(),removeMirrorImage(),item&&classes.rm(item,"gu-transit"),_renderTimer&&clearTimeout(_renderTimer),drake.dragging=!1,_lastDropTarget&&drake.emit("out",item,_lastDropTarget,_source),drake.emit("dragend",item),_source=_item=_copy=_initialSibling=_currentSibling=_renderTimer=_lastDropTarget=null}function isInitialPlacement(target,s){var sibling;return sibling=void 0!==s?s:_mirror?_currentSibling:nextEl(_copy||_item),target===_source&&sibling===_initialSibling}function findDropTarget(elementBehindCursor,clientX,clientY){function accepted(){var droppable=isContainer(target);if(droppable===!1)return!1;var immediate=getImmediateChild(target,elementBehindCursor),reference=getReference(target,immediate,clientX,clientY),initial=isInitialPlacement(target,reference);return initial?!0:o.accepts(_item,target,_source,reference)}for(var target=elementBehindCursor;target&&!accepted();)target=getParent(target);return target}function drag(e){function moved(type){drake.emit(type,item,_lastDropTarget,_source)}function over(){changed&&moved("over")}function out(){_lastDropTarget&&moved("out")}if(_mirror){e.preventDefault();var clientX=getCoord("clientX",e),clientY=getCoord("clientY",e),x=clientX-_offsetX,y=clientY-_offsetY;_mirror.style.left=x+"px",_mirror.style.top=y+"px";var item=_copy||_item,elementBehindCursor=getElementBehindPoint(_mirror,clientX,clientY),dropTarget=findDropTarget(elementBehindCursor,clientX,clientY),changed=null!==dropTarget&&dropTarget!==_lastDropTarget;(changed||null===dropTarget)&&(out(),_lastDropTarget=dropTarget,over());var parent=getParent(item);if(dropTarget===_source&&_copy&&!o.copySortSource)return void(parent&&parent.removeChild(item));var reference,immediate=getImmediateChild(dropTarget,elementBehindCursor);if(null!==immediate)reference=getReference(dropTarget,immediate,clientX,clientY);else{if(o.revertOnSpill!==!0||_copy)return void(_copy&&parent&&parent.removeChild(item));reference=_initialSibling,dropTarget=_source}(null===reference||reference!==item&&reference!==nextEl(item)&&reference!==_currentSibling)&&(_currentSibling=reference,dropTarget.insertBefore(item,reference),drake.emit("shadow",item,dropTarget,_source))}}function spillOver(el){classes.rm(el,"gu-hide")}function spillOut(el){drake.dragging&&classes.add(el,"gu-hide")}function renderMirrorImage(){if(!_mirror){var rect=_item.getBoundingClientRect();_mirror=_item.cloneNode(!0),_mirror.style.width=getRectWidth(rect)+"px",_mirror.style.height=getRectHeight(rect)+"px",classes.rm(_mirror,"gu-transit"),classes.add(_mirror,"gu-mirror"),o.mirrorContainer.appendChild(_mirror),touchy(documentElement,"add","mousemove",drag),classes.add(o.mirrorContainer,"gu-unselectable"),drake.emit("cloned",_mirror,_item,"mirror")}}function removeMirrorImage(){_mirror&&(classes.rm(o.mirrorContainer,"gu-unselectable"),touchy(documentElement,"remove","mousemove",drag),getParent(_mirror).removeChild(_mirror),_mirror=null)}function getImmediateChild(dropTarget,target){for(var immediate=target;immediate!==dropTarget&&getParent(immediate)!==dropTarget;)immediate=getParent(immediate);return immediate===documentElement?null:immediate}function getReference(dropTarget,target,x,y){function outside(){var i,el,rect,len=dropTarget.children.length;for(i=0;len>i;i++){if(el=dropTarget.children[i],rect=el.getBoundingClientRect(),horizontal&&rect.left>x)return el;if(!horizontal&&rect.top>y)return el}return null}function inside(){var rect=target.getBoundingClientRect();return resolve(horizontal?x>rect.left+getRectWidth(rect)/2:y>rect.top+getRectHeight(rect)/2)}function resolve(after){return after?nextEl(target):target}var horizontal="horizontal"===o.direction,reference=target!==dropTarget?inside():outside();return reference}function isCopy(item,container){return"boolean"==typeof o.copy?o.copy:o.copy(item,container)}var len=arguments.length;1===len&&Array.isArray(initialContainers)===!1&&(options=initialContainers,initialContainers=[]);var _mirror,_source,_item,_offsetX,_offsetY,_moveX,_moveY,_initialSibling,_currentSibling,_copy,_renderTimer,_grabbed,_lastDropTarget=null,o=options||{};void 0===o.moves&&(o.moves=always),void 0===o.accepts&&(o.accepts=always),void 0===o.invalid&&(o.invalid=invalidTarget),void 0===o.containers&&(o.containers=initialContainers||[]),void 0===o.isContainer&&(o.isContainer=never),void 0===o.copy&&(o.copy=!1),void 0===o.copySortSource&&(o.copySortSource=!1),void 0===o.revertOnSpill&&(o.revertOnSpill=!1),void 0===o.removeOnSpill&&(o.removeOnSpill=!1),void 0===o.direction&&(o.direction="vertical"),void 0===o.ignoreInputTextSelection&&(o.ignoreInputTextSelection=!0),void 0===o.mirrorContainer&&(o.mirrorContainer=doc.body);var drake=emitter({containers:o.containers,start:manualStart,end:end,cancel:cancel,remove:remove,destroy:destroy,dragging:!1});return o.removeOnSpill===!0&&drake.on("over",spillOver).on("out",spillOut),events(),drake}function touchy(el,op,type,fn){var touch={mouseup:"touchend",mousedown:"touchstart",mousemove:"touchmove"},pointers={mouseup:"pointerup",mousedown:"pointerdown",mousemove:"pointermove"},microsoft={mouseup:"MSPointerUp",mousedown:"MSPointerDown",mousemove:"MSPointerMove"};global.navigator.pointerEnabled?crossvent[op](el,pointers[type],fn):global.navigator.msPointerEnabled?crossvent[op](el,microsoft[type],fn):(crossvent[op](el,touch[type],fn),crossvent[op](el,type,fn))}function whichMouseButton(e){if(void 0!==e.touches)return e.touches.length;if(void 0!==e.buttons)return e.buttons;if(void 0!==e.which)return e.which;var button=e.button;return void 0!==button?1&button?1:2&button?3:4&button?2:0:void 0}function getOffset(el){var rect=el.getBoundingClientRect();return{left:rect.left+getScroll("scrollLeft","pageXOffset"),top:rect.top+getScroll("scrollTop","pageYOffset")}}function getScroll(scrollProp,offsetProp){return"undefined"!=typeof global[offsetProp]?global[offsetProp]:documentElement.clientHeight?documentElement[scrollProp]:doc.body[scrollProp]}function getElementBehindPoint(point,x,y){var el,p=point||{},state=p.className;return p.className+=" gu-hide",el=doc.elementFromPoint(x,y),p.className=state,el}function never(){return!1}function always(){return!0}function getRectWidth(rect){return rect.width||rect.right-rect.left}function getRectHeight(rect){return rect.height||rect.bottom-rect.top}function getParent(el){return el.parentNode===doc?null:el.parentNode}function isInput(el){return"INPUT"===el.tagName||"TEXTAREA"===el.tagName||"SELECT"===el.tagName||isEditable(el)}function isEditable(el){return el?"false"===el.contentEditable?!1:"true"===el.contentEditable?!0:isEditable(getParent(el)):!1}function nextEl(el){function manually(){var sibling=el;do sibling=sibling.nextSibling;while(sibling&&1!==sibling.nodeType);return sibling}return el.nextElementSibling||manually()}function getEventHost(e){return e.targetTouches&&e.targetTouches.length?e.targetTouches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}function getCoord(coord,e){var host=getEventHost(e),missMap={pageX:"clientX",pageY:"clientY"};return coord in missMap&&!(coord in host)&&missMap[coord]in host&&(coord=missMap[coord]),host[coord]}var emitter=require("contra/emitter"),crossvent=require("crossvent"),classes=require("./classes"),doc=document,documentElement=doc.documentElement;module.exports=dragula}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./classes":1,"contra/emitter":4,crossvent:8}],3:[function(require,module,exports){var ticky=require("ticky");module.exports=function(fn,args,ctx){fn&&ticky(function(){fn.apply(ctx||null,args||[])})}},{ticky:6}],4:[function(require,module,exports){var atoa=require("atoa"),debounce=require("./debounce");module.exports=function(thing,options){var opts=options||{},evt={};return void 0===thing&&(thing={}),thing.on=function(type,fn){return evt[type]?evt[type].push(fn):evt[type]=[fn],thing},thing.once=function(type,fn){return fn._once=!0,thing.on(type,fn),thing},thing.off=function(type,fn){var c=arguments.length;if(1===c)delete evt[type];else if(0===c)evt={};else{var et=evt[type];if(!et)return thing;et.splice(et.indexOf(fn),1)}return thing},thing.emit=function(){var args=atoa(arguments);return thing.emitterSnapshot(args.shift()).apply(this,args)},thing.emitterSnapshot=function(type){var et=(evt[type]||[]).slice(0);return function(){var args=atoa(arguments),ctx=this||thing;if("error"===type&&opts["throws"]!==!1&&!et.length)throw 1===args.length?args[0]:args;return et.forEach(function(listen){opts.async?debounce(listen,args,ctx):listen.apply(ctx,args),listen._once&&thing.off(type,listen)}),thing}},thing}},{"./debounce":3,atoa:5}],5:[function(require,module,exports){module.exports=function(a,n){return Array.prototype.slice.call(a,n)}},{}],6:[function(require,module,exports){var tick,si="function"==typeof setImmediate;tick=si?function(fn){setImmediate(fn)}:function(fn){setTimeout(fn,0)},module.exports=tick},{}],7:[function(require,module,exports){(function(global){function useNative(){try{var p=new NativeCustomEvent("cat",{detail:{foo:"bar"}});return"cat"===p.type&&"bar"===p.detail.foo}catch(e){}return!1}var NativeCustomEvent=global.CustomEvent;module.exports=useNative()?NativeCustomEvent:"function"==typeof document.createEvent?function(type,params){var e=document.createEvent("CustomEvent");return params?e.initCustomEvent(type,params.bubbles,params.cancelable,params.detail):e.initCustomEvent(type,!1,!1,void 0),e}:function(type,params){var e=document.createEventObject();return e.type=type,params?(e.bubbles=Boolean(params.bubbles),e.cancelable=Boolean(params.cancelable),e.detail=params.detail):(e.bubbles=!1,e.cancelable=!1,e.detail=void 0),e}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],8:[function(require,module,exports){(function(global){function addEventEasy(el,type,fn,capturing){return el.addEventListener(type,fn,capturing)}function addEventHard(el,type,fn){return el.attachEvent("on"+type,wrap(el,type,fn))}function removeEventEasy(el,type,fn,capturing){return el.removeEventListener(type,fn,capturing)}function removeEventHard(el,type,fn){var listener=unwrap(el,type,fn);return listener?el.detachEvent("on"+type,listener):void 0}function fabricateEvent(el,type,model){function makeClassicEvent(){var e;return doc.createEvent?(e=doc.createEvent("Event"),e.initEvent(type,!0,!0)):doc.createEventObject&&(e=doc.createEventObject()),e}function makeCustomEvent(){return new customEvent(type,{detail:model})}var e=-1===eventmap.indexOf(type)?makeCustomEvent():makeClassicEvent();el.dispatchEvent?el.dispatchEvent(e):el.fireEvent("on"+type,e)}function wrapperFactory(el,type,fn){return function(originalEvent){var e=originalEvent||global.event;e.target=e.target||e.srcElement,e.preventDefault=e.preventDefault||function(){e.returnValue=!1},e.stopPropagation=e.stopPropagation||function(){e.cancelBubble=!0},e.which=e.which||e.keyCode,fn.call(el,e)}}function wrap(el,type,fn){var wrapper=unwrap(el,type,fn)||wrapperFactory(el,type,fn);return hardCache.push({wrapper:wrapper,element:el,type:type,fn:fn}),wrapper}function unwrap(el,type,fn){var i=find(el,type,fn);if(i){var wrapper=hardCache[i].wrapper;return hardCache.splice(i,1),wrapper}}function find(el,type,fn){var i,item;for(i=0;i<hardCache.length;i++)if(item=hardCache[i],item.element===el&&item.type===type&&item.fn===fn)return i}var customEvent=require("custom-event"),eventmap=require("./eventmap"),doc=global.document,addEvent=addEventEasy,removeEvent=removeEventEasy,hardCache=[];global.addEventListener||(addEvent=addEventHard,removeEvent=removeEventHard),module.exports={add:addEvent,remove:removeEvent,fabricate:fabricateEvent}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./eventmap":9,"custom-event":7}],9:[function(require,module,exports){(function(global){var eventmap=[],eventname="",ron=/^on/;for(eventname in global)ron.test(eventname)&&eventmap.push(eventname.slice(2));module.exports=eventmap}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[2])(2)});let SimpleUndo=require("simple-undo");class UndoManager{constructor(){this.state={imageDimensions:null,imageSrc:null};this.history=new SimpleUndo({maxLength:10,provider:function(done){return done(JSON.stringify(this.state))}.bind(this)});this.history.initialize(JSON.stringify(this.state));this.unserializer=function(serialized){this.state=JSON.parse(serialized);let imageDimensions=this.state.imageDimensions,imageSrc=this.state.imageSrc;if(imageSrc!=null){window.negative.frameController.setImageAndSize(imageSrc,imageDimensions[0],imageDimensions[1])}else{window.negative.frameController.removeImage()}}.bind(this)}save(state){this.state=state;this.history.save()}undo(){this.history.undo(this.unserializer)}redo(){this.history.redo(this.unserializer)}canUndo(){return this.history.canUndo()}canRedo(){return this.history.canRedo()}serialize(){return{canUndo:this.canUndo(),canRedo:this.canRedo()}}}let ipc=require("electron").ipcRenderer;class NegativeFrame{constructor(){this.imageContainer=document.getElementById("imageContainer");this.currentImage=document.getElementById("negativeImage");this.currentImage.addEventListener("load",function(){document.body.classList.add("negative-on")},false);ipc.send("get-settings-request");ipc.on("get-settings-response",function(evt,settings){if(settings["shouldShowTips"]===false){document.body.classList.add("no-tips")}}.bind(this))}setShouldShowTips(shouldShowTips){if(shouldShowTips){document.body.classList.remove("no-tips")}else{document.body.classList.add("no-tips")}}setImageAndSize(src,width,height){if(src){document.body.classList.add("negative-on");this.currentImage.setAttribute("src",src);let newWidth=width+"px",newHeight=height+"px";this.currentImage.style.width=newWidth;this.currentImage.style.height=newHeight;this.imageContainer.style.width=newWidth;this.imageContainer.style.height=newHeight;window.negative.tabsController.setTabHasContent();window.negative.tabsController.setTabLabel(width+"x"+height)}}removeImage(){document.body.classList.remove("negative-on");this.currentImage.setAttribute("src","");window.negative.tabsController.unsetTabHasContent();window.negative.tabsController.setTabLabel("")}setFocused(){document.body.classList.remove("blur");document.body.classList.add("focus")}unsetFocused(){document.body.classList.remove("focus");document.body.classList.add("blur")}setPrimary(){document.body.classList.add("primary")}unsetPrimary(){document.body.classList.remove("primary")}}let clipboard=require("clipboard"),nativeImage=require("native-image"),remote=require("electron").remote,BrowserWindow=remote.BrowserWindow;class NegativeTabs{constructor(){this.tabIndex=0;this.tabs=[this.getEmptyModel()];this.tabsContainer=document.getElementById("tabs");this.tabsContainer.addEventListener("click",function(evt){let target=evt.target;if(target){if(target.classList.contains("tab")){this.deselectTabByIndex(this.tabIndex);this.tabIndex=Array.from(this.tabsContainer.children).indexOf(target);this.selectTabByIndex(this.tabIndex)}else if(target.classList.contains("close")){this.closeTab()}}}.bind(this),false);let drake=window.dragula([this.tabsContainer],{direction:"horizontal"}),drakeSourceIndex=null,drakeDestIndex=null;drake.on("drag",function(el,source){drakeSourceIndex=Array.from(this.tabsContainer.children).indexOf(el)}.bind(this));drake.on("drop",function(el,target,source,sibling){drakeDestIndex=Array.from(this.tabsContainer.children).indexOf(el);let sourceTab=this.tabs.splice(drakeSourceIndex,1);this.tabs.splice(drakeDestIndex,0,sourceTab[0]);this.deselectTabByIndex(drakeSourceIndex);this.selectTabByIndex(drakeDestIndex);this.tabIndex=drakeDestIndex}.bind(this));document.getElementById("close").addEventListener("click",function(evt){BrowserWindow.getFocusedWindow().close()});document.getElementById("minimize").addEventListener("click",function(evt){BrowserWindow.getFocusedWindow().minimize()});document.getElementById("maximize").addEventListener("click",function(evt){BrowserWindow.getFocusedWindow().maximize()})}addTab(){this.deselectTabByIndex(this.tabIndex);this.tabIndex++;let newTabButton=this.getTabButtonElement(true);this.tabsContainer.insertBefore(newTabButton,this.tabsContainer.children[this.tabIndex]);newTabButton.focus();this.tabs.splice(this.tabIndex,0,this.getEmptyModel());window.negative.frameController.removeImage();this.refreshMenu()}closeTab(){let closedTabIndex=this.tabIndex;if(!this.canSelectNextTab()){if(this.canSelectPreviousTab()){this.tabIndex--}else{BrowserWindow.getFocusedWindow().close();return}}this.tabsContainer.children[closedTabIndex].remove();this.tabs.splice(closedTabIndex,1);this.selectTabByIndex(this.tabIndex)}canSelectNextTab(){return this.tabIndex+1<this.tabs.length}canSelectPreviousTab(){return this.tabIndex>0}selectTabByIndex(index){let newTab=this.tabs[index].undoManager.state,newTabButton=this.tabsContainer.children[index],imageSrc=newTab.imageSrc,imageDimensions=newTab.imageDimensions;newTabButton.classList.add("selected");newTabButton.setAttribute("aria-selected","true");newTabButton.focus();if(imageSrc&&imageDimensions){window.negative.frameController.setImageAndSize(imageSrc,imageDimensions[0],imageDimensions[1])}else{window.negative.frameController.removeImage()}this.refreshMenu()}deselectTabByIndex(index){let oldTab=this.tabsContainer.children[index];oldTab.classList.remove("selected");oldTab.setAttribute("aria-selected","false")}selectNextTab(){let canSelectNextTab=this.canSelectNextTab();if(canSelectNextTab){this.deselectTabByIndex(this.tabIndex);this.tabIndex++;this.selectTabByIndex(this.tabIndex)}return canSelectNextTab}selectPreviousTab(){let canSelectPreviousTab=this.canSelectPreviousTab();if(canSelectPreviousTab){this.deselectTabByIndex(this.tabIndex);this.tabIndex--;this.selectTabByIndex(this.tabIndex)}return canSelectPreviousTab}setTabHasContent(){this.tabsContainer.children[this.tabIndex].classList.add("has-content")}unsetTabHasContent(){this.tabsContainer.children[this.tabIndex].classList.remove("has-content")}setTabLabel(label){this.tabsContainer.children[this.tabIndex].children[0].textContent=label}getEmptyModel(){return{undoManager:new UndoManager}}getTabButtonElement(isSelected){let tabDiv=document.createElement("div"),labelSpan=document.createElement("span"),closeButton=document.createElement("button");tabDiv.classList.add("tab");labelSpan.classList.add("label");closeButton.classList.add("close");closeButton.setAttribute("aria-label","close");closeButton.innerHTML="&times;";if(isSelected){tabDiv.classList.add("selected");tabDiv.setAttribute("aria-selected","true")}tabDiv.appendChild(labelSpan);tabDiv.appendChild(closeButton);return tabDiv}saveForUndo(state){let undoManager=this.tabs[this.tabIndex].undoManager;undoManager.save(state);this.refreshMenu()}undo(){let undoManager=this.tabs[this.tabIndex].undoManager;undoManager.undo();this.refreshMenu()}redo(){let undoManager=this.tabs[this.tabIndex].undoManager;undoManager.redo();this.refreshMenu()}copy(){let undoManagerState=this.tabs[this.tabIndex].undoManager.state,imageSrc=undoManagerState.imageSrc,imageDimensions=undoManagerState.imageDimensions;if(imageSrc!==null&&imageDimensions!==null){clipboard.write({image:nativeImage.createFromDataURL(imageSrc),text:JSON.stringify(imageDimensions)});this.refreshMenu()}}paste(){let image=clipboard.readImage(),imageDimensions;try{imageDimensions=JSON.parse(clipboard.readText()||null)}catch(err){}if(image!==null){if(!imageDimensions){imageDimensions=function(dims){return[dims.width,dims.height]}(image.getSize())}let imageSrc=image.toDataURL();window.negative.frameController.setImageAndSize(imageSrc,imageDimensions[0],imageDimensions[1]);this.saveForUndo({imageSrc:imageSrc,imageDimensions:imageDimensions});this.refreshMenu()}}refreshMenu(){let undoManager=this.tabs[this.tabIndex].undoManager;ipc.send("refresh-menu",{canAddTab:true,canCloseTab:true,canCloseWindow:true,canUndo:undoManager.canUndo(),canRedo:undoManager.canRedo(),canCapture:true,isImageEmpty:undoManager.state.imageSrc===null,canReload:true,canToggleDevTools:true,canSelectPreviousTab:this.canSelectPreviousTab(),canSelectNextTab:this.canSelectNextTab(),canMinimize:true,canMove:true})}fitWindowToImage(){let undoManagerState=this.tabs[this.tabIndex].undoManager.state;ipc.send("fit-window-to-image",undoManagerState.imageDimensions)}}document.addEventListener("DOMContentLoaded",function(){window.negative={frameController:new NegativeFrame,tabsController:new NegativeTabs};let noop=function(evt){return evt.preventDefault(),!1};document.body.addEventListener("dragend",noop,!1),document.body.addEventListener("dragleave",noop,!1),document.body.addEventListener("dragover",noop,!1),document.body.addEventListener("dragstart",noop,!1),document.body.addEventListener("drop",noop,!1)})}(window,document,JSON);