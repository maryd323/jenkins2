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
    mod(require("../../CodeMirror/lib/codemirror"), require("../../CodeMirror/mode/htmlmixed/htmlmixed"), require("./wcmmixed"), require("./wcm"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../CodeMirror/lib/codemirror", "./wcmmixed", "./wcm", "../../CodeMirror/mode/htmlmixed/htmlmixed"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

   CodeMirror.defineMode("wcmmixed", function(config, parserConfig) {
      var htmlMode = CodeMirror.getMode(config, "htmlmixed");
      var wcmMode = CodeMirror.getMode(config, "wcm");
      var quoteRegExp = /[\'\"]/;
      
      function dispatch(stream, state) {
         if (stream.sol()){
            //CodeMirror.wcm.clear();
         }
         var isWCM = (state.currentMode == wcmMode);
         if (stream.sol() && state.pending && state.pending != '"' && state.pending != "'")
            state.pending = null;
         if (!isWCM) {
            if (stream.peek() == "[") {
               state.currentMode = wcmMode;
               state.currentState = state.wcm;
               return wcmMode.token(stream, state.currentState);
            }

            var style;
            if (quoteRegExp.test(state.pending)) {
               while (!stream.eol() && stream.next() != state.pending) {}
               
               style = "string";
            } else {
               style = htmlMode.token(stream, state.currentState);
            }

            if (state.pending){
               state.pending = null;
            }
            
            var current = stream.current(), pendingMatch, wcmTagStartPos = current.search(/\[/);
            if (wcmTagStartPos != -1) {
               if (style == "string" && !/\]/.test(current) && (pendingMatch = current.match(/[\'\"]$/))) {
                  state.pending = pendingMatch[0];
               }
                  
               stream.backUp(current.length - wcmTagStartPos);
            }

            return style;
         } else if (isWCM && stream.peek() == "]" && state.currentState.stateStack.length == 0) {
            var style = wcmMode.token(stream, state.currentState);
            state.currentMode = htmlMode;
            state.currentState = state.html;
            return style;
         } else {
            // Sanity check. If we have a scope without any tags we have likely
            // gone to a new line. Switch back to HTML mode.
            if (stream.string.indexOf("[") == -1) {
               state.currentMode = htmlMode;
               state.currentState = state.html;

               return htmlMode.token(stream, state.currentState);
            }

            return wcmMode.token(stream, state.currentState);
         }
      }

      return {
         startState : function() {
            var html = CodeMirror.startState(htmlMode), wcm = CodeMirror.startState(wcmMode);
            return { currentMode : htmlMode, currentState : html, html : html, wcm : wcm, pending : null };
         },

         copyState : function(state) {
            var htmlState = state.html, wcmState = state.wcm;
            
            var newHTMLState = CodeMirror.copyState(htmlMode, htmlState);
            var newWCMState = CodeMirror.copyState(wcmMode, wcmState), current;
            
            if (state.currentMode == htmlMode) {
               current = newHTMLState;
            }
            else {
               current = newWCMState;
            }
            
            return { 
               currentMode : state.currentMode, 
               currentState : current, 
               html : newHTMLState, 
               wcm : newWCMState, 
               pending : state.pending};
         },

         indent : function(state, textAfter) {
            return htmlMode.indent(state.html, textAfter);
         },

         innerMode : function(state) {
            return { state : state.currentState, mode : state.currentMode };
         },
         
         token : dispatch          
      };
   }, "htmlmixed");
});
