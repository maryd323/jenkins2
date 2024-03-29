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
dojo.declare("ibm.sample.authoring.CodeMirrorSample", [ibm.wcm.ui.html.HTMLEditor], {
      /** the actual editor */
      editorRef: null,

      originalValue: null,

      mergeRef: null,

      constructor: function(editorId, editor) {
         this.inherited(arguments);
         this.editorRef = editor;
         this.originalValue = editor.getValue();
      },

      insertMarkupAtCursor: function(markup){ 
         if (this.editorRef.somethingSelected()) {
            this.editorRef.replaceSelection(markup);
         }
         else {
            this.editorRef.replaceRange(markup, this.editorRef.getCursor());
         }
      },

      setMarkup: function(markup){ 
         this.editorRef.setValue(markup);
      },

      getMarkup: function(){ 
         return this.editorRef.getValue();
      }
   });