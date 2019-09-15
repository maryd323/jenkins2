Sample Custom HTML Editor with CodeMirror


In IBM WebSphere Portal v8.5 a new extension point was exposed within the Web Content Manager (WCM) Authoring portlet to support replacing all HTML fields with a custom editor. 
The extension works in the same way as all other custom fields of WCM. The extension is documented with a sample here: http://www-01.ibm.com/support/knowledgecenter/SSHRKX_8.5.0/mp/wcm/wcm_dev_custom_html_editor.dita?lang=en

CodeMirror is described on their web site as "a versatile text editor implemented in JavaScript for the browser. It is specialized for editing code, and comes with a number of language modes and addons that implement more advanced editing functionality."

This sample includes all the files necessary to integrate CodeMirror (http://codemirror.net/) into WCM and to deploy it onto your portal server. 

Deploying:
1. Login to the WebSphere administration console.
2. Navigate to "Application / New Applications" and install the CustomHTMLEditor.ear to the WebSphere_Portal server instance. 
3. No special configuration is needed for the EAR. Work through all the install steps using the default. Note: Ensure that the application is deployed to the WebSphere_Portal server.
4. Ensure that the application is running. If not, start it.

Configuration the Authoring UI:
1. Login to WebSphere Portal and navigate to the WCM Authoring Portlet
2. Go to either the Configure, Edit Preferences, or Shared Settings for the authoring portlet
3. Expand the "Editor Options" section. Go to the "Select the HTML editor to use in HTML fields" and select "Custom Editor"
4. For "Enter edit mode JSP for the custom HTML editor" set the following value:

/wps/wcmSamples;/WEB-INF/resources/Editor.jsp

5. Click "OK" to apply the changes. 
6. Create a new Presentation Template to verify that the editor has been deployed and is running. 

Troubleshooting:
Q: The editor does not appear and HTML fields are still text areas.
A: Check the portlet configuration is being applied. If the authoring portlet has been customized, then the portlet settings must be set and not just the configuration. 

Q: The error "An error occurred rendering the custom JSP." is shown under the text area.
A: Check that the web application has been started. Consult the logs for any errors.
																																			          			
Extending the integration:
The download package includes all source files necessary to build the enterprise application (including the CodeMirror files).
The integration source files consist of two files. The custom field that is rendered within the form of the page and the javascript integration and implementation of WCM APIs to drive the integrated editor. The details on the integration can be found in the infocenter.

It is possible to modify and extend the featured enabled in CodeMirror by editing the custom field jsp, which is located here:
CustomHTMLEditor_download/src/main/webapp/WEB-INF/resources/Editor.jsp

The build has no dependencies on Portal or WCM libraries and can be built with ant. 
