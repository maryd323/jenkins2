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
      mod(require("../../CodeMirror/lib/codemirror"), require("./wcmtags"), require("./wcm-hinthandler"));
   else if (typeof define == "function" && define.amd) // AMD
      define(["../../CodeMirror/lib/codemirror", "./wcmtags", "./wcm-hinthandler"], mod);
   else // Plain browser env
      mod(CodeMirror, WCMTagLibraryFactory, WCMHintHandlerFactory);
})(function(CodeMirror, WCMTagLibraryFactory, WCMHintHandlerFactory) {
   "use strict";

   var Pos = CodeMirror.Pos;

   var WCMTagLibrary = null;

   CodeMirror.registerHelper("hint", "wcm", function (editor, options) {
      var cur = editor.getCursor();
      var token = editor.getTokenAt(cur), end = token.end;
      var result = [], replaceToken = true, tagStart;

      var search = token.string;

      // If the cursor is at the end of the search term and token and the value ends with
      // a space AND no delimiter has been defined then assume this is actually the start
      // of a new attribute and reset the search term and replaceToken flag
      if (cur.ch === token.end && search.endsWith(" ") && !/[='"]/.test(token.string.charAt(0))) {
         search = "";
         replaceToken = false;
      }
      else {
         search = token.string.trim();
      }

      if (WCMTagLibrary == null) {
         WCMTagLibrary = WCMTagLibraryFactory.createLibrary(editor.options);
      }

      if (search.charAt(0) == "[" && !(search.length > 1 && search.charAt(1) == "$")) {
         replaceToken = true;
         var isEndTag = search.charAt(1) == "/";
         var compoundTagSeparator = search.indexOf(":");
         var decorator = WCMHintHandlerFactory.createTagHandler(search, WCMTagLibrary);
         if (compoundTagSeparator > 0) {
            var tagName = search.substring(1, compoundTagSeparator);
            if (tagName.charAt(0) == "/") {
               tagName = tagName.slice(1);
            }
            search = search.substring(compoundTagSeparator + 1);
            result = WCMTagLibrary.findMatchingCompoundSubTags(search, tagName, isEndTag, decorator);
         }
         else {

            if (isEndTag) {
               result = WCMTagLibrary.findMatchingEndTags(decorator.searchTerm, decorator);
            }
            else {
               result = WCMTagLibrary.findMatchingTags(decorator.searchTerm, decorator);
            }
         }
      }
      // Might be an attribute or attribute value....
      else {
         if (search.length == 0 && token.string.length > 0)
         {
            // Check if the cursor is in the middle of a blank
            if (cur.ch == token.end) {
               var nextToken = editor.getTokenAt(Pos(editor.getCursor().line, token.end + 1));
               if (nextToken) {
                  var nextTokenChar = nextToken.string.trim().charAt(0);
                  if (token.start != nextToken.start && !/[='"\]]/.test(nextTokenChar)) {
                     token = nextToken;
                     search = nextToken.string.trim();
                     replaceToken = true;
                  }
                  else {
                     replaceToken = false;
                  }
               }
            }
            else {
               replaceToken = false;
            }
         }

         var inner = CodeMirror.innerMode(editor.getMode(), token.state);

         if (inner.mode.name != "wcm"){
            return;
         }

         var tagName = inner.state.tagName;

         if (tagName.charAt(0) == "$") {
            tagName = "$";
         }
         else if (!WCMTagLibrary.isValidTag(tagName)) {
            return;
         }

         var attributeName = inner.state.attributeName;
         var attrValSearch = false;
         if (search.indexOf("[$") == 0) {
            attributeName = "field";
            tagName = "$";
            search = search.substring(2);
            attrValSearch = true;
            replaceToken = true;
            token.start = token.start + 2;
         }

         // Attribute value search if the attribute name we have is not the same as the
         // search term AND the user has typed something (otherwise its likely an attribute
         if (attributeName != search && (search.length > 0 || attrValSearch))
         {
            var nextToken = editor.getTokenAt(Pos(editor.getCursor().line, token.end + 1));

            // Check whether the next token represents an actual value or is merely whitespace
            // identifying the start of another attribute
            var suffix = " ";
            if (nextToken && nextToken.end != token.end) {
               if (nextToken.string.charAt(0) == " ") {
                  if (replaceToken) {
                     token.end = token.end + 1;
                  }
                  else {
                     suffix = null;
                  }
               }
               else if (nextToken.string.charAt(0) == "]") {
                  // End character. Nothing to do. Search on the existing term
               }
               // No whitespace this is likely the actual attribute value. We should
               // query on
               else {
                  token = nextToken;
                  search = token.string.trim();
               }
            }

            var decorator = WCMHintHandlerFactory.createTagAttributeAndValueHandler(search, true, suffix);
            result = WCMTagLibrary.findMatchingTagAttributeValues(decorator.getSearchTerm(), tagName, attributeName, decorator);
         }
         else if (search == attributeName && token.type != "wcmIncomplete" && token.type != "error") {
            var nextToken = editor.getTokenAt(Pos(editor.getCursor().line, token.end + 1));
            if (nextToken && nextToken.string.charAt(0) != "=") {
               replaceToken = false;
               result.push("=\"\"");
            }
            else {
               result.push(search);
            }
         }
         else {
            var decorator = WCMHintHandlerFactory.createTagAttributeAndValueHandler(search, false);

            var nextToken = editor.getTokenAt(Pos(editor.getCursor().line, token.end + 1));
            if (nextToken && token.string.charAt(0) != "="){
               decorator.setSuffix("=\"\"");
            }

            result = WCMTagLibrary.findMatchingTagAttributes(search, tagName, inner.state.tagAttributes, decorator);
         }
      }

      return {
         list: result,
         from: replaceToken ? Pos(cur.line, tagStart == null ? token.start : tagStart) : cur,
         to: replaceToken ? Pos(cur.line, token.end) : cur
      };
   });
});