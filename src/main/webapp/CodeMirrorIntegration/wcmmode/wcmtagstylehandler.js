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
      mod();
   else if (typeof define == "function" && define.amd) // AMD
      define([], mod);
   else // Plain browser env
      this.WCMTagStyleFactory = mod();
})(function() {
   "use strict";

   /**
    *
    * @type {{getSearchTerm: Function, setSuffix: Function, getSuffix: Function, decorate: Function, capitalize: Function}}
    */
   var TagStyleHandler = {
      /**
       * Give the tag name, attribute name (optional) and attribute value (optional) determine the
       * appropriate style to be used in the editor.
       *
       * @param tagName
       * @param attributeName
       * @param value
       * @returns {string}
       */
      tagStyle: function(tagName){},
      tagAttributeStyle: function(tagName, attributeName){},
      tagValueStyle: function(tagName, attributeName, value){}
   };

   /*
   * @param searchTerm
   * @param isValue
   * @param suffix
   * @constructor
   */
   var WCMTagStyleHandler = function (wcmTagLibrary) {
      this.tagLibrary = wcmTagLibrary;
   };

   WCMTagStyleHandler.prototype = Object.create(TagStyleHandler);

   WCMTagStyleHandler.prototype.tagStyle = function (tagName) {
      var style = "error";

      if (tagName.charAt(0) == "$") {
         style = "wcmIncomplete";

         if (tagName.length > 1) {
            var tag = this.tagLibrary.getTag("$");
            var value = tagName.substring(1);

            if (this.tagLibrary.isValidAttributeValue(value, tag.value, "$")) {
               style = "wcm";
            }
            // Everything is valid
            else {
               style = "wcm";
            }
         }
      }
      else if (this.tagLibrary.isValidTag(tagName)) {
         style = "wcm";
      }
      else {
         var parsedTagName = this.tagLibrary.getTagName(tagName);
         var matchingTags = this.tagLibrary.findMatchingTags(parsedTagName.name);
         if (matchingTags.length > 1) {
            style = "wcmIncomplete";
         }
         else if (matchingTags.length == 1) {
            var tag = this.tagLibrary.getTag(parsedTagName.name);

            style = "wcmIncomplete";
            if (tag && tag.supportsPrimaryAttribute && parsedTagName.value) {
               if (this.tagLibrary.findMatchingTagAttributeValues(parsedTagName.value, parsedTagName.name, tag.value).length == 0) {
                  style = "error";
               }
            }
         }
      }


      return style;
   };

   WCMTagStyleHandler.prototype.tagAttributeStyle = function (tagName, attributeName) {
      var style = "error";
      if (attributeName && tagName) {
         if (this.tagLibrary.isValidAttribute(attributeName, tagName)) {
            style = "keyword";
         }
         else if (this.tagLibrary.findMatchingTagAttributes(attributeName, tagName).length > 0) {
            style = "wcmIncomplete";
         }
      }
      else {
         style = this.tagStyle(tagName);
      }
      return style;
   };

   WCMTagStyleHandler.prototype.tagValueStyle = function (tagName, attributeName, value) {
      var style = "error";

      if (value && attributeName && tagName) {
         if (this.tagLibrary.isValidAttributeValue(value, attributeName, tagName)) {
            style = "string";
         }
         else if (this.tagLibrary.findMatchingTagAttributeValues(value, tagName, attributeName).length > 0) {
            style = "wcmIncomplete";
         }
      }
      else if (attributeName && tagName) {
         style = this.tagAttributeStyle(tagName, attributeName);
      }

      return style;
   };

   return {
      createStyleHandler: function(wcmTagLibrary) {
         return new WCMTagStyleHandler(wcmTagLibrary);
      }
   };
});
