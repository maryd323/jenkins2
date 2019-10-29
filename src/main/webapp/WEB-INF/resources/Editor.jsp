   <%--
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
   --%>
      <%@ taglib uri="/WEB-INF/tld/portlet.tld" prefix="portletAPI" %>
      <%@ page import="com.ibm.workplace.wcm.api.authoring.HTMLEditorBean,
                 java.util.*,com.ibm.icu.text.Collator,
                 com.ibm.workplace.wcm.services.WCMServiceManager" %><portletAPI:init /><%
   HTMLEditorBean editor = (HTMLEditorBean) request.getAttribute("EditorBean");
   String docId = editor.getName();

   /** START: ProofOfConcept: Looking at ways to inject dynamic lists into the editor. For now use a static
       list of plugins. Later look to add proper type ahead for actual items using REST. */
   com.aptrix.pluto.cmpnt.plugin.RenderingPluginService rs = WCMServiceManager.getService(com.aptrix.pluto.cmpnt.plugin.RenderingPluginService.class);
   
   Collator collator = null;
   try 
   {
      // Plugin names (not titles) are always ascii so can sort with static locale
      // todo: show title/description?
      collator = Collator.getInstance(Locale.US);
   } catch (Exception e) {
       System.err.println("English collation creation failed.");
       e.printStackTrace();
   }
   
   List sortedPluginList = new ArrayList();
   sortedPluginList.addAll(rs.getRenderingPlugins().keySet());
   Collections.sort(sortedPluginList, collator);
   
   java.util.Iterator<String> keys = sortedPluginList.iterator();
   java.lang.StringBuffer pluginStr = new java.lang.StringBuffer();
   while (keys.hasNext())
   {
      String key = keys.next();
      pluginStr.append("\"").append(key).append("\":");
      pluginStr.append("{title:\"").append(key).append("\"}");
      if (keys.hasNext())
      {
         pluginStr.append(",");
      }
   }

   /** END: ProofOfConcept */
%>
<script src="/wps/wcmSamples/CodeMirrorIntegration/Integration.js"></script>

<link rel="stylesheet" href="/wps/wcmSamples/CodeMirror/lib/codemirror.css" >
<link rel="stylesheet" href="/wps/wcmSamples/CodeMirror/addon/hint/show-hint.css" >
<link rel="stylesheet" href="/wps/wcmSamples/CodeMirrorIntegration/Integration.css" >

<script type="text/javascript">
   var pluginDefn = {<%= pluginStr.toString() %>};

   require({
      baseUrl: "/wps/wcmSamples/CodeMirror"},
      ["CodeMirror/lib/codemirror", "CodeMirror/mode/xml/xml", "CodeMirror/addon/hint/show-hint",
      "CodeMirror/addon/hint/xml-hint", "CodeMirror/addon/hint/html-hint", "CodeMirror/addon/fold/xml-fold",
      "CodeMirror/addon/edit/matchtags", "CodeMirror/addon/edit/closetag", "CodeMirror/mode/javascript/javascript",
      "CodeMirror/mode/css/css", "CodeMirror/mode/htmlmixed/htmlmixed",
      "CodeMirror/../CodeMirrorIntegration/wcmaddon/wcmtags", "CodeMirror/../CodeMirrorIntegration/wcmaddon/wcm-hint",
      "CodeMirror/../CodeMirrorIntegration/wcmmode/wcmmixed"],
      function(CodeMirror) {
         var targetTextArea = document.getElementById('<%=docId%>');
         var editor = CodeMirror.fromTextArea(targetTextArea, {
            mode : "wcmmixed",
            tabMode : 'indent',
            lineWrapping : true,
            matchTags: {bothTags: true},
            lineNumbers : true,
            autoCloseTags: true,
            readOnly: <%= !editor.isEditable() %>,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            wcmPluginDefn: pluginDefn
      });
      editor.setSize("100%", (targetTextArea.rows * 20));
      var codeMirrorEditor = new ibm.sample.authoring.CodeMirrorSample('<%= docId %>', editor);
      codeMirrorEditor.showToolbar(true);
   });
   // For some reason need to set the baseURL back (even though it should be scoped...)
   require({baseUrl: dojo.config.baseUrl});
</script>
