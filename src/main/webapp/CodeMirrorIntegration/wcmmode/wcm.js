/*
 * Copyright 2014  IBM Corp.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing permissions and limitations under the
 * License.
 */
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../CodeMirror/lib/codemirror"), require("../../CodeMirrorIntegration/wcmaddon/wcmtags"), require("./wcmtagstylehandler"), require("../../CodeMirror/mode/htmlmixed/htmlmixed"), require("./wcm"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../CodeMirror/lib/codemirror", "../../CodeMirrorIntegration/wcmaddon/wcmtags", "./wcmtagstylehandler", "./wcm", "../../CodeMirror/mode/htmlmixed/htmlmixed"], mod);
  else // Plain browser env
    mod(CodeMirror, WCMTagLibraryFactory, WCMTagStyleFactory);
})(function(CodeMirror, WCMTagLibraryFactory, WCMTagStyleFactory) {
"use strict";

   /*

   TODO: Add dynamic property support [$property | element | attribute resource]                            -- WORKING
      TODO: hint support                                                                                    -- BASIC parse working. Need to add attributes values
   TODO: change compound key to primary attribute handler. Do not automatically add suffix                  -- WORKING
      TODO: Remove compound key handling and refactor to use primary attribute handler
      TODO: auto add suffix when tag name complete and hint requested and tag supports primary attribute
   TODO: support no quotes                               -- WORKING
   TODO: support primary attribute tags [property:title] -- WORKING
      TODOL hint support                                 -- WORKING
   TODO: support 1st class plugins
   TODO: Server side tag defintion generation


   TODO: Comments!
    */

   CodeMirror.defineMode('wcm', function(config) {

      var tagLibrary = WCMTagLibraryFactory.createLibrary(config);
      var tagStyleHandler = WCMTagStyleFactory.createStyleHandler(tagLibrary);

      function initTag(stream, state) {
   
         var character = stream.next();
   
         if (character === '[') {
            var tagName = "";

            var peek = stream.peek();

            stream.eat("/");
            stream.eatSpace();
            var c;
            while ((c = stream.eat(/[^\s\u00a0=\"\'\/?(\]]/)))
               tagName += c;

            state.tagAttributes = [];

            var tag = tagLibrary.getTag(tagName);
            if (tag && tag.supportsPrimaryAttribute && tagName.toLocaleLowerCase().indexOf(tagLibrary.getTagName(tagName).name.toLocaleLowerCase() + ":") == 0) {
               state.tagAttributes.push(tag.value);
            }

            state.tagName = tagName;
            state.tokenize = inTag;

            return tagStyleHandler.tagStyle(tagName);
         }
   
         return null;
      }

      function inTag(stream, state) {
         var character = stream.next();
         var peek = stream.peek();

         if (character == "]") {
            // If an outer tag exist restore its state
            if (state.stateStack.length > 0) {
               var prevState = state.stateStack.pop();
               state.tagName = prevState.tagName;
               state.tokenize = prevState.tokenize;
               state.tagAttributes = prevState.tagAttributes;
            } else {
               state.tokenize = initTag;
            }

            return tagStyleHandler.tagStyle(state.tagName);
         } else if (character == "=") {
            // Anything other than a quote character is invalid
            if (!/[\'\"]/.test(peek)) {
               state.tokenize = function(stream, state) {
                  while (!stream.eol()) {
                     var ch = stream.next();
                     var peek = stream.peek();
                     if (ch == " " || ch == "," || /[ )\]]/.test(peek)) {
                        state.tokenize = inTag;
                        break;
                     }
                  }
                  return "error";
               };
            }
            if (peek != " " && !/[\'\"]/.test(peek)) {
               state.tokenize = inAttribute(new RegExp(" |\\]"), false);
            }
            return "operator";
         } else if (/[\'\"]/.test(character)) {
            state.tokenize = inAttribute(new RegExp(character), true);
            return state.tokenize(stream, state);
         } else {
   
            var attributeName = character;
            var c;
            while ((c = stream.eat(/[^\s\u00a0=\"\'\/?(\]]/))) {
               attributeName += c;
            }

            state.attributeName = attributeName;

            return tagStyleHandler.tagAttributeStyle(state.tagName, attributeName);
         }
      }
   // TODO: make regEx optional... and have simple char check for perf
      function inAttribute(delimiterRegEx, consumeDelimiter) {
         return function(stream, state) {
   
            var value = "";
            while (!stream.eol()) {
               var peek = stream.peek();
               if (peek == "[") {

                  // Preserve current state of outer tag.
                  state.stateStack.push({tokenize: state.tokenize, tagName: state.tagName, tagAttributes: state.tagAttributes});

                  // Clear existing state
                  state.tagName = null;
                  state.tagAttributes = [];
                  state.tokenize = initTag;
                  return "string";
               } else if (!consumeDelimiter && delimiterRegEx.test(peek)) {
                  state.tokenize = inTag;
                  break;
               } else {
                  var next = stream.next();
                  if (delimiterRegEx.test(next)) {
                     state.tokenize = inTag;
                     break;
                  } else {
                     value += next;
                  }
               }
            }

            // Track valid attributes to avoid duplication (todo: should validate against this)
            if (tagLibrary.isValidAttribute(state.attributeName, state.tagName)) {
               state.tagAttributes.push(state.attributeName);
            }

            return tagStyleHandler.tagValueStyle(state.tagName, state.attributeName, value);
         };
      }
   
      return { 
         startState : function() {
            return { tokenize : initTag, tagName : null, attributeName : null, tagAttributes : [], stateStack : []};
         }, 
         token : function(stream, state) {
   
            if (stream.eatSpace()) {
               return null;
            }
      
            return state.tokenize(stream, state);
         } 
      };
   });

   CodeMirror.defineMIME("text/wcm", "wcm");
});
