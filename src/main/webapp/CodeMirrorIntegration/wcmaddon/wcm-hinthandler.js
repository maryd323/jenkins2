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
      mod(require("./wcmtags"));
   else if (typeof define == "function" && define.amd) // AMD
      define(["./wcmtags"], mod);
   else // Plain browser env
      this.WCMHintHandlerFactory = mod();
})(function() {
   "use strict";

   /**
    *
    * @type {{getSearchTerm: Function, setSuffix: Function, getSuffix: Function, decorate: Function, capitalize: Function}}
    */
   var HintHandler = {
      getSearchTerm: function() {},
      setSuffix: function(suffix) {},
      getSuffix: function() {},

      decorate: function(value) {},
      capitalize: function(str) {
         return str.charAt(0).toUpperCase() + str.slice(1);
      }
   };

   /**
    *
    * @param searchTerm
    * @param WCMTagLibrary
    * @constructor
    */
   var WCMTagHintHandler = function (searchTerm, WCMTagLibrary) {
      this.WCMTagLibrary = WCMTagLibrary;
      this.prefix = "";
      this.endTag = false;

      if (searchTerm.charAt(0) == "[") {
         this.prefix = "[";
         searchTerm = searchTerm.slice(1);
      }

      if (searchTerm.charAt(0) == "/") {
         this.prefix = this.prefix + "/";
         searchTerm = searchTerm.slice(1);
         this.endTag = true;
      }

      var keySeparatorPos = searchTerm.indexOf(":");
      if (keySeparatorPos > 0) {
         this.prefix = this.prefix + searchTerm.substring(0, keySeparatorPos + 1);
         searchTerm = searchTerm.substring(keySeparatorPos + 1);
      }

      this.searchTerm = searchTerm;
   };

   WCMTagHintHandler.prototype = Object.create(HintHandler);

   WCMTagHintHandler.prototype.getSearchTerm = function () {
      return this.searchTerm;
   };

   WCMTagHintHandler.prototype.decorate = function (tagName) {
      var suffix = "";
      var tag = this.WCMTagLibrary.getTag(tagName);

      // TODO: change compound key to primary attribute handler. Do not automatically add suffix
      // TODO: auto add suffix when tag name complete and hint requested and tag supports primary attribute
      if (tag && tag.compoundkey &&  tag.compoundkey == true) {
         suffix = ":";
      }

      return {
         text: this.prefix + tagName + suffix,
         displayText: this.capitalize(tagName)
      };
   };

   /**
    *
    * @param searchTerm
    * @param isValue
    * @param suffix
    * @constructor
    */
   var WCMTagAttributeAndValueHintHandler = function (searchTerm, isValue, suffix) {
      this.prefix = "";
      this.quote = "";
      this.suffix = suffix ? suffix : "";

      if (/['"]/.test(searchTerm.charAt(0))) {
         this.quote = searchTerm.charAt(0);
         searchTerm = searchTerm.slice(1);

         if (searchTerm.charAt(searchTerm.length - 1) == this.quote) {
            searchTerm = searchTerm.substring(0, searchTerm.length - 1);
         }
      }
      else if (searchTerm.charAt(0) == "=") {
         //this.quote = "\"";
         searchTerm = searchTerm.slice(1);
         this.prefix = "=";
      }
      else if (isValue == true) {
         //this.quote = "\"";
      }

      this.searchTerm = searchTerm;
   };

   WCMTagAttributeAndValueHintHandler.prototype = Object.create(HintHandler);

   WCMTagAttributeAndValueHintHandler.prototype.getSearchTerm = function () {
      return this.searchTerm;
   };

   WCMTagAttributeAndValueHintHandler.prototype.getSuffix = function () {
      return this.suffix;
   };

   WCMTagAttributeAndValueHintHandler.prototype.setSuffix = function (suffix) {
      this.suffix = suffix;
   };

   WCMTagAttributeAndValueHintHandler.prototype.decorate = function (value) {
      return {
         text: this.prefix + this.quote + value + this.quote + this.suffix,
         displayText: this.capitalize(value)
      };
   };

   /**
    *
    * @type {{createTagHandler: Function, createTagAttributeAndValueHandler: Function}}
    */
   var WCMHintHandlerFactory = {
      createTagHandler: function(searchTerm, WCMTagLibrary) {
         return new WCMTagHintHandler(searchTerm, WCMTagLibrary);
      },
      createTagAttributeAndValueHandler: function(searchTerm, isValue, suffix) {
         return new WCMTagAttributeAndValueHintHandler(searchTerm, isValue, suffix);
      }
   };

   return WCMHintHandlerFactory;
});