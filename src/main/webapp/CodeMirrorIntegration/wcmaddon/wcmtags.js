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

   console.log(mod);
   if (typeof exports == "object" && typeof module == "object") { // CommonJS
      console.log("req");
      mod(require("./wcmtags"));
   }
   else if (typeof define == "function" && define.amd) // AMD
      define(["./wcmtags"], mod);
   else // Plain browser env
      this.WCMTagLibraryFactory = mod();
})(function() {
   "use strict";

   /**
    * WCM Tag Library Interface. Used to find and validate WCM tags, tag attributes and tag attribute values for WCM tags.
    *
    * @type {{exists: Function, getTag: Function, findMatchingTags: Function, findMatchingEndTags: Function, findMatchingTagAttributes: Function, findMatchingTagAttributeValues: Function, findMatchingCompoundSubTags: Function, findAvailablePlugins: Function, getTagName: Function, match: Function, isValidTag: Function, isValidAttribute: Function, isValidAttributeValue: Function}}
    */
   var WCMTagLibrary = {
      /**
       * Returns true if the specified tag exists.
       * @param tagName the tag name to test for
       * @returns true if the tag exists, otherwise false is returned
       */
      exists: function(/* String */ tagName) {},
      /**
       * Returns the tag corresponding to the supplied name
       *
       * @param tagName the tag name to retrieve
       */
      getTag: function(/* String */tagName) {},

      /**
       * Returns array of all tags matching the search provided or if the search value is empty all available tags
       * will be returned.
       *
       * For each result the decorator will be invoked to optionally enrich the returned value.
       *
       * @param search used to filter the list of all possible tags. Must never be null.
       * @param decorator Optional object with "decorate(string)" method that accepts the single result value and returns an enriched
       * value which can be a string or object (optional).
       *
       * @return array of results. If no decorator is supplied then results will consist of string tag name
       */
      findMatchingTags: function (/* String */search, /* Object */decorator){},

      /**
       * Returns array of all end tags matching the search provided or if the search value is empty all available tags
       * will be returned.
       *
       * For each result the decorator will be invoked to optionally enrich the returned value.
       *
       * @param search used to filter the list of all possible end tags. Must never be null.
       * @param decorator Optional object with "decorate(string)" method that accepts the single result value and returns an enriched
       * value which can be a string or object (optional).
       *
       * @return array of results. If no decorator is supplied then results will consist of string end tag names
       */
      findMatchingEndTags: function (/* String */search, /* Object */decorator){},

      /**
       * Returns array of all tags attributes for the specified tag that match the search provided or if the search value
       * is empty all possible tag attributes for the specified tag will be returned.
       *
       * For each result the supplied decorator will be invoked to optionally enrich the returned value.
       *
       * @param search used to filter the list of all possible tag attributes. Must never be null.
       * @param tagName the target tag whose attributes will be returned. Must never be null.
       * @param decorator Optional object with "decorate(string)" method that accepts the single result value and returns an enriched
       * value which can be a string or object (optional).
       *
       * @return array of results. If no decorator is supplied then results will consist of string attribute names
       */
      findMatchingTagAttributes: function(/* String */search, /* String */tagName, /* Array*/ existingAttributes, /* Object */decorator) {},

      /**
       * Returns array of all tags attributes for the specified tag that match the search provided or if the search value
       * is empty all possible tag attributes for the specified tag will be returned.
       *
       * For each result the decorator will be invoked to optionally enrich the returned value.
       *
       * @param search used to filter the list of all possible tag attribute values. Must never be null.
       * @param tagName the target tag whose attribute value will be returned. Must never be null.
       * @param attributeName the target tag attribute whose values will be returned. Must never be null.
       * @param decorator Optional object with "decorate(string)" method that accepts the single result value and returns an enriched
       * value which can be a string or object (optional).
       *
       * @return array of results. If no decorator is supplied then results will consist of string tag attribute values
       */
      findMatchingTagAttributeValues: function(/* String */search, /* String */tagName, /* String */attributeName, /* Object */decorator) {},

      /**
       * Returns an array of compound sub tags that match the search supplied for the specified tag. If
       * no search is supplied (must be empty string) then all possible sub tags for the specified tag will
       * be returned.
       *
       * TODO: this is still POC
       *
       * @param search used to filter list of all possible sub tags with those that match this value. Must never be null.
       * @param tagName the target tag whose sub tags will be returned. Must never be null.
       * @param isEndTag flag whether this is a start of end tag
       *
       * @return array of result objects  in the format [{text : "Value being inserted into the editor", displayText: "Value displayed in pop-up"}]
       */
      findMatchingCompoundSubTags: function (/* String */search, /* String */tagName, /** Boolean */isEndTag) {},

      /**
       * TODO: POC
       */
      findAvailablePlugins: function (/* String */search) {},

      /**
       * TODO: POC
       * Parses the supplied tag and returns the name, and flag whether it is a compound tag
       * @param tagName
       */
      getTagName: function(/* String */tagName) {},

      /**
       * Helper method to match a given search string again the supplied word. The strings need not be equal, rather
       * a matched is deemed to be true if the supplied word starts with the supplied search term.
       * @param search the string to match
       * @param word the string to test the search term against
       *
       * @return true if the supplied word starts with the search term. Note empty search terms will always match the supplied word.
       */
      match: function(/* String */search, /* String */word) {},

      /**
       * Test if this is a valid tag known to the library
       * @param tagName the target tag
       * to test. Not null.
       *
       * @return true if the tag attribute is valid
       */
      isValidTag: function(tagName) {},

      /**
       * Test if this is a valid tag attribute for the tag that is known to the library
       *
       * @param tagAttribute the target tag attribute to test. Not null.
       * @param tagName the target tag. Not null, and must be a valid tag.
       *
       * @return true if the tag attribute is valid
       */
      isValidAttribute: function(tagAttribute, tagName) {},

      /**
       * Test if this is a valid tag attribute value for the tag and tag attribute that is known to the library
       *
       * @param tagAttributeValue the tag attribute value to test. Not null.
       * @param tagAttribute the target tag attribute. Not null, and must be a valid tag attribute.
       * @param tagName the target tag. Not null, and must be a valid tag.
       *
       * @return true if the tag attribute is valid
       */
      isValidAttributeValue: function(tagAttributeValue, tagAttribute, tagName) {}
   };

   // Tag value constants.
   var wcmTagContexts = ["current", "autofill", "parent", "auto", "sitearea", "selected", "portalContext", "portalmapping", "portletContext", "portletmapping"];
   var wcmTagTypes = ["site", "sitearea", "auto", "content", "top", "parent"];
   var wcmTagBooleanValue = ["true", "false"];
   var wcmTagCompute = ["always", "once"];
   var wcmHiddenAttributes = ["id", "normalid", "highlightid"];

   /**
    * A completely client side definition of WCM tags, attributes and when appropriate the possible values.
    *
    * @param options Editor options passed in when creating the CodeMirror instance (optional)
    *
    * @constructor
    */
   var WCMTagLocalLibrary = function (options) {
      if (options) {
         this.wcmPluginDefn = options.wcmPluginDefn;
      }
      else {
         this.wcmPluginDefn = [];
      }

      /*
         JS WCM Tag Model. The structure of this object is as follows:
         {"tagName": {
                isVoidElement: true|false, // flag whether this tag supports start and end tags (and an embedded tag body)
                compoundkey: true|false, // flag whether this tag support the short form compound notation for its name
                allowAnyAttribute: true|false, // flag that tag supports arbitrary attributes (used in validation)
                attributes: { // array of all tag attributes (can be empty)
                   tagAttribute: ["one", "two", "three"], // attributes define all possible tag attribute values
                   tagAttribute2: [],
                   tagAttribute3: function // TODO: support dynamic attribute values?
                },
                compoundKeyHint: function // TODO: support dynamic compound key values?
            }
         }
      */
      this.wcmTags = {
         "component": {
            isVoidElement: true,
            attributes: {
               name: [],
               format: [],
               separator: [],
               htmlencode: wcmTagBooleanValue,
               presentation: [],
               awareness: wcmTagBooleanValue,
               startPage: [],
               resultsPerPage: [],
               start: [],
               end: [],
               compute: wcmTagCompute,
               rendition: [],
               id: []
            }
         },
         "element": {
            isVoidElement: true,
            attributes: {
               type: wcmTagTypes,
               key: [],
               context: wcmTagContexts,
               format: [],
               separator: [],
               htmlencode: wcmTagBooleanValue,
               link: ["default", "path", "contextual"],
               awareness: wcmTagBooleanValue,
               ifEmpty: [],
               start: [],
               end: [],
               rendition: [],
               id: []
            }
         },
         "plugin": {
            isVoidElement: false,
            compoundkey: true,
            supportsPrimaryAttribute: true,
            value: "name",
            allowAnyAttribute: true,
            attributes: {
               compute: wcmTagCompute,
               htmlencode: wcmTagBooleanValue,
               start: [],
               end: []
            },
            compoundKeyHint: this.findAvailablePlugins
         },
         "urlcmpnt": {
            isVoidElement: true,
            attributes: {
               mode: [],
               context: wcmTagContexts,
               type: wcmTagTypes,
               name: [],
               pagedesign: [],
               portaltarget: [],
               targetcurrentportalpage: [],
               usedIn: [],
               start: [],
               end: [],
               htmlencode: wcmTagBooleanValue
            }
         },
         "property": {
            isVoidElement: true,
            supportsPrimaryAttribute: true,
            value: "field",
            attributes: {
               field: ["name", "title", "description", "id", "authors", "owners", "authtemplateid", "authtemplatename", "authtemplatetitle", "projectid", "projectname", "projecttitle", "libraryid", "libraryname", "librarytitle", "parentid", "parentname", "parenttitle", "status", "statusid", "workflow", "currentstage", "publishdate", "expirydate", "generaldateone", "generaldatetwo", "additionalviewers", "lastmodified", "lastmodifieddate", "categories", "keywords", "creationdate", "creator", "lastmodifier"],
               context: wcmTagContexts,
               type: wcmTagTypes,
               name: [],
               format: [],
               link: [],
               separator: [],
               htmlencode: wcmTagBooleanValue,
               awareness: wcmTagBooleanValue,
               ifEmpty: [],
               include: [],
               restrict: [],
               resolve: [],
               start: [],
               end: [],
               id: []
            }
         },
         "$": {
            isVoidElement: true,
            supportsPrimaryAttribute: true,
            value: "field",
            attributes: {
               field: ["name", "title", "description", "id", "authors", "owners", "authtemplateid", "authtemplatename", "authtemplatetitle", "projectid", "projectname", "projecttitle", "libraryid", "libraryname", "librarytitle", "parentid", "parentname", "parenttitle", "status", "statusid", "workflow", "currentstage", "publishdate", "expirydate", "generaldateone", "generaldatetwo", "additionalviewers", "lastmodified", "lastmodifieddate", "categories", "keywords", "creationdate", "creator", "lastmodifier"],
               context: ["current", "autofill", "parent", "auto", "sitearea", "portalContext", "portalmapping", "portletContext", "portletmapping"],
               type: wcmTagTypes,
               name: [],
               format: [],
               link: [],
               separator: [],
               htmlencode: wcmTagBooleanValue,
               awareness: wcmTagBooleanValue,
               ifEmpty: [],
               include: [],
               restrict: [],
               resolve: [],
               start: [],
               end: [],
               id: []
            }
         },
         "editableproperty": {
            isVoidElement: false,
            attributes: {
               field: [],
               context: wcmTagContexts,
               type: wcmTagTypes,
               name: [],
               key: [],
               format: ["div", "span"],
               callback: [],
               class: [],
               mode: ["inplace", "embed" , "dialog"]
            }
         },
         "editableelement": {
            isVoidElement: false,
            attributes: {
               context: wcmTagContexts,
               type: wcmTagTypes,
               name: [],
               key: [],
               format: ["div", "span"],
               callback: [],
               class: [],
               mode: ["inplace", "embed" , "dialog"]
            }
         },
         "alternatedesign": {
            isVoidElement: true,
            attributes: {
               highlight: [],
               normal: [],
               type: wcmTagTypes,
               start: [],
               end: [],
               normalid: [],
               highlightid: []
            }
         },
         "attributeresource": {
            isVoidElement: true,
            attributes: {
               attributename: ["authoringtemplate", "author", "category", "contentid", "contentpath","date", "description", "effectivedate", "expirationdate", "keywords", "lastmodifieddate", "modifier", "name", "namelink", "owner", "parentcontentpath", "relevance", "summary", "title", "titlelink", "url", "ibmcm:title", "ibmcm:description", "ibmcm:modifiedDate", "ibmcm:expirationDate", "ibmcm:effectiveDate", "ibmcm:authors", "ibmcm:categories", "ibmcm:keywords", "ibmcm:owners", "ibmcm:wcmId"],
               separator: [],
               format: []
            }
         },
         "pageinfo": {
            isVoidElement: true,
            attributes: {
               value: ["currentpage", "totalpages", "firstitemonpage", "lastitemonpage", "totalitems", "itemsperpage", "unknownpages"],
               knowntext: [],
               unknowntext: [],
               start: [],
               end: []
            }
         },
         "pathcmpnt": {
            isVoidElement: true,
            attributes: {
               type: ["base", "noprefixbase", "context", "servlet", "noprefixservlet", "prefix"],
               start: [],
               end: []
            }
         },
         "placeholder": {
            isVoidElement: true,
            attributes: {
               tag: ["name", "title", "titlelink", "href", "namelink", "sitepath", "idnum", "listnum", "treenum", "paddedtreenum", "depth", "noprefixhref", "noprefixnamelink", "noprefixtitlelink", "value"],
               htmlencode: wcmTagBooleanValue,
               start: [],
               end: []
            }
         },
         "styleelement": {
            isVoidElement: true,
            attributes: {
               source: [],
               name: [],
               start: [],
               end: []
            }
         },
         "ifeditmode": {
            isVoidElement: false,
            attributes: {}
         },
         "ifnoteditmode": {
            isVoidElement: false,
            attributes: {}
         },
         "indentcmpnt": {
            isVoidElement: true,
            attributes: {
               repeat: [],
               offset: [],
               start: [],
               end: []
            }
         }
      };

      for (var pluginDef in this.wcmPluginDefn) {
         var pluginTitle = pluginDef.toLowerCase();

         var pluginTag = {
            isVoidElement: false,
            compoundkey: false,
            supportsPrimaryAttribute: false,
            //value: "name",
            allowAnyAttribute: true,
            attributes: {
               compute: wcmTagCompute,
               htmlencode: wcmTagBooleanValue,
               start: [],
               end: []
            }
         };

         this.wcmTags[pluginTitle] = pluginTag;
      }
   };

   WCMTagLocalLibrary.prototype = Object.create(WCMTagLibrary);

   /** @see WCMTagLibrary.exists */
   WCMTagLocalLibrary.prototype.exists = function (tagName) {
      return this.wcmTags[tagName.toLowerCase()] ? true : false;
   };

   /** @see WCMTagLibrary.getTag */
   WCMTagLocalLibrary.prototype.getTag = function (tagName) {
      var parsedTagName = this.getTagName(tagName);
      return this.wcmTags[parsedTagName.name.toLowerCase()] ? this.wcmTags[parsedTagName.name.toLowerCase()] : null;
   };

   /** @see WCMTagLibrary.getTagName */
   WCMTagLocalLibrary.prototype.getTagName = function(tagName) {
      tagName = tagName.toLowerCase();

      var isCompoundKey = false;
      var keySeparatorPos = tagName.indexOf(":");
      var primaryAttributeValue = null;
      if (keySeparatorPos > 0) {
         isCompoundKey = true;
         if (tagName.length != (keySeparatorPos + 1)){
            primaryAttributeValue = tagName.substring(keySeparatorPos + 1);
         }
         tagName = tagName.substring(0, keySeparatorPos);
      }

      if (tagName.charAt(0) == "$") {
         tagName = "$";
      }

      return { name : tagName, isCompound : isCompoundKey, value: primaryAttributeValue};
   };

   /** @see WCMTagLibrary.match */
   WCMTagLocalLibrary.prototype.match = function(search, word) {
      var len = search.length;
      var sub = word.substr(0, len);
      return search.toUpperCase() === sub.toUpperCase();
   };

   /** @see WCMTagLibrary.isValidTag */
   WCMTagLocalLibrary.prototype.isValidTag = function (tagName) {
      var valid = false;

      if (!tagName) {
         return valid;
      }

      var parsedTagName = this.getTagName(tagName);
      tagName = parsedTagName.name;
      var isCompoundKey = parsedTagName.isCompound;

      var tag = this.getTag(tagName);
      if (tag) {
         var isCompoundKeyTag = tag.compoundkey ? tag.compoundkey : false;
         if (isCompoundKeyTag == isCompoundKey && parsedTagName.value != null) {
            valid = true;
         }
         else if (tag.supportsPrimaryAttribute == true && isCompoundKey == true) {
            var currentValue = parsedTagName.value;
            if (currentValue != null) {
               valid = this.isValidAttributeValue(currentValue, tag.value, tagName);
            }
         }
         else {
            valid = true;
         }
      }

      return valid;
   };

   /** @see WCMTagLibrary.isValidAttribute */
   WCMTagLocalLibrary.prototype.isValidAttribute = function(tagAttribute, tagName) {
      var valid = false;

      if (!tagName || !tagAttribute) {
         return valid;
      }

      tagName = this.getTagName(tagName).name;

      var tag = this.getTag(tagName);
      if (tag) {
         if (tag.attributes[tagAttribute.toLowerCase()] || tag.allowAnyAttribute) {
            valid = true;
         }
      }

      return valid;
   };

   /** @see WCMTagLibrary.isValidAttributeValue */
   WCMTagLocalLibrary.prototype.isValidAttributeValue = function(tagAttributeValue, tagAttribute, tagName) {
      var valid = true;

      if (!tagName || !tagAttribute || !tagAttributeValue) {
         return valid;
      }

      tagName = this.getTagName(tagName).name;

      var tag = this.getTag(tagName);
      if (tag) {
         var tagAttributes = tag.attributes[tagAttribute.toLowerCase()];
         if (tagAttributes && tagAttributes.length > 0) {
            valid = false;
            for (var i = 0, len = tagAttributes.length; i < len; ++i) {
               if (tagAttributes[i] == tagAttributeValue.toLowerCase()) {
                  valid = true;
                  break;
               }
            }
         }
      }

      return valid;
   };

   /** @see WCMTagLibrary.findMatchingTags */
   WCMTagLocalLibrary.prototype.findMatchingTags = function (search, decorator){
      var result = [];
      for (var tagRef in this.wcmTags) {
         if (this.match(search.toLowerCase(), tagRef)) {
            decorator ? result.push(decorator.decorate(tagRef)) : result.push(tagRef);
         }
      }

      return result;
   };

   /** @see WCMTagLibrary.findMatchingEndTags */
   WCMTagLocalLibrary.prototype.findMatchingEndTags = function (search, decorator){
      var result = [];
      for (var tagRef in this.wcmTags) {
         var tag = this.getTag(tagRef);
         if (tag.isVoidElement == false && this.match(search.toLowerCase(), tagRef)) {
            decorator ? result.push(decorator.decorate(tagRef)) : result.push(tagRef);
         }
      }

      return result;
   };

   /** @see WCMTagLibrary.findMatchingTagAttributes */
   WCMTagLocalLibrary.prototype.findMatchingTagAttributes = function(search, tagName, existingAttributes, decorator) {
      var result = [];

      tagName = this.getTagName(tagName).name;

      var tag = this.getTag(tagName);
      if (tag) {
         for (var attribute in tag.attributes) {
            if (this.match(search.toLowerCase(), attribute)) {
               if (wcmHiddenAttributes.indexOf(attribute) == -1 && (!existingAttributes || existingAttributes.indexOf(attribute) == -1)) {
                  decorator ? result.push(decorator.decorate(attribute)) : result.push(attribute);
               }
            }
         }
      }

      return result;
   };

   /** @see WCMTagLibrary.findMatchingTagAttributeValues */
   WCMTagLocalLibrary.prototype.findMatchingTagAttributeValues = function(search, tagName, attributeName, decorator) {
      var result = [];

      tagName = this.getTagName(tagName).name;

      if (!this.isValidAttribute(attributeName, tagName))
      {
         return result;
      }

      var tag = this.getTag(tagName);
      var attributeValues = tag.attributes[attributeName];
      if (attributeValues) {
         for (var i = 0, len = attributeValues.length; i < len; ++i) {
            if (this.match(search.toLowerCase(), attributeValues[i])) {
               decorator ? result.push(decorator.decorate(attributeValues[i])) : result.push(attributeValues[i]);
            }
         }
      }

      return result;
   };

   /** @see WCMTagLibrary.findMatchingCompoundSubTags */
   WCMTagLocalLibrary.prototype.findMatchingCompoundSubTags = function (search, tagName, isEndTag, decorator) {
      var result = [];

      var tag = this.getTag(tagName);
      if (tag && tag.compoundkey == true && tag.compoundKeyHint) {
         result = tag.compoundKeyHint.call(this, search, tagName, isEndTag);
      }
      else if (tag && tag.supportsPrimaryAttribute) {
         result = this.findMatchingTagAttributeValues(search, tagName, tag.value, decorator);
      }

      return result;
   };

   /**
    * TODO: this should be externalised/passed in for now be lazy
    */
   WCMTagLocalLibrary.prototype.findAvailablePlugins = function (search, tag, isEndTag) {
      var result = [];

      var prefix = "[";
      if (isEndTag == true) {
         prefix = prefix + "/";
      }

      if (this.wcmPluginDefn) {
         for (var pluginDef in this.wcmPluginDefn) {
            if (this.match(search.toLowerCase(), pluginDef)) {

               result.push({
                  text: prefix + tag + ":" + pluginDef,
                  displayText: this.wcmPluginDefn[pluginDef].title
               });
            }
         }
      }

      return result;
   };

   /** Factory to construct instances of a WCMTagLibrary */
   var WCMTagLibraryFactory = {
      createLibrary: function(options) {
         return new WCMTagLocalLibrary(options);
      }
   };

   return WCMTagLibraryFactory;
});
